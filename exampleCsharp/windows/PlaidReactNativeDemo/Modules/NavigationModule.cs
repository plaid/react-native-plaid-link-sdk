using Microsoft.ReactNative.Managed;
using System;
using Windows.UI.Xaml.Controls;

namespace PlaidReactNativeDemo.Modules
{
    [ReactModule("NavigationModule")]
    public sealed class NavigationModule
    {
        [ReactMethod("navigateToCustomWebViewPage")]
        public void NavigateToCustomWebViewPage()
        {
            // Get the current window's content frame
            var frame = (Frame)Windows.UI.Xaml.Window.Current.Content;
            frame.Navigate(typeof(CustomWebViewPage)); 
            // Navigate to CustomWebViewPage
        }
    }
}
