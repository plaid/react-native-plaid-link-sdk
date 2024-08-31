using Microsoft.ReactNative.Managed;
using System;
using Windows.UI.Xaml;
using Windows.UI.Xaml.Controls;
using Microsoft.ReactNative;
using Windows.ApplicationModel.Activation;
using PlaidReactNativeDemo;
namespace PlaidLinkModuleWindows
{
    [ReactModule("NavigationModule")]
    public sealed class NavigationModule
    {
        private static object mainContent; // Store main content to toggle back

        [ReactMethod("navigateToCustomWebViewPage")]
        public void NavigateToCustomWebViewPage()
        {
            // Check if Window.Current is available and content is a Frame
            if (Window.Current?.Content is Frame frame)
            {
                // Save the current content before navigating away
                mainContent = Window.Current.Content;

                // Navigate to the CustomWebViewPage
                if (!frame.Navigate(typeof(CustomWebViewPage)))
                {
                    Console.WriteLine("Error: Navigation to CustomWebViewPage failed.");
                }
            }
            else
            {
                Console.WriteLine("Error: The current window content is not a Frame or Window.Current is null.");
            }
        }

        [ReactMethod("navigateBackToApp")]
        public void NavigateBackToApp()
        {
            // Check if Window.Current is available and content is a Frame
            if (Window.Current?.Content is Frame frame && mainContent != null)
            {
                // Restore the original content (ReactRootView or other initial content)
                frame.Content = mainContent;

                // Reactivate the main application state if mainContent is a ReactRootView
                if (mainContent is ReactRootView reactRootView)
                {
                    var app = Application.Current as App;
                    if (app?.Host != null)
                    {
                        reactRootView.ReactNativeHost = app.Host;
                    }
                    else
                    {
                        Console.WriteLine("Error: Application or ReactNativeHost is null.");
                    }
                }
                else
                {
                    Console.WriteLine("Error: Restored content is not a ReactRootView.");
                }
            }
            else
            {
                Console.WriteLine("Error: Unable to navigate back to the main app, frame or mainContent is null.");
            }
        }
    }
}
