using Windows.UI.Xaml.Controls;
using System;
using System.Diagnostics;

namespace PlaidReactNativeDemo.Modules
{
    public sealed partial class CustomWebViewPage : Page
    {
        public CustomWebViewPage()
        {
            InitializeComponent();
            webView.NavigationFailed += WebView_NavigationFailed; // Attach the navigation failed event
        }

        // Method to navigate using a token or URL
        public void Navigate(string token)
        {
            string url = $"https://cdn.plaid.com/link/v2/stable/link.html?token={token}";
            webView.Navigate(new Uri(url)); // Uses the WebView defined in XAML
            Debug.WriteLine($"Navigating to URL: {url}");
        }

        // Handle navigation failures
        private void WebView_NavigationFailed(object sender, WebViewNavigationFailedEventArgs e)
        {
            Debug.WriteLine($"Navigation to {e.Uri} failed with error {e.WebErrorStatus}");
        }
    }
}
