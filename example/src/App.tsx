import * as React from 'react';
import {Platform} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

import {PlaidEmbeddedLinkScreen} from './Screens/PlaidEmbeddedLinkScreen';
import {PlaidLinkScreen} from './Screens/PlaidLinkScreen';
import {PlaidLayerScreen} from './Screens/PlaidLayerScreen';
import {FinanceKitScreen} from './Screens/FinanceKitScreen';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          tabBarLabelPosition: 'beside-icon',
          tabBarLabelStyle: {
            fontWeight: '700',
            fontSize: 15,
          },
          tabBarIconStyle: {display: 'none'},
        }}>
        <Tab.Screen name="Link" component={PlaidLinkScreen} />
        <Tab.Screen name="Embedded" component={PlaidEmbeddedLinkScreen} />
        <Tab.Screen name="Layer" component={PlaidLayerScreen} />
        {Platform.OS === 'ios' && (
          <Tab.Screen name="FinanceKit" component={FinanceKitScreen} />
        )}
      </Tab.Navigator>
    </NavigationContainer>
  );
}
