// we use Object type because methods on the native side use NSDictionary and ReadableMap
// and we want to stay compatible with those
import {TurboModuleRegistry, TurboModule} from 'react-native';
import {Int32} from 'react-native/Libraries/Types/CodegenTypes';
import {UnsafeObject} from './fabricUtils';
import {LinkSuccess, LinkExit, LinkError, FinanceKitError} from '../Types';

export interface Spec extends TurboModule {
  create(token: string, noLoadingState: boolean): boolean;
  open(
      fullScreen: boolean,
      onSuccess: (result: UnsafeObject<LinkSuccess>) => boolean,
      onExit: (error: UnsafeObject<LinkError>, result: UnsafeObject<LinkExit>) => boolean,
  ): boolean;
  dismiss(): boolean;
  submit(phoneNumber: string | undefined): boolean;
  // those two are here for event emitter methods
  addListener(eventName: string): boolean;
  removeListeners(count: Int32): boolean;
  syncFinanceKit(
      token: string,
      requestAuthorizationIfNeeded: boolean,
      onSuccess: (success: boolean) => boolean,
      onError: (error: UnsafeObject<FinanceKitError>) => boolean
  ): boolean;
}

export default TurboModuleRegistry.get<Spec>('RNLinksdk');
