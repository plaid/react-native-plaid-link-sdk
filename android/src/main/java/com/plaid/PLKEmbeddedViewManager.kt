package com.plaid

import com.facebook.react.uimanager.SimpleViewManager
import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.uimanager.annotations.ReactProp

class PLKEmbeddedViewManager : SimpleViewManager<PLKEmbeddedView>() {
  override fun getName(): String {
    return REACT_CLASS
  }

  public override fun createViewInstance(context: ThemedReactContext): PLKEmbeddedView {
    return PLKEmbeddedView(context)
  }

  @ReactProp(name = "token")
  fun setToken(view: PLKEmbeddedView, token: String?) {
    view.setToken(token ?: "")
  }

  override fun getExportedCustomBubblingEventTypeConstants(): Map<String, Any> {
    return mapOf(
      EVENT_NAME to mapOf(
        "phasedRegistrationNames" to mapOf(
          "bubbled" to EVENT_NAME
        )
    ))
  }

  companion object {
    const val REACT_CLASS = "PLKEmbeddedView"
    const val EVENT_NAME = "onEmbeddedEvent"
  }
}
