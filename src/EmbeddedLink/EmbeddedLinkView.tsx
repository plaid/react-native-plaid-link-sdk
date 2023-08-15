import React from 'react';
import { NativeSyntheticEvent, StyleProp, ViewStyle } from 'react-native';
import NativeEmbeddedLinkView from './NativeEmbeddedLinkView';
import { LinkSuccessListener, LinkExitListener, LinkIOSPresentationStyle, LinkOnEventListener } from '../Types';

type IProps = {
    token: String,
    onClick: Function,
    style: StyleProp<ViewStyle> | undefined,
}
  
export const MyNativeCustomView: React.FC<IProps> = (props) => {

const {token, onClick, style} = props;
const _onClick = (event: any) => {
    if (!onClick) {
    return;
    }

    console.log('raw event', event);

    onClick(event.nativeEvent.eventName);
}

return <NativeEmbeddedLinkView
        token={token}
        onEvent={_onClick}
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