import { requireNativeComponent } from 'react-native';

// Error "Tried to register two views with the same name PLKEmbeddedView"
// will be thrown during hot reload when any change is made to the
// file that is calling this requireNativeComponent('PLKEmbeddedView') call.
// Leaving this in its own file resolves this issue.
const NativeEmbeddedLinkView = requireNativeComponent<any>('PLKEmbeddedView');

export default NativeEmbeddedLinkView;