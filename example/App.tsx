// import React from 'react';
// import {
//   SafeAreaView,
//   ScrollView,
//   StatusBar,
//   useColorScheme,
//   View,
// } from 'react-native';

// import {Colors} from 'react-native/Libraries/NewAppScreen';
// import {PlaidEventContainer} from './PlaidEventContainer';

// function App(): JSX.Element {
//   const isDarkMode = useColorScheme() === 'dark';

//   const backgroundStyle = {
//     backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
//   };

//   return (
//     <SafeAreaView style={backgroundStyle}>
//       <StatusBar
//         barStyle={isDarkMode ? 'light-content' : 'dark-content'}
//         backgroundColor={backgroundStyle.backgroundColor}
//       />
//       <ScrollView
//         contentInsetAdjustmentBehavior="automatic"
//         style={backgroundStyle}>
//         <View
//           style={{
//             backgroundColor: isDarkMode ? Colors.black : Colors.white,
//           }}>
//           <PlaidEventContainer />
//         </View>
//       </ScrollView>
//     </SafeAreaView>
//   );
// }

// export default App;

import React from 'react';
import {Component} from 'react';
import {StyleSheet, View} from 'react-native';
import MyCustomView from 'react-native-plaid-link-sdk';

export default class App extends Component {
  state = {
    status: true,
  };

  render() {
    return (
      <View style={styles.container}>
        <MyCustomView
          status={this.state.status}
          style={{width: 100, height: 100}}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
});