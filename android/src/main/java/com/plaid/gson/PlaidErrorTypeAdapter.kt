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