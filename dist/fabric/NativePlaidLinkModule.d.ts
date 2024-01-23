import { TurboModule } from 'react-native';
import { Int32 } from 'react-native/Libraries/Types/CodegenTypes';
import { LinkSuccess as UnsafeObject, LinkExit as Double, LinkError as Float } from '../Types';
export interface Spec extends TurboModule {
    continueFromRedirectUriString(redirectUriString: string): void;
    create(configuration: Object): void;
    open(onSuccess: (success: UnsafeObject) => void, onExit: (error: Float, result: Double) => void): void;
    dismiss(): void;
    startLinkActivityForResult(data: string, onSuccessCallback: (result: UnsafeObject) => void, onExitCallback: (result: Double) => void): void;
    addListener(eventName: string): void;
    removeListeners(count: Int32): void;
}
declare const _default: Spec;
export default _default;
