package expo.modules.plaidlinksdk

import com.plaid.link.result.LinkResult

internal object PlaidEmbeddedResultDispatcher {
  private val handlers = mutableSetOf<(LinkResult) -> Unit>()

  fun register(handler: (LinkResult) -> Unit) {
    handlers.add(handler)
  }

  fun unregister(handler: (LinkResult) -> Unit) {
    handlers.remove(handler)
  }

  fun dispatch(result: LinkResult) {
    handlers.toList().forEach { it(result) }
  }
}
