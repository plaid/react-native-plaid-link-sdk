package com.plaid

import android.app.Application
import android.content.Context
import android.content.Intent
import android.util.AttributeSet
import android.util.Log
import android.view.View
import android.widget.FrameLayout
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.NativeModule
import com.facebook.react.bridge.ReactContext
import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.uimanager.events.RCTEventEmitter
import com.plaid.gson.PlaidJsonConverter
import com.plaid.link.OpenPlaidLink
import com.plaid.link.Plaid.create
import com.plaid.link.Plaid.createLinkEmbeddedView
import com.plaid.link.Plaid.setLinkEventListener
import com.plaid.link.configuration.LinkTokenConfiguration
import com.plaid.link.configuration.LinkTokenConfiguration.Builder
import com.plaid.link.event.LinkEvent
import com.plaid.link.result.LinkExit
import com.plaid.link.result.LinkSuccess
import org.json.JSONException
import org.json.JSONObject

class PLKEmbeddedView @JvmOverloads constructor(
  context: Context,
  attrs: AttributeSet? = null
) : FrameLayout(context, attrs), ActivityResultHandler {
  private val themedReactContext: ThemedReactContext = context as ThemedReactContext
  private val TAG = "EmbeddedSearch"
  private val LINK_ACTIVITY_REQUEST_CODE = 3364
  private val EVENT_NAME = "OnEmbeddedEvent"
  private val jsonConverter = PlaidJsonConverter()

  init {
    inflate(context, R.layout.plk_embedded_view, this)
    setupOnEventListener()
  }

  fun setToken(token: String) {
    val embeddedView = createEmbedded(token)
    val frameLayout = findViewById<FrameLayout>(R.id.embedded_frame_layout)
    frameLayout.addView(embeddedView)
  }

  override fun onAttachedToWindow() {
    super.onAttachedToWindow()
    val nativeModule: NativeModule? = themedReactContext.getNativeModule(PlaidModule::class.java)
    if (nativeModule is PlaidModule) {
      // Add our handler so we can get the callback result.
      nativeModule.mActivityResultManager[LINK_ACTIVITY_REQUEST_CODE] = this
    }
  }

  override fun onDetachedFromWindow() {
    super.onDetachedFromWindow()
    val nativeModule: NativeModule? = themedReactContext.getNativeModule(PlaidModule::class.java)
    if (nativeModule is PlaidModule) {
      // Remove the handler so the module can handle it.
      nativeModule.mActivityResultManager.remove(LINK_ACTIVITY_REQUEST_CODE)
    }
  }

  private fun createEmbedded(token: String): View? {
    val linkTokenConfiguration: LinkTokenConfiguration = Builder().token(token).build()
    val activity = themedReactContext.currentActivity ?: return null
    return createLinkEmbeddedView(activity, linkTokenConfiguration, { config: LinkTokenConfiguration? ->
      val plaidHandler = create((themedReactContext.applicationContext as Application), config!!)
      val currentActivity = themedReactContext.currentActivity
      if (currentActivity != null) {
        plaidHandler.open(currentActivity)
      }
    }) { linkExit: LinkExit ->
      handleLinkExit(linkExit)
    }
  }

  private fun setupOnEventListener() {
    setLinkEventListener { event: LinkEvent ->
      try {
        val jsonString = jsonConverter.convert(event)
        val jsonObject = JSONObject(jsonString)
        val eventMap = convertJsonToMap(jsonObject)
        val eventName = PLKEmbeddedViewManager.EVENT_NAME
        eventMap.putString("embeddedEventName", "onEvent")
        val reactContext = context as ReactContext
        reactContext.getJSModule(RCTEventEmitter::class.java).receiveEvent(id, eventName, eventMap)
        return@setLinkEventListener
      } catch (e: JSONException) {
        Log.e(TAG, "JSON Exception: $e")
        return@setLinkEventListener
      }
    }
  }

  override fun handleActivityResult(requestCode: Int, resultCode: Int, data: Intent) {
    if (requestCode == LINK_ACTIVITY_REQUEST_CODE) {
      val openPlaidLink = OpenPlaidLink()
      when (val linkResult = openPlaidLink.parseResult(resultCode, data)) {
        is LinkSuccess -> {
          try {
            val jsonString = jsonConverter.convert(linkResult)
            val jsonObject = JSONObject(jsonString)
            val successMap = convertJsonToMap(jsonObject)
            val eventName = PLKEmbeddedViewManager.EVENT_NAME
            successMap.putString("embeddedEventName", "onSuccess")
            val reactContext = context as ReactContext
            reactContext.getJSModule(RCTEventEmitter::class.java).receiveEvent(id, eventName, successMap)
          } catch (e: JSONException) {
            Log.e(TAG, "JSON Exception parsing LinkSuccess")
            sendLinkExitFrom(e)
          }
        }
        is LinkExit -> {
          handleLinkExit(linkResult)
        }
        else -> {
          Log.e(TAG, "Unhandled LinkResult")
        }
      }
    }
  }

  private fun handleLinkExit(linkExit: LinkExit) {
    try {
      val jsonString = jsonConverter.convert(linkExit)
      val jsonObject = JSONObject(jsonString)
      val exitMap = convertJsonToMap(jsonObject)
      val eventName = PLKEmbeddedViewManager.EVENT_NAME
      exitMap.putString("embeddedEventName", "onExit")
      val reactContext = context as ReactContext
      reactContext.getJSModule(RCTEventEmitter::class.java).receiveEvent(id, eventName, exitMap)
    } catch (e: JSONException) {
      Log.e(TAG, "JSON Exception: $e")
      sendLinkExitFrom(e)
    }
  }

  private fun sendLinkExitFrom(e: JSONException) {
    val map = Arguments.createMap()
    val errorMap = Arguments.createMap()
    val exitMetadataMap = Arguments.createMap()
    errorMap.putString("error_message", e.message)
    errorMap.putString("json", e.message)
    errorMap.putString("error_type", "JSONException")
    errorMap.putInt("error_code", 499)
    exitMetadataMap.putString("error_message", e.message)
    exitMetadataMap.putString("json", e.message)
    exitMetadataMap.putString("error_type", "JSONException")
    exitMetadataMap.putInt("error_code", 499)
    map.putString("eventName", "EXIT")
    map.putMap("metadata", exitMetadataMap)
    map.putMap("error", errorMap)
    map.putString("embeddedEventName", "onExit")
    val reactContext = context as ReactContext
    reactContext.getJSModule(RCTEventEmitter::class.java).receiveEvent(id, PLKEmbeddedViewManager.EVENT_NAME, map)
  }
}
