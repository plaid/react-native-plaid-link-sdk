package com.plaid.gson

import com.google.gson.JsonElement
import com.google.gson.JsonObject
import com.google.gson.JsonSerializationContext
import com.google.gson.JsonSerializer
import com.plaid.link.result.LinkError
import java.lang.reflect.Type

class ReactNativeLinkErrorTypeAdapter : JsonSerializer<LinkError> {
  override fun serialize(src: LinkError?, typeOfSrc: Type?, context: JsonSerializationContext?): JsonElement {
    if (src == null) {
      return JsonObject()
    }

    return JsonObject().apply {
      val error = context?.serialize(src.errorCode)?.asJsonObject
      error?.let {
        addProperty("errorCode", it.get("json").asString)
        addProperty("errorType", it.get("errorType").asString)
      }
      addPropertyIfNotNull("errorDisplayMessage", src.displayMessage)
      addPropertyIfNotNull("errorJson", src.errorJson)
    }
  }
}
