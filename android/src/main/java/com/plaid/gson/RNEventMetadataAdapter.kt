package com.plaid.gson

import com.google.gson.JsonDeserializationContext
import com.google.gson.JsonDeserializer
import com.google.gson.JsonElement
import com.google.gson.JsonObject
import com.google.gson.JsonPrimitive
import com.google.gson.JsonSerializationContext
import com.google.gson.JsonSerializer
import com.plaid.link.event.LinkEventMetadata
import java.lang.reflect.Type

class RNEventMetadataAdapter : JsonSerializer<LinkEventMetadata> {

  override fun serialize(
    src: LinkEventMetadata?,
    typeOfSrc: Type?,
    context: JsonSerializationContext?
  ): JsonElement {
    if (src == null) {
      return JsonObject()
    }
    val obj = JsonObject().apply {
      addProperty("errorType", src.errorType)
      addProperty("errorCode", src.errorCode)
      addProperty("errorMessage", src.errorMessage)
      addProperty("exitStatus", src.exitStatus)
      addProperty("institutionId", src.institutionId)
      addProperty("institutionName", src.institutionName)
      addProperty("institutionSearchQuery", src.institutionSearchQuery)
      addProperty("accountNumberMask", src.accountNumberMask)
      addProperty("isUpdateMode", src.isUpdateMode)
      addProperty("matchReason", src.matchReason)
      addProperty("routingNumber", src.routingNumber)
      addProperty("selection", src.selection)
      addProperty("linkSessionId", src.linkSessionId)
      addProperty("mfaType", src.mfaType)
      addProperty("requestId", src.requestId)
      addProperty("timestamp", src.timestamp)
      addProperty("viewName", src.viewName?.jsonValue ?: "")
      addProperty("metadata_json", src.metadataJson)
    }
    return obj
  }
}