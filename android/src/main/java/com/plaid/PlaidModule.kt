package com.plaid

import android.app.Activity
import android.app.Application
import android.content.Intent
import android.os.Handler
import android.os.Looper
import android.text.TextUtils
import android.util.Log
import com.facebook.react.bridge.ActivityEventListener
import com.facebook.react.bridge.Callback
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.ReadableMap
import com.facebook.react.module.annotations.ReactModule
import com.facebook.react.modules.core.DeviceEventManagerModule
import com.plaid.gson.PlaidJsonConverter
import com.plaid.link.Plaid
import com.plaid.link.PlaidHandler
import com.plaid.link.OnLoadCallback
import com.plaid.link.configuration.LinkLogLevel
import com.plaid.link.configuration.LinkTokenConfiguration
import com.plaid.link.event.LinkEvent
import com.plaid.link.exception.LinkException
import com.plaid.link.result.LinkResultHandler
import com.plaid.link.SubmissionData
import org.json.JSONException
import org.json.JSONObject
import java.util.concurrent.CountDownLatch
import java.util.concurrent.TimeUnit

@ReactModule(name = PlaidModule.NAME)
class PlaidModule internal constructor(reactContext: ReactApplicationContext) :
  NativePlaidLinkModuleAndroidSpec(reactContext), ActivityEventListener {

  val mActivityResultManager by lazy { ActivityResultManager() }

  private val jsonConverter by lazy { PlaidJsonConverter() }

  // Written on the RN native-modules thread (open/create), read and cleared on the
  // main thread (onActivityResult); @Volatile for cross-thread visibility.
  @Volatile private var onSuccessCallback: Callback? = null
  @Volatile private var onExitCallback: Callback? = null

  private var plaidHandler: PlaidHandler? = null

  // Tracks whether this module has created a Link session in this process. Guards
  // releaseCurrentSession() so Plaid.destroy() isn't called when there is nothing to
  // release, which would tear down sessions this module doesn't own (e.g. embedded Link).
  private var didCreateSession = false

  companion object {
    private const val LINK_TOKEN_PREFIX = "link"

    const val NAME = "PlaidAndroid"
  }

  override fun getName(): String {
    return NAME
  }

  override fun initialize() {
    super.initialize()
    reactApplicationContext.addActivityEventListener(this)
  }

  override fun invalidate() {
    super.invalidate()
    reactApplicationContext.removeActivityEventListener(this)
  }

  private fun getLinkTokenConfiguration(
    token: String,
    noLoadingState: Boolean,
    logLevel: LinkLogLevel,
  ): LinkTokenConfiguration? {
    if (token == null) {
      return null
    }

    if (!token.startsWith(LINK_TOKEN_PREFIX)) {
      return null
    }

    val builder = LinkTokenConfiguration.Builder()
      .token(token)
      .logLevel(logLevel)
      .noLoadingState(noLoadingState)

    return builder.build()
  }

  @ReactMethod
  override fun submit(phoneNumber: String?, dateOfBirth: String?, params: ReadableMap?) {
    if (plaidHandler != null) {
      val paramsMap: Map<String, String>? = params?.let { map ->
        map.toHashMap().mapNotNull { (key, value) ->
          if (value is String) key to value else null
        }.toMap()
      }
      
      val submissionData = SubmissionData(
        phoneNumber = phoneNumber,
        dateOfBirth = dateOfBirth,
        params = paramsMap
      )
      plaidHandler?.submit(submissionData)
    }
  }

  @ReactMethod
  override fun createPlaidLink(
    token: String,
    noLoadingState: Boolean,
    logLevel: String,
    onLoad: Callback,
  ) {
    val tokenConfiguration = getLinkTokenConfiguration(token, noLoadingState, getLogLevel(logLevel))
    if (tokenConfiguration == null) {
      throw LinkException("Unable to open link, please check that your configuration is valid")
    }

    // Tear down any previous session before creating a new one. Without this, a stale session (e.g. the
    // user bypassed the OAuth redirect and relaunched Link) leaves old callbacks in place, and its result
    // can re-invoke a spent RN Callback, crashing with "This callback type only permits a single
    // invocation from native code."
    releaseCurrentSession()

    // Set the event listener here instead of in open for Layer use cases.
    try {
      Plaid.setLinkEventListener { linkEvent: LinkEvent ->
        var json = jsonConverter.convert(linkEvent)
        val eventMap = convertJsonToMap(JSONObject(json))
        reactApplicationContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
          .emit("onEvent", eventMap)
      }
    } catch (ex: JSONException) {
        Log.e("PlaidModule", ex.toString())
        throw ex
    }

    // Create Plaid handler.
    this.plaidHandler = Plaid.create(
      reactApplicationContext.getApplicationContext() as Application,
      tokenConfiguration,
      onLoad = OnLoadCallback {
        try {
          onLoad.invoke()
        } catch (e: Exception) {
          Log.e("PlaidModule", "onLoad callback failed", e)
        }
      }
    )
    this.didCreateSession = true
  }

  @ReactMethod
  override fun open(onSuccessCallback: Callback, onExitCallback: Callback) {
    val activity = reactApplicationContext.currentActivity ?: throw IllegalStateException("Current activity is null")

    plaidHandler?.let { handler ->
      // Work with nonNullValue here
      this.onSuccessCallback = onSuccessCallback
      this.onExitCallback = onExitCallback
      handler.open(activity)
    } ?: run {
      // Handler is nil.
      throw LinkException("Create must be called before open.")
    }
  }

  @ReactMethod
  override fun destroy(promise: Promise) {
    val latch = CountDownLatch(1)

    Handler(Looper.getMainLooper()).post {
      try {
        Plaid.destroy()
      } catch (e: Exception) {
        promise.reject("DESTROY_FAILED", "Failed to destroy Plaid", e)
        latch.countDown()
        return@post
      }
      latch.countDown()
    }

    try {
      // Wait for main-thread work to finish (max 5 seconds)
      if (!latch.await(5, TimeUnit.SECONDS)) {
        promise.reject("TIMEOUT", "Timed out waiting for destroy() to complete.")
      } else {
        promise.resolve(null)
      }
    } catch (e: InterruptedException) {
      promise.reject("INTERRUPTED", "Thread was interrupted", e)
    }
  }


  @ReactMethod
  @Suppress("unused")
  override fun startLinkActivityForResult(
    token: String,
    noLoadingState: Boolean,
    logLevel: String,
    onSuccessCallback: Callback,
    onExitCallback: Callback
  ) {
    val activity = reactApplicationContext.currentActivity ?: throw IllegalStateException("Current activity is null")

    // Tear down any previous session before starting a new one. See create() for rationale.
    releaseCurrentSession()

    this.onSuccessCallback = onSuccessCallback
    this.onExitCallback = onExitCallback

    try {
      Plaid.setLinkEventListener { linkEvent: LinkEvent ->
        var json = jsonConverter.convert(linkEvent)
        val eventMap = convertJsonToMap(JSONObject(json))
        reactApplicationContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
          .emit("onEvent", eventMap)
      }

      val tokenConfiguration = getLinkTokenConfiguration(token, noLoadingState, getLogLevel(logLevel))
      tokenConfiguration?.let {
        val handler = Plaid.create(
          reactApplicationContext.getApplicationContext() as Application,
          it
        )
        this.didCreateSession = true
        handler.open(activity)
        return
      }

      throw LinkException("Unable to open link, please check that your configuration is valid")
    } catch (ex: JSONException) {
      Log.e("PlaidModule", ex.toString())
      throw ex
    }
  }

  override fun addListener(eventName: String?) = Unit

  override fun removeListeners(count: Double) = Unit

  /**
   * Releases the current Link session: drops any pending success/exit callbacks, clears the cached
   * handler, and tears down the underlying Plaid SDK resources (preloaded WebView / token component)
   * via [Plaid.destroy]. Safe to call when no session exists (no-op). Used before creating a new
   * session so a stale session cannot deliver a result into spent callbacks.
   *
   * Plaid.destroy() is deliberately called synchronously on the calling (RN native-modules) thread
   * rather than posted to the main looper: the caller creates the replacement session immediately
   * afterwards on this thread, and an async destroy could run after Plaid.create() and null the new
   * session's token component.
   */
  private fun releaseCurrentSession() {
    onSuccessCallback = null
    onExitCallback = null
    plaidHandler = null
    if (!didCreateSession) {
      return
    }
    didCreateSession = false
    try {
      Plaid.destroy()
    } catch (ex: Exception) {
      Log.w("PlaidModule", "Failed to destroy previous Plaid session", ex)
    }
  }

  private fun maybeGetStringField(obj: JSONObject, fieldName: String): String? {
    if (obj.has(fieldName) && !TextUtils.isEmpty(obj.getString(fieldName))) {
      return obj.getString(fieldName)
    }
    return null
  }

  private fun maybeGetBooleanField(obj: JSONObject, fieldName: String): Boolean? {
    if (obj.has(fieldName)) {
      return obj.getBoolean(fieldName);
    }
    return null
  }

  private fun getLogLevel(string: String): LinkLogLevel {
    when (string) {
      "debug" -> return LinkLogLevel.DEBUG
      "info" -> return LinkLogLevel.INFO
      "warn" -> return LinkLogLevel.WARN
      "error" ->  return LinkLogLevel.ERROR
      else -> {
        return LinkLogLevel.ASSERT
      }
    }
  }

  override fun onActivityResult(
    activity: Activity,
    requestCode: Int,
    resultCode: Int,
    data: Intent?
  ) {

    // Dispath to embedded to handle the callback.
    if (mActivityResultManager[requestCode] != null) {
      mActivityResultManager.dispatch(requestCode, resultCode, data)
      return
    }

    val linkHandler = LinkResultHandler(
      onSuccess = { success ->
        val result = convertJsonToMap(JSONObject(jsonConverter.convert(success)))
        // Capture and null both callbacks before invoking so a duplicate result delivery cannot
        // re-invoke a single-use RN Callback.
        val callback = this.onSuccessCallback
        this.onSuccessCallback = null
        this.onExitCallback = null
        callback?.invoke(result)
      },
      onExit = { exit ->
        val result = convertJsonToMap(JSONObject(jsonConverter.convert(exit)))
        val callback = this.onExitCallback
        this.onSuccessCallback = null
        this.onExitCallback = null
        callback?.invoke(result)
      }
    )

    if (linkHandler.onActivityResult(requestCode, resultCode, data)) {
      return
    } else {
      Log.i("PlaidModule", "Result code not handled.")
    }
    return
  }

  override fun onNewIntent(intent: Intent) {
    // Do Nothing
  }
}
