import React from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import { LinkSuccessListener, LinkExitListener, LinkIOSPresentationStyle, LinkOnEventListener } from '../Types';
type EmbeddedLinkProps = {
    token: String;
    iOSPresentationStyle: LinkIOSPresentationStyle;
    onEvent: LinkOnEventListener | undefined;
    onSuccess: LinkSuccessListener;
    onExit: LinkExitListener | undefined;
    style: StyleProp<ViewStyle> | undefined;
};
export declare const EmbeddedLinkView: React.FC<EmbeddedLinkProps>;
export {};
