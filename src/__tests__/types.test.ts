import {
  PlaidEnvironment,
  PlaidProduct,
  LinkAccountType,
  LinkAccountSubtypes,
  LinkAccountSubtypeCredit,
  LinkAccountSubtypeDepository,
  LinkAccountSubtypeInvestment,
  LinkAccountSubtypeLoan,
  LinkAccountSubtypeUnknown,
  LinkAccountVerificationStatus,
  LinkExitMetadataStatus,
  LinkErrorCode,
  LinkErrorType,
  LinkEventName,
  LinkIOSPresentationStyle,
} from "../ReactNativePlaidLinkSdk.types";

describe("Type Definitions", () => {
  describe("Enums", () => {
    describe("PlaidEnvironment", () => {
      it("has correct values", () => {
        expect(PlaidEnvironment.PRODUCTION).toBe("production");
        expect(PlaidEnvironment.SANDBOX).toBe("sandbox");
      });
    });

    describe("PlaidProduct", () => {
      it("has correct values", () => {
        expect(PlaidProduct.AUTH).toBe("auth");
        expect(PlaidProduct.TRANSACTIONS).toBe("transactions");
        expect(PlaidProduct.IDENTITY).toBe("identity");
        expect(PlaidProduct.ASSETS).toBe("assets");
        expect(PlaidProduct.INVESTMENTS).toBe("investments");
        expect(PlaidProduct.LIABILITIES).toBe("liabilities");
        expect(PlaidProduct.PAYMENT_INITIATION).toBe("payment_initiation");
        expect(PlaidProduct.DEPOSIT_SWITCH).toBe("deposit_switch");
        expect(PlaidProduct.INCOME).toBe("income");
        expect(PlaidProduct.LIABILITIES_REPORT).toBe("liabilities_report");
      });
    });

    describe("LinkAccountType", () => {
      it("has correct values", () => {
        expect(LinkAccountType.CREDIT).toBe("credit");
        expect(LinkAccountType.DEPOSITORY).toBe("depository");
        expect(LinkAccountType.INVESTMENT).toBe("investment");
        expect(LinkAccountType.LOAN).toBe("loan");
        expect(LinkAccountType.OTHER).toBe("other");
      });
    });

    describe("LinkEventName", () => {
      it("has critical event values", () => {
        expect(LinkEventName.OPEN).toBe("OPEN");
        expect(LinkEventName.EXIT).toBe("EXIT");
        expect(LinkEventName.ERROR).toBe("ERROR");
        expect(LinkEventName.SELECT_INSTITUTION).toBe("SELECT_INSTITUTION");
        expect(LinkEventName.SUBMIT_CREDENTIALS).toBe("SUBMIT_CREDENTIALS");
        expect(LinkEventName.LAYER_READY).toBe("LAYER_READY");
      });
    });

    describe("LinkErrorCode", () => {
      it("has item error codes", () => {
        expect(LinkErrorCode.INVALID_CREDENTIALS).toBe("INVALID_CREDENTIALS");
        expect(LinkErrorCode.ITEM_LOGIN_REQUIRED).toBe("ITEM_LOGIN_REQUIRED");
        expect(LinkErrorCode.NO_ACCOUNTS).toBe("NO_ACCOUNTS");
      });

      it("has institution error codes", () => {
        expect(LinkErrorCode.INSTITUTION_DOWN).toBe("INSTITUTION_DOWN");
        expect(LinkErrorCode.INSTITUTION_NOT_RESPONDING).toBe(
          "INSTITUTION_NOT_RESPONDING",
        );
      });

      it("has API error codes", () => {
        expect(LinkErrorCode.INTERNAL_SERVER_ERROR).toBe(
          "INTERNAL_SERVER_ERROR",
        );
        expect(LinkErrorCode.PLANNED_MAINTENANCE).toBe("PLANNED_MAINTENANCE");
      });
    });

    describe("LinkErrorType", () => {
      it("has correct values", () => {
        expect(LinkErrorType.ITEM_ERROR).toBe("ITEM_ERROR");
        expect(LinkErrorType.INSTITUTION_ERROR).toBe("INSTITUTION_ERROR");
        expect(LinkErrorType.API_ERROR).toBe("API_ERROR");
        expect(LinkErrorType.INVALID_REQUEST).toBe("INVALID_REQUEST");
        expect(LinkErrorType.RATE_LIMIT_EXCEEDED).toBe("RATE_LIMIT_EXCEEDED");
      });
    });

    describe("LinkAccountVerificationStatus", () => {
      it("has correct values", () => {
        expect(
          LinkAccountVerificationStatus.PENDING_AUTOMATIC_VERIFICATION,
        ).toBe("pending_automatic_verification");
        expect(LinkAccountVerificationStatus.PENDING_MANUAL_VERIFICATION).toBe(
          "pending_manual_verification",
        );
        expect(LinkAccountVerificationStatus.MANUALLY_VERIFIED).toBe(
          "manually_verified",
        );
      });
    });

    describe("LinkExitMetadataStatus", () => {
      it("has correct values", () => {
        expect(LinkExitMetadataStatus.CONNECTED).toBe("connected");
        expect(LinkExitMetadataStatus.REQUIRES_CREDENTIALS).toBe(
          "requires_credentials",
        );
        expect(LinkExitMetadataStatus.REQUIRES_CODE).toBe("requires_code");
      });
    });

    describe("LinkIOSPresentationStyle", () => {
      it("has correct values", () => {
        expect(LinkIOSPresentationStyle.FULL_SCREEN).toBe("FULL_SCREEN");
        expect(LinkIOSPresentationStyle.MODAL).toBe("MODAL");
      });
    });
  });

  describe("LinkAccountSubtype Classes", () => {
    describe("LinkAccountSubtypeCredit", () => {
      it("instantiates correctly", () => {
        const creditCard = LinkAccountSubtypeCredit.CREDIT_CARD;
        expect(creditCard.type).toBe(LinkAccountType.CREDIT);
        expect(creditCard.subtype).toBe(LinkAccountSubtypes.CREDIT_CARD);
      });

      it("has ALL subtype", () => {
        const all = LinkAccountSubtypeCredit.ALL;
        expect(all.type).toBe(LinkAccountType.CREDIT);
        expect(all.subtype).toBe(LinkAccountSubtypes.ALL);
      });

      it("has PAYPAL subtype", () => {
        const paypal = LinkAccountSubtypeCredit.PAYPAL;
        expect(paypal.type).toBe(LinkAccountType.CREDIT);
        expect(paypal.subtype).toBe(LinkAccountSubtypes.PAYPAL);
      });
    });

    describe("LinkAccountSubtypeDepository", () => {
      it("instantiates CHECKING correctly", () => {
        const checking = LinkAccountSubtypeDepository.CHECKING;
        expect(checking.type).toBe(LinkAccountType.DEPOSITORY);
        expect(checking.subtype).toBe(LinkAccountSubtypes.CHECKING);
      });

      it("instantiates SAVINGS correctly", () => {
        const savings = LinkAccountSubtypeDepository.SAVINGS;
        expect(savings.type).toBe(LinkAccountType.DEPOSITORY);
        expect(savings.subtype).toBe(LinkAccountSubtypes.SAVINGS);
      });

      it("has multiple subtypes", () => {
        expect(LinkAccountSubtypeDepository.CD).toBeDefined();
        expect(LinkAccountSubtypeDepository.HSA).toBeDefined();
        expect(LinkAccountSubtypeDepository.MONEY_MARKET).toBeDefined();
        expect(LinkAccountSubtypeDepository.PREPAID).toBeDefined();
      });
    });

    describe("LinkAccountSubtypeInvestment", () => {
      it("instantiates IRA correctly", () => {
        const ira = LinkAccountSubtypeInvestment.IRA;
        expect(ira.type).toBe(LinkAccountType.INVESTMENT);
        expect(ira.subtype).toBe(LinkAccountSubtypes.IRA);
      });

      it("has 401k variants", () => {
        const i401k = LinkAccountSubtypeInvestment.INVESTMENT_401K;
        expect(i401k.type).toBe(LinkAccountType.INVESTMENT);
        expect(i401k.subtype).toBe(LinkAccountSubtypes.FOUR_0_1_K);

        const roth401k = LinkAccountSubtypeInvestment.ROTH_401K;
        expect(roth401k.subtype).toBe(LinkAccountSubtypes.ROTH_401K);
      });

      it("has retirement account subtypes", () => {
        expect(LinkAccountSubtypeInvestment.RETIREMENT).toBeDefined();
        expect(LinkAccountSubtypeInvestment.ROTH).toBeDefined();
        expect(LinkAccountSubtypeInvestment.SEP_IRA).toBeDefined();
        expect(LinkAccountSubtypeInvestment.SIMPLE_IRA).toBeDefined();
      });
    });

    describe("LinkAccountSubtypeLoan", () => {
      it("instantiates MORTGAGE correctly", () => {
        const mortgage = LinkAccountSubtypeLoan.MORTGAGE;
        expect(mortgage.type).toBe(LinkAccountType.LOAN);
        expect(mortgage.subtype).toBe(LinkAccountSubtypes.MORTGAGE);
      });

      it("has various loan types", () => {
        expect(LinkAccountSubtypeLoan.AUTO).toBeDefined();
        expect(LinkAccountSubtypeLoan.STUDENT).toBeDefined();
        expect(LinkAccountSubtypeLoan.BUSINESS).toBeDefined();
        expect(LinkAccountSubtypeLoan.HOME_EQUITY).toBeDefined();
      });
    });

    describe("LinkAccountSubtypeUnknown", () => {
      it("handles arbitrary types", () => {
        const unknown = new LinkAccountSubtypeUnknown(
          "custom_type",
          "custom_subtype",
        );
        expect(unknown.type).toBe("custom_type");
        expect(unknown.subtype).toBe("custom_subtype");
      });

      it("can be instantiated with any string values", () => {
        const unknown1 = new LinkAccountSubtypeUnknown("foo", "bar");
        const unknown2 = new LinkAccountSubtypeUnknown("", "");

        expect(unknown1.type).toBe("foo");
        expect(unknown1.subtype).toBe("bar");
        expect(unknown2.type).toBe("");
        expect(unknown2.subtype).toBe("");
      });
    });
  });

  describe("Type Structure Validation", () => {
    it("LinkSuccess has correct structure", () => {
      const linkSuccess = {
        publicToken: "public-token-123",
        metadata: {
          accounts: [
            {
              id: "account-1",
              name: "Checking",
              mask: "1234",
              type: LinkAccountType.DEPOSITORY,
              subtype: LinkAccountSubtypeDepository.CHECKING,
            },
          ],
          linkSessionId: "session-123",
          institution: {
            id: "inst-1",
            name: "Test Bank",
          },
          metadataJson: "{}",
        },
      };

      expect(linkSuccess.publicToken).toBeDefined();
      expect(linkSuccess.metadata.accounts).toBeInstanceOf(Array);
      expect(linkSuccess.metadata.linkSessionId).toBeDefined();
      expect(linkSuccess.metadata.institution?.id).toBeDefined();
      expect(linkSuccess.metadata.institution?.name).toBeDefined();
    });

    it("LinkExit has correct structure", () => {
      const linkExit = {
        metadata: {
          status: LinkExitMetadataStatus.REQUIRES_CREDENTIALS,
          institution: {
            id: "inst-1",
            name: "Test Bank",
          },
          linkSessionId: "session-123",
          requestId: "request-123",
        },
        error: {
          errorCode: LinkErrorCode.INVALID_CREDENTIALS,
          errorType: LinkErrorType.ITEM_ERROR,
          errorMessage: "Invalid credentials",
          displayMessage: "Please check your username and password",
        },
      };

      expect(linkExit.metadata.linkSessionId).toBeDefined();
      expect(linkExit.metadata.requestId).toBeDefined();
      expect(linkExit.error?.errorCode).toBeDefined();
      expect(linkExit.error?.errorType).toBeDefined();
      expect(linkExit.error?.errorMessage).toBeDefined();
    });

    it("LinkEvent has correct structure", () => {
      const linkEvent = {
        eventName: LinkEventName.SELECT_INSTITUTION,
        metadata: {
          linkSessionId: "session-123",
          viewName: "SELECT_INSTITUTION" as any,
          timestamp: "2026-03-27T12:00:00Z",
          metadata_json: "{}",
          institutionId: "inst-1",
          institutionName: "Test Bank",
        },
      };

      expect(linkEvent.eventName).toBeDefined();
      expect(linkEvent.metadata.linkSessionId).toBeDefined();
      expect(linkEvent.metadata.viewName).toBeDefined();
      expect(linkEvent.metadata.timestamp).toBeDefined();
      expect(linkEvent.metadata.metadata_json).toBeDefined();
    });

    it("LinkAccount has verification status", () => {
      const account = {
        id: "account-1",
        name: "Checking",
        mask: "1234",
        type: LinkAccountType.DEPOSITORY,
        subtype: LinkAccountSubtypeDepository.CHECKING,
        verificationStatus: LinkAccountVerificationStatus.MANUALLY_VERIFIED,
      };

      expect(account.verificationStatus).toBe("manually_verified");
    });
  });

  describe("Interface Compliance", () => {
    it("LinkTokenConfiguration has required fields", () => {
      const config = {
        token: "link-token",
        onSuccess: jest.fn(),
        onExit: jest.fn(),
        onEvent: jest.fn(),
        onLoad: jest.fn(),
      };

      expect(config.token).toBeDefined();
      expect(typeof config.onSuccess).toBe("function");
      expect(typeof config.onExit).toBe("function");
      expect(typeof config.onEvent).toBe("function");
      expect(typeof config.onLoad).toBe("function");
    });

    it("LayerTokenConfiguration has required fields", () => {
      const config = {
        token: "layer-token",
        onSuccess: jest.fn(),
        onExit: jest.fn(),
        onEvent: jest.fn(),
      };

      expect(config.token).toBeDefined();
      expect(typeof config.onSuccess).toBe("function");
    });

    it("LayerTokenConfiguration onExit and onEvent are optional", () => {
      const minimalConfig = {
        token: "layer-token",
        onSuccess: jest.fn(),
      };

      expect(minimalConfig.token).toBeDefined();
      expect(typeof minimalConfig.onSuccess).toBe("function");
      expect(minimalConfig.onExit).toBeUndefined();
      expect(minimalConfig.onEvent).toBeUndefined();
    });

    it("PlaidLinkSession has open method", () => {
      const session = {
        open: jest.fn((fullScreen?: boolean) => Promise.resolve()),
      };

      expect(typeof session.open).toBe("function");
    });

    it("PlaidLayerSession has open and submit methods", () => {
      const session = {
        open: jest.fn(() => Promise.resolve()),
        submit: jest.fn((data) => Promise.resolve()),
      };

      expect(typeof session.open).toBe("function");
      expect(typeof session.submit).toBe("function");
    });

    it("SubmissionData structure is valid", () => {
      const submissionData = {
        phoneNumber: "555-1234",
        dateOfBirth: "1990-01-01",
        params: {
          key1: "value1",
          key2: "value2",
        },
      };

      expect(submissionData.phoneNumber).toBeDefined();
      expect(submissionData.dateOfBirth).toBeDefined();
      expect(submissionData.params).toBeInstanceOf(Object);
    });
  });

  describe("LinkAccountSubtypes Enum", () => {
    it("has credit subtypes", () => {
      expect(LinkAccountSubtypes.CREDIT_CARD).toBe("credit card");
      expect(LinkAccountSubtypes.PAYPAL).toBe("paypal");
    });

    it("has depository subtypes", () => {
      expect(LinkAccountSubtypes.CHECKING).toBe("checking");
      expect(LinkAccountSubtypes.SAVINGS).toBe("savings");
      expect(LinkAccountSubtypes.CD).toBe("cd");
      expect(LinkAccountSubtypes.MONEY_MARKET).toBe("money market");
    });

    it("has investment subtypes", () => {
      expect(LinkAccountSubtypes.FOUR_0_1_K).toBe("401k");
      expect(LinkAccountSubtypes.IRA).toBe("ira");
      expect(LinkAccountSubtypes.ROTH).toBe("roth");
      expect(LinkAccountSubtypes.BROKERAGE).toBe("brokerage");
    });

    it("has loan subtypes", () => {
      expect(LinkAccountSubtypes.MORTGAGE).toBe("mortgage");
      expect(LinkAccountSubtypes.AUTO).toBe("auto");
      expect(LinkAccountSubtypes.STUDENT).toBe("student");
      expect(LinkAccountSubtypes.HOME_EQUITY).toBe("home equity");
    });
  });

  describe("Complex Type Scenarios", () => {
    it("LinkSuccess with all optional fields", () => {
      const linkSuccess = {
        publicToken: "token",
        metadata: {
          institution: {
            id: "inst-1",
            name: "Bank",
          },
          accounts: [
            {
              id: "account-1",
              name: "Checking",
              mask: "1234",
              type: LinkAccountType.DEPOSITORY,
              subtype: LinkAccountSubtypeDepository.CHECKING,
              verificationStatus:
                LinkAccountVerificationStatus.MANUALLY_VERIFIED,
            },
          ],
          linkSessionId: "session-123",
          metadataJson: "{}",
        },
      };

      expect(linkSuccess).toBeDefined();
      expect(linkSuccess.metadata.accounts[0].verificationStatus).toBe(
        "manually_verified",
      );
    });

    it("LinkExit without error", () => {
      const linkExit = {
        metadata: {
          linkSessionId: "session-123",
          requestId: "request-123",
          status: LinkExitMetadataStatus.CONNECTED,
        },
      };

      expect(linkExit.error).toBeUndefined();
      expect(linkExit.metadata).toBeDefined();
    });

    it("LinkExit with error", () => {
      const linkExit = {
        error: {
          errorCode: LinkErrorCode.INSTITUTION_DOWN,
          errorType: LinkErrorType.INSTITUTION_ERROR,
          errorMessage: "Institution is down",
          displayMessage: "The bank is temporarily unavailable",
          errorJson: "{}",
        },
        metadata: {
          linkSessionId: "session-123",
          requestId: "request-123",
        },
      };

      expect(linkExit.error).toBeDefined();
      expect(linkExit.error?.errorCode).toBe(LinkErrorCode.INSTITUTION_DOWN);
      expect(linkExit.error?.displayMessage).toBeDefined();
    });

    it("LinkEvent with all metadata fields", () => {
      const linkEvent = {
        eventName: LinkEventName.ERROR,
        metadata: {
          accountNumberMask: "1234",
          linkSessionId: "session-123",
          mfaType: "code",
          requestId: "request-123",
          viewName: "ERROR" as any,
          errorCode: "INVALID_CREDENTIALS",
          errorMessage: "Invalid credentials",
          errorType: "ITEM_ERROR",
          exitStatus: "requires_credentials",
          institutionId: "inst-1",
          institutionName: "Test Bank",
          institutionSearchQuery: "test",
          timestamp: "2026-03-27T12:00:00Z",
          metadata_json: "{}",
        },
      };

      expect(linkEvent.metadata.errorCode).toBeDefined();
      expect(linkEvent.metadata.errorMessage).toBeDefined();
      expect(linkEvent.metadata.institutionId).toBeDefined();
    });
  });
});
