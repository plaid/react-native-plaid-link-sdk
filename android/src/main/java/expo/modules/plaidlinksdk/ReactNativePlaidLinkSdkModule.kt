package expo.modules.plaidlinksdk

import android.app.Activity
import android.content.Intent
import com.plaid.link.OnLoadCallback
import com.plaid.link.Plaid
import com.plaid.link.PlaidHeadlessSession
import com.plaid.link.PlaidLayerSession
import com.plaid.link.PlaidLinkSession
import com.plaid.link.PlaidSession
import com.plaid.link.SubmissionData
import com.plaid.link.configuration.LayerTokenConfiguration
import com.plaid.link.configuration.LinkTokenConfiguration
import com.plaid.link.result.LinkExit
import com.plaid.link.result.LinkSuccess
import expo.modules.kotlin.Promise
import expo.modules.kotlin.exception.CodedException
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition

class ReactNativePlaidLinkSdkModule : Module() {
  private var linkSession: PlaidLinkSession? = null
  private var layerSession: PlaidLayerSession? = null
  private var headlessSession: PlaidHeadlessSession? = null
  private var activeSession: PlaidSession? = null
  private var sessionCreationError: Throwable? = null

  override fun definition() = ModuleDefinition {
    Name("ReactNativePlaidLinkSdk")

    Constant("sdkVersion") { Plaid.VERSION_NAME }

    Events("PlaidLink.onSuccess", "PlaidLink.onExit", "PlaidLink.onEvent")

    View(ReactNativePlaidLinkSdkView::class) {
      Events("onSuccess", "onExit", "onEvent", "onLoad")
      Prop("token") { view: ReactNativePlaidLinkSdkView, token: String -> view.setToken(token) }
    }

    OnActivityResult { _, payload ->
      if (payload.requestCode == Plaid.LINK_REQUEST_CODE) {
        handleActivityResult(payload.resultCode, payload.data)
      }
    }

    AsyncFunction("createPlaidLinkSession") { token: String, promise: Promise ->
      try {
        val activity = requireActivity()
        Plaid.setLinkEventListener { event -> sendEvent("PlaidLink.onEvent", event.toWritableMap()) }
        val config = LinkTokenConfiguration.Builder()
          .token(token)
          .onLoad(OnLoadCallback { promise.resolve(null) })
          .build()
        linkSession = Plaid.createPlaidLinkSession(activity, config)
        activeSession = linkSession
        sessionCreationError = null
      } catch (error: Throwable) {
        sessionCreationError = error
        promise.reject("LINK_SESSION_CREATE_ERROR", error.message ?: "Failed to create Link session", error)
      }
    }

    AsyncFunction("createPlaidLayerSession") { token: String, promise: Promise ->
      try {
        val activity = requireActivity()
        Plaid.setLinkEventListener { event -> sendEvent("PlaidLink.onEvent", event.toWritableMap()) }
        val config = LayerTokenConfiguration.Builder().token(token).build()
        layerSession = Plaid.createPlaidLayerSession(activity, config)
        activeSession = layerSession
        sessionCreationError = null
        promise.resolve(null)
      } catch (error: Throwable) {
        sessionCreationError = error
        promise.reject("LAYER_SESSION_CREATE_ERROR", error.message ?: "Failed to create Layer session", error)
      }
    }

    AsyncFunction("createPlaidHeadlessSession") { token: String, promise: Promise ->
      try {
        val activity = requireActivity()
        Plaid.setLinkEventListener { event -> sendEvent("PlaidLink.onEvent", event.toWritableMap()) }
        val config = LinkTokenConfiguration.Builder()
          .token(token)
          .onLoad(OnLoadCallback { promise.resolve(null) })
          .build()
        headlessSession = Plaid.createPlaidHeadlessSession(activity, config)
        activeSession = headlessSession
        sessionCreationError = null
      } catch (error: Throwable) {
        sessionCreationError = error
        promise.reject("HEADLESS_SESSION_CREATE_ERROR", error.message ?: "Failed to create Headless session", error)
      }
    }

    AsyncFunction("openLinkSession") { _: Boolean, promise: Promise ->
      openSession(linkSession, "createPlaidLinkSession was not called.", promise)
    }

    AsyncFunction("openLayerSession") { promise: Promise ->
      openSession(layerSession, "createPlaidLayerSession was not called.", promise)
    }

    AsyncFunction("startHeadlessSession") { promise: Promise ->
      openSession(headlessSession, "createPlaidHeadlessSession was not called.", promise)
    }

    AsyncFunction("submitLayerData") { phoneNumber: String?, dateOfBirth: String?, params: Map<String, String>?, promise: Promise ->
      val session = layerSession
      if (session == null) {
        promise.reject("PLAID_NO_LAYER_SESSION", "Layer session not found. Call createPlaidLayerSession first.", null)
        return@AsyncFunction
      }
      session.submit(SubmissionData(phoneNumber = phoneNumber, dateOfBirth = dateOfBirth, params = params))
      promise.resolve(null)
    }

    AsyncFunction("syncFinanceKit") { _: String, _: Boolean, _: Int, promise: Promise ->
      promise.reject("UNSUPPORTED_ANDROID", "FinanceKit is only available on iOS", null)
    }
  }

  private fun openSession(session: PlaidSession?, missingSessionMessage: String, promise: Promise) {
    if (session == null) {
      sendCreationExit(missingSessionMessage)
      promise.resolve(null)
      return
    }

    try {
      val activity = requireActivity()
      activeSession = session
      activity.prepareForPlaidKeyboard()
      session.open(activity)
      promise.resolve(null)
    } catch (error: Throwable) {
      promise.reject("PLAID_OPEN_ERROR", error.message ?: "Failed to open Plaid session", error)
    }
  }

  private fun handleActivityResult(resultCode: Int, data: Intent?) {
    when (val result = Plaid.parseResult(Plaid.LINK_REQUEST_CODE, resultCode, data)) {
      is LinkSuccess -> {
        PlaidEmbeddedResultDispatcher.dispatch(result)
        sendEvent("PlaidLink.onSuccess", result.toWritableMap())
        clearActiveSession()
      }
      is LinkExit -> {
        PlaidEmbeddedResultDispatcher.dispatch(result)
        sendEvent("PlaidLink.onExit", result.toWritableMap())
        clearActiveSession()
      }
      null -> Unit
    }
  }

  private fun clearActiveSession() {
    when (activeSession) {
      linkSession -> linkSession = null
      layerSession -> layerSession = null
      headlessSession -> headlessSession = null
    }
    activeSession = null
  }

  private fun sendCreationExit(defaultMessage: String) {
    val errorMessage = sessionCreationError?.localizedMessage ?: defaultMessage
    sendEvent(
      "PlaidLink.onExit",
      mapOf(
        "error" to mapOf(
          "errorType" to "creation error",
          "errorCode" to "-1",
          "errorMessage" to errorMessage,
          "displayMessage" to errorMessage,
          "errorJson" to "",
        ),
        "metadata" to emptyExitMetadata(),
      ),
    )
  }

  private fun requireActivity(): Activity = appContext.currentActivity
    ?: throw CodedException("Could not find current activity.")
}
