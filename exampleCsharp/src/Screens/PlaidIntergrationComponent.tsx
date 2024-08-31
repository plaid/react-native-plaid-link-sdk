// Screens/PlaidIntegrationComponent.tsx
import React, { useRef } from 'react';
import { View, Button, StyleSheet } from 'react-native';
import CustomWebView, { CustomWebViewHandle } from './CustomWebView'; // Import the handle type
import { styles } from '../Styles'; // Styles used throughout the app

const PlaidIntergrationComponent: React.FC<{ token: string }> = ({ token }) => {
  // Correctly type the ref to match CustomWebViewHandle
  const webViewRef = useRef<CustomWebViewHandle>(null);

  // Function to navigate to the Plaid URL with the token
  const navigateToPlaid = () => {
    console.log(webViewRef)
    if (webViewRef.current && token) {
        webViewRef.current.sendCommand('navigate', [token]);
    
    }
  };

  return (
    <View style={styles.container}>
      <Button title="Open Plaid Link" onPress={navigateToPlaid} />

      {/* Render the custom WebView component with the correct props */}
      <CustomWebView
        ref={webViewRef}
        label="Plaid Link WebView"
        color="#000000"
        backgroundColor="#ffffff"
        style={styles.webview}
      />
    </View>
  );
};


export default PlaidIntergrationComponent;
