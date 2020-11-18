/*
 * Copyright (c) 2020 Plaid Technologies, Inc. <support@plaid.com>
 */
package com.plaid.gson

import com.google.gson.Gson
import com.google.gson.GsonBuilder
import com.plaid.internal.networking.adapter.AccountSubtypeAdapter
import com.plaid.internal.networking.adapter.AccountTypeAdapter
import com.plaid.internal.networking.adapter.LinkAccountVerificationStatusAdapter
import com.plaid.internal.networking.adapter.LinkEventNameAdapter
import com.plaid.internal.networking.adapter.LinkEventViewNameAdapter
import com.plaid.internal.networking.adapter.LinkExitMetadataStatusAdapter
import com.plaid.internal.networking.adapter.PlaidErrorCodeAdapter
import com.plaid.internal.networking.adapter.PlaidErrorTypeAdapter
import com.plaid.link.event.LinkEvent
import com.plaid.link.event.LinkEventName
import com.plaid.link.event.LinkEventViewName
import com.plaid.link.result.LinkAccount
import com.plaid.link.result.LinkAccountSubtype
import com.plaid.link.result.LinkAccountType
import com.plaid.link.result.LinkAccountVerificationStatus
import com.plaid.link.result.LinkErrorCode
import com.plaid.link.result.LinkErrorType
import com.plaid.link.result.LinkExit
import com.plaid.link.result.LinkExitMetadataStatus
import com.plaid.link.result.LinkSuccess

class PlaidJsonConverter {

  private val gson: Gson by lazy {
    GsonBuilder().apply {
      this.registerTypeAdapter(
        LinkAccount::class.java,
        RNAccountAdapter()
      )
      this.registerTypeAdapter(
        LinkAccountType::class.java,
        AccountTypeAdapter()
      )
      this.registerTypeAdapter(
        LinkAccountSubtype::class.java,
        AccountSubtypeAdapter()
      )
      this.registerTypeAdapter(
        LinkAccountVerificationStatus::class.java,
        LinkAccountVerificationStatusAdapter()
      )
      this.registerTypeAdapter(
        LinkEventViewName::class.java,
        LinkEventViewNameAdapter()
      )
      this.registerTypeAdapter(
        LinkEventName::class.java,
        LinkEventNameAdapter()
      )
      this.registerTypeAdapter(
        LinkErrorCode::class.java,
        PlaidErrorCodeAdapter()
      )
      this.registerTypeAdapter(
        LinkErrorType::class.java,
        PlaidErrorTypeAdapter()
      )
      this.registerTypeAdapter(
        LinkExitMetadataStatus::class.java,
        LinkExitMetadataStatusAdapter()
      )
    }.create()
  }

  fun convert(linkSuccess: LinkSuccess): String {
    return gson.toJson(linkSuccess)
  }

  fun convert(linkExit: LinkExit): String {
    return gson.toJson(linkExit)

  }

  fun convert(linkEvent: LinkEvent): String {
    return gson.toJson(linkEvent).replace("event_name", "event")
  }
}
