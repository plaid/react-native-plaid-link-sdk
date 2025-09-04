// EmbeddedLinkView.web.tsx is a shim file which causes web bundlers to ignore the EmbeddedLinkView.tsx file 
// which imports requireNativeComponent (causing a runtime error with react-native-web). 
// Ref - https://github.com/plaid/react-native-plaid-link-sdk/issues/564
import React from 'react';
export const EmbeddedLinkView = () => null;
