import React from 'react';

import {NavigationContainer, useNavigation} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {HeaderBackButton} from '@react-navigation/stack';
import {StatusBar} from 'react-native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import ErrorScreen from './components/ErrorScreen';
import SuccessScreen from './components/SuccessScreen';
import HomeScreen from './components/HomeScreen';

const Stack = createStackNavigator();

const App: () => React$Node = () => {
  return (
    <SafeAreaProvider>
      <NavigationContainer style={(backgroundColor = '#000000')}>
        <StatusBar barStyle="light-content" backgroundColor="#000000" />
        <Stack.Navigator>
          <Stack.Screen
            name="Link Demo"
            component={HomeScreen}
            options={{
              animationEnabled: false,
              headerStyle: {
                backgroundColor: '#000000',
              },
              headerTintColor: '#fff',
            }}
          />
          <Stack.Screen
            name="Success"
            component={SuccessScreen}
            options={{
              animationEnabled: false,
              headerStyle: {
                backgroundColor: '#000000',
              },
              headerTintColor: '#fff',
              headerLeft: (props) => <HeaderBackButton {...props} />,
            }}
          />
          <Stack.Screen
            name="Error"
            component={ErrorScreen}
            options={{
              animationEnabled: false,
              headerStyle: {
                backgroundColor: '#000000',
              },
              headerTintColor: '#fff',
              headerLeft: (props) => <HeaderBackButton {...props} />,
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
};

export default App;
