package expo.modules.plaidlinksdk

import com.plaid.link.event.LinkEventName
import com.plaid.link.event.LinkEventViewName
import java.io.File
import org.junit.Assert.assertEquals
import org.junit.Assert.assertTrue
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

    assertEquals(setOf("publicToken", "metadata"), map.keys)
    assertEquals(successMetadataKeys, metadata.keys)
    assertEquals(institutionKeys, institution.keys)
    assertEquals(accountKeys, account.keys)
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

    assertEquals(setOf("error", "metadata"), map.keys)
    assertEquals(errorKeys, error.keys)
    assertEquals(exitMetadataKeys, metadata.keys)
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

    assertEquals(setOf("eventName", "metadata"), map.keys)
    assertEquals(eventMetadataKeys, metadata.keys)
    assertEquals("TRANSITION_VIEW", map["eventName"])
    assertEquals("session-id", metadata["linkSessionId"])
    assertEquals("CREDENTIAL", metadata["viewName"])
    assertEquals("{\"event\":true}", metadata["metadataJson"])
    assertEquals("1234", metadata["accountNumberMask"])
  }

  @Test
  fun mapsAccountPayload() {
    val map = checkingAccountPayload()

    assertEquals(accountKeys, map.keys)
    assertEquals("account-id", map["id"])
    assertEquals("Plaid Checking", map["name"])
    assertEquals("0000", map["mask"])
    assertEquals("checking", map["subtype"])
    assertEquals("depository", map["type"])
    assertEquals("automatically_verified", map["verificationStatus"])
  }

  @Test
  fun reactNativeEventEnumIncludesAndroidSdkEventNames() {
    val rnEvents = reactNativeEnumValues("eventNames")
    val androidEvents = linkEventNameValues()

    assertTrue(
      "RN LinkEventName is missing Android SDK values: ${androidEvents - rnEvents}",
      rnEvents.containsAll(androidEvents),
    )
  }

  @Test
  fun reactNativeViewEnumIncludesAndroidSdkViewNames() {
    val rnViews = reactNativeEnumValues("viewNames")
    val androidViews = linkEventViewNameValues()

    assertTrue(
      "RN LinkEventViewName is missing Android SDK values: ${androidViews - rnViews}",
      rnViews.containsAll(androidViews),
    )
  }

  private fun checkingAccountPayload(): Map<String, Any> = accountPayload(
    id = "account-id",
    name = "Plaid Checking",
    mask = "0000",
    subtype = "checking",
    type = "depository",
    verificationStatus = "automatically_verified",
  )

  private fun linkEventNameValues(): Set<String> = sealedSingletonNames(LinkEventName::class.java)

  private fun linkEventViewNameValues(): Set<String> = sealedSingletonNames(LinkEventViewName::class.java)

  private fun sealedSingletonNames(baseClass: Class<*>): Set<String> =
    baseClass.declaredClasses
      .filter { baseClass.isAssignableFrom(it) }
      .filterNot { it.simpleName == "UNKNOWN" }
      .map { it.simpleName }
      .toSet()

  private fun reactNativeEnumValues(key: String): Set<String> {
    val repoRoot = findRepoRoot()
    val process = ProcessBuilder("node", "scripts/extract-rn-enums.js", "--json")
      .directory(repoRoot)
      .redirectErrorStream(true)
      .start()
    val output = process.inputStream.bufferedReader().readText()
    val exitCode = process.waitFor()
    check(exitCode == 0) {
      "Failed to extract RN enum values with exit code $exitCode:\n$output"
    }

    val arrayMatch = Regex("\"$key\"\\s*:\\s*\\[(.*?)]").find(output)
      ?: error("Could not find $key in RN enum output:\n$output")
    return Regex("\"([^\"]+)\"")
      .findAll(arrayMatch.groupValues[1])
      .map { it.groupValues[1] }
      .toSet()
  }

  private fun findRepoRoot(): File {
    var current = File(System.getProperty("user.dir")).absoluteFile
    while (true) {
      if (File(current, "scripts/extract-rn-enums.js").exists()) {
        return current
      }
      current = current.parentFile ?: error("Could not find repository root")
    }
  }

  private companion object {
    val successMetadataKeys = setOf("linkSessionId", "institution", "accounts", "metadataJson")
    val exitMetadataKeys = setOf("status", "institution", "requestId", "linkSessionId", "metadataJson")
    val errorKeys = setOf("errorType", "errorCode", "errorMessage", "displayMessage", "errorJson")
    val eventMetadataKeys = setOf(
      "errorType",
      "errorCode",
      "errorMessage",
      "exitStatus",
      "institutionId",
      "institutionName",
      "institutionSearchQuery",
      "accountNumberMask",
      "isUpdateMode",
      "matchReason",
      "routingNumber",
      "selection",
      "linkSessionId",
      "mfaType",
      "requestId",
      "issueId",
      "issueDescription",
      "issueDetectedAt",
      "timestamp",
      "viewName",
      "metadataJson",
    )
    val institutionKeys = setOf("name", "id")
    val accountKeys = setOf("id", "name", "mask", "subtype", "type", "verificationStatus")
  }
}
