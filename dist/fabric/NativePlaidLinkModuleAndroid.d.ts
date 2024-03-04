import { TurboModule } from 'react-native';
import { Int32, UnsafeObject } from 'react-native/Libraries/Types/CodegenTypes';
export interface Spec extends TurboModule {
    startLinkActivityForResult(token: string, noLoadingState: boolean, logLevel: string, onSuccessCallback: (result: UnsafeObject) => void, onExitCallback: (result: UnsafeObject) => void): void;
    addListener(eventName: string): void;
    removeListeners(count: Int32): void;
}
declare const _default: Spec | null;
export default _default;
