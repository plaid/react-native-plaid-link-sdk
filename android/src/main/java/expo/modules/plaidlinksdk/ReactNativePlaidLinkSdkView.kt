package expo.modules.plaidlinksdk

import android.content.Context
import android.widget.FrameLayout
import com.plaid.link.OnLinkContinuation
import com.plaid.link.Plaid
import com.plaid.link.configuration.EmbeddedLinkTokenConfiguration
import com.plaid.link.result.LinkExit
import com.plaid.link.result.LinkResult
import com.plaid.link.result.LinkSuccess
import expo.modules.kotlin.AppContext
import expo.modules.kotlin.views.ExpoView
import expo.modules.kotlin.viewevent.EventDispatcher

class ReactNativePlaidLinkSdkView(
  context: Context,
  appContext: AppContext,
) : ExpoView(context, appContext) {
  private val container = FrameLayout(context)
  private val onSuccess by EventDispatcher()
  private val onExit by EventDispatcher()
  private val onEvent by EventDispatcher()
  private val onLoad by EventDispatcher()

  init {
    addView(container, LayoutParams(LayoutParams.MATCH_PARENT, LayoutParams.MATCH_PARENT))
  }

  fun setToken(token: String) {
    if (token.isBlank()) return

    Plaid.setLinkEventListener { event -> onEvent(event.toWritableMap()) }

    val config = EmbeddedLinkTokenConfiguration.Builder()
      .token(token)
      .onEmbeddedViewExit { exit -> onExit(exit.toWritableMap()) }
      .build()

    val embeddedView = Plaid.createPlaidEmbeddedLinkView(
      context,
      config,
      OnLinkContinuation { session ->
        val activity = appContext.currentActivity ?: return@OnLinkContinuation
        activity.prepareForPlaidKeyboard()
        session.open(activity)
      },
    )

    container.removeAllViews()
    container.addView(embeddedView, FrameLayout.LayoutParams(LayoutParams.MATCH_PARENT, LayoutParams.MATCH_PARENT))
    onLoad(mapOf<String, Any>())
  }

  override fun onAttachedToWindow() {
    super.onAttachedToWindow()
    PlaidEmbeddedResultDispatcher.register(::handleResult)
  }

  override fun onDetachedFromWindow() {
    PlaidEmbeddedResultDispatcher.unregister(::handleResult)
    super.onDetachedFromWindow()
  }

  private fun handleResult(result: LinkResult) {
    when (result) {
      is LinkSuccess -> onSuccess(result.toWritableMap())
      is LinkExit -> onExit(result.toWritableMap())
    }
  }
}
