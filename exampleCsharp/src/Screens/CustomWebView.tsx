// CustomWebView.tsx
import React, { forwardRef, useImperativeHandle, useRef } from 'react';
import { requireNativeComponent, UIManager, findNodeHandle, Platform, ViewStyle } from 'react-native';

// Define the interface for the props expected by the native component
interface CustomWebViewProps {
  label?: string;
  color?: string; // Hex color code for text color
  backgroundColor?: string; // Hex color code for background color
  style?: ViewStyle; // Style prop for custom styling
}

// Define the methods that will be exposed to the parent component via ref
export interface CustomWebViewHandle {
  sendCommand: (command: string, args?: any[]) => void;
}

// Define the native component binding with typed props
const NativeCustomWebView = requireNativeComponent<CustomWebViewProps>('CustomWebViewControl');
console.log(NativeCustomWebView)
// Define the CustomWebView component with forwardRef to expose native methods
const CustomWebView = forwardRef<CustomWebViewHandle, CustomWebViewProps>(
  ({ label, color, backgroundColor, style }, ref) => {
    const webViewRef = useRef(null);

    // Allow the parent component to call methods on the CustomWebView
    useImperativeHandle(ref, () => ({
      sendCommand: (command: string, args: any[] = []) => {
        const viewId = findNodeHandle(webViewRef.current);
        console.log(viewId);
        if (viewId && Platform.OS === 'windows') {
          UIManager.dispatchViewManagerCommand(
            viewId,
            UIManager.getViewManagerConfig('CustomWebViewControl').Commands.CustomCommand,
            [command, ...args]
          );
        }
      },
    }));

    // Render the native component with forwarded props
    return (
      <NativeCustomWebView
        ref={webViewRef}
        style={style}
        label={label}
        color={color}
        backgroundColor={backgroundColor}
      />
    );
  }
);

export default CustomWebView;
