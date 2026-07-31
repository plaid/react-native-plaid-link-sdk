const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '../..');
const rnLinksdk = fs.readFileSync(path.join(root, 'ios/RNLinksdk.mm'), 'utf8');
const plaidLink = fs.readFileSync(path.join(root, 'src/PlaidLink.tsx'), 'utf8');
const iosSpec = fs.readFileSync(
  path.join(root, 'src/fabric/NativePlaidLinkModuleiOS.ts'),
  'utf8',
);
const iosJavaSpec = fs.readFileSync(
  path.join(
    root,
    'android/src/paper/java/com/plaid/NativePlaidLinkModuleiOSSpec.java',
  ),
  'utf8',
);

const indexOfOrThrow = (source, needle) => {
  const index = source.indexOf(needle);
  if (index === -1) {
    throw new Error(`Expected source to contain: ${needle}`);
  }
  return index;
};

describe('iOS callback lifecycle hardening', () => {
  test('exposes destroy through the iOS JS and native specs', () => {
    expect(plaidLink).toContain('await RNLinksdkiOS?.destroy();');
    expect(iosSpec).toContain('destroy(): Promise<void>;');
    expect(iosJavaSpec).toContain('import com.facebook.react.bridge.Promise;');
    expect(iosJavaSpec).toContain(
      'public abstract void destroy(Promise promise);',
    );
  });

  test('releaseCurrentSession clears callbacks, handler, and creation error', () => {
    const releaseStart = indexOfOrThrow(
      rnLinksdk,
      '- (void)releaseCurrentSession',
    );
    const createStart = indexOfOrThrow(
      rnLinksdk,
      'RCT_EXPORT_METHOD(createPlaidLink',
    );
    const releaseBody = rnLinksdk.slice(releaseStart, createStart);

    expect(releaseBody).toContain('[self dismissPresentedViewController];');
    expect(releaseBody).toContain('self.successCallback = nil;');
    expect(releaseBody).toContain('self.exitCallback = nil;');
    expect(releaseBody).toContain('self.linkHandler = nil;');
    expect(releaseBody).toContain('self.creationError = nil;');
  });

  test('terminal callbacks release stored callback state before invoking JavaScript', () => {
    const successCopy = indexOfOrThrow(
      rnLinksdk,
      'RCTResponseSenderBlock successCallback = strongSelf.successCallback;',
    );
    const successRelease = indexOfOrThrow(
      rnLinksdk,
      '[strongSelf releaseCurrentSession];\n            successCallback(@[jsMetadata]);',
    );
    const successInvoke = indexOfOrThrow(
      rnLinksdk,
      'successCallback(@[jsMetadata]);',
    );

    expect(successCopy).toBeLessThan(successRelease);
    expect(successRelease).toBeLessThan(successInvoke);

    const exitCopy = indexOfOrThrow(
      rnLinksdk,
      'RCTResponseSenderBlock exitCallback = strongSelf.exitCallback;',
    );
    const exitRelease = indexOfOrThrow(
      rnLinksdk,
      '[strongSelf releaseCurrentSession];\n            exitCallback(callbackArguments);',
    );
    const exitInvoke = indexOfOrThrow(
      rnLinksdk,
      'exitCallback(callbackArguments);',
    );

    expect(exitCopy).toBeLessThan(exitRelease);
    expect(exitRelease).toBeLessThan(exitInvoke);
  });

  test('dismiss and destroy clear the session, while internal LinkKit dismissal only dismisses UI', () => {
    expect(rnLinksdk).toMatch(
      /RCT_EXPORT_METHOD\(dismiss\)\s*{\s*\[self releaseCurrentSession\];\s*}/,
    );
    expect(rnLinksdk).toContain(
      'RCT_EXPORT_METHOD(destroy:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)',
    );
    expect(rnLinksdk).toContain(
      '[self releaseCurrentSession];\n    resolve(nil);',
    );
    expect(rnLinksdk).toContain('[weakSelf dismissPresentedViewController];');
    expect(rnLinksdk).not.toContain('[weakSelf dismiss];');
  });

  test('reentrant open updates callbacks without presenting LinkKit again', () => {
    const alreadyOpen = indexOfOrThrow(
      rnLinksdk,
      'BOOL alreadyOpen = self.successCallback || self.exitCallback;',
    );
    const assignSuccess = indexOfOrThrow(
      rnLinksdk,
      'self.successCallback = onSuccess;',
    );
    const assignExit = indexOfOrThrow(rnLinksdk, 'self.exitCallback = onExit;');
    const guard = indexOfOrThrow(
      rnLinksdk,
      'if (alreadyOpen) {\n            return;\n        }',
    );
    const openLink = indexOfOrThrow(
      rnLinksdk,
      '[self.linkHandler openWithPresentationHandler:presentationHandler dismissalHandler:dismissalHandler];',
    );

    expect(alreadyOpen).toBeLessThan(assignSuccess);
    expect(assignSuccess).toBeLessThan(assignExit);
    expect(assignExit).toBeLessThan(guard);
    expect(guard).toBeLessThan(openLink);
  });
});
