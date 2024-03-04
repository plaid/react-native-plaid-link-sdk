import React from 'react';
import NativeEmbeddedLinkView from './NativeEmbeddedLinkView';
class EmbeddedEvent {
  constructor(event) {
    this.eventName = event.eventName;
    this.metadata = event.metadata;
  }
}
class EmbeddedExit {
  constructor(event) {
    this.error = event.error;
    this.metadata = event.metadata;
  }
}
class EmbeddedSuccess {
  constructor(event) {
    this.publicToken = event.publicToken;
    this.metadata = event.metadata;
  }
}
export const EmbeddedLinkView = props => {
  const {
    token,
    iOSPresentationStyle,
    onEvent,
    onSuccess,
    onExit,
    style,
  } = props;
  const onEmbeddedEvent = event => {
    switch (event.nativeEvent.embeddedEventName) {
      case 'onSuccess': {
        if (!onSuccess) {
          return;
        }
        const embeddedSuccess = new EmbeddedSuccess(event.nativeEvent);
        onSuccess(embeddedSuccess);
        break;
      }
      case 'onExit': {
        if (!onExit) {
          return;
        }
        const embeddedExit = new EmbeddedExit(event.nativeEvent);
        onExit(embeddedExit);
        break;
      }
      case 'onEvent': {
        if (!onEvent) {
          return;
        }
        const embeddedEvent = new EmbeddedEvent(event.nativeEvent);
        onEvent(embeddedEvent);
        break;
      }
      default: {
        return;
      }
    }
  };
  return (
    <NativeEmbeddedLinkView
      token={token}
      iOSPresentationStyle={iOSPresentationStyle.toString()}
      onEmbeddedEvent={onEmbeddedEvent}
      style={style}
    />
  );
};
