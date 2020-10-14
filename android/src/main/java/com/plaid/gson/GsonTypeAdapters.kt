/*
 * Copyright (c) 2020 Plaid Technologies, Inc. <support@plaid.com>
 */
package com.plaid.gson

import com.google.gson.JsonDeserializationContext
import com.google.gson.JsonDeserializer
import com.google.gson.JsonElement
import com.google.gson.JsonObject
import com.google.gson.JsonPrimitive
import com.google.gson.JsonSerializationContext
import com.google.gson.JsonSerializer
import com.plaid.link.result.*
import com.plaid.link.event.*
import java.lang.reflect.Type

class AccountAdapter : JsonSerializer<LinkAccount> {

  override fun serialize(
    src: LinkAccount?,
    typeOfSrc: Type?,
    context: JsonSerializationContext?
  ): JsonElement {
    if (src == null) {
      return JsonObject()
    }
    val obj = JsonObject().apply {
      addProperty("id", src.id)
      addProperty("name", src.name)
      addProperty("mask", src.mask)
      context?.serialize(src.verificationStatus)?.let {
        add("verificationStatus", it)
      }

      // Special handling around account subtype
      val subtype = context?.serialize(src.subtype)?.asJsonObject
      subtype?.let {
        addProperty("type", it.get("account_type").asString)
        addProperty("subtype", it.get("json").asString)
      }
    }
    return obj
  }
}

class AccountSubtypeAdapter : JsonDeserializer<LinkAccountSubtype> {

  override fun deserialize(
    json: JsonElement?,
    typeOfT: Type?,
    context: JsonDeserializationContext?
  ): LinkAccountSubtype {
    if (json == null) {
      return LinkAccountSubtype.UNKNOWN(
        "null",
        LinkAccountType.UNKNOWN("null")
      )
    }
    return try {
      val obj = json.asJsonObject
      LinkAccountSubtype.convert(
        subtypeJson = obj["subtype"].asString,
        accountTypeJson = obj["type"].asString
      )
    } catch (e: Exception) {
      LinkAccountSubtype.UNKNOWN(
        "null",
        LinkAccountType.UNKNOWN("null")
      )
    }
  }

}

class AccountTypeAdapter : JsonSerializer<LinkAccountType>,
  JsonDeserializer<LinkAccountType> {

  override fun deserialize(
    json: JsonElement?,
    typeOfT: Type?,
    context: JsonDeserializationContext?
  ): LinkAccountType {
    if (json == null) {
      return LinkAccountType.UNKNOWN("null")
    }

    return LinkAccountType.convert(json.asString)
  }

  override fun serialize(
    src: LinkAccountType?,
    typeOfSrc: Type?,
    context: JsonSerializationContext?
  ): JsonElement {
    return JsonPrimitive(src?.json ?: "")
  }
}

class LinkAccountVerificationStatusAdapter : JsonSerializer<LinkAccountVerificationStatus>,
  JsonDeserializer<LinkAccountVerificationStatus> {

  override fun deserialize(
    json: JsonElement?,
    typeOfT: Type?,
    context: JsonDeserializationContext?
  ): LinkAccountVerificationStatus? {
    if (json == null) {
      return null
    }

    return LinkAccountVerificationStatus.convert(json.asString)
  }

  override fun serialize(
    src: LinkAccountVerificationStatus?,
    typeOfSrc: Type?,
    context: JsonSerializationContext?
  ): JsonElement {
    return JsonPrimitive(src?.json ?: "")
  }
}

class LinkEventNameAdapter : JsonSerializer<LinkEventName>,
  JsonDeserializer<LinkEventName> {

  private val map by lazy {
    mapOf(
      LinkEventName.CLOSE_OAUTH.json to LinkEventName.CLOSE_OAUTH,
      LinkEventName.ERROR.json to LinkEventName.ERROR,
      LinkEventName.EXIT.json to LinkEventName.EXIT,
      LinkEventName.FAIL_OAUTH.json to LinkEventName.FAIL_OAUTH,
      LinkEventName.HANDOFF.json to LinkEventName.HANDOFF,
      LinkEventName.OPEN.json to LinkEventName.OPEN,
      LinkEventName.OPEN_MY_PLAID.json to LinkEventName.OPEN_MY_PLAID,
      LinkEventName.OPEN_OAUTH.json to LinkEventName.OPEN_OAUTH,
      LinkEventName.SEARCH_INSTITUTION.json to LinkEventName.SEARCH_INSTITUTION,
      LinkEventName.SELECT_INSTITUTION.json to LinkEventName.SELECT_INSTITUTION,
      LinkEventName.SUBMIT_CREDENTIALS.json to LinkEventName.SUBMIT_CREDENTIALS,
      LinkEventName.SUBMIT_MFA.json to LinkEventName.SUBMIT_MFA,
      LinkEventName.TRANSITION_VIEW.json to LinkEventName.TRANSITION_VIEW
    )
  }

  override fun deserialize(
    json: JsonElement?,
    typeOfT: Type?,
    context: JsonDeserializationContext?
  ): LinkEventName {

    return if (json == null) {
      LinkEventName.UNKNOWN("")
    } else {
      val eventName = json.asString
      map[eventName] ?: LinkEventName.UNKNOWN(eventName)
    }
  }

  override fun serialize(
    src: LinkEventName?,
    typeOfSrc: Type?,
    context: JsonSerializationContext?
  ): JsonElement {
    return JsonPrimitive(src?.json ?: "")
  }
}

class LinkEventViewNameAdapter : JsonSerializer<LinkEventViewName>,
  JsonDeserializer<LinkEventViewName> {

  private val map by lazy {
    mapOf(
      LinkEventViewName.CONNECTED.jsonValue to LinkEventViewName.CONNECTED,
      LinkEventViewName.CONSENT.jsonValue to LinkEventViewName.CONSENT,
      LinkEventViewName.CREDENTIAL.jsonValue to LinkEventViewName.CREDENTIAL,
      LinkEventViewName.ERROR.jsonValue to LinkEventViewName.ERROR,
      LinkEventViewName.EXIT.jsonValue to LinkEventViewName.EXIT,
      LinkEventViewName.LOADING.jsonValue to LinkEventViewName.LOADING,
      LinkEventViewName.MFA.jsonValue to LinkEventViewName.MFA,
      LinkEventViewName.NUMBERS.jsonValue to LinkEventViewName.NUMBERS,
      LinkEventViewName.RECAPTCHA.jsonValue to LinkEventViewName.RECAPTCHA,
      LinkEventViewName.SELECT_ACCOUNT.jsonValue to LinkEventViewName.SELECT_ACCOUNT,
      LinkEventViewName.SELECT_INSTITUTION.jsonValue to LinkEventViewName.SELECT_INSTITUTION
    )
  }

  override fun deserialize(
    json: JsonElement?,
    typeOfT: Type?,
    context: JsonDeserializationContext?
  ): LinkEventViewName {
    if (json == null) {
      return LinkEventViewName.OTHER("")
    }

    return map[json.asString]
      ?: LinkEventViewName.OTHER(json.asString)
  }

  override fun serialize(
    src: LinkEventViewName?,
    typeOfSrc: Type?,
    context: JsonSerializationContext?
  ): JsonElement {
    return JsonPrimitive(src?.jsonValue ?: "")
  }
}

class PlaidErrorCodeAdapter : JsonSerializer<LinkErrorCode>, JsonDeserializer<LinkErrorCode> {

  override fun deserialize(
    json: JsonElement?,
    typeOfT: Type?,
    context: JsonDeserializationContext?
  ): LinkErrorCode {
    if (json == null) {
      return LinkErrorCode.UNKNOWN("null", LinkErrorType.UNKNOWN("null"))
    }
    return try {
      LinkErrorCode.convert(json.asString)
    } catch (e: Exception) {
      LinkErrorCode.UNKNOWN("null", LinkErrorType.UNKNOWN("null"))
    }
  }

  override fun serialize(
    src: LinkErrorCode?,
    typeOfSrc: Type?,
    context: JsonSerializationContext?
  ): JsonElement {
    return JsonPrimitive(src?.json ?: "")
  }
}

class PlaidErrorTypeAdapter : JsonSerializer<LinkErrorType>, JsonDeserializer<LinkErrorType> {

  override fun deserialize(
    json: JsonElement?,
    typeOfT: Type?,
    context: JsonDeserializationContext?
  ): LinkErrorType {
    if (json == null) {
      return LinkErrorType.UNKNOWN("null")
    }
    return try {
      LinkErrorType.convert(json.asString)
    } catch (e: Exception) {
      LinkErrorType.UNKNOWN("null")
    }
  }

  override fun serialize(
    src: LinkErrorType?,
    typeOfSrc: Type?,
    context: JsonSerializationContext?
  ): JsonElement {
    return JsonPrimitive(src?.json ?: "")
  }
}

class LinkExitMetadataStatusAdapter : JsonSerializer<LinkExitMetadataStatus>,
  JsonDeserializer<LinkExitMetadataStatus> {

  override fun deserialize(
    json: JsonElement?,
    typeOfT: Type?,
    context: JsonDeserializationContext?
  ): LinkExitMetadataStatus {
    if (json == null) {
      return LinkExitMetadataStatus.UNKNOWN(
        ""
      )
    }
    return try {
      LinkExitMetadataStatus.fromString(json.asString) ?: LinkExitMetadataStatus.UNKNOWN("")
    } catch (e: Exception) {
      LinkExitMetadataStatus.UNKNOWN("")
    }
  }

  override fun serialize(
    src: LinkExitMetadataStatus?,
    typeOfSrc: Type?,
    context: JsonSerializationContext?
  ): JsonElement {
    return JsonPrimitive(src?.jsonValue ?: "")
  }
}
