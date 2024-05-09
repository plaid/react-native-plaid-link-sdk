package com.plaid;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.facebook.react.TurboReactPackage;
import com.facebook.react.ViewManagerOnDemandReactPackage;
import com.facebook.react.bridge.ModuleSpec;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.common.MapBuilder;
import com.facebook.react.module.annotations.ReactModule;
import com.facebook.react.module.annotations.ReactModuleList;
import com.facebook.react.module.model.ReactModuleInfo;
import com.facebook.react.module.model.ReactModuleInfoProvider;
import com.facebook.react.uimanager.ViewManager;

import javax.annotation.Nonnull;
import javax.annotation.Nullable;
import javax.inject.Provider;

@ReactModuleList(nativeModules = {PlaidModule.class})
public class PlaidPackage extends TurboReactPackage implements ViewManagerOnDemandReactPackage {

  private @Nullable Map<String, ModuleSpec> mViewManagers;

  private Map<String, ModuleSpec> getViewManagersMap(final ReactApplicationContext reactContext) {
    if (mViewManagers == null) {
      Map<String, ModuleSpec> specs = MapBuilder.newHashMap();
      specs.put(
              PLKEmbeddedViewManager.REACT_CLASS,
              ModuleSpec.viewManagerSpec(
                      new Provider<NativeModule>() {
                        @Override
                        public NativeModule get() {
                          return new PLKEmbeddedViewManager();
                        }
                      }));
      mViewManagers = specs;
    }
    return mViewManagers;
  }

  /** {@inheritDoc} */
  @Override
  public List<String> getViewManagerNames(ReactApplicationContext reactContext) {
    return new ArrayList<>(getViewManagersMap(reactContext).keySet());
  }

  @Override
  protected List<ModuleSpec> getViewManagers(ReactApplicationContext reactContext) {
    return new ArrayList<>(getViewManagersMap(reactContext).values());
  }

  /** {@inheritDoc} */
  @Override
  public @Nullable ViewManager createViewManager(
          ReactApplicationContext reactContext, String viewManagerName) {
    ModuleSpec spec = getViewManagersMap(reactContext).get(viewManagerName);
    return spec != null ? (ViewManager) spec.getProvider().get() : null;
  }

  @Override
  public NativeModule getModule(String name, @Nonnull ReactApplicationContext reactContext) {
    switch (name) {
      case PlaidModule.NAME:
        return new PlaidModule(reactContext);
      default:
        return null;
    }
  }

  @Override
  public ReactModuleInfoProvider getReactModuleInfoProvider() {
    try {
      Class<?> reactModuleInfoProviderClass =
              Class.forName("com.plaid.PlaidPackage$$ReactModuleInfoProvider");
      return (ReactModuleInfoProvider) reactModuleInfoProviderClass.newInstance();
    } catch (ClassNotFoundException e) {
      // ReactModuleSpecProcessor does not run at build-time. Create this ReactModuleInfoProvider by
      // hand.
      return new ReactModuleInfoProvider() {
        @Override
        public Map<String, ReactModuleInfo> getReactModuleInfos() {
          final Map<String, ReactModuleInfo> reactModuleInfoMap = new HashMap<>();

          Class<? extends NativeModule>[] moduleList =
                  new Class[]{
                          PlaidModule.class,
                  };

          for (Class<? extends NativeModule> moduleClass : moduleList) {
            ReactModule reactModule = moduleClass.getAnnotation(ReactModule.class);

            reactModuleInfoMap.put(
                    reactModule.name(),
                    new ReactModuleInfo(
                            reactModule.name(),
                            moduleClass.getName(),
                            reactModule.canOverrideExistingModule(),
                            reactModule.needsEagerInit(),
                            reactModule.hasConstants(),
                            reactModule.isCxxModule(),
                            BuildConfig.IS_NEW_ARCHITECTURE_ENABLED));
          }

          return reactModuleInfoMap;
        }
      };
    } catch (InstantiationException | IllegalAccessException e) {
      throw new RuntimeException(
              "No ReactModuleInfoProvider for com.plaid.PlaidPackage$$ReactModuleInfoProvider", e);
    }
  }
}
