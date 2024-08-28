import * as React from 'react';
import { NativeModules } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { TextInput, Text, TouchableOpacity } from 'react-native';
import { PlaidEmbeddedLinkScreen } from './Screens/PlaidEmbeddedLinkScreen';
import { PlaidLinkScreen } from './Screens/PlaidLinkScreen';
import { styles } from './Styles';
const Tab = createBottomTabNavigator();
const { PlaidClassModule, PlaidLinkModuleWindows } = NativeModules;


console.log(PlaidLinkModuleWindows)
export default function App() {
  // const [token, setToken] = React.useState('');

  // const getLinkToken = async () => {
  //   PlaidClassModule.PLAID_PUBLIC_TOKEN = await PlaidClassModule.getLinkToken();
  //   setToken(PlaidClassModule.PLAID_PUBLIC_TOKEN);
  // };

  // React.useEffect(() => {
  //   getLinkToken();
  //   console.log(token);
  // }, []);


  return (
    <>
      {/* <TouchableOpacity
        style={styles.button}
        onPress={() => {
          PlaidLinkModuleWindows.create({ token });

        }
        }>
        <Text style={styles.button}>Create Link</Text>
      </TouchableOpacity> */}
      <NavigationContainer>
        <Tab.Navigator screenOptions={{
          tabBarLabelPosition: 'beside-icon',
          tabBarLabelStyle: {
            fontWeight: '700',
            fontSize: 15,
          },
          tabBarIconStyle: { display: 'none' },
        }}>
          <Tab.Screen name="Standard Link" component={PlaidLinkScreen} />
          <Tab.Screen name="Embedded Link" component={PlaidEmbeddedLinkScreen} />
        </Tab.Navigator>
      </NavigationContainer>
    </>
  );
}
