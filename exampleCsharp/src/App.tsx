


import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import { NativeModules} from 'react-native';
import {PlaidEmbeddedLinkScreen} from './Screens/PlaidEmbeddedLinkScreen';
import {PlaidLinkScreen} from './Screens/PlaidLinkScreen';

const { PlaidClassModule } = NativeModules;
const Tab = createBottomTabNavigator();

export default function App() {
  // State for managing the link token
  const [linkToken, setLinkToken] = React.useState('');

  const [publicToken, setPublicToken] = React.useState('');
  const [loading, setLoading] = React.useState(true); // State to manage loading status

  // Function to retrieve the link token from the native module
  const getLinkToken = async () => {
    try {
      const linkToken = await PlaidClassModule.getLinkToken();
      PlaidClassModule.PLAID_LINK_TOKEN = linkToken; // Set the token in the native module
      setLinkToken(linkToken); 
      if(linkToken){
        const publicToken = await PlaidClassModule.getPublicToken();
        PlaidClassModule.PLAID_PUBLIC_TOKEN = publicToken; 
        setPublicToken(publicToken);
        if(publicToken){
          const accessToken = await PlaidClassModule.exchangePublicToken();
          PlaidClassModule.PLAID_ACCESS_TOKEN = accessToken; 
        }
        // Set the token in the native module
      }// Update the state with the fetched token
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
    <NavigationContainer>
      <Tab.Navigator screenOptions={{
          tabBarLabelPosition: 'beside-icon',
          tabBarLabelStyle: {
            fontWeight: '700',
            fontSize: 15,
          },
          tabBarIconStyle: {display: 'none'},
        }}>
        <Tab.Screen name="Standard Link" component={PlaidLinkScreen} />
        <Tab.Screen name="Embedded Link" component={PlaidEmbeddedLinkScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
