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

class LinkEventNameAdapter : JsonSerializer<LinkEventName>,
  JsonDeserializer<LinkEventName> {

  private val map by lazy {
    mapOf(
      LinkEventName.CLOSE_OAUTH.json to LinkEventName.CLOSE_OAUTH,
      LinkEventName.ERROR.json to LinkEventName.ERROR,
      LinkEventName.EXIT.json to LinkEventName.EXIT,
      LinkEventName.FAIL_OAUTH.json to LinkEventName.FAIL_OAUTH,
      LinkEventName.HANDOFF.json to LinkEventName.HANDOFF,
      LinkEventName.OPEN.json to LinkEventName.OPEN,
      LinkEventName.OPEN_MY_PLAID.json to LinkEventName.OPEN_MY_PLAID,
      LinkEventName.OPEN_OAUTH.json to LinkEventName.OPEN_OAUTH,
      LinkEventName.SEARCH_INSTITUTION.json to LinkEventName.SEARCH_INSTITUTION,
      LinkEventName.SELECT_INSTITUTION.json to LinkEventName.SELECT_INSTITUTION,
      LinkEventName.SUBMIT_CREDENTIALS.json to LinkEventName.SUBMIT_CREDENTIALS,
      LinkEventName.SUBMIT_MFA.json to LinkEventName.SUBMIT_MFA,
      LinkEventName.TRANSITION_VIEW.json to LinkEventName.TRANSITION_VIEW
    )
  }

  override fun deserialize(
    json: JsonElement?,
    typeOfT: Type?,
    context: JsonDeserializationContext?
  ): LinkEventName {

    return if (json == null) {
      LinkEventName.UNKNOWN("")
    } else {
      val eventName = json.asString
      map[eventName] ?: LinkEventName.UNKNOWN(eventName)
    }
  }

  override fun serialize(
    src: LinkEventName?,
    typeOfSrc: Type?,
    context: JsonSerializationContext?
  ): JsonElement {
    return JsonPrimitive(src?.json ?: "")
  }
}