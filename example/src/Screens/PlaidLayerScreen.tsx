import React, {useState} from 'react';
import {
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  Platform,
  KeyboardAvoidingView,
  View,
  FlatList,
  StyleSheet,
} from 'react-native';
import {styles} from '../Styles';
import {
  create,
  open,
  submit,
  LinkSuccess,
  LinkExit,
  LinkOpenProps,
  LinkLogLevel,
  LinkIOSPresentationStyle,
  SubmissionData,
  dismissLink,
  usePlaidEmitter,
  LinkEvent,
  LinkEventName,
} from 'react-native-plaid-link-sdk';

export function PlaidLayerScreen() {
  const [linkToken, setLinkToken] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [handlerCreated, setHandlerCreated] = useState(false);
  const [isLayerReady, setIsLayerReady] = useState(false);
  const [events, setEvents] = useState<string[]>([]);

  const showAlert = (title: string, message: string) =>
    Alert.alert(title, message, [{text: 'OK'}], {cancelable: true});

  const createHandler = () => {
    if (!linkToken) {
      showAlert('Missing Token', 'Please enter a valid Link token');
      return;
    }

    const config = {
      token: linkToken,
      noLoadingState: false,
    };

    create(config);
    setHandlerCreated(true);
    setIsLayerReady(false);
    setEvents([]);
  };

  const handleSubmitPhone = () => {
    const data: SubmissionData = {phoneNumber};
    submit(data);
  };

  const handleSubmitDOB = () => {
    const data: SubmissionData = {dateOfBirth};
    submit(data);
  };

  const handleOpen = () => {
    const props: LinkOpenProps = {
      onSuccess: (success: LinkSuccess) => {
        console.log('Success', success);
      },
      onExit: (exit: LinkExit) => {
        console.log('Exit', exit);
        dismissLink();
      },
      iOSPresentationStyle: LinkIOSPresentationStyle.FULL_SCREEN,
      logLevel: LinkLogLevel.ERROR,
    };

    open(props);
    setIsLayerReady(false);
  };

  usePlaidEmitter((event: LinkEvent) => {
    console.log('Plaid Event:', event.eventName);
    if (event.eventName === LinkEventName.LAYER_READY) {
      setIsLayerReady(true);
    }
    setEvents(prev => [...prev, event.eventName]);
  });

  const renderEventItem = ({item}: {item: string}) => (
    <View style={screenStyles.eventItem}>
      <Text style={screenStyles.eventText}>{item}</Text>
    </View>
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={screenStyles.container}>
      <FlatList
        data={events}
        keyExtractor={(item, index) => `${item}-${index}`}
        renderItem={renderEventItem}
        ListHeaderComponent={
          <>
            <Text style={screenStyles.directions}>
              Paste a valid Link token, press "Load Layer", and then enter the
              user’s phone number. Once the handler is loaded, submit the
              required fields before opening the Link flow. Events will be shown
              at the bottom of the screen.
            </Text>

            <Text style={styles.label}>Link Token</Text>
            <TextInput
              style={styles.input}
              value={linkToken}
              onChangeText={setLinkToken}
              placeholder="link-production-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
              placeholderTextColor="#D3D3D3"
            />

            <Text style={styles.label}>Phone Number</Text>
            <TextInput
              style={styles.input}
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              placeholder="+1 415-555-0011"
              keyboardType="phone-pad"
              placeholderTextColor="#D3D3D3"
            />
            <TouchableOpacity
              disabled={!handlerCreated}
              style={handlerCreated ? styles.button : styles.disabledButton}
              onPress={handleSubmitPhone}>
              <Text style={styles.buttonText}>Submit Phone Number</Text>
            </TouchableOpacity>

            <Text style={styles.label}>Date of Birth</Text>
            <TextInput
              style={styles.input}
              value={dateOfBirth}
              onChangeText={setDateOfBirth}
              placeholder="YYYY-MM-DD"
              placeholderTextColor="#D3D3D3"
            />
            <TouchableOpacity
              disabled={!handlerCreated}
              style={handlerCreated ? styles.button : styles.disabledButton}
              onPress={handleSubmitDOB}>
              <Text style={styles.buttonText}>Submit Date of Birth</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.button} onPress={createHandler}>
              <Text style={styles.buttonText}>Load Layer</Text>
            </TouchableOpacity>

            <TouchableOpacity
              disabled={!isLayerReady}
              style={isLayerReady ? styles.button : styles.disabledButton}
              onPress={handleOpen}>
              <Text style={styles.buttonText}>Open Layer</Text>
            </TouchableOpacity>

            <Text style={screenStyles.eventHeader}>Received Events</Text>
            {events.length === 0 && (
              <Text style={screenStyles.noEvents}>No events yet</Text>
            )}
          </>
        }
        style={screenStyles.list}
      />
    </KeyboardAvoidingView>
  );
}

const screenStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  list: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  directions: {
    marginBottom: 12,
    fontSize: 14,
    fontWeight: '500',
    color: '#222',
  },
  eventHeader: {
    marginTop: 24,
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  noEvents: {
    textAlign: 'center',
    marginVertical: 12,
    color: '#888',
  },
  eventItem: {
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  eventText: {
    textAlign: 'center',
  },
});
