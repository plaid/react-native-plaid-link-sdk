import { TurboModule } from 'react-native';
import { Int32, UnsafeObject } from 'react-native/Libraries/Types/CodegenTypes';
export interface Spec extends TurboModule {
    create(token: string, noLoadingState: boolean): void;
    open(fullScreen: boolean, onSuccess: (success: UnsafeObject) => void, onExit: (error: UnsafeObject, result: UnsafeObject) => void): void;
    dismiss(): void;
    addListener(eventName: string): void;
    removeListeners(count: Int32): void;
}
declare const _default: Spec | null;
export default _default;
