import * as React from 'react';

import { ReactNativePlaidLinkSdkViewProps } from './ReactNativePlaidLinkSdk.types';

export default function ReactNativePlaidLinkSdkView(props: ReactNativePlaidLinkSdkViewProps) {
  return (
    <div>
      <iframe
        style={{ flex: 1 }}
        src={props.url}
        onLoad={() => props.onLoad({ nativeEvent: { url: props.url } })}
      />
    </div>
  );
}
