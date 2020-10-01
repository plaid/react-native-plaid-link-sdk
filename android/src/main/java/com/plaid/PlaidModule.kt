package com.plaid

import android.app.Activity
import android.app.Application
import android.content.Intent
import android.text.TextUtils
import android.util.Log
import com.facebook.react.bridge.ActivityEventListener
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
import com.plaid.link.configuration.LinkLogLevel
import com.plaid.link.configuration.LinkPublicKeyConfiguration
import com.plaid.link.configuration.LinkTokenConfiguration
import com.plaid.link.configuration.PlaidEnvironment
import com.plaid.link.configuration.PlaidProduct
import com.plaid.link.exception.LinkException
import com.plaid.link.result.LinkResultHandler
import org.json.JSONException
import org.json.JSONObject
import java.util.ArrayList

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
    private const val EXTRAS = "extras"
    private const val DATA = "data"
    private const val RESULT_CODE = "resultCode"
    private const val LINK_TOKEN_PREFIX = "link"
  }

  override fun getName(): String {
    return "PlaidAndroid"
  }

  override fun initialize() {
    super.initialize()
    reactApplicationContext.addActivityEventListener(this)
  }

  override fun onCatalystInstanceDestroy() {
    super.onCatalystInstanceDestroy()
    reactApplicationContext.removeActivityEventListener(this)
  }

  private fun getLinkTokenConfiguration(obj: JSONObject, token: String?): LinkTokenConfiguration? {
    val extrasMap = mutableMapOf<String, String>()
    maybePopulateExtrasMap(obj, extrasMap)

    val logLevel = LinkLogLevel.ASSERT

    if (token == null) {
      return null
    }

    if (!token.startsWith(LINK_TOKEN_PREFIX)) {
      return null
    }

    val builder = LinkTokenConfiguration.Builder()
      .token(token)
      .logLevel(logLevel)

    if (extrasMap.isNotEmpty()) {
      builder.extraParams(extrasMap)
    }

    return builder.build()
  }

  private fun getLinkPublicKeyConfiguration(obj: JSONObject, publicKey: String): LinkPublicKeyConfiguration {
    val extrasMap = mutableMapOf<String, String>()
    maybePopulateExtrasMap(obj, extrasMap)
    val logLevel = LinkLogLevel.ASSERT

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

    val builder = LinkPublicKeyConfiguration.Builder()
      .publicKey(publicKey)
      .clientName(obj.getString(CLIENT_NAME))
      .products(productsArray)
      .logLevel(logLevel)

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

    if (extrasMap.isNotEmpty()) {
      builder.extraParams(extrasMap)
    }

    return builder.build()
  }

  @ReactMethod
  @Suppress("unused")
  fun startLinkActivityForResult(
    data: String,
    onSuccessCallback: Callback,
    onExitCallback: Callback
  ) {
    val activity = currentActivity ?: throw IllegalStateException("Current activity is null")
    this.onSuccessCallback = onSuccessCallback
    this.onExitCallback = onExitCallback

    try {
      Plaid.setLinkEventListener {
        var json = snakeCaseGson.toJson(it)
        json = json.replace("event_name", "event")
        reactApplicationContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
          .emit("onEvent", convertJsonToMap(JSONObject(json)))
      }

      val obj = JSONObject(data)
      val publicKey = maybeGetStringField(obj, PUBLIC_KEY)
      // If we're initializing with a Link token, we will not use or
      // accept many of the client-side configs.
      val token = maybeGetStringField(obj, TOKEN)
      if (publicKey == null && token == null) {
        throw IllegalStateException("Token must be part of configuration.")
      }

      publicKey?.let {
        try {
          Plaid.create(
            reactApplicationContext.getApplicationContext() as Application,
            getLinkPublicKeyConfiguration(obj, it)
          ).open(activity)
          return
        } catch (ex: Exception) {
          Log.w("PlaidModule", "Public key provided but unable to open Link")
          Log.w("PlaidModule", ex.message ?: "")
          throw ex
        }
      }

      val tokenConfiguration = getLinkTokenConfiguration(obj, token)
      tokenConfiguration?.let {
        Plaid.create(
          reactApplicationContext.getApplicationContext() as Application,
          it
        ).open(activity)
        return
      }

      throw LinkException("Unable to open link, please check that your configuration is valid")
    } catch (ex: JSONException) {
      Log.e("PlaidModule", ex.toString())
      throw ex
    }
  }

  private fun maybeGetStringField(obj: JSONObject, fieldName: String): String? {
    if (obj.has(fieldName) && !TextUtils.isEmpty(obj.getString(fieldName))) {
      return obj.getString(fieldName)
    }
    return null
  }

  private fun maybePopulateExtrasMap(obj: JSONObject, extrasMap: MutableMap<String, String>) {
    if (obj.has(EXTRAS)) {
      val extrasObject = obj.getJSONObject("extras")
      extrasObject.keys().forEach { key: String ->
        try {
          extrasMap[key] = extrasObject.getString(key)
        } catch (e: JSONException) {
          // Do nothing.
        }
      }
    }
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
      Log.w("PlaidModule", "No data was returned")
      throw Throwable("No data was returned in onActivityResult")
    }

    val linkHandler = LinkResultHandler(
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
}
