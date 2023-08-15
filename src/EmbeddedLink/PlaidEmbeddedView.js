// import React from 'react';
// // import { requireNativeComponent } from 'react-native';

// // const NativeEmbeddedView = requireNativeComponent('PLKEmbeddedView');

// export class PlaidEmbeddedView extends React.PureComponent {

//   _onEvent = event => {
//     if (!this.props.onEvent) {
//       console.log('##########################################################');
//       console.log('##########################################################');
//       console.log('##########################################################');
//       return;
//     }

//     console.log('#37 event: ', event);
//     console.log('#38 native event: ', event.nativeEvent);

//     // process raw event
//     this.props.onEvent(event.nativeEvent);
//   };

//   render() {
//     return (
//       <NativeEmbeddedView {...this.props} onEvent={this._onEvent} />
//     );
//   }
// }
