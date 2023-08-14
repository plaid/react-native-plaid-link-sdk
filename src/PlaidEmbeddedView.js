import React from 'react';
import { requireNativeComponent } from 'react-native';

const NativeEmbeddedView = requireNativeComponent('PLKEmbeddedView');

// export interface Props {
//   presentationStyle: 'MODAL' | 'FULL_SCREEN'
//   onEvent: (any) => void;
// }

export class PlaidEmbeddedView extends React.PureComponent {
  constructor(props) {
    console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
    console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
    console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');

    super(props);
    this._onEvent = this.onEvent.bind(this);
  }

  _onEvent = event => {
    if (!this.props.onEvent) {
      console.log('##########################################################');
      console.log('##########################################################');
      console.log('##########################################################');
      return;
    }

    console.log('#37 event: ', event);
    console.log('#38 native event: ', event.nativeEvent);

    // process raw event
    this.props.onEvent(event.nativeEvent);
  };

  render() {
    return (
      <NativeEmbeddedView {...this.props} onEventCallback={this._onEvent} />
    );
  }
}
