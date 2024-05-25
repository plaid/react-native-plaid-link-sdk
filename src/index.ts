import {
    openLink,
    PlaidLink,
    create,
    open,
    dismissLink,
    usePlaidEmitter,
    syncFinanceKit,
} from './PlaidLink';

export * from './Types';

export default PlaidLink;

export {
    PlaidLink,
    openLink,
    create,
    open,
    dismissLink,
    usePlaidEmitter,
    syncFinanceKit
};

// Components

export { EmbeddedLinkView } from './EmbeddedLink/EmbeddedLinkView';
