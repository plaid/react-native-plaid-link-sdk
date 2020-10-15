/*
 * Copyright (c) 2020 Plaid Technologies, Inc. <support@plaid.com>
 */
package com.plaid.gson

import com.google.gson.FieldNamingPolicy
import com.google.gson.Gson
import com.google.gson.GsonBuilder
import com.plaid.gson.RNAccountAdapter
import com.plaid.link.configuration.LinkLogLevel
import com.plaid.link.configuration.LinkPublicKeyConfiguration
import com.plaid.link.configuration.LinkTokenConfiguration
import com.plaid.link.configuration.PlaidEnvironment
import com.plaid.link.configuration.PlaidProduct
import com.plaid.link.event.LinkEvent
import com.plaid.link.event.LinkEventName
import com.plaid.link.event.LinkEventViewName
import com.plaid.link.result.LinkAccount
import com.plaid.link.result.LinkAccountSubtype
import com.plaid.link.result.LinkAccountType
import com.plaid.link.result.LinkAccountVerificationStatus
import com.plaid.link.result.LinkErrorCode
import com.plaid.link.result.LinkErrorType
import com.plaid.link.result.LinkExitMetadataStatus
import com.plaid.link.result.LinkExit
import com.plaid.link.result.LinkSuccess
import com.plaid.internal.networking.adapter.AccountSubtypeAdapter
import com.plaid.internal.networking.adapter.AccountTypeAdapter
import com.plaid.internal.networking.adapter.LinkAccountVerificationStatusAdapter
import com.plaid.internal.networking.adapter.LinkEventNameAdapter
import com.plaid.internal.networking.adapter.LinkEventViewNameAdapter
import com.plaid.internal.networking.adapter.LinkExitMetadataStatusAdapter
import com.plaid.internal.networking.adapter.PlaidErrorCodeAdapter
import com.plaid.internal.networking.adapter.PlaidErrorTypeAdapter

class PlaidJsonConverter {

 private val snakeCaseGson: Gson by lazy {
    GsonBuilder().apply {
      setFieldNamingPolicy(FieldNamingPolicy.LOWER_CASE_WITH_UNDERSCORES)
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

  fun convert(linkSuccess: LinkSuccess) : String {
    return snakeCaseGson.toJson(linkSuccess)

  }

  fun convert(linkExit: LinkExit) : String {
    return snakeCaseGson.toJson(linkExit)

  }

  fun convert(linkEvent: LinkEvent) : String {
    return snakeCaseGson.toJson(linkEvent).replace("event_name", "event")
  }
}