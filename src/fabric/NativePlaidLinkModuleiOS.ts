// Import necessary modules for defining the TurboModule interface
import {TurboModuleRegistry, TurboModule} from 'react-native'; // TurboModule system for native modules
import {Int32} from 'react-native/Libraries/Types/CodegenTypes'; // Codegen-friendly integer type
import {UnsafeObject} from './fabricUtils'; // Utility for handling dynamic or loosely-typed objects
import {LinkSuccess, LinkExit, LinkError} from '../Types'; // Type definitions for Link SDK operations

// Define the Spec interface, which represents the methods exposed by the native RNLinksdk module
export interface Spec extends TurboModule {
    
    /**
     * Initializes the Link handler with the provided token.
     * @param token - The authentication token used to configure Link.
     * @param noLoadingState - If true, skips showing the loading state in the UI.
     */
    create(token: string, noLoadingState: boolean): void;

    /**
     * Opens the Link experience.
     * Must be called after the `create` method has been successfully invoked.
     * @param fullScreen - If true, opens the Link UI in full-screen mode.
     * @param onSuccess - Callback invoked when Link completes successfully.
     * @param onExit - Callback invoked when the user exits the Link UI.
     */
    open(
        fullScreen: boolean,
        onSuccess: (result: UnsafeObject<LinkSuccess>) => void,
        onExit: (error: UnsafeObject<LinkError>, result: UnsafeObject<LinkExit>) => void,
    ): void;

    /**
     * Dismisses the Link UI.
     * Can be used to programmatically close the Link experience.
     */
    dismiss(): void;

    /**
     * Submits the provided phone number for eligibility checks.
     * @param phoneNumber - The user's phone number, or undefined if not provided.
     */
    submit(phoneNumber: string | undefined): void;

    /**
     * Registers a listener for a specific event emitted by the module.
     * @param eventName - The name of the event to listen for.
     */
    addListener(eventName: string): void;

    /**
     * Removes a specified number of event listeners.
     * @param count - The number of listeners to remove.
     */
    removeListeners(count: Int32): void;

    /**
     * Synchronizes the user's transactions and data using FinanceKit.
     * @param token - The authentication token used to access FinanceKit.
     * @param requestAuthorizationIfNeeded - If true, prompts the user for necessary permissions.
     * @param onSuccess - Callback invoked when synchronization completes successfully.
     * @param onError - Callback invoked when an error occurs during synchronization.
     *                  The error object includes:
     *                  - `type`: A numeric code identifying the error type.
     *                  - `message`: A descriptive message about the error.
     */
    syncFinanceKit(
        token: string,
        requestAuthorizationIfNeeded: boolean,
        onSuccess: () => void,
        onError: (error: { type: number; message: string }) => void
    ): void;
}

// Export the TurboModule registry entry for this module, enabling JavaScript access.
export default TurboModuleRegistry.get<Spec>('RNLinksdk');
