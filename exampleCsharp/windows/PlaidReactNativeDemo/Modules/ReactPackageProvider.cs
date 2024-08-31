using Microsoft.ReactNative;
using Microsoft.ReactNative.Managed;

namespace PlaidLinkModuleWindows.Modules
{
    public class ReactPackageProvider : IReactPackageProvider
    {
        public void CreatePackage(IReactPackageBuilder packageBuilder)
        {
            // Register the native module with React Native
            packageBuilder.AddAttributedModules();
        }
    }
}
