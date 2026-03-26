import NativePlaidModule from './ReactNativePlaidLinkSdkModule';
import { LinkExit, LinkEvent, LinkSuccess, LinkTokenConfiguration, PlaidLinkSession } from './ReactNativePlaidLinkSdk.types';

type Subscription = ReturnType<typeof NativePlaidModule.addListener>;

let successSub: Subscription | null = null;
let exitSub: Subscription | null = null;
let eventSub: Subscription | null = null;

export async function create(config: LinkTokenConfiguration): Promise<PlaidLinkSession> {
    try {
        successSub?.remove();
        exitSub?.remove();
        eventSub?.remove();

        successSub = NativePlaidModule.addListener('onSuccess', (success: LinkSuccess) => {
            config.onSuccess(success);
        });

        exitSub = NativePlaidModule.addListener('onExit', (exit: LinkExit) => {
            config.onExit(exit);
        });

        eventSub = NativePlaidModule.addListener('onEvent', (event: LinkEvent) => {
            config.onEvent(event);
        });

        await NativePlaidModule.createPlaidLinkSession(config.token);

        console.log('[PlaidLink] create - returning session');

        return {
            open: (fullScreen = false) => {
                console.log('[PlaidLink] open called', fullScreen);
                return NativePlaidModule.openLinkSession(fullScreen);
            },
        };
    } catch (e) {
        console.error('[PlaidLink] create failed:', e);
        throw e;
    }
}

export { default } from './ReactNativePlaidLinkSdkModule';
export { default as ReactNativePlaidLinkSdkView } from './ReactNativePlaidLinkSdkView';
export * from './ReactNativePlaidLinkSdk.types';