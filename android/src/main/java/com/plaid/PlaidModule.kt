package com.plaid

import android.app.Activity
import android.content.Intent
import android.text.TextUtils
import com.facebook.react.bridge.ActivityEventListener
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.Callback
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.WritableNativeMap
import com.facebook.react.modules.core.DeviceEventManagerModule
import com.google.gson.FieldNamingPolicy
import com.google.gson.Gson
import com.google.gson.GsonBuilder
import com.plaid.link.Plaid
import com.plaid.linkbase.models.LinkCancellation
import com.plaid.linkbase.models.LinkConfiguration
import com.plaid.linkbase.models.LinkConnection
import com.plaid.linkbase.models.LinkEventListener
import com.plaid.linkbase.models.PlaidApiError
import com.plaid.linkbase.models.PlaidEnvironment
import com.plaid.linkbase.models.PlaidProduct
import org.json.JSONException
import org.json.JSONObject
import java.util.ArrayList
import java.util.HashMap

class PlaidModule internal constructor(reactContext: ReactApplicationContext) :
  ReactContextBaseJavaModule(reactContext), ActivityEventListener {

  private val snakeCaseGson: Gson = GsonBuilder()
    .setFieldNamingPolicy(FieldNamingPolicy.LOWER_CASE_WITH_UNDERSCORES)
    .create()
  private var callback: Callback? = null

  companion object {
    private const val PRODUCTS = "product"
    private const val CLIENT_NAME = "clientName"
    private const val COUNTRY_CODES = "countryCodes"
    private const val LANGUAGE = "language"
    private const val ENV = "env"
    private const val LINK_CUSTOMIZATION_NAME = "linkCustomizationName"
    private const val PUBLIC_TOKEN = "publicToken"
    private const val USER_EMAIL = "userEmailAddress"
    private const val USER_NAME = "userLegalName"
    private const val USER_PHONE = "userPhoneNumber"
    private const val WEBHOOK = "webhook"
    private const val DATA = "data"
    private const val RESULT_CODE = "resultCode"
    private const val WEBVIEW_REDIRECT_URI = "webviewRedirectUri"
    private const val LINK_REQUEST_CODE = 101
  }

  override fun getName(): String {
    return "PlaidAndroid"
  }

  override fun getConstants(): Map<String, Any>? {
    val constants = HashMap<String, Any>()
    constants["RESULT_SUCCESS"] = Plaid.RESULT_SUCCESS
    constants["RESULT_CANCELLED"] = Plaid.RESULT_CANCELLED
    constants["RESULT_EXIT"] = Plaid.RESULT_EXIT
    constants["RESULT_EXCEPTION"] = Plaid.RESULT_EXCEPTION
    constants["REQUEST_CODE"] = LINK_REQUEST_CODE
    return constants
  }

  override fun initialize() {
    super.initialize()
    reactApplicationContext.addActivityEventListener(this)
  }

  override fun onCatalystInstanceDestroy() {
    super.onCatalystInstanceDestroy()
    reactApplicationContext.removeActivityEventListener(this)
  }

  @ReactMethod
  @Suppress("unused")
  fun startLinkActivityForResult(
    data: String,
    callback: Callback
  ) {
    val activity = currentActivity ?: throw IllegalStateException("Current activity is null")
    this.callback = callback
    try {
      val obj = JSONObject(data)

      val productsArray = ArrayList<PlaidProduct>()
      var jsonArray = obj.getJSONArray(PRODUCTS)
      for (i in 0 until jsonArray.length()) {
        val productString = jsonArray.getString(i)
        if (!TextUtils.isEmpty(productString)) {
          for (product in PlaidProduct.values()) {
            if (!productsArray.contains(product) && product.name
                .equals(productString, ignoreCase = true)
            ) {
              productsArray.add(product)
            }
          }
        }
      }

      val builder = LinkConfiguration.Builder(
        obj.getString(CLIENT_NAME),
        productsArray,
        obj.getString(WEBVIEW_REDIRECT_URI)
      )

      if (obj.has(COUNTRY_CODES)) {
        val countryCodes = ArrayList<String>()
        jsonArray = obj.getJSONArray(COUNTRY_CODES)
        for (i in 0 until jsonArray.length()) {
          countryCodes.add(jsonArray.getString(i))
        }
        if (countryCodes.isNotEmpty()) {
          builder.countryCodes(countryCodes)
        }
      }

      if (obj.has(LANGUAGE)) {
        if (!TextUtils.isEmpty(obj.getString(LANGUAGE))) {
          builder.language(obj.getString(LANGUAGE))
        }
      }

      if (obj.has(ENV)) {
        if (!TextUtils.isEmpty(obj.getString(ENV))) {
          for (env in PlaidEnvironment.values()) {
            if (env.name.equals(obj.getString(ENV), ignoreCase = true)) {
              builder.environment(env)
              break
            }
          }
        }
      }

      if (obj.has(LINK_CUSTOMIZATION_NAME)) {
        if (!TextUtils.isEmpty(obj.getString(LINK_CUSTOMIZATION_NAME))) {
          builder.linkCustomizationName(obj.getString(LINK_CUSTOMIZATION_NAME))
        }
      }

      if (obj.has(PUBLIC_TOKEN)) {
        if (!TextUtils.isEmpty(obj.getString(PUBLIC_TOKEN))) {
          builder.publicToken(obj.getString(PUBLIC_TOKEN))
        }
      }

      if (obj.has(USER_EMAIL)) {
        if (!TextUtils.isEmpty(obj.getString(USER_EMAIL))) {
          builder.userEmailAddress(obj.getString(USER_EMAIL))
        }
      }

      if (obj.has(USER_NAME)) {
        if (!TextUtils.isEmpty(obj.getString(USER_NAME))) {
          builder.userLegalName(obj.getString(USER_NAME))
        }
      }

      if (obj.has(USER_PHONE)) {
        if (!TextUtils.isEmpty(obj.getString(USER_PHONE))) {
          builder.userPhoneNumber(obj.getString(USER_PHONE))
        }
      }

      if (obj.has(WEBHOOK)) {
        if (!TextUtils.isEmpty(obj.getString(WEBHOOK))) {
          builder.webhook(obj.getString(WEBHOOK))
        }
      }

      Plaid.setLinkEventListener(LinkEventListener {
        var json = snakeCaseGson.toJson(it)
        json = json.replace("event_name", "event")
        reactApplicationContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
          .emit("onEvent", convertJsonToMap(JSONObject(json)))
      })

      Plaid.openLink(activity, builder.build(), LINK_REQUEST_CODE)
    } catch (ex: JSONException) {
      val result = WritableNativeMap()
      result.putInt(RESULT_CODE, Plaid.RESULT_EXCEPTION)
      result.putString(DATA, snakeCaseGson.toJson(ex))
      this.callback?.invoke(result)
    }

  }

  override fun onActivityResult(
    activity: Activity,
    requestCode: Int,
    resultCode: Int,
    data: Intent
  ) {
    val result = WritableNativeMap()

    result.putInt(RESULT_CODE, resultCode)

    if (requestCode == LINK_REQUEST_CODE) {
      if (resultCode == Plaid.RESULT_SUCCESS) {
        val item = data.getParcelableExtra(Plaid.LINK_RESULT) as LinkConnection
        result.putMap(DATA, convertJsonToMap(JSONObject(snakeCaseGson.toJson(item))))
      } else if (resultCode == Plaid.RESULT_CANCELLED) {
        val cancellation = data.getParcelableExtra(Plaid.LINK_RESULT) as LinkCancellation
        result.putMap(DATA, convertJsonToMap(JSONObject(snakeCaseGson.toJson(cancellation))))
      } else if (resultCode == Plaid.RESULT_EXIT) {
        val error = data.getParcelableExtra(Plaid.LINK_RESULT) as PlaidApiError
        result.putMap(DATA, convertJsonToMap(JSONObject(snakeCaseGson.toJson(error))))
      } else if (resultCode == Plaid.RESULT_EXCEPTION) {
        val exception = data.getSerializableExtra(Plaid.LINK_RESULT) as Exception
        val map = WritableNativeMap()
        map.putString("class", exception.javaClass.name)
        map.putString("message", exception.message)
        result.putMap(DATA, map)
      }
      this.callback?.invoke(result)
    } else {
      if (data.extras != null) {
        result.putMap(DATA, Arguments.makeNativeMap(data.extras))
      }
      this.callback?.invoke(result)
    }
  }

  override fun onNewIntent(intent: Intent) {
    // Do Nothing
  }
}
