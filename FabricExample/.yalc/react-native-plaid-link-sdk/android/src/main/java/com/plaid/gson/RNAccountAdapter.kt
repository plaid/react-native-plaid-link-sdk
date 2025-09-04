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
import com.plaid.link.result.LinkAccount
import java.lang.reflect.Type

class RNAccountAdapter : JsonSerializer<LinkAccount> {

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
      src.mask?.let {
        addProperty("mask", it)
      }
      src.verificationStatus?.let { status ->
        context?.serialize(status)?.asJsonObject?.let {
          addProperty("verification_status", it.get("json").asString)
          addProperty("verificationStatus", it.get("json").asString)
        }
      }

      // Special handling around account subtype
      val subtype = context?.serialize(src.subtype)?.asJsonObject
      subtype?.let {
        addProperty("type", it.get("accountType")?.asString)
        addProperty("subtype", it.get("json")?.asString)
      }
    }
    return obj
  }
}
