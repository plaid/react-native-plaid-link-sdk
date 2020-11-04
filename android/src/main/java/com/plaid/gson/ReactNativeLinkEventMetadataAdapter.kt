package com.plaid.gson

import com.google.gson.JsonElement
import com.google.gson.JsonObject
import com.google.gson.JsonSerializationContext
import com.google.gson.JsonSerializer
import com.plaid.link.event.LinkEventMetadata
import java.lang.reflect.Type

class ReactNativeLinkEventMetadataAdapter : JsonSerializer<LinkEventMetadata> {
  override fun serialize(src: LinkEventMetadata?, typeOfSrc: Type?, context: JsonSerializationContext?): JsonElement {
    if (src == null) {
      return JsonObject()
    }

    return JsonObject().apply {
      addProperty("linkSessionId", src.linkSessionId)
      addPropertyIfNotNull("mfaType", src.mfaType)
      addPropertyIfNotNull("requestId", src.requestId)
      addPropertyIfNotNull("viewName", src.viewName?.jsonValue)
      addPropertyIfNotNull("errorCode", src.errorCode)
      addPropertyIfNotNull("errorMessage", src.errorMessage)
      addPropertyIfNotNull("errorType", src.errorType)
      addPropertyIfNotNull("exitStatus", src.exitStatus)
      addPropertyIfNotNull("institutionId", src.institutionId)
      addPropertyIfNotNull("institutionName", src.institutionName)
      addPropertyIfNotNull("institutionSearchQuery", src.institutionSearchQuery)
      addProperty("timestamp", src.timestamp)
    }
  }
}
