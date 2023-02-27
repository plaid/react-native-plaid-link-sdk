package com.plaid;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.facebook.react.TurboReactPackage;
import com.facebook.react.ViewManagerOnDemandReactPackage;
import com.facebook.react.bridge.ModuleSpec;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.module.annotations.ReactModule;
import com.facebook.react.module.annotations.ReactModuleList;
import com.facebook.react.module.model.ReactModuleInfo;
import com.facebook.react.module.model.ReactModuleInfoProvider;
import com.facebook.react.turbomodule.core.interfaces.TurboModule;
import com.facebook.react.uimanager.ViewManager;

import javax.annotation.Nonnull;
import javax.annotation.Nullable;

@ReactModuleList(nativeModules = {PlaidModule.class})
public class PlaidPackage extends TurboReactPackage implements ViewManagerOnDemandReactPackage {

  /**
   * {@inheritDoc}
   */
  @Override
  public List<String> getViewManagerNames(ReactApplicationContext reactContext) {
    return null;
  }

  @Override
  protected List<ModuleSpec> getViewManagers(ReactApplicationContext reactContext) {
    return null;
  }

  /**
   * {@inheritDoc}
   */
  @Override
  public @Nullable
  ViewManager createViewManager(
          ReactApplicationContext reactContext, String viewManagerName) {
    return null;
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
                            TurboModule.class.isAssignableFrom(moduleClass)));
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
