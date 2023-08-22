import React from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import NativeEmbeddedLinkView from './NativeEmbeddedLinkView';
import { 
    LinkSuccessListener,
    LinkSuccess,
    LinkExitListener, 
    LinkExit, 
    LinkIOSPresentationStyle, 
    LinkOnEventListener,
    LinkEvent,
    LinkEventName,
    LinkEventMetadata,
    LinkError,
    LinkExitMetadata,
    LinkSuccessMetadata, 
} from '../Types';

type EmbeddedLinkProps = {
    token: String,
    iOSPresentationStyle: LinkIOSPresentationStyle,
    onEvent: LinkOnEventListener | undefined,
    onSuccess: LinkSuccessListener,
    onExit: LinkExitListener | undefined,
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

class EmbeddedExit implements LinkExit {
    error: LinkError | undefined;
    metadata: LinkExitMetadata;

    constructor(event: any) {
        this.error = event.error;
        this.metadata = event.metadata;
    }
}

class EmbeddedSuccess implements LinkSuccess {
    publicToken: string;
    metadata: LinkSuccessMetadata;

    constructor(event: any) {
        this.publicToken = event.publicToken;
        this.metadata = event.metadata;
    }
}

export const EmbeddedLinkView: React.FC<EmbeddedLinkProps> = (props) => {

    const {token, iOSPresentationStyle, onEvent, onSuccess, onExit, style} = props;

    // qwe still need to handle this case??
    const _onEvent = (event: any) => {
        if (!onEvent) {
            return;
        }

        const embeddedEvent = new EmbeddedEvent(event.nativeEvent);
        onEvent(embeddedEvent);
    }

    const onEmbeddedEvent = (event: any) => {
        console.log('onEmbeddedEvent ', event.nativeEvent);
        console.log('onEmbeddedEvent ', event.nativeEvent.embeddedEventName);

        switch (event.nativeEvent.embeddedEventName) {
            case 'onSuccess': {
                if (!onSuccess) { return; }
                const embeddedSuccess = new EmbeddedSuccess(event.nativeEvent);
                onSuccess(embeddedSuccess);
                break;
            }
            case 'onExit': {
                if (!onExit) {return; }
                const embeddedExit = new EmbeddedExit(event.nativeEvent);
                onExit(embeddedExit);
                break;
            }
            default: {
                return;
            }
        }
    }

    return <NativeEmbeddedLinkView
                token={token}
                iOSPresentationStyle={iOSPresentationStyle.toString()}
                // onSuccess={_onSuccess}
                // onEvent={_onEvent}
                // onExit={_onExit}
                onEmbeddedEvent={onEmbeddedEvent}
                style={style}
            />
};