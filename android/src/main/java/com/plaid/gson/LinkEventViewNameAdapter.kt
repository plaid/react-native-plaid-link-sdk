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
