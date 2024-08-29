using Microsoft.ReactNative;
using Windows.ApplicationModel.Activation;
using Windows.UI.Xaml;
using Windows.UI.Xaml.Controls;
using PlaidLinkModuleWindows;

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

            // Register any autolinked modules
            Microsoft.ReactNative.Managed.AutolinkedNativeModules.RegisterAutolinkedNativeModulePackages(PackageProviders);

            // Register package providers
            PackageProviders.Add(new ReactPackageProvider());
            PackageProviders.Add(new PlaidLinkModuleWindows.PlaidReactPackageProvider());

             // Making sure this is correct

            InitializeComponent();
        }

        protected override void OnLaunched(LaunchActivatedEventArgs e)
        {
            base.OnLaunched(e);
            var frame = (Frame)Window.Current.Content;
            frame.Navigate(typeof(MainPage), e.Arguments);
        }

        protected override void OnActivated(IActivatedEventArgs e)
        {
            var preActivationContent = Window.Current.Content;
            base.OnActivated(e);
            if (preActivationContent == null && Window.Current != null)
            {
                var frame = (Frame)Window.Current.Content;
                frame.Navigate(typeof(MainPage), null);
            }
        }
    }
}
