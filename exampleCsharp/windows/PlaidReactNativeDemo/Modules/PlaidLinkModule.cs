using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.ReactNative;
using Microsoft.ReactNative.Managed;
using System.Net.Http;
using Newtonsoft.Json;
using Windows.Management;

// This is an example of usages for development
namespace PlaidLinkModuleWindows
{

    [ReactModule("PlaidClassModule")]
    public sealed class PlaidClassModule
    {

        [ReactConstant("PlaidContext")]
        public object PlaidContext { get; set; }
        [ReactConstant("PLAID_PUBLIC_TOKEN")]
        public string _publicToken = "public-";
        [ReactConstant("PLAID_ACCESS_TOKEN")]
        public string _accessToken = "access-";
        [ReactConstant("PLAID_BACKEND_URL")]
        public string backendApiUrl = "https://greenfieldxplatform-00f7d0070a43.herokuapp.com";

        [ReactSyncMethod("GET_PublicToken")]
        public string getPubToken()
        {
            return _publicToken;
        }
        [ReactSyncMethod("SET_PublicToken")]
        public string setPubToken(string token)
        {
            _publicToken += token;
            return _publicToken;
        }


        [ReactMethod("getLinkToken")]
        public async Task<string> GetLinkToken()
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
                    _publicToken = linkToken;
                    // Load Plaid Link
                    return linkToken;
                }
            }
            catch (Exception ex)
            {
                // Handle exceptions here
                return ex.Message;
            }
        }

        [ReactMethod("exchangePublicToken")]
        public async Task<string> ExchangePublicToken(string publicToken)
        {
            try
            {
                using (HttpClient client = new HttpClient())
                {
                    var requestBody = new { public_token = publicToken };
                    var json = JsonConvert.SerializeObject(requestBody);
                    var content = new StringContent(json, System.Text.Encoding.UTF8, "application/json");
                    HttpResponseMessage response = await client.PostAsync($"{backendApiUrl}/plaid/api/exchange_public_token", content);
                    response.EnsureSuccessStatusCode();
                    string responseData = await response.Content.ReadAsStringAsync();
                    dynamic jsonData = JsonConvert.DeserializeObject(responseData);
                    string accessToken = jsonData.access_token;
                    _accessToken = accessToken;

                    return _accessToken;
                    // Handle the response
                }
            }
            catch (Exception ex)
            {
                return ex.Message;
            }
        }
        //Not allowed in development mode
        [ReactMethod("getAuth")]
        public async Task<string> GetAuth()
        {
            try
            {
                using (HttpClient client = new HttpClient())
                {
                    // Send GET request to the specified URL
                    HttpResponseMessage response = await client.GetAsync($"{backendApiUrl}/plaid/api/auth");

                    // Ensure the response is successful
                    response.EnsureSuccessStatusCode();

                    // Read the response content as a string
                    string data = await response.Content.ReadAsStringAsync();


                    // Deserialize the JSON response
                    dynamic jsonData = JsonConvert.DeserializeObject(data);

                    Newtonsoft.Json.Linq.JObject jsonObject = jsonData;
                    string jsonString = jsonObject.ToString();

                    // Return the extracted data
                    return jsonString;
                }
            }
            catch (HttpRequestException ex)
            {
                // Handle HTTP request exceptions
                return $"HTTP Request Error: {ex.Message}";
            }
            catch (JsonException ex)
            {
                // Handle JSON parsing exceptions
                return $"JSON Parsing Error: {ex.Message}";
            }
            catch (Exception ex)
            {
                // Handle other exceptions
                return $"Error: {ex.Message}";
            }
        }
        [ReactMethod("getInfo")]
        public async Task<string> GetInfo()
        {
            try
            {
                using (HttpClient client = new HttpClient())
                {
                    // Send GET request to the specified URL
                    HttpResponseMessage response = await client.GetAsync($"{backendApiUrl}/plaid/api/info");

                    // Ensure the response is successful
                    response.EnsureSuccessStatusCode();

                    // Read the response content as a string
                    string data = await response.Content.ReadAsStringAsync();

                    // Deserialize the JSON response
                    dynamic jsonData = JsonConvert.DeserializeObject(data);

                    Newtonsoft.Json.Linq.JObject jsonObject = jsonData;
                    string jsonString = jsonObject.ToString();

                    // Return the extracted data
                    return jsonString;
                }
            }
            catch (HttpRequestException ex)
            {
                // Handle HTTP request exceptions
                return $"HTTP Request Error: {ex.Message}";
            }
            catch (JsonException ex)
            {
                // Handle JSON parsing exceptions
                return $"JSON Parsing Error: {ex.Message}";
            }
            catch (Exception ex)
            {
                // Handle other exceptions
                return $"Error: {ex.Message}";
            }
        }
        [ReactMethod("getItem")]
        public async Task<string> GetItem()
        {
            try
            {
                using (HttpClient client = new HttpClient())
                {
                    // Send GET request to the specified URL
                    HttpResponseMessage response = await client.GetAsync($"{backendApiUrl}/plaid/api/item");

                    // Ensure the response is successful
                    response.EnsureSuccessStatusCode();

                    // Read the response content as a string
                    string data = await response.Content.ReadAsStringAsync();

                    // Deserialize the JSON response
                    dynamic jsonData = JsonConvert.DeserializeObject(data);

                    Newtonsoft.Json.Linq.JObject jsonObject = jsonData;
                    string jsonString = jsonObject.ToString();

                    // Return the extracted data
                    return jsonString;
                }
            }
            catch (HttpRequestException ex)
            {
                // Handle HTTP request exceptions
                return $"HTTP Request Error: {ex.Message}";
            }
            catch (JsonException ex)
            {
                // Handle JSON parsing exceptions
                return $"JSON Parsing Error: {ex.Message}";
            }
            catch (Exception ex)
            {
                // Handle other exceptions
                return $"Error: {ex.Message}";
            }
        }
        [ReactMethod("getAccounts")]
        public async Task<string> GetAccounts()
        {
            try
            {
                using (HttpClient client = new HttpClient())
                {
                    // Send GET request to the specified URL
                    HttpResponseMessage response = await client.GetAsync($"{backendApiUrl}/plaid/api/accounts");

                    // Ensure the response is successful
                    response.EnsureSuccessStatusCode();

                    // Read the response content as a string
                    string data = await response.Content.ReadAsStringAsync();

                    // Deserialize the JSON response
                    dynamic jsonData = JsonConvert.DeserializeObject(data);

                    Newtonsoft.Json.Linq.JObject jsonObject = jsonData;
                    string jsonString = jsonObject.ToString();

                    // Return the extracted data
                    return jsonString;
                }
            }
            catch (HttpRequestException ex)
            {
                // Handle HTTP request exceptions
                return $"HTTP Request Error: {ex.Message}";
            }
            catch (JsonException ex)
            {
                // Handle JSON parsing exceptions
                return $"JSON Parsing Error: {ex.Message}";
            }
            catch (Exception ex)
            {
                // Handle other exceptions
                return $"Error: {ex.Message}";
            }
        }

[ReactMethod("getTransactions")]
        public async Task<string> GetTransactions()
        {
            try
            {
                using (HttpClient client = new HttpClient())
                {
                    // Send GET request to the specified URL
                    HttpResponseMessage response = await client.GetAsync($"{backendApiUrl}/plaid/api/transactions");

                    // Ensure the response is successful
                    response.EnsureSuccessStatusCode();

                    // Read the response content as a string
                    string data = await response.Content.ReadAsStringAsync();

                    // Deserialize the JSON response
                    dynamic jsonData = JsonConvert.DeserializeObject(data);

                    Newtonsoft.Json.Linq.JObject jsonObject = jsonData;
                    string jsonString = jsonObject.ToString();

                    // Return the extracted data
                    return jsonString;
                }
            }
            catch (HttpRequestException ex)
            {
                // Handle HTTP request exceptions
                return $"HTTP Request Error: {ex.Message}";
            }
            catch (JsonException ex)
            {
                // Handle JSON parsing exceptions
                return $"JSON Parsing Error: {ex.Message}";
            }
            catch (Exception ex)
            {
                // Handle other exceptions
                return $"Error: {ex.Message}";
            }
        }

    }
}
