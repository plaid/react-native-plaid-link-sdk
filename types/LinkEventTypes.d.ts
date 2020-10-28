export type LinkEventListener = (linkEvent: LinkEvent) => void

 
export interface LinkEvent {
  eventName: LinkEventName;
  metadata: LinkEventMetadata;
}
 
export interface LinkEventMetadata {
  error_code: string;
  error_message: string;
  error_type: string;
  exit_status: string;
  institution_id: string;
  institution_name: string;
  institution_search_query: string;
  request_id: string;
  link_session_id: string;
  mfa_type: string;
  view_name: LinkEventViewName;
  timestamp: string;
}
 
export enum LinkEventName {
  CLOSE_OAUTH = 'close_oauth',
  ERROR = 'error',
  EXIT = 'exit',
  FAIL_OAUTH = 'fail_oauth',
  HANDOFF = 'handoff',
  MATCHED_CONSENT = 'matched_consent',
  MATCHED_SELECT_INSTITUTION = 'matched_select_institution',
  OPEN = 'open',
  OPEN_MY_PLAID = 'open_my_plaid',
  OPEN_OAUTH = 'open_oauth',
  SEARCH_INSTITUTION = 'search_institution',
  SELECT_INSTITUTION = 'select_institution',
  SUBMIT_CREDENTIALS = 'submit_credentials',
  SUBMIT_MFA = 'submit_mfa',
  TRANSITION_VIEW = 'transition_view',
}
 
export enum LinkEventViewName {
  CONNECTED = 'CONNECTED',
  CONSENT = 'CONSENT',
  CREDENTIAL = 'CREDENTIAL',
  ERROR = 'ERROR',
  EXIT = 'EXIT',
  LOADING = 'LOADING',
  MFA = 'MFA',
  NUMBERS = 'NUMBERS',
  RECAPTCHA = 'RECAPTCHA',
  SELECT_ACCOUNT =  'SELECT_ACCOUNT',
  SELECT_INSTITUTION = 'SELECT_INSTITUTION',
}
