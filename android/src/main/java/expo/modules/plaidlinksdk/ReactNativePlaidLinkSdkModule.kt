package expo.modules.plaidlinksdk

import android.app.Activity
import android.content.Intent
import android.os.Handler
import android.os.Looper
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
  private val linkSessions = mutableMapOf<String, PlaidLinkSession>()
  private val layerSessions = mutableMapOf<String, PlaidLayerSession>()
  private val headlessSessions = mutableMapOf<String, PlaidHeadlessSession>()
  private val mainHandler = Handler(Looper.getMainLooper())
  private var activeSessionId: String? = null
  private var postSuccessSessionId: String? = null
  private var postSuccessCleanup: Runnable? = null

  override fun definition() = ModuleDefinition {
    Name("ReactNativePlaidLinkSdk")

    Constant("sdkVersion") { RNPlaidLinkSdkVersion.SDK_VERSION }

    Events("PlaidLink.onSuccess", "PlaidLink.onExit", "PlaidLink.onEvent")

    OnCreate {
      Plaid.setLinkEventListener { event ->
        (activeSessionId ?: postSuccessSessionId)?.let { clientSessionId ->
          sendSessionEvent("PlaidLink.onEvent", clientSessionId, event.toWritableMap())
        }
      }
    }

    OnDestroy {
      clearAllSessions()
    }

    View(ReactNativePlaidLinkSdkView::class) {
      Events("onSuccess", "onExit", "onEvent", "onLoad")
      Prop("token") { view: ReactNativePlaidLinkSdkView, token: String -> view.setToken(token) }
    }

    OnActivityResult { _, payload ->
      if (payload.requestCode == Plaid.LINK_REQUEST_CODE) {
        handleActivityResult(payload.resultCode, payload.data)
      }
    }

    AsyncFunction("createPlaidLinkSession") { clientSessionId: String, token: String, promise: Promise ->
      try {
        clearPostSuccessSession()
        val activity = requireActivity()
        val config = LinkTokenConfiguration.Builder()
          .token(token)
          .onLoad(OnLoadCallback { promise.resolve(null) })
          .build()
        linkSessions[clientSessionId] = Plaid.createPlaidLinkSession(activity, config)
      } catch (error: Throwable) {
        clearSession(clientSessionId)
        promise.reject("LINK_SESSION_CREATE_ERROR", error.message ?: "Failed to create Link session", error)
      }
    }

    AsyncFunction("createPlaidLayerSession") { clientSessionId: String, token: String, promise: Promise ->
      try {
        clearPostSuccessSession()
        val activity = requireActivity()
        val config = LayerTokenConfiguration.Builder().token(token).build()
        layerSessions[clientSessionId] = Plaid.createPlaidLayerSession(activity, config)
        promise.resolve(null)
      } catch (error: Throwable) {
        clearSession(clientSessionId)
        promise.reject("LAYER_SESSION_CREATE_ERROR", error.message ?: "Failed to create Layer session", error)
      }
    }

    AsyncFunction("createPlaidHeadlessSession") { clientSessionId: String, token: String, promise: Promise ->
      try {
        clearPostSuccessSession()
        val activity = requireActivity()
        val config = LinkTokenConfiguration.Builder()
          .token(token)
          .onLoad(OnLoadCallback { promise.resolve(null) })
          .build()
        headlessSessions[clientSessionId] = Plaid.createPlaidHeadlessSession(activity, config)
      } catch (error: Throwable) {
        clearSession(clientSessionId)
        promise.reject("HEADLESS_SESSION_CREATE_ERROR", error.message ?: "Failed to create Headless session", error)
      }
    }

    AsyncFunction("openLinkSession") { clientSessionId: String, _: Boolean, promise: Promise ->
      openSession(clientSessionId, linkSessions[clientSessionId], promise)
    }

    AsyncFunction("openLayerSession") { clientSessionId: String, promise: Promise ->
      openSession(clientSessionId, layerSessions[clientSessionId], promise)
    }

    AsyncFunction("startHeadlessSession") { clientSessionId: String, promise: Promise ->
      openSession(clientSessionId, headlessSessions[clientSessionId], promise)
    }

    AsyncFunction("submitLayerData") { clientSessionId: String, phoneNumber: String?, dateOfBirth: String?, params: Map<String, String>?, promise: Promise ->
      val session = layerSessions[clientSessionId]
      if (session == null) {
        promise.reject("PLAID_NO_LAYER_SESSION", "Layer session not found for the supplied session identifier.", null)
        return@AsyncFunction
      }
      if (!activateSession(clientSessionId, promise)) {
        return@AsyncFunction
      }
      session.submit(SubmissionData(phoneNumber = phoneNumber, dateOfBirth = dateOfBirth, params = params))
      promise.resolve(null)
    }

    AsyncFunction("destroySession") { clientSessionId: String ->
      clearSession(clientSessionId)
    }

    AsyncFunction("syncFinanceKit") { _: String, _: Boolean, _: Int, promise: Promise ->
      promise.reject("UNSUPPORTED_ANDROID", "FinanceKit is only available on iOS", null)
    }
  }

  private fun openSession(clientSessionId: String, session: PlaidSession?, promise: Promise) {
    if (session == null) {
      promise.reject("PLAID_NO_SESSION", "Plaid session not found for the supplied session identifier.", null)
      return
    }
    if (!activateSession(clientSessionId, promise)) {
      return
    }

    try {
      val activity = requireActivity()
      session.open(activity)
      promise.resolve(null)
    } catch (error: Throwable) {
      activeSessionId = null
      promise.reject("PLAID_OPEN_ERROR", error.message ?: "Failed to open Plaid session", error)
    }
  }

  private fun activateSession(clientSessionId: String, promise: Promise): Boolean {
    val currentSessionId = activeSessionId
    if (currentSessionId != null && currentSessionId != clientSessionId) {
      promise.reject(
        "PLAID_SESSION_ALREADY_ACTIVE",
        "Another Plaid session is already active.",
        null,
      )
      return false
    }
    if (postSuccessSessionId != clientSessionId) {
      clearPostSuccessSession()
    }
    activeSessionId = clientSessionId
    return true
  }

  private fun handleActivityResult(resultCode: Int, data: Intent?) {
    when (val result = Plaid.parseResult(Plaid.LINK_REQUEST_CODE, resultCode, data)) {
      is LinkSuccess -> {
        PlaidEmbeddedResultDispatcher.dispatch(result)
        activeSessionId?.let { clientSessionId ->
          sendSessionEvent("PlaidLink.onSuccess", clientSessionId, result.toWritableMap())
          clearSession(clientSessionId)
          retainPostSuccessSession(clientSessionId)
        }
      }
      is LinkExit -> {
        PlaidEmbeddedResultDispatcher.dispatch(result)
        activeSessionId?.let { clientSessionId ->
          sendSessionEvent("PlaidLink.onExit", clientSessionId, result.toWritableMap())
          clearSession(clientSessionId)
        }
      }
      null -> Unit
    }
  }

  private fun sendSessionEvent(eventName: String, clientSessionId: String, payload: Map<String, Any>) {
    sendEvent(
      eventName,
      mapOf(
        "clientSessionId" to clientSessionId,
        "payload" to payload,
      ),
    )
  }

  private fun clearSession(clientSessionId: String) {
    linkSessions.remove(clientSessionId)
    layerSessions.remove(clientSessionId)
    headlessSessions.remove(clientSessionId)
    if (activeSessionId == clientSessionId) {
      activeSessionId = null
    }
    if (postSuccessSessionId == clientSessionId) {
      clearPostSuccessSession()
    }
  }

  private fun retainPostSuccessSession(clientSessionId: String) {
    clearPostSuccessSession()
    postSuccessSessionId = clientSessionId
    postSuccessCleanup = Runnable {
      if (postSuccessSessionId == clientSessionId) {
        postSuccessSessionId = null
        postSuccessCleanup = null
      }
    }.also { mainHandler.postDelayed(it, POST_SUCCESS_EVENT_WINDOW_MS) }
  }

  private fun clearPostSuccessSession() {
    postSuccessCleanup?.let(mainHandler::removeCallbacks)
    postSuccessCleanup = null
    postSuccessSessionId = null
  }

  private fun clearAllSessions() {
    linkSessions.clear()
    layerSessions.clear()
    headlessSessions.clear()
    activeSessionId = null
    clearPostSuccessSession()
  }

  private fun requireActivity(): Activity = appContext.currentActivity
    ?: throw CodedException("Could not find current activity.")

  companion object {
    private const val POST_SUCCESS_EVENT_WINDOW_MS = 1500L
  }
}
