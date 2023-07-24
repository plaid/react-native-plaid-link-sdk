import Foundation

final class TestTokenLoader {

  static func loadToken(
    clientID: String,
    secret: String
  ) async throws -> String {

    let rawJSON = """
    {
        "user": {
            "client_user_id": "react-native-ci-user-id"
        },
        "client_name": "Plaid React Native iOS Test App",
        "products": ["auth", "transactions"],
        "country_codes": ["US"],
        "language": "en",
        "client_id": "\(clientID)",
        "secret": "\(secret)"
    }
    """

    let request = try makeRequest(rawJSON: rawJSON)
    let (data, _) = try await URLSession.shared.data(for: request)

    print(data.prettyJson)

    do {
      let token = try JSONDecoder().decode(LinkTokenCreateResponse.self, from: data)
      return token.linkToken
    } catch let tokenDecodingError {
      if let apiError = try? JSONDecoder().decode(LinkTokenCreateErrorResponse.self, from: data) {
        print("Error fetching token: \(apiError)")
        throw apiError
      } else {
        throw tokenDecodingError
      }
    }
  }

  static func makeRequest(rawJSON: String) throws -> URLRequest {
    guard let url = URL(string: "https://sandbox.plaid.com/link/token/create") else {
      throw NSError(
        domain: "",
        code: 500,
        userInfo: [NSLocalizedDescriptionKey: "Failed to construct URL."]
      )
    }

    guard let data = rawJSON.data(using: .utf8) else {
      throw NSError(
        domain: "",
        code: 500,
        userInfo: [NSLocalizedDescriptionKey: "Failed to convert JSON string to data."]
      )
    }

    var request = URLRequest(url: url)
    request.httpBody = data
    request.httpMethod = "POST"
    request.setValue("application/json", forHTTPHeaderField: "Content-Type")
    request.setValue("application/json", forHTTPHeaderField: "Accept")
    request.setValue("application/json", forHTTPHeaderField: "Accept")

    return request
  }
}

// MARK: - LinkTokenCreateResponse

fileprivate struct LinkTokenCreateResponse: Decodable, Equatable {

   init(from decoder: Decoder) throws {
      let container = try decoder.container(keyedBy: CodingKeys.self)
      self.linkToken = try container.decode(String.self, forKey: .linkToken)
      self.requestId = try container.decode(String.self, forKey: .requestId)

      let expirationString = try container.decode(String.self, forKey: .expiration)

      self.expiration = ISO8601DateFormatter().date(from: expirationString) ?? Date()
  }

  let linkToken: String
  let expiration: Date
  let requestId: String

  enum CodingKeys: String, CodingKey {
    case linkToken = "link_token"
    case expiration
    case requestId = "request_id"
  }
}

// MARK: - LinkTokenCreateErrorResponse

fileprivate struct LinkTokenCreateErrorResponse: Decodable, LocalizedError, CustomStringConvertible {

   let displayMessage: String?
   let documentationUrl: String
   let errorCode: String
   let errorMessage: String
   let errorType: String
   let requestId: String
   let suggestedAction: String?

  var description: String {
    """
    display_message: \(String(describing: displayMessage)),
    error_code: \(errorCode),
    error_message: \(errorMessage),
    error_type: \(errorType),
    request_id: \(requestId),
    suggested_action: \(String(describing: suggestedAction))
    """
  }

  var errorDescription: String? { description }

  enum CodingKeys: String, CodingKey {
    case displayMessage = "display_message"
    case documentationUrl = "documentation_url"
    case errorCode = "error_code"
    case errorMessage = "error_message"
    case errorType = "error_type"
    case requestId = "request_id"
    case suggestedAction = "suggested_action"
  }
}

// MARK: Data Extension

extension Data {

    /// Helper method to pretty print JSON data.
    fileprivate var prettyJson: String {
        guard let object = try? JSONSerialization.jsonObject(with: self, options: []),
            let data = try? JSONSerialization.data(withJSONObject: object, options: [.prettyPrinted]),
            let prettyPrintedString = String(data: data, encoding: .utf8)
        else { return "nil" }

        return prettyPrintedString
    }
}
