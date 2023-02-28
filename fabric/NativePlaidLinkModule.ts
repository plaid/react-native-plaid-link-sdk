// we use Object type because methods on the native side use NSDictionary and ReadableMap
// and we want to stay compatible with those
import {TurboModuleRegistry, TurboModule} from 'react-native';
import { Int32 } from 'react-native/Libraries/Types/CodegenTypes';
// we do it in this hacky way to trick codegen which does not care about types in callbacks,
// and at the same time to satisfy ts types
import { LinkSuccess as UnsafeObject, LinkExit as Double, LinkError as Float } from '../Types';

export interface Spec extends TurboModule {
    continueFromRedirectUriString(redirectUriString: string): void;
    create(configuration: Object): void;
    open(
        onSuccess: (success: UnsafeObject) => void,
        onExit: (error: Float, result: Double) => void,
      ): void;
    dismiss(): void;
    startLinkActivityForResult(
        data: string,
        onSuccessCallback: (result: UnsafeObject) => void,
        onExitCallback: (result: Double) => void): void;
    // those two are here for event emitter methods
    addListener(eventName: string): void;
    removeListeners(count: Int32): void;
}

export default TurboModuleRegistry.getEnforcing<Spec>('RNLinksdk');
