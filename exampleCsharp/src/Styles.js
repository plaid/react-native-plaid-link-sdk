import {StyleSheet} from 'react-native';
import {Colors} from 'react-native/Libraries/NewAppScreen';

// Define common button styles to avoid redundancy
const buttonBase = {
  elevation: 8,
  backgroundColor: '#2196F3',
  width: '90%',
  margin: 4,
  paddingVertical: 10,
  borderRadius: 4,
  alignSelf: 'center',
  textAlign: 'center',
  textTransform: 'uppercase',
  overflow: 'hidden',
};

export const styles = StyleSheet.create({
  button: {
    ...buttonBase,
    fontSize: 16,
    color: 'white',
  },
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: 'black',
  },
  webview: {
    width: '95%',
    alignSelf: 'center',
    height: 400, // Adjust height as needed
    backgroundColor: 'pink',
  },
  // Disabled button style with reduced opacity
  disabledButton: {
    ...buttonBase,
    opacity: 0.5,
  },

  // Input field style
  input: {
    height: 40,
    margin: 12,
    width: '90%',
    alignSelf: 'center',
    borderWidth: 1,
    padding: 10,
    borderColor: Colors.black,
    borderRadius: 4, // Adding border radius for consistency
    backgroundColor: '#fff', // Ensure input is visually distinct
  },

  // Embedded component style, such as for embedded web views
  embedded: {
    width: '95%',
    alignSelf: 'center',
    height: 360,
    borderWidth: 1,
    borderColor: Colors.light, // Adding border to make the embedded area stand out
  },

  // Example of additional text styling (e.g., for token display)
  tokenText: {
    fontSize: 16,
    marginVertical: 10,
    textAlign: 'center',
    color: Colors.dark, // Make sure the text is readable
  },

  // Loading indicator style
  loadingIndicator: {
    marginVertical: 20,
  },

  // General container style
  appContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.lighter, // Adds a subtle background color
  },
});
