package expo.modules.plaidlinksdk

import android.app.Activity
import android.view.WindowManager

@Suppress("DEPRECATION")
internal fun Activity.prepareForPlaidKeyboard() {
  window.setSoftInputMode(WindowManager.LayoutParams.SOFT_INPUT_ADJUST_RESIZE)
}
