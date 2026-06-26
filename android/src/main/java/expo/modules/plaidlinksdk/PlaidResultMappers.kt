package expo.modules.plaidlinksdk

import com.plaid.link.event.LinkEvent
import com.plaid.link.event.LinkEventMetadata
import com.plaid.link.result.LinkAccount
import com.plaid.link.result.LinkError
import com.plaid.link.result.LinkExit
import com.plaid.link.result.LinkExitMetadata
import com.plaid.link.result.LinkInstitution
import com.plaid.link.result.LinkSuccess
import com.plaid.link.result.LinkSuccessMetadata

internal fun LinkSuccess.toWritableMap(): Map<String, Any> = successPayload(
  publicToken = publicToken,
  metadata = metadata.toWritableMap(),
)

internal fun LinkSuccessMetadata.toWritableMap(): Map<String, Any> = successMetadataPayload(
  linkSessionId = linkSessionId,
  institution = institution?.toWritableMap() ?: "",
  accounts = accounts.map { it.toWritableMap() },
  metadataJson = metadataJson.orEmpty(),
)

internal fun LinkExit.toWritableMap(): Map<String, Any> = exitPayload(
  error = error?.toWritableMap() ?: emptyMap<String, Any>(),
  metadata = metadata.toWritableMap(),
)

internal fun LinkExitMetadata.toWritableMap(): Map<String, Any> = exitMetadataPayload(
  status = status?.jsonValue.orEmpty(),
  institution = institution?.toWritableMap() ?: "",
  requestId = requestId.orEmpty(),
  linkSessionId = linkSessionId.orEmpty(),
  metadataJson = metadataJson.orEmpty(),
)

internal fun LinkError.toWritableMap(): Map<String, Any> = errorPayload(
  errorType = errorCode.errorType.json,
  errorCode = errorCode.json,
  errorMessage = errorMessage,
  displayMessage = displayMessage.orEmpty(),
  errorJson = errorJson.orEmpty(),
)

internal fun LinkEvent.toWritableMap(): Map<String, Any> = eventPayload(
  eventName = eventName.json,
  metadata = metadata.toWritableMap(),
)

internal fun LinkEventMetadata.toWritableMap(): Map<String, Any> = eventMetadataPayload(
  errorType = errorType.orEmpty(),
  errorCode = errorCode.orEmpty(),
  errorMessage = errorMessage.orEmpty(),
  exitStatus = exitStatus.orEmpty(),
  institutionId = institutionId.orEmpty(),
  institutionName = institutionName.orEmpty(),
  institutionSearchQuery = institutionSearchQuery.orEmpty(),
  accountNumberMask = accountNumberMask.orEmpty(),
  isUpdateMode = isUpdateMode.orEmpty(),
  matchReason = matchReason.orEmpty(),
  routingNumber = routingNumber.orEmpty(),
  selection = selection.orEmpty(),
  linkSessionId = linkSessionId,
  mfaType = mfaType.orEmpty(),
  requestId = requestId.orEmpty(),
  issueId = issueId.orEmpty(),
  issueDescription = issueDescription.orEmpty(),
  issueDetectedAt = issueDetectedAt.orEmpty(),
  timestamp = timestamp,
  viewName = viewName?.jsonValue.orEmpty(),
  metadataJson = metadataJson.orEmpty(),
)

internal fun LinkInstitution.toWritableMap(): Map<String, Any> = institutionPayload(
  name = name,
  id = id,
)

internal fun LinkAccount.toWritableMap(): Map<String, Any> = accountPayload(
  id = id,
  name = name.orEmpty(),
  mask = mask.orEmpty(),
  subtype = subtype.json,
  type = subtype.accountType.json,
  verificationStatus = verificationStatus?.json.orEmpty(),
)

internal fun successPayload(publicToken: String, metadata: Map<String, Any>): Map<String, Any> = mapOf(
  "publicToken" to publicToken,
  "metadata" to metadata,
)

internal fun successMetadataPayload(
  linkSessionId: String,
  institution: Any,
  accounts: List<Map<String, Any>>,
  metadataJson: String,
): Map<String, Any> = mapOf(
  "linkSessionId" to linkSessionId,
  "institution" to institution,
  "accounts" to accounts,
  "metadataJson" to metadataJson,
)

internal fun exitPayload(error: Map<String, Any>, metadata: Map<String, Any>): Map<String, Any> = mapOf(
  "error" to error,
  "metadata" to metadata,
)

internal fun exitMetadataPayload(
  status: String,
  institution: Any,
  requestId: String,
  linkSessionId: String,
  metadataJson: String,
): Map<String, Any> = mapOf(
  "status" to status,
  "institution" to institution,
  "requestId" to requestId,
  "linkSessionId" to linkSessionId,
  "metadataJson" to metadataJson,
)

internal fun errorPayload(
  errorType: String,
  errorCode: String,
  errorMessage: String,
  displayMessage: String,
  errorJson: String,
): Map<String, Any> = mapOf(
  "errorType" to errorType,
  "errorCode" to errorCode,
  "errorMessage" to errorMessage,
  "displayMessage" to displayMessage,
  "errorJson" to errorJson,
)

internal fun eventPayload(eventName: String, metadata: Map<String, Any>): Map<String, Any> = mapOf(
  "eventName" to eventName,
  "metadata" to metadata,
)

internal fun eventMetadataPayload(
  errorType: String,
  errorCode: String,
  errorMessage: String,
  exitStatus: String,
  institutionId: String,
  institutionName: String,
  institutionSearchQuery: String,
  accountNumberMask: String,
  isUpdateMode: String,
  matchReason: String,
  routingNumber: String,
  selection: String,
  linkSessionId: String,
  mfaType: String,
  requestId: String,
  issueId: String,
  issueDescription: String,
  issueDetectedAt: String,
  timestamp: String,
  viewName: String,
  metadataJson: String,
): Map<String, Any> = mapOf(
  "errorType" to errorType,
  "errorCode" to errorCode,
  "errorMessage" to errorMessage,
  "exitStatus" to exitStatus,
  "institutionId" to institutionId,
  "institutionName" to institutionName,
  "institutionSearchQuery" to institutionSearchQuery,
  "accountNumberMask" to accountNumberMask,
  "isUpdateMode" to isUpdateMode,
  "matchReason" to matchReason,
  "routingNumber" to routingNumber,
  "selection" to selection,
  "linkSessionId" to linkSessionId,
  "mfaType" to mfaType,
  "requestId" to requestId,
  "issueId" to issueId,
  "issueDescription" to issueDescription,
  "issueDetectedAt" to issueDetectedAt,
  "timestamp" to timestamp,
  "viewName" to viewName,
  "metadataJson" to metadataJson,
)

internal fun institutionPayload(name: String, id: String): Map<String, Any> = mapOf(
  "name" to name,
  "id" to id,
)

internal fun accountPayload(
  id: String,
  name: String,
  mask: String,
  subtype: String,
  type: String,
  verificationStatus: String,
): Map<String, Any> = mapOf(
  "id" to id,
  "name" to name,
  "mask" to mask,
  "subtype" to subtype,
  "type" to type,
  "verificationStatus" to verificationStatus,
)

internal fun emptyExitMetadata(): Map<String, Any> = exitMetadataPayload(
  linkSessionId = "",
  institution = "",
  status = "",
  requestId = "",
  metadataJson = "",
)
