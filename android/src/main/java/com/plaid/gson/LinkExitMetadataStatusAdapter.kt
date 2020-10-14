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
