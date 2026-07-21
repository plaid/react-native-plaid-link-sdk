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
import com.plaid.link.result.LinkInstitution
import java.lang.reflect.Type

class RNLinkInstitutionAdapter : JsonSerializer<LinkInstitution> {

  override fun serialize(
    src: LinkInstitution?,
    typeOfSrc: Type?,
    context: JsonSerializationContext?
  ): JsonElement {
    if (src == null) {
      return JsonObject()
    }
    val obj = JsonObject().apply {
      // Replace "institution_id" with "id"
      addProperty("id", src.id)
      // Replace "institution_name" with "id"
      addProperty("name", src.name)
    }
    return obj
  }
}
