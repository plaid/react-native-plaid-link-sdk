using Microsoft.ReactNative;
using Windows.ApplicationModel.Activation;
using Windows.UI.Xaml;
using Windows.UI.Xaml.Controls;

namespace PlaidReactNativeDemo
{
    sealed partial class App : ReactApplication
    {
        public App()
        {

#if BUNDLE
            JavaScriptBundleFile = "index.windows";
            InstanceSettings.UseWebDebugger = false;
            InstanceSettings.UseFastRefresh = false;
#else
            JavaScriptBundleFile = "index";
            InstanceSettings.UseWebDebugger = true;
            InstanceSettings.UseFastRefresh = true;
#endif

#if DEBUG
            InstanceSettings.UseDeveloperSupport = true;
#else
            InstanceSettings.UseDeveloperSupport = false;
#endif

            // Register any autolinked modules - ensures any automatically detected modules are registered
            Microsoft.ReactNative.Managed.AutolinkedNativeModules.RegisterAutolinkedNativeModulePackages(PackageProviders);

            // Register custom package providers
            PackageProviders.Add(new ReactPackageProvider());
            PackageProviders.Add(new PlaidLinkModuleWindows.PlaidReactPackageProvider());

            // Uncomment and ensure the correct namespace if additional package providers are needed
            PackageProviders.Add(new PlaidLinkModuleWindows.Modules.ReactPackageProvider());

            InitializeComponent(); // Ensure this initializes your App.xaml components correctly

        }

        protected override void OnLaunched(LaunchActivatedEventArgs e)
        {
            base.OnLaunched(e);

            Frame rootFrame = Window.Current.Content as Frame;

            if (rootFrame == null)
            {
                // Create a new frame if one does not already exist
                rootFrame = new Frame();
                Window.Current.Content = rootFrame;
            }

            // Only navigate if the app is not already prelaunched
            if (e.PrelaunchActivated == false && rootFrame.Content == null)
            {
                rootFrame.Navigate(typeof(MainPage), e.Arguments); // Ensure MainPage is defined correctly
                Window.Current.Activate();
            }
        }

        protected override void OnActivated(IActivatedEventArgs e)
        {
            var preActivationContent = Window.Current.Content;
            base.OnActivated(e);

            // Handle cases where the app is activated without a pre-existing content frame
            if (preActivationContent == null && Window.Current != null)
            {
                var frame = (Frame)Window.Current.Content;
                if (frame == null)
                {
                    frame = new Frame();
                    Window.Current.Content = frame;
                }
                frame.Navigate(typeof(MainPage), null); // Navigate to MainPage on activation
            }
        }
    }
}
