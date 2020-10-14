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