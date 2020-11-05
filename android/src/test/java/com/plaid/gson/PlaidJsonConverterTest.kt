package com.plaid.gson

import com.plaid.link.event.LinkEvent
import com.plaid.link.event.LinkEventMetadata
import com.plaid.link.event.LinkEventName
import com.plaid.link.event.LinkEventViewName
import com.plaid.link.result.LinkAccount
import com.plaid.link.result.LinkAccountSubtype
import com.plaid.link.result.LinkAccountVerificationStatus
import com.plaid.link.result.LinkError
import com.plaid.link.result.LinkErrorCode
import com.plaid.link.result.LinkExit
import com.plaid.link.result.LinkExitMetadata
import com.plaid.link.result.LinkExitMetadataStatus
import com.plaid.link.result.LinkInstitution
import com.plaid.link.result.LinkSuccess
import com.plaid.link.result.LinkSuccessMetadata
import io.mockk.every
import io.mockk.mockk
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.DisplayName
import org.junit.jupiter.api.Nested

class PlaidJsonConverterTest {
  companion object {
    const val SUCCESS_JSON = """{"publicToken":"4","metadata":{"institution":{"id":"2","name":"Chase"},"accounts":[{"id":"1","name":"My Checking","mask":"1234","verificationStatus":"manually_verified","type":"depository","subtype":"checking"}],"linkSessionId":"3","metadataJson":"{\"json\":\"test\"}"}}"""
    const val EXIT_ERROR_JSON = """{"error":{"errorCode":"INTERNAL_SERVER_ERROR","errorType":"API_ERROR","errorDisplayMessage":"2","errorJson":"{\"json\":\"error json\"}"},"metadata":{"status":"requires_code","institution":{"id":"2","name":"Chase"},"linkSessionId":"3","requestId":"3","metadataJson":"{\"json\":\"test\"}"}}"""
    const val EVENT_ERROR_JSON = """{"eventName":"ERROR","metadata":{"linkSessionId":"8","mfaType":"9","requestId":"10","viewName":"ERROR","errorCode":"1","errorMessage":"3","errorType":"2","exitStatus":"4","institutionId":"5","institutionName":"6","institutionSearchQuery":"7","timestamp":"11"}}"""
  }

  lateinit var plaidJsonConverter: PlaidJsonConverter

  @BeforeEach
  fun setup() {
    plaidJsonConverter = PlaidJsonConverter()
  }

  @Nested
  @DisplayName("Link Success")
  inner class Success {
    @Test
    fun convert_whenSuccess_formatsData() {
      val linkAccount = mockk<LinkAccount>()
      every { linkAccount.id } returns "1"
      every { linkAccount.mask } returns "1234"
      every { linkAccount.name } returns "My Checking"
      every { linkAccount.subtype } returns LinkAccountSubtype.DEPOSITORY.CHECKING
      every { linkAccount.verificationStatus } returns LinkAccountVerificationStatus.MANUALLY_VERIFIED

      val linkInstitution = mockk<LinkInstitution>()
      every { linkInstitution.id } returns "2"
      every { linkInstitution.name } returns "Chase"

      val successMetadata = mockk<LinkSuccessMetadata>()
      every { successMetadata.accounts } returns listOf(linkAccount)
      every { successMetadata.institution } returns linkInstitution
      every { successMetadata.linkSessionId } returns "3"
      every { successMetadata.metadataJson } returns """{"json":"test"}"""

      val success = mockk<LinkSuccess>()
      every { success.publicToken } returns "4"
      every { success.metadata } returns successMetadata

      assertThat(plaidJsonConverter.convert(success)).isEqualTo(SUCCESS_JSON)
    }
  }

  @Nested
  @DisplayName("Link Exit")
  inner class Exit {
    @Test
    fun convert_whenExitWithError_formatsData() {
      val linkError = mockk<LinkError>()
      every { linkError.displayMessage } returns "2"
      every { linkError.errorCode } returns LinkErrorCode.ApiError.INTERNAL_SERVER_ERROR
      every { linkError.errorMessage } returns "message"
      every { linkError.errorJson } returns """{"json":"error json"}"""

      val linkInstitution = mockk<LinkInstitution>()
      every { linkInstitution.id } returns "2"
      every { linkInstitution.name } returns "Chase"

      val exitMetadata = mockk<LinkExitMetadata>()
      every { exitMetadata.requestId } returns "3"
      every { exitMetadata.institution } returns linkInstitution
      every { exitMetadata.linkSessionId } returns "3"
      every { exitMetadata.status } returns LinkExitMetadataStatus.REQUIRES_CODE
      every { exitMetadata.metadataJson } returns """{"json":"test"}"""

      val exit = mockk<LinkExit>()
      every { exit.error } returns linkError
      every { exit.metadata } returns exitMetadata

      assertThat(plaidJsonConverter.convert(exit)).isEqualTo(EXIT_ERROR_JSON)
    }
  }

  @Nested
  @DisplayName("Link Exit")
  inner class Event {
    @Test
    fun convert_whenEventWithError_formatsData() {
      val eventMetadata = mockk<LinkEventMetadata>()
      every { eventMetadata.errorCode } returns "1"
      every { eventMetadata.errorType } returns "2"
      every { eventMetadata.errorMessage } returns "3"
      every { eventMetadata.exitStatus } returns "4"
      every { eventMetadata.institutionId } returns "5"
      every { eventMetadata.institutionName } returns "6"
      every { eventMetadata.institutionSearchQuery } returns "7"
      every { eventMetadata.linkSessionId } returns "8"
      every { eventMetadata.mfaType } returns "9"
      every { eventMetadata.requestId } returns "10"
      every { eventMetadata.timestamp } returns "11"
      every { eventMetadata.viewName } returns LinkEventViewName.ERROR
      every { eventMetadata.metadataJson } returns """{"json":"test"}"""

      val event = mockk<LinkEvent>()
      every { event.eventName } returns LinkEventName.ERROR
      every { event.metadata } returns eventMetadata

      assertThat(plaidJsonConverter.convert(event)).isEqualTo(EVENT_ERROR_JSON)
    }
  }
}
