import React from 'react';

import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {StatusBar} from 'react-native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import ExitScreen from './components/ExitScreen';
import SuccessScreen from './components/SuccessScreen';
import HomeScreen from './components/HomeScreen';
import {PlaidTheme} from './components/style';

const Stack = createStackNavigator();

const App = (): React.ReactElement => {
  return (
    <SafeAreaProvider>
      <NavigationContainer theme={PlaidTheme}>
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
            }}
          />
          <Stack.Screen
            name="Exit"
            component={ExitScreen}
            options={{
              animationEnabled: false,
              headerStyle: {
                backgroundColor: '#000000',
              },
              headerTintColor: '#fff',
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
};

export default App;
