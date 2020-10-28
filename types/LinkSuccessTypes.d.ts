import { LinkAccountSubtype } from "./AccountSubtypes";
import { LinkAccountType } from "./AccountTypes";
import { LinkInstitution } from "./LinkInstitution";

export interface LinkSuccess {  
    publicToken: string;
    metadata: LinkSuccessMetadata;
  }
   
  export interface LinkSuccessMetadata {
    institution?: LinkInstitution;
    accounts: LinkAccount[];
    linkSessionId: String;
    metadataJson: String;
  }
 
  export interface LinkAccount {
    id: String;
    name?: String;
    mask?: String;
    type: LinkAccountType;
    subtype: LinkAccountSubtype;
    verificationStatus: LinkAccountVerificationStatus;
  }
   
  export enum LinkAccountVerificationStatus {
    PENDING_AUTOMATIC_VERIFICATION = 'pending_automatic_verification',
    PENDING_MANUAL_VERIFICATION = 'pending_manual_verification',
    MANUALLY_VERIFIED = 'manually_verified',
  }
    