import React from 'react';
import { NativeSyntheticEvent, StyleProp, ViewStyle } from 'react-native';
import NativeEmbeddedLinkView from './NativeEmbeddedLinkView';
import { LinkSuccessListener, LinkExitListener, LinkIOSPresentationStyle, LinkOnEventListener } from '../Types';
import { LinkEvent, LinkEventMetadata, LinkEventName } from 'react-native-plaid-link-sdk';

type EmbeddedLinkProps = {
    token: String,
    iOSPresentationStyle: LinkIOSPresentationStyle,
    onEvent: LinkOnEventListener | undefined,
    onSuccess: Function,
    onExit: Function | undefined,
    style: StyleProp<ViewStyle> | undefined,
}

class EmbeddedEvent implements LinkEvent {
    eventName: LinkEventName;
    metadata: LinkEventMetadata;

    constructor(event: any) {
        this.eventName = event.eventName
        this.metadata = event.metadata
    }
}
  
export const MyNativeCustomView: React.FC<EmbeddedLinkProps> = (props) => {

    const {token, iOSPresentationStyle, onEvent, onSuccess, onExit, style} = props;

    const _onEvent = (event: any) => {
        
        if (!onEvent) {
            return;
        }

        const embeddedEvent = new EmbeddedEvent(event.nativeEvent);
        onEvent(embeddedEvent);
    }

    const _onSuccess = (event: any) => {

        if (!onSuccess) {
            return;
        }

        const json = JSON.stringify(event.nativeEvent);
        console.log('JSON ', json);

        onSuccess(event.nativeEvent);
    }

    const _onExit = (event: any) => {

        if (!onExit) {
            return;
        }

        const json = JSON.stringify(event.nativeEvent);
        console.log('JSON ', json);

        onExit(event.nativeEvent);
    }

    return <NativeEmbeddedLinkView
                token={token}
                presentationStyle={iOSPresentationStyle.toString()}
                onEvent={_onEvent}
                onSuccess={_onSuccess}
                onExit={_onExit}
                style={style}
            />
};

// export interface PlaidEmbeddedLinkProps {
//     token: string,
//     onEvent: LinkOnEventListener,
//     onSuccess: LinkSuccessListener,
//     onExit: LinkExitListener,
//     iOSPresentationStyle?: LinkIOSPresentationStyle,
// }

// export class EmbeddedLinkProps implements PlaidEmbeddedLinkProps {

//     token: string;
//     onEvent: LinkOnEventListener;
//     onSuccess: LinkSuccessListener;
//     onExit: LinkExitListener;
//     iOSPresentationStyle: LinkIOSPresentationStyle;
    
//     constructor(
//         token: string,
//         onSuccess: LinkSuccessListener,
//         onEvent: LinkOnEventListener,
//         onExit: LinkExitListener,
//         iOSPresentationStyle: LinkIOSPresentationStyle,
//     ) {
//         this.token = token
//         this.onEvent = onEvent
//         this.onSuccess = onSuccess
//         this.onExit = onExit
//         this.iOSPresentationStyle = iOSPresentationStyle
//     }
// }

// export const EmbeddedLinkView: React.FC<EmbeddedLinkProps> = (props: EmbeddedLinkProps) => {

//     const {token, onSuccess, onExit, onEvent, iOSPresentationStyle } = props;

//     const _onEvent = (event: any) => {
//         if (!onEvent) {
//             return;
//         }

//         console.log('event', event);

//         onEvent(event.nativeEvent);
//     }

//     return <NativeEmbeddedLinkView {...props}
//                 // token={token}
//                 // presentationStyle={'MODAL'}
//                 // onEvent={_onEvent}
//             />

// }