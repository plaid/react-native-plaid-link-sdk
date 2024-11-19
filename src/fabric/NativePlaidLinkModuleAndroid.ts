// Import necessary modules and types from React Native and other utilities
// TurboModuleRegistry and TurboModule are used to define and register TurboModules, which are native modules
// UnsafeObject is a utility type used to maintain compatibility with native objects like NSDictionary and ReadableMap
import {TurboModuleRegistry, TurboModule} from 'react-native';
import {Double} from 'react-native/Libraries/Types/CodegenTypes';
import {UnsafeObject} from './fabricUtils';
import {LinkSuccess, LinkExit} from '../Types';

// Define the Spec interface, which extends TurboModule
// This interface represents the shape of the native module that we are exposing to JavaScript
export interface Spec extends TurboModule {
    /**
     * Initializes the Plaid module with the provided Link token and configuration.
     *
     * @param token - The Link token used to authenticate the session.
     * @param noLoadingState - Whether to disable the loading state in the UI.
     * @param logLevel - The logging level for debugging or error reporting.
     */
    create(token: string, noLoadingState: boolean, logLevel: string): void;

    /**
     * Opens the Plaid Link session and handles the success and exit callbacks.
     *
     * @param onSuccess - Callback function executed when the session completes successfully.
     * @param onExit - Callback function executed when the session exits, either by user action or an error.
     */
    open(
        onSuccess: (result: UnsafeObject<LinkSuccess>) => void,
        onExit: (result: UnsafeObject<LinkExit>) => void,
      ): void;

    /**
     * Starts the Link activity for result on Android, allowing users to link accounts.
     *
     * @param token - The Link token used to authenticate the session.
     * @param noLoadingState - Whether to disable the loading state in the UI.
     * @param logLevel - The logging level for debugging or error reporting.
     * @param onSuccessCallback - Callback function executed when the session completes successfully.
     * @param onExitCallback - Callback function executed when the session exits, either by user action or an error.
     */
    startLinkActivityForResult(
        token: string,
        noLoadingState: boolean,
        logLevel: string,
        onSuccessCallback: (result: UnsafeObject<LinkSuccess>) => void,
        onExitCallback: (result: UnsafeObject<LinkExit>) => void
    ): void;

    /**
     * Submits a phone number to the Plaid module, typically used for verification or similar purposes.
     *
     * @param phoneNumber - The phone number to submit, or undefined if not available.
     */
    submit(phoneNumber: string | undefined): void;

    /**
     * Adds an event listener for the specified event name.
     *
     * @param eventName - The name of the event to listen for.
     */
    addListener(eventName: string): void;

    /**
     * Removes the specified number of event listeners.
     *
     * @param count - The number of listeners to remove.
     */
    removeListeners(count: Double): void;
}

// Export the default instance of the PlaidAndroid TurboModule
// This retrieves the native module implementation, if available, and provides it to the JavaScript layer.
export default TurboModuleRegistry.get<Spec>('PlaidAndroid');
