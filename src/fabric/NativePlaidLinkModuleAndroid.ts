// we use Object type because methods on the native side use NSDictionary and ReadableMap
// and we want to stay compatible with those
import {TurboModuleRegistry, TurboModule} from 'react-native';
import {Double} from 'react-native/Libraries/Types/CodegenTypes';
import {UnsafeObject} from './fabricUtils';
import {LinkSuccess, LinkExit} from '../Types';

export interface Spec extends TurboModule {
    create(token: string, noLoadingState: boolean, logLevel: string): null;
    open(
        onSuccess: (result: UnsafeObject<LinkSuccess>) => null,
        onExit: (result: UnsafeObject<LinkExit>) => null,
      ): null;
    startLinkActivityForResult(
        token: string,
        noLoadingState: boolean,
        logLevel: string,
        onSuccessCallback: (result: UnsafeObject<LinkSuccess>) => null,
        onExitCallback: (result: UnsafeObject<LinkExit>) => null
    ): void;
    submit(phoneNumber: string | undefined): null;
    // those two are here for event emitter methods
    addListener(eventName: string): null;
    removeListeners(count: Double): null;
}

export default TurboModuleRegistry.get<Spec>('PlaidAndroid');
