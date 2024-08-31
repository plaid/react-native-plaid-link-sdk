// App.tsx
import * as React from 'react';
import { NativeModules,Button, Text, View, ActivityIndicator, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { PlaidEmbeddedLinkScreen } from './Screens/PlaidEmbeddedLinkScreen';
import { PlaidLinkScreen } from './Screens/PlaidLinkScreen';
import PlaidIntergrationComponent from './Screens/PlaidIntergrationComponent'; // Ensure the correct path and spelling
import { styles } from './Styles'; // Styles used throughout the app
const { NavigationModule,  PlaidClassModule } = NativeModules;

const navigateToCustomWebViewPage = () => {
  NavigationModule.navigateToCustomWebViewPage();
};
// Define the tab navigator
const Tab = createBottomTabNavigator();


export default function App() {
  // State for managing the link token
  const [token, setToken] = React.useState('');
  const [loading, setLoading] = React.useState(true); // State to manage loading status

  // Function to retrieve the link token from the native module
  const getLinkToken = async () => {
    try {
      const linkToken = await PlaidClassModule.getLinkToken();
      PlaidClassModule.PLAID_PUBLIC_TOKEN = linkToken; // Set the token in the native module
      setToken(linkToken); // Update the state with the fetched token
      setLoading(false); // Stop the loading indicator
    } catch (error) {
      console.error('Error fetching the link token:', error);
      setLoading(false); // Stop loading even if there is an error
    }
  };

  // Fetch the link token when the component mounts
  React.useEffect(() => {
    getLinkToken();
  }, []);

  return (
    <View style={styles.appContainer}>
      {/* Display the token or a loading indicator */}
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" style={styles.loadingIndicator} />
      ) : (
        <>
          <Text style={styles.tokenText}>{token ? `Token: ${token}` : 'No token available'}</Text>
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Button
        title="Open WebView Page"
        onPress={navigateToCustomWebViewPage} // This triggers navigation to CustomWebViewPage
      />
    </View>
          {/* Integration Component with the Plaid Link */}
          {/* <PlaidIntergrationComponent token={token} /> */}

          {/* Navigation Container with Tab Navigator */}
          <NavigationContainer>
            <Tab.Navigator
              screenOptions={{
                tabBarLabelPosition: 'beside-icon',
                tabBarLabelStyle: {
                  fontWeight: '700',
                  fontSize: 15,
                },
                tabBarIconStyle: { display: 'none' },
              }}
            >
              <Tab.Screen name="Standard Link" component={PlaidLinkScreen} />
              <Tab.Screen name="Embedded Link" component={PlaidEmbeddedLinkScreen} />
            </Tab.Navigator>
          </NavigationContainer>
        </>
      )}
    </View>
  );
}

