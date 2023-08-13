import React from 'react';
import { requireNativeComponent } from 'react-native';

const RCTCustomView = requireNativeComponent(
  'RCTMyCustomView',
  MyCustomView,
  {},
);

export class MyCustomView extends React.PureComponent {
  render() {
    return <RCTCustomView {...this.props} />;
  }
}
