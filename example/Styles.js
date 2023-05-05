import {StyleSheet} from 'react-native';
import {Colors} from 'react-native/Libraries/NewAppScreen';

export const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: Colors.white,
  },
  engine: {
    position: 'absolute',
    right: 0,
  },
  body: {
    backgroundColor: Colors.white,
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.black,
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
    color: Colors.dark,
  },
  buttonContainer: {
    paddingHorizontal: 24,
    paddingBottom: 8,
  },
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
  highlight: {
    fontWeight: '700',
  },
  footer: {
    color: Colors.dark,
    fontSize: 12,
    fontWeight: '600',
    padding: 4,
    paddingRight: 12,
    textAlign: 'right',
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
  inputDark: {
    height: 40,
    margin: 12,
    width: '90%',
    alignSelf: 'center',
    borderWidth: 1,
    padding: 10,
    borderColor: Colors.white,
  },
});
