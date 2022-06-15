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
import com.facebook.react.modules.core.DeviceEventManagerModule
import com.plaid.gson.PlaidJsonConverter
import com.plaid.link.Plaid
import com.plaid.link.configuration.LinkLogLevel
import com.plaid.link.configuration.LinkPublicKeyConfiguration
import com.plaid.link.configuration.LinkTokenConfiguration
import com.plaid.link.configuration.PlaidEnvironment
import com.plaid.link.configuration.PlaidProduct
import com.plaid.link.event.LinkEvent
import com.plaid.link.exception.LinkException
import com.plaid.link.result.LinkAccountSubtype
import com.plaid.link.result.LinkResultHandler
import org.json.JSONException
import org.json.JSONObject
import java.util.ArrayList

class PlaidModule internal constructor(reactContext: ReactApplicationContext) :
  ReactContextBaseJavaModule(reactContext), ActivityEventListener {

  private val jsonConverter by lazy { PlaidJsonConverter() }

  private var onSuccessCallback: Callback? = null
  private var onExitCallback: Callback? = null

  companion object {
    private const val PRODUCTS = "products"
    private const val PUBLIC_KEY = "publicKey"
    private const val ACCOUNT_SUBTYPES = "accountSubtypes"
    private const val CLIENT_NAME = "clientName"
    private const val COUNTRY_CODES = "countryCodes"
    private const val LANGUAGE = "language"
    private const val LOG_LEVEL = "logLevel"
    private const val ENV = "environment"
    private const val LINK_CUSTOMIZATION_NAME = "linkCustomizationName"
    private const val TOKEN = "token"
    private const val NO_LOADING_STATE = "noLoadingState"
    private const val USER_EMAIL = "userEmailAddress"
    private const val USER_NAME = "userLegalName"
    private const val USER_PHONE = "userPhoneNumber"
    private const val WEBHOOK = "webhook"
    private const val EXTRAS = "extras"
    private const val LINK_TOKEN_PREFIX = "link"
    private const val TYPE = "type"
    private const val SUBTYPE = "subtype"
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

    if (token == null) {
      return null
    }

    if (!token.startsWith(LINK_TOKEN_PREFIX)) {
      return null
    }

    val logLevel =
      if (obj.has(LOG_LEVEL)) {
        getLogLevel(obj.getString(LOG_LEVEL))
      } else {
        LinkLogLevel.ASSERT
      }

    val builder = LinkTokenConfiguration.Builder()
      .token(token)
      .logLevel(logLevel)
      .noLoadingState(false)

      maybeGetBooleanField(obj, NO_LOADING_STATE)?.let {
        builder.noLoadingState(it)
      }

    if (extrasMap.isNotEmpty()) {
      builder.extraParams(extrasMap)
    }

    return builder.build()
  }

  private fun getLogLevel(logLevelString: String): LinkLogLevel {
    return LinkLogLevel.values().firstOrNull {
      it.name.equals(logLevelString, true)
    } ?: LinkLogLevel.ASSERT
  }

  private fun getLinkPublicKeyConfiguration(
    obj: JSONObject,
    publicKey: String
  ): LinkPublicKeyConfiguration {
    val extrasMap = mutableMapOf<String, String>()
    maybePopulateExtrasMap(obj, extrasMap)

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

    val logLevel =
      if (obj.has(LOG_LEVEL)) {
        getLogLevel(obj.getString(LOG_LEVEL))
      } else {
        LinkLogLevel.ASSERT
      }

    val builder = LinkPublicKeyConfiguration.Builder()
      .publicKey(publicKey)
      .clientName(obj.getString(CLIENT_NAME))
      .products(productsArray)
      .logLevel(logLevel)

    if (obj.has(ACCOUNT_SUBTYPES)) {
      val subtypeList = mutableListOf<LinkAccountSubtype>()
      val subtypesArray = obj.getJSONArray(ACCOUNT_SUBTYPES)
      for (i in 0 until subtypesArray.length()) {
        val subtypeObject = subtypesArray.get(i) as JSONObject
        subtypeList.add(
          LinkAccountSubtype.convert(
            subtypeObject.getString(SUBTYPE),
            subtypeObject.getString(TYPE)
          )
        )
      }
      builder.accountSubtypes = subtypeList
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
      Plaid.setLinkEventListener { linkEvent: LinkEvent ->
        var json = jsonConverter.convert(linkEvent)
        val eventMap = convertJsonToMap(JSONObject(json))
        reactApplicationContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
          .emit("onEvent", eventMap)
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

  private fun maybeGetBooleanField(obj: JSONObject, fieldName: String): Boolean? {
    if (obj.has(fieldName)) {
      return obj.getBoolean(fieldName);
    }
    return null
  }

  private fun maybePopulateExtrasMap(obj: JSONObject, extrasMap: MutableMap<String, String>) {
    if (obj.has(EXTRAS)) {
      val extrasArray = obj.getJSONArray(EXTRAS)
      for (i in 0 until extrasArray.length()) {
        val extraObject = extrasArray.get(i) as JSONObject
        extraObject.keys().forEach { key ->
          extrasMap[key] = extraObject.getString(key)
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
    val linkHandler = LinkResultHandler(
      onSuccess = { success ->
        val result = convertJsonToMap(JSONObject(jsonConverter.convert(success)))
        print(result)
        this.onSuccessCallback?.invoke(result)
      },
      onExit = { exit ->
        val result = convertJsonToMap(JSONObject(jsonConverter.convert(exit)))
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
