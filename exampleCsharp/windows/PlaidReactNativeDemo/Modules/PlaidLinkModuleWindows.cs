using Microsoft.ReactNative.Managed;
using System;
using System.Diagnostics;
using Windows.UI.Xaml.Controls;

namespace PlaidLinkModuleWindows
{
    [ReactModule("PlaidLinkModuleWindows")]
    public sealed class PlaidLinkModuleWindows
    {
        private ReactContext _reactContext;

        // Default constructor
        public PlaidLinkModuleWindows()
        {
            // Optionally, initialize or handle without context
            Debug.WriteLine("PlaidLinkModuleWindows instance created without context.");
        }

        // Constructor to initialize the React context
        public PlaidLinkModuleWindows(ReactContext reactContext)
        {
            _reactContext = reactContext;
            Debug.WriteLine("PlaidLinkModuleWindows instance created with context.");
        }

        // Method to create the Plaid Link session
        [ReactMethod("create")]
        public void Create(string token, bool noLoadingState)
        {
            // Implement logic to initialize Plaid Link session
            Debug.WriteLine($"Creating Plaid Link with token: {token} and noLoadingState: {noLoadingState}");

            // Simulate success or exit callback
            var successResult = new JSValueObject();
            successResult["status"] = "success";
            _reactContext.EmitJSEvent("PlaidLinkEvent", null, successResult);
        }

        // Method to open the Plaid Link session
        [ReactMethod("open")]
        public void Open(Action<JSValue> onSuccess, Action<JSValue> onExit)
        {
            // Implement logic to open Plaid Link
            Debug.WriteLine("Opening Plaid Link");

            // Simulate success or exit callback
            var successResult = new JSValueObject();
            successResult["status"] = "success";
            onSuccess(successResult);
        }

        // Method to dismiss the Plaid Link view
        [ReactMethod("dismiss")]
        public void Dismiss()
        {
            // Implement logic to dismiss the Plaid Link view
            Debug.WriteLine("Dismissing Plaid Link");
        }

        // Method to submit data (e.g., phone number)
        [ReactMethod("submit")]
        public void Submit(string phoneNumber)
        {
            // Implement logic to handle submission of data
            Debug.WriteLine($"Submitting phone number: {phoneNumber}");
        }
    }
}
