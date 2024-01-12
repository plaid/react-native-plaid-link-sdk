import {StyleSheet} from 'react-native';
import {Colors} from 'react-native/Libraries/NewAppScreen';

export const styles = StyleSheet.create({
  button: {
    elevation: 8,
    backgroundColor: '#2196F3',
    width: '90%',
    margin: 4,
    paddingVertical: 4,
    fontSize: 16,
    textAlign: 'center',
    color: 'white',
    borderRadius: 4,
    alignSelf: 'center',
    textTransform: 'uppercase',
    overflow: 'hidden',
  },
  input: {
    height: 40,
    margin: 12,
    width: '90%',
    alignSelf: 'center',
    borderWidth: 1,
    padding: 10,
    borderColor: Colors.black,
  },
  embedded: {
    width: '95%',
    alignSelf: 'center',
    height: 360,
  },
});
