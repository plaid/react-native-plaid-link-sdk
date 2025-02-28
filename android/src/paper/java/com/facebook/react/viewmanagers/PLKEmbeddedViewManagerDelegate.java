/**
* This code was generated by [react-native-codegen](https://www.npmjs.com/package/react-native-codegen).
*
* Do not edit this file as changes may cause incorrect behavior and will be lost
* once the code is regenerated.
*
* @generated by codegen project: GeneratePropsJavaDelegate.js
*/

package com.facebook.react.viewmanagers;

import android.view.View;
import androidx.annotation.Nullable;
import com.facebook.react.uimanager.BaseViewManagerDelegate;
import com.facebook.react.uimanager.BaseViewManager;
import com.facebook.react.uimanager.LayoutShadowNode;

public class PLKEmbeddedViewManagerDelegate<T extends View, U extends BaseViewManager<T, ? extends LayoutShadowNode> & PLKEmbeddedViewManagerInterface<T>> extends BaseViewManagerDelegate<T, U> {
  public PLKEmbeddedViewManagerDelegate(U viewManager) {
    super(viewManager);
  }
  @Override
  public void setProperty(T view, String propName, @Nullable Object value) {
    switch (propName) {
      case "token":
        mViewManager.setToken(view, value == null ? null : (String) value);
        break;
      case "iOSPresentationStyle":
        mViewManager.setIOSPresentationStyle(view, value == null ? null : (String) value);
        break;
      default:
        super.setProperty(view, propName, value);
    }
  }
}
