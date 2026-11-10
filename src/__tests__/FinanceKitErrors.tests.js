const fs = require('fs');
const path = require('path');
const Types = require('./../Types');

const root = path.resolve(__dirname, '../..');
const rnLinksdk = fs.readFileSync(path.join(root, 'ios/RNLinksdk.mm'), 'utf8');
const plaidLink = fs.readFileSync(path.join(root, 'src/PlaidLink.tsx'), 'utf8');
const linkKitHeader = fs.readFileSync(
  path.join(
    root,
    'ios/Frameworks/LinkKit.xcframework/ios-arm64/LinkKit.framework/Headers/PLKPlaid.h',
  ),
  'utf8',
);

// The codes the bundled LinkKit declares, e.g. { NoAccounts: 5 }.
const linkKitErrorCodes = () => {
  const codes = {};
  const pattern = /PLKPlaidFinanceKitError(\w+) = (\d+)/g;
  let match = pattern.exec(linkKitHeader);
  while (match !== null) {
    codes[match[1]] = Number(match[2]);
    match = pattern.exec(linkKitHeader);
  }
  return codes;
};

describe('FinanceKit sync errors', () => {
  test('FinanceKitErrorType has every code the bundled LinkKit reports', () => {
    const codes = linkKitErrorCodes();
    const names = Object.keys(codes);

    expect(names.length).toBeGreaterThanOrEqual(11);
    names.forEach(name => {
      expect(Types.FinanceKitErrorType[name]).toBe(codes[name]);
    });
  });

  test('FinanceKitErrorType has no code LinkKit does not report', () => {
    const codes = linkKitErrorCodes();
    const names = Object.keys(Types.FinanceKitErrorType).filter(key =>
      Number.isNaN(Number(key)),
    );

    names.forEach(name => {
      expect(codes[name]).toBe(Types.FinanceKitErrorType[name]);
    });
  });

  test('the bridge forwards the API error of a sync the server failed', () => {
    expect(rnLinksdk).toContain('error.userInfo[kPLKFinanceKitErrorTypeKey]');
    expect(rnLinksdk).toContain('error.userInfo[kPLKFinanceKitErrorCodeKey]');
    expect(rnLinksdk).toContain('financeKitError[@"errorType"] = errorType;');
    expect(rnLinksdk).toContain('financeKitError[@"errorCode"] = errorCode;');
  });

  test('syncFinanceKit hands the native error to the caller unchanged', () => {
    expect(plaidLink).toContain('completion(error)');
  });
});
