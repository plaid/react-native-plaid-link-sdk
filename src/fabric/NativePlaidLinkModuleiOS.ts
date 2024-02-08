// we use Object type because methods on the native side use NSDictionary and ReadableMap
// and we want to stay compatible with those
import {TurboModuleRegistry, TurboModule} from 'react-native';
import { Int32, UnsafeObject } from 'react-native/Libraries/Types/CodegenTypes';

export interface Spec extends TurboModule {
    create(token: string, noLoadingState: boolean): void;
    open(
        fullScreen: boolean,
        onSuccess: (success: UnsafeObject) => void,
        onExit: (error: UnsafeObject, result: UnsafeObject) => void,
      ): void;
    dismiss(): void;
    // those two are here for event emitter methods
    addListener(eventName: string): void;
    removeListeners(count: Int32): void;
}

export default TurboModuleRegistry.get<Spec>('RNLinksdk');
