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
