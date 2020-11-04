package com.plaid.gson

import com.google.gson.JsonElement
import com.google.gson.JsonObject
import com.google.gson.JsonSerializationContext
import com.google.gson.JsonSerializer
import com.plaid.link.result.LinkError
import com.plaid.link.result.LinkInstitution
import java.lang.reflect.Type

class ReactNativeInstitutionAdapter : JsonSerializer<LinkInstitution> {
  override fun serialize(src: LinkInstitution?, typeOfSrc: Type?, context: JsonSerializationContext?): JsonElement {
    if (src == null) {
      return JsonObject()
    }

    return JsonObject().apply {
      addProperty("id", src.id)
      addProperty("name", src.name)
    }
  }
}
