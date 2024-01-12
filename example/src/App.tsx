import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { PlaidEmbeddedLinkScreen } from './Screens/PlaidEmbeddedLinkScreen';
import { PlaidLinkScreen } from './Screens/PlaidLinkScreen';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator screenOptions={{
          tabBarLabelPosition: "beside-icon",
          tabBarLabelStyle: {
            fontWeight: "700",
            fontSize: 15
          },
          tabBarIconStyle: { display: "none" },
        }}
      >
        <Tab.Screen name="Standard Link" component={PlaidLinkScreen} />
        <Tab.Screen name="Embedded Link" component={PlaidEmbeddedLinkScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
