package com.plaid

import android.app.Activity
import android.app.Application
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
import com.plaid.link.configuration.LinkConfiguration;
import com.plaid.link.configuration.LinkLogLevel;
import com.plaid.link.configuration.PlaidEnvironment;
import com.plaid.link.configuration.PlaidProduct;
import com.plaid.link.result.LinkError
import com.plaid.link.result.LinkExit
import com.plaid.link.result.LinkSuccess
import com.plaid.link.result.PlaidLinkResultHandler
import org.json.JSONException
import org.json.JSONObject
import java.util.ArrayList
import java.util.HashMap

class PlaidModule internal constructor(reactContext: ReactApplicationContext) :
  ReactContextBaseJavaModule(reactContext), ActivityEventListener {

  private val snakeCaseGson: Gson = GsonBuilder()
    .setFieldNamingPolicy(FieldNamingPolicy.LOWER_CASE_WITH_UNDERSCORES)
    .create()

  private var onSuccessCallback: Callback? = null
  private var onExitCallback: Callback? = null

  companion object {
    private const val PRODUCTS = "product"
    private const val PUBLIC_KEY = "publicKey"
    private const val ACCOUNT_SUBTYPES = "accountSubtypes"
    private const val CLIENT_NAME = "clientName"
    private const val COUNTRY_CODES = "countryCodes"
    private const val LANGUAGE = "language"
    private const val ENV = "env"
    private const val LINK_CUSTOMIZATION_NAME = "linkCustomizationName"
    private const val TOKEN = "token"
    private const val USER_EMAIL = "userEmailAddress"
    private const val USER_NAME = "userLegalName"
    private const val USER_PHONE = "userPhoneNumber"
    private const val WEBHOOK = "webhook"
    private const val DATA = "data"
    private const val RESULT_CODE = "resultCode"
    private const val INSTITUTION = "institution"
  }

  override fun getName(): String {
    return "PlaidAndroid"
  }

  override fun initialize() {
    super.initialize()
    reactApplicationContext.addActivityEventListener(this)
    Plaid.initialize(reactApplicationContext.getApplicationContext() as Application)
  }

  override fun onCatalystInstanceDestroy() {
    super.onCatalystInstanceDestroy()
    reactApplicationContext.removeActivityEventListener(this)
  }

  @ReactMethod
  @Suppress("unused")
  fun startLinkActivityForResult(
    data: String,
    onSuccessCallback: Callback,
    onExitCallback: Callback
  ) {
    val activity = currentActivity ?: throw IllegalStateException("Current activity is null")
    val extrasMap = mutableMapOf<String, String>()
    this.onSuccessCallback = onSuccessCallback
    this.onExitCallback = onExitCallback
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

      val builder = LinkConfiguration.Builder()
        .publicKey(obj.getString(PUBLIC_KEY))
        .clientName(obj.getString(CLIENT_NAME))
        .products(productsArray)

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

      maybeGetStringField(obj, INSTITUTION)?.let {
        extrasMap[INSTITUTION] = it
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

      Plaid.openLink(activity, builder.build())
    } catch (ex: JSONException) {
      val result = WritableNativeMap()
      result.putString(DATA, snakeCaseGson.toJson(plaidErrorFromException(ex)))
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

    // This should not happen but if it does we have no data to return
    if (data == null) {
      Log.w(PlaidModule::class.java.simpleName, Log.getStackTraceString(Throwable()))
      val exitMetadata: Map<String, String?> = mapOf(Pair("link_session_id", ""))
      val exit = LinkExit.fromMap(exitMetadata)
      result.putMap(DATA, convertJsonToMap(JSONObject(snakeCaseGson.toJson(exit))))
      this.onExitCallback?.invoke(result)
    }

    val linkHandler = PlaidLinkResultHandler(
      onSuccess = { success ->
        result.putMap(DATA, convertJsonToMap(JSONObject(snakeCaseGson.toJson(success))))
        print(result)
        this.onSuccessCallback?.invoke(result)
      },
      onExit = { exit ->
        result.putMap(DATA, convertJsonToMap(JSONObject(snakeCaseGson.toJson(exit))))
        print(result)
        this.onExitCallback?.invoke(result)
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

  private fun plaidErrorFromException(exception: Throwable?) =
    LinkError.fromException(exception)
}

