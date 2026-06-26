package expo.modules.plaidlinksdk

import org.junit.Assert.assertEquals
import org.junit.Test

class PlaidResultMappersTest {
  @Test
  fun mapsSuccessPayload() {
    val institution = institutionPayload("First Platypus Bank", "ins_109508")
    val account = checkingAccountPayload()
    val metadata = successMetadataPayload(
      linkSessionId = "session-id",
      institution = institution,
      accounts = listOf(account),
      metadataJson = "{\"accounts\":[]}",
    )
    val map = successPayload("public-sandbox-token", metadata)

    assertEquals("public-sandbox-token", map["publicToken"])
    assertEquals("session-id", metadata["linkSessionId"])
    assertEquals("First Platypus Bank", institution["name"])
    assertEquals("ins_109508", institution["id"])
    assertEquals(account, (metadata["accounts"] as List<*>).first())
    assertEquals("{\"accounts\":[]}", metadata["metadataJson"])
  }

  @Test
  fun mapsExitPayload() {
    val error = errorPayload(
      errorType = "INVALID_INPUT",
      errorCode = "INVALID_LINK_TOKEN",
      errorMessage = "Invalid token",
      displayMessage = "Try again",
      errorJson = "{\"error_code\":\"INVALID_LINK_TOKEN\"}",
    )
    val metadata = exitMetadataPayload(
      status = "requires_account_selection",
      institution = institutionPayload("First Platypus Bank", "ins_109508"),
      requestId = "request-id",
      linkSessionId = "session-id",
      metadataJson = "{\"status\":\"requires_account_selection\"}",
    )
    val map = exitPayload(error, metadata)

    assertEquals("INVALID_LINK_TOKEN", error["errorCode"])
    assertEquals("Invalid token", error["errorMessage"])
    assertEquals("requires_account_selection", metadata["status"])
    assertEquals("request-id", metadata["requestId"])
    assertEquals("session-id", metadata["linkSessionId"])
    assertEquals(error, map["error"])
    assertEquals(metadata, map["metadata"])
  }

  @Test
  fun mapsEventPayload() {
    val metadata = eventMetadataPayload(
      errorType = "INVALID_INPUT",
      errorCode = "ERROR_CODE",
      errorMessage = "Something happened",
      exitStatus = "requires_credentials",
      institutionId = "ins_109508",
      institutionName = "First Platypus Bank",
      institutionSearchQuery = "first",
      accountNumberMask = "1234",
      isUpdateMode = "false",
      matchReason = "manual_select",
      routingNumber = "021000021",
      selection = "checking",
      linkSessionId = "session-id",
      mfaType = "sms",
      requestId = "request-id",
      issueId = "issue-id",
      issueDescription = "issue-description",
      issueDetectedAt = "2026-06-25T00:00:00Z",
      timestamp = "2026-06-25T01:00:00Z",
      viewName = "CREDENTIAL",
      metadataJson = "{\"event\":true}",
    )
    val map = eventPayload("TRANSITION_VIEW", metadata)

    assertEquals("TRANSITION_VIEW", map["eventName"])
    assertEquals("session-id", metadata["linkSessionId"])
    assertEquals("CREDENTIAL", metadata["viewName"])
    assertEquals("{\"event\":true}", metadata["metadataJson"])
    assertEquals("1234", metadata["accountNumberMask"])
  }

  @Test
  fun mapsAccountPayload() {
    val map = checkingAccountPayload()

    assertEquals("account-id", map["id"])
    assertEquals("Plaid Checking", map["name"])
    assertEquals("0000", map["mask"])
    assertEquals("checking", map["subtype"])
    assertEquals("depository", map["type"])
    assertEquals("automatically_verified", map["verificationStatus"])
  }

  private fun checkingAccountPayload(): Map<String, Any> = accountPayload(
    id = "account-id",
    name = "Plaid Checking",
    mask = "0000",
    subtype = "checking",
    type = "depository",
    verificationStatus = "automatically_verified",
  )
}
