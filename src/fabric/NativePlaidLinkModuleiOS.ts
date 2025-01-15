// we use Object type because methods on the native side use NSDictionary and ReadableMap
// and we want to stay compatible with those
import {TurboModuleRegistry, TurboModule} from 'react-native';
import {Int32} from 'react-native/Libraries/Types/CodegenTypes';
import {UnsafeObject} from './fabricUtils';
import {LinkSuccess, LinkExit, LinkError, FinanceKitError} from '../Types';

export interface Spec extends TurboModule {
    create(token: string, noLoadingState: boolean): null;
    open(
        fullScreen: boolean,
        onSuccess: (result: UnsafeObject<LinkSuccess>) => null,
        onExit: (error: UnsafeObject<LinkError>, result: UnsafeObject<LinkExit>) => null,
      ): void;
    dismiss(): null;
    submit(phoneNumber: string | undefined): null;
    // those two are here for event emitter methods
    addListener(eventName: string): null;
    removeListeners(count: Int32): null;
    syncFinanceKit(
      token: string,
      requestAuthorizationIfNeeded: boolean,
      onSuccess: (success: void) => null,
      onError: (error: FinanceKitError) => null
    ): null
}

export default TurboModuleRegistry.get<Spec>('RNLinksdk');
