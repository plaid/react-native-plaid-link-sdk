package com.plaid;

import java.util.HashMap;
import java.util.Map;

import com.facebook.react.TurboReactPackage;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.module.model.ReactModuleInfo;
import com.facebook.react.module.model.ReactModuleInfoProvider;

@SuppressWarnings("unused")
public class PlaidPackage extends TurboReactPackage {

  @Override
  public NativeModule getModule(
      String name, ReactApplicationContext reactContext) {
    return new PlaidModule(reactContext);
  }

  @Override
  public ReactModuleInfoProvider getReactModuleInfoProvider() {
    return () -> {
      Map<String, ReactModuleInfo> map = new HashMap<>();
      map.put(
          "PlaidAndroid",
          new ReactModuleInfo(
              "PlaidAndroid",
              "com.reactlibrary.PlaidModule",
              false,
              false,
              true,
              false,
              false));
      return map;
    };
  }
}
