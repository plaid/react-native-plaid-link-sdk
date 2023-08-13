import React from 'react';
import { requireNativeComponent } from 'react-native';

const NativeEmbeddedView = requireNativeComponent('PLKEmbeddedView');

export class PlaidEmbeddedView extends React.PureComponent {
  render() {
    return <NativeEmbeddedView {...this.props} />;
  }
}
