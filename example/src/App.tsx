import * as React from 'react';
import {SafeAreaView, StatusBar, StyleSheet} from 'react-native';
import {PlaidLayerScreen} from './Screens/PlaidLayerScreen';

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <PlaidLayerScreen />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
