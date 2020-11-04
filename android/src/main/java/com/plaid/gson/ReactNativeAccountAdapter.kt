/*
 * Copyright (c) 2020 Plaid Technologies, Inc. <support@plaid.com>
 */
package com.plaid.gson

import com.google.gson.JsonElement
import com.google.gson.JsonObject
import com.google.gson.JsonSerializationContext
import com.google.gson.JsonSerializer
import com.plaid.link.result.LinkAccount
import java.lang.reflect.Type

internal class ReactNativeAccountAdapter : JsonSerializer<LinkAccount> {

  override fun serialize(
    src: LinkAccount?,
    typeOfSrc: Type?,
    context: JsonSerializationContext?
  ): JsonElement {
    if (src == null) {
      return JsonObject()
    }
    return JsonObject().apply {
      addProperty("id", src.id)
      addPropertyIfNotNull("name", src.name)
      addPropertyIfNotNull("mask", src.mask)
      addPropertyIfNotNull("verificationStatus", src.verificationStatus?.json)

      // Special handling around account subtype
      val subtype = context?.serialize(src.subtype)?.asJsonObject
      subtype?.let {
        addProperty("type", it.get("accountType").asString)
        addProperty("subtype", it.get("json").asString)
      }
    }
  }
}
