// we use Object type because methods on the native side use NSDictionary and ReadableMap
// and we want to stay compatible with those
import {TurboModuleRegistry, TurboModule} from 'react-native';
import {Double} from 'react-native/Libraries/Types/CodegenTypes';
import {UnsafeObject} from './fabricUtils';
import {LinkSuccess, LinkExit} from '../Types';

export interface Spec extends TurboModule {
    create(token: string, noLoadingState: boolean, logLevel: string): void;
    open(
        onSuccess: (result: UnsafeObject<LinkSuccess>) => void,
        onExit: (result: UnsafeObject<LinkExit>) => void,
      ): void;
    startLinkActivityForResult(
        token: string,
        noLoadingState: boolean,
        logLevel: string,
        onSuccessCallback: (result: UnsafeObject<LinkSuccess>) => void,
        onExitCallback: (result: UnsafeObject<LinkExit>) => void
    ): void;
    submit(phoneNumber: string | undefined): void;
    // those two are here for event emitter methods
    addListener(eventName: string): void;
    removeListeners(count: Double): void;
}

export default TurboModuleRegistry.get<Spec>('PlaidAndroid');
