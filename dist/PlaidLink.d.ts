import { LinkEventListener, PlaidLinkComponentProps, PlaidLinkProps } from './Types';
/**
 * A hook that registers a listener on the Plaid emitter for the 'onEvent' type.
 * The listener is cleaned up when this view is unmounted
 *
 * @param LinkEventListener the listener to call
 */
export declare const usePlaidEmitter: (LinkEventListener: LinkEventListener) => void;
export declare const openLink: (props: PlaidLinkProps) => Promise<void>;
export declare const dismissLink: () => void;
export declare const useDeepLinkRedirector: () => void;
export declare const PlaidLink: (props: PlaidLinkComponentProps) => JSX.Element;
