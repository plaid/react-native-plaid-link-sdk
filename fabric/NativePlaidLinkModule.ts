// we use Object type because methods on the native side use NSDictionary and ReadableMap
// and we want to stay compatible with those
import {TurboModuleRegistry, TurboModule} from 'react-native';

export interface Spec extends TurboModule {
    continueFromRedirectUriString(redirectUriString: string): void;
    create(configuration: Object): void;
    open(
        onSuccess: (success: Object) => void,
        onExit: (error: Object) => void,
      ): void;
    dismiss(): void;
    startLinkActivityForResult(
        data: string,
        onSuccessCallback: () => void,
        onExitCallback: () => void): void;
}

export default TurboModuleRegistry.getEnforcing<Spec>('RNLinksdk');