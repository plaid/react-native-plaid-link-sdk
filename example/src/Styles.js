import {StyleSheet} from 'react-native';
import {Colors} from 'react-native/Libraries/NewAppScreen';

export const styles = StyleSheet.create({
  button: {
    backgroundColor: '#2196F3',
    width: '90%',
    marginVertical: 6,
    paddingVertical: 10,
    alignSelf: 'center',
    alignItems: 'center',
    borderRadius: 6,
  },
  disabledButton: {
    backgroundColor: '#2196F3',
    width: '90%',
    marginVertical: 6,
    paddingVertical: 10,
    alignSelf: 'center',
    alignItems: 'center',
    borderRadius: 6,
    opacity: 0.5,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    textTransform: 'uppercase',
  },
  input: {
    height: 40,
    marginVertical: 12,
    width: '90%',
    alignSelf: 'center',
    borderWidth: 1,
    paddingHorizontal: 10,
    borderColor: '#000',
    borderRadius: 4,
  },
  label: {
    marginLeft: '5%',
    marginTop: 12,
    fontSize: 14,
    fontWeight: '600',
    color: Colors.black,
  },
  embedded: {
    width: '95%',
    alignSelf: 'center',
    height: 360,
  },
  loadingContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: Colors.black,
  },
});
