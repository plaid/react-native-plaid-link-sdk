using Microsoft.ReactNative.Managed;
using System;
using System.Net.Http;
using System.Threading.Tasks;
using Newtonsoft.Json;
using System.Collections.Generic; 

namespace PlaidLinkModuleWindows
{
    [ReactModule("RNLinkSdkWindows")] // Updated module name to be platform-specific
    public sealed class PlaidLinkModuleWindows
    {
        private ReactContext _reactContext;
        private string _linkToken;
        private const string PlaidBackendUrl = "https://greenfieldxplatform-00f7d0070a43.herokuapp.com"; // Replace with your actual backend URL

        public PlaidLinkModuleWindows() { }

        [ReactInitializer]
        public void Initialize(ReactContext reactContext)
        {
            _reactContext = reactContext;
        }

        [ReactMethod("create")]
        public async Task CreateAsync(string token, bool noLoadingState)
        {
            _linkToken = token;
            var successResult = new JSValueObject
            {
                ["status"] = "success",
                ["message"] = "Plaid Link created successfully"
            };
            EmitEvent("PlaidLinkEvent", successResult);
        }

        [ReactMethod("open")]
        public async Task OpenAsync(
            bool fullScreen,
            Action<JSValue> onSuccess,
            Action<JSValue, JSValue> onExit)
        {
            try
            {
                using (HttpClient client = new HttpClient())
                {
                    HttpResponseMessage response = await client.PostAsync($"{PlaidBackendUrl}/plaid/api/open_link", null);
                    response.EnsureSuccessStatusCode();
                    string data = await response.Content.ReadAsStringAsync();
                    var jsonData = JsonConvert.DeserializeObject<Dictionary<string, string>>(data);

                    if (jsonData != null && jsonData.ContainsKey("link_token"))
                    {
                        var successResult = new JSValueObject
                        {
                            ["status"] = "success",
                            ["message"] = "Link opened successfully",
                            ["link_token"] = jsonData["link_token"]
                        };
                        onSuccess(successResult);
                    }
                    else
                    {
                        var exitError = new JSValueObject
                        {
                            ["code"] = "TOKEN_NOT_FOUND",
                            ["message"] = "Link token not found"
                        };
                        var exitResult = new JSValueObject
                        {
                            ["status"] = "exit",
                            ["message"] = "Link session exited"
                        };
                        onExit(exitError, exitResult);
                    }
                }
            }
            catch (Exception ex)
            {
                var exitError = new JSValueObject
                {
                    ["code"] = "ERROR_OPENING_LINK",
                    ["message"] = ex.Message
                };
                var exitResult = new JSValueObject
                {
                    ["status"] = "exit",
                    ["message"] = "Link session exited with error"
                };
                onExit(exitError, exitResult);
            }
        }

        [ReactMethod("dismiss")]
        public void Dismiss()
        {
            var dismissResult = new JSValueObject
            {
                ["status"] = "dismissed",
                ["message"] = "Plaid Link dismissed"
            };
            EmitEvent("PlaidLinkEvent", dismissResult);
        }

        [ReactMethod("submit")]
        public void Submit(string phoneNumber)
        {
            var submitResult = new JSValueObject
            {
                ["status"] = "submitted",
                ["message"] = $"Phone number {phoneNumber} submitted"
            };
            EmitEvent("PlaidLinkEvent", submitResult);
        }

        [ReactMethod("addListener")]
        public void AddListener(string eventName) { }

        [ReactMethod("removeListeners")]
        public void RemoveListeners(int count) { }

        [ReactMethod]
        public void EmitEvent(string eventName, JSValueObject eventData)
        {
            // Use a unique module name or event channel if needed
            _reactContext.CallJSFunction("RCTDeviceEventEmitter", "emit", $"RNLinkSdkWindows.{eventName}", eventData);
        }

    }
}
