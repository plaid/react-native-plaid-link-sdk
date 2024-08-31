using Microsoft.ReactNative.Managed;
using System.Collections.Generic;
using System.Diagnostics;
using Windows.UI.Xaml.Controls;

namespace PlaidLinkModuleWindows
{
    internal class CustomControlWebViewManager : AttributedViewManager<CustomWebViewControl>
    {
        [ViewManagerProperty("label")]
        public void SetLabel(CustomWebViewControl view, string value)
        {
            if (value != null)
            {
                view.Label = value;
            }
            else
            {
                view.ClearValue(CustomWebViewControl.LabelProperty);
            }
        }

        [ViewManagerProperty("color")]
        public void SetColor(CustomWebViewControl view, Windows.UI.Xaml.Media.Brush value)
        {
            if (value != null)
            {
                view.Foreground = value;
            }
            else
            {
                view.ClearValue(Control.ForegroundProperty);
            }
        }

        [ViewManagerProperty("backgroundColor")]
        public void SetBackgroundColor(CustomWebViewControl view, Windows.UI.Xaml.Media.Brush value)
        {
            if (value != null)
            {
                view.Background = value;
            }
            else
            {
                view.ClearValue(Control.BackgroundProperty);
            }
        }

        [ViewManagerCommand]
        public void CustomCommand(CustomWebViewControl view, IReadOnlyList<object> commandArgs)
        {
            if (commandArgs == null || commandArgs.Count == 0)
            {
                Debug.WriteLine("No command arguments provided.");
                return;
            }

            string commandType = commandArgs[0]?.ToString()?.ToLower();

            switch (commandType)
            {
                case "navigate":
                    if (commandArgs.Count > 1 && commandArgs[1] is string url)
                    {
                        view.Navigate(url); // Call the Navigate method
                    }
                    else
                    {
                       // Debug.WriteLine("Navigate command requires a URL argument.");
                    }
                    break;

                case "executejs":
                    if (commandArgs.Count > 1 && commandArgs[1] is string jsScript)
                    {
                        view.ExecuteJavaScript(jsScript);
                    }
                    else
                    {
                       /// Debug.WriteLine("ExecuteJS command requires a JavaScript string argument.");
                    }
                    break;

                case "reload":
                    view.Reload();
                    break;

                case "clearcache":
                    view.ClearCache();
                    break;

                default:
                    Debug.WriteLine($"Unknown command type: {commandType}");
                    break;
            }
        }
    }
}
