package com.plaid

import android.app.Activity
import android.content.Intent
import android.text.TextUtils
import android.util.Log
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
import com.plaid.linkbase.models.configuration.LinkConfiguration
import com.plaid.linkbase.models.configuration.PlaidEnvironment
import com.plaid.linkbase.models.configuration.PlaidProduct
import com.plaid.linkbase.models.connection.LinkCancellation
import com.plaid.linkbase.models.connection.LinkConnection
import com.plaid.linkbase.models.connection.LinkExitMetadata
import com.plaid.linkbase.models.connection.PlaidError
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
    private const val PUBLIC_KEY = "publicKey"
    private const val ACCOUNT_SUBTYPES = "accountSubtypes"
    private const val CLIENT_NAME = "clientName"
    private const val COUNTRY_CODES = "countryCodes"
    private const val LANGUAGE = "language"
    private const val ENV = "env"
    private const val LINK_CUSTOMIZATION_NAME = "linkCustomizationName"
    private const val OAUTH_NONCE = "oauthNonce"
    private const val TOKEN = "token"
    private const val USER_EMAIL = "userEmailAddress"
    private const val USER_NAME = "userLegalName"
    private const val USER_PHONE = "userPhoneNumber"
    private const val WEBHOOK = "webhook"
    private const val DATA = "data"
    private const val RESULT_CODE = "resultCode"
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
    val extrasMap = mutableMapOf<String, String>()
    this.callback = callback
    try {
      val obj = JSONObject(data)

      Plaid.setPublicKey(obj.getString(PUBLIC_KEY))

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
        productsArray
      )

      if (obj.has(ACCOUNT_SUBTYPES)) {
        extrasMap[ACCOUNT_SUBTYPES] = obj.getJSONObject(ACCOUNT_SUBTYPES).toString()
      }

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

      maybeGetStringField(obj, LANGUAGE)?.let {
        builder.language(it)
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

      maybeGetStringField(obj, LINK_CUSTOMIZATION_NAME)?.let {
        builder.linkCustomizationName(it)
      }

      maybeGetStringField(obj, OAUTH_NONCE)?.let {
        builder.oauthNonce(it)
      }

      maybeGetStringField(obj, TOKEN)?.let {
        builder.token(it)
      }

      maybeGetStringField(obj, USER_EMAIL)?.let {
        builder.userEmailAddress(it)
      }

      maybeGetStringField(obj, USER_NAME)?.let {
        builder.userLegalName(it)
      }

      maybeGetStringField(obj, USER_PHONE)?.let {
        builder.userPhoneNumber(it)
      }

      maybeGetStringField(obj, WEBHOOK)?.let {
        builder.webhook(it)
      }

      if (extrasMap.isNotEmpty()) {
        builder.extraParams(extrasMap)
      }

      Plaid.setLinkEventListener {
        var json = snakeCaseGson.toJson(it)
        json = json.replace("event_name", "event")
        reactApplicationContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
          .emit("onEvent", convertJsonToMap(JSONObject(json)))
      }

      Plaid.openLink(activity, builder.build(), LINK_REQUEST_CODE)
    } catch (ex: JSONException) {
      val result = WritableNativeMap()
      result.putInt(RESULT_CODE, Plaid.RESULT_EXIT)
      result.putString(DATA, snakeCaseGson.toJson(plaidErrorFromException(ex)))
      this.callback?.invoke(result)
    }
  }

  private fun maybeGetStringField(obj: JSONObject, fieldName: String): String? {
    if (obj.has(fieldName) && !TextUtils.isEmpty(obj.getString(fieldName))) {
      return obj.getString(fieldName)
    }
    return null
  }

  override fun onActivityResult(
    activity: Activity,
    requestCode: Int,
    resultCode: Int,
    data: Intent?
  ) {
    val result = WritableNativeMap()
    val PLAID_RESULT_CODES =
      arrayOf(Plaid.RESULT_SUCCESS, Plaid.RESULT_CANCELLED, Plaid.RESULT_EXIT)

    result.putInt(RESULT_CODE, resultCode)
    if (!PLAID_RESULT_CODES.contains(resultCode)) {
      Log.w("PlaidModule", "ignoring result")
      return
    }

    // This should not happen but if it does we have no data to return
    if (data == null) {
      Log.w(PlaidModule::class.java.simpleName, Log.getStackTraceString(Throwable()))
      val cancellation = LinkCancellation("")
      result.putMap(DATA, convertJsonToMap(JSONObject(snakeCaseGson.toJson(cancellation))))
      this.callback?.invoke(result)
      return
    }

    if (requestCode == LINK_REQUEST_CODE) {
      if (resultCode == Plaid.RESULT_SUCCESS) {
        val item = data.getParcelableExtra(Plaid.LINK_RESULT) as LinkConnection
        result.putMap(DATA, convertJsonToMap(JSONObject(snakeCaseGson.toJson(item))))
      } else if (resultCode == Plaid.RESULT_CANCELLED) {
        val cancellation = data.getParcelableExtra(Plaid.LINK_RESULT) as LinkCancellation
        result.putMap(DATA, convertJsonToMap(JSONObject(snakeCaseGson.toJson(cancellation))))
      } else if (resultCode == Plaid.RESULT_EXIT) {
        val error = data.getParcelableExtra(Plaid.LINK_RESULT) as PlaidError
        result.putMap(DATA, convertJsonToMap(JSONObject(snakeCaseGson.toJson(error))))
      }
      this.callback?.invoke(result)
    } else {
      try {
        if (data.extras != null) {
          result.putMap(DATA, Arguments.makeNativeMap(data.extras))
        }
        Log.d("PlaidModule", "callback invoked")
        print(result)
        this.callback?.invoke(result)
      } catch (t: Throwable) {
        // log error
        Log.e("PlaidModule", "error in plaid module" + t.stackTrace)
      }
    }
  }

  override fun onNewIntent(intent: Intent) {
    // Do Nothing
  }

  private fun plaidErrorFromException(exception: Throwable?) =
    PlaidError(
      "Internal exception occurred",
      "499",
      exception?.stackTrace?.contentToString() ?: "No stack trace",
      exception?.localizedMessage,
      LinkExitMetadata()
    )
}
