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