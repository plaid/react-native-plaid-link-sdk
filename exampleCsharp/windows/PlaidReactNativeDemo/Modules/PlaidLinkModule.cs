using System;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using Microsoft.ReactNative.Managed;
using Newtonsoft.Json;
using Windows.UI.Xaml;
using Windows.UI.Xaml.Controls;
using Windows.UI.Core;
using Microsoft.ReactNative;
using PlaidReactNativeDemo;

namespace PlaidLinkModuleWindows
{
    [ReactModule("PlaidClassModule")]
    public sealed class PlaidClassModule
    {
        public WebView PlaidWebView => PlaidWebView;
        public ReactRootView ReactRootView => reactRootView;

        private ReactRootView reactRootView;
        private CoreDispatcher dispatcher = Windows.UI.Xaml.Window.Current.Dispatcher;

        // Constants exposed to JavaScript
        [ReactConstant("PLAID_LINK_TOKEN")]
        public string _linkToken = "link-";

        [ReactConstant("PLAID_PUBLIC_TOKEN")]
        public string _publicToken = "public-";

        [ReactConstant("PLAID_ACCESS_TOKEN")]
        public string _accessToken = "access-";

        [ReactConstant("PLAID_BACKEND_URL")]
        public string backendApiUrl = "https://greenfieldxplatform-00f7d0070a43.herokuapp.com";

        // Methods exposed to JavaScript
        [ReactSyncMethod("GET_PublicToken")]
        public string GetPublicToken()
        {
            return _publicToken;
        }

        [ReactSyncMethod("SET_PublicToken")]
        public void SetPublicToken(string token)
        {
            _publicToken = token;
        }

        [ReactMethod("getLinkToken")]
        public async Task<string> GetLinkTokenAsync()
        {
            try
            {
                using (HttpClient client = new HttpClient())
                {
                    HttpResponseMessage response = await client.PostAsync($"{backendApiUrl}/plaid/api/create_link_token", null);
                    response.EnsureSuccessStatusCode();
                    string data = await response.Content.ReadAsStringAsync();
                    dynamic jsonData = JsonConvert.DeserializeObject(data);
                    string linkToken = jsonData.link_token;
                    _linkToken = linkToken;

                    var returnObject = new { linkToken = _linkToken, metadata = jsonData };
                    return JsonConvert.SerializeObject(returnObject, Formatting.None);
                }
            }
            catch (Exception ex)
            {
                return ex.Message;
            }
        }

        [ReactMethod("exchangePublicToken")]
        public async Task<string> ExchangePublicTokenAsync(string publicToken)
        {
            try
            {
                using (HttpClient client = new HttpClient())
                {
                    var requestBody = new { public_token = _publicToken };
                    var json = JsonConvert.SerializeObject(requestBody);
                    var content = new StringContent(json, Encoding.UTF8, "application/json");

                    HttpResponseMessage response = await client.PostAsync($"{backendApiUrl}/plaid/api/exchange_public_token", content);
                    response.EnsureSuccessStatusCode();

                    string responseData = await response.Content.ReadAsStringAsync();
                    dynamic jsonData = JsonConvert.DeserializeObject(responseData);
                    string accessToken = jsonData.access_token;

                    _accessToken = accessToken;
                    return _accessToken;
                }
            }
            catch (Exception ex)
            {
                return ex.Message;
            }
        }

        ///
        // Method to get a public token by making a request to Plaid
        [ReactMethod("getPublicToken")]
        public async Task<string> GetPublicTokenAsync(string token)
        {
            try
            {
                using (HttpClient client = new HttpClient())
                {
                    var requestBody = new { public_token = publicToken };
                    var json = JsonConvert.SerializeObject(requestBody);
                    var content = new StringContent(json, Encoding.UTF8, "application/json");

                    HttpResponseMessage response = await client.PostAsync($"{backendApiUrl}/plaid/api/create_public_token", content);
                    response.EnsureSuccessStatusCode();

                    string responseData = await response.Content.ReadAsStringAsync();
                    dynamic jsonData = JsonConvert.DeserializeObject(responseData);
                    string publicToken = jsonData.access_token;

                    _publicToken = publicToken;
                    return _publicToken;
                }
            }
            catch (Exception ex)
            {
                return ex.Message;
            }
        }
    }
}