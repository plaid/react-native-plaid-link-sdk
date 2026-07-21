package com.plaid

import com.facebook.react.module.annotations.ReactModule
import com.facebook.react.uimanager.SimpleViewManager
import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.uimanager.ViewManagerDelegate
import com.facebook.react.uimanager.annotations.ReactProp
import com.facebook.react.viewmanagers.PLKEmbeddedViewManagerDelegate
import com.facebook.react.viewmanagers.PLKEmbeddedViewManagerInterface

@ReactModule(name = PLKEmbeddedViewManager.REACT_CLASS)
class PLKEmbeddedViewManager : SimpleViewManager<PLKEmbeddedView>(),
  PLKEmbeddedViewManagerInterface<PLKEmbeddedView> {
  private val delegate: ViewManagerDelegate<PLKEmbeddedView>

  init {
    delegate = PLKEmbeddedViewManagerDelegate(this)
  }

  override fun getName(): String {
    return REACT_CLASS
  }

  public override fun createViewInstance(context: ThemedReactContext): PLKEmbeddedView {
    return PLKEmbeddedView(context)
  }

  @ReactProp(name = "token")
  override fun setToken(view: PLKEmbeddedView, token: String?) {
    view.setToken(token ?: "")
  }

  override fun setIOSPresentationStyle(view: PLKEmbeddedView, value: String?) {
    // Unsupported on Android
  }

  override fun getExportedCustomBubblingEventTypeConstants(): Map<String, Any> {
    return mutableMapOf(
      EVENT_NAME to mutableMapOf(
        "phasedRegistrationNames" to mutableMapOf(
          "bubbled" to EVENT_NAME
        )
    ))
  }

  companion object {
    const val REACT_CLASS = "PLKEmbeddedView"
    const val EVENT_NAME = "onEmbeddedEvent"
  }
}
