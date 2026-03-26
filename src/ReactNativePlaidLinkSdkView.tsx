import { requireNativeView } from "expo";
import * as React from "react";

import { ReactNativePlaidLinkSdkViewProps } from "./ReactNativePlaidLinkSdk.types";

const NativeView: React.ComponentType<ReactNativePlaidLinkSdkViewProps> =
  requireNativeView("ReactNativePlaidLinkSdk");

export default function ReactNativePlaidLinkSdkView(
  props: ReactNativePlaidLinkSdkViewProps
) {
  return <NativeView {...props} />;
}
