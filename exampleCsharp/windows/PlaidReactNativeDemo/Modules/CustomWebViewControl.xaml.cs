using Windows.UI.Xaml.Controls;
using System;
using System.Diagnostics;

namespace PlaidLinkModuleWindows.Modules
{
    public sealed partial class CustomWebViewControl : UserControl
    {
        public CustomWebViewControl()
        {
            InitializeComponent(); // This line initializes the XAML components
            webView.NavigationFailed += WebView_NavigationFailed; // Event handler for WebView navigation errors
        }

        // Method to navigate using a token or URL
        public void Navigate(string token)
        {
            string url = $"https://cdn.plaid.com/link/v2/stable/link.html?token={token}";
            webView.Navigate(new Uri(url));
            Debug.WriteLine($"Navigating to URL: {url}");
        }

        // Handle navigation failures
        private void WebView_NavigationFailed(object sender, WebViewNavigationFailedEventArgs e)
        {
            Debug.WriteLine($"Navigation to {e.Uri} failed with error {e.WebErrorStatus}");
        }
    }
}
