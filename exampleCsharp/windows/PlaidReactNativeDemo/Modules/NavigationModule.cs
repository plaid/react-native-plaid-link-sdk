using Microsoft.ReactNative.Managed;
using System;
using Windows.UI.Xaml;
using Windows.UI.Xaml.Controls;

namespace PlaidLinkModuleWindows
{
    [ReactModule("NavigationModule")]
    public sealed class NavigationModule
    {
        private static object mainContent; // Store main content to toggle back

        [ReactMethod("navigateToCustomWebViewPage")]
        public void NavigateToCustomWebViewPage()
        {
            // Get the current window's content frame
            if (Window.Current.Content is Frame frame)
            {
                // Save the current content before navigating away
                mainContent = Window.Current.Content;

                // Navigate to the CustomWebViewPage
                frame.Navigate(typeof(CustomWebViewPage));
            }
            else
            {
                Console.WriteLine("Error: The current window content is not a Frame.");
            }
        }

        [ReactMethod("navigateBackToApp")]
        public void NavigateBackToApp()
        {
            // Get the current window's content frame
            if (Window.Current.Content is Frame frame && mainContent != null)
            {
                // Restore the original content (ReactRootView)
                frame.Content = mainContent;

                // Reactivate the main application state
                if (mainContent is ReactRootView reactRootView)
                {
                    var app = Application.Current as App;
                    reactRootView.ReactNativeHost = app.Host;
                }
            }
            else
            {
                Console.WriteLine("Error: Unable to navigate back to the main app.");
            }
        }
    }
}
