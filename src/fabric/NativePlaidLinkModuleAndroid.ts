// we use Object type because methods on the native side use NSDictionary and ReadableMap
// and we want to stay compatible with those
import {TurboModuleRegistry, TurboModule} from 'react-native';
import { Int32, UnsafeObject } from 'react-native/Libraries/Types/CodegenTypes';

export interface Spec extends TurboModule {
    startLinkActivityForResult(
        token: string,
        noLoadingState: boolean,
        logLevel: string,
        onSuccessCallback: (result: UnsafeObject) => void,
        onExitCallback: (result: UnsafeObject) => void
    ): void;

    // those two are here for event emitter methods
    addListener(eventName: string): void;
    removeListeners(count: Int32): void;
}

export default TurboModuleRegistry.get<Spec>('PlaidAndroid');
