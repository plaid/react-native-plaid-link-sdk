import type { ViewProps } from 'react-native';
import codegenNativeComponent from 'react-native/Libraries/Utilities/codegenNativeComponent';
// @ts-ignore getting the types from the codegen
import { DirectEventHandler, UnsafeMixed } from 'react-native/Libraries/Types/CodegenTypes';

export interface NativeProps extends ViewProps {
  token?: string;
  iOSPresentationStyle?: string;
  onEmbeddedEvent: DirectEventHandler<{
    embeddedEventName: string;
    // for EmbeddedEvent
    eventName?: string;
    // for EmbeddedExit
    error?: UnsafeMixed;
    // for EmbeddedSuccess
    publicToken?: string;
    // for all of them
    metadata?: UnsafeMixed;
  }>;
}

export default codegenNativeComponent<NativeProps>(
  'PLKEmbeddedView',
);
