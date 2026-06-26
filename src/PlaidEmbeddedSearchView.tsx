import { requireNativeViewManager } from "expo-modules-core";
import * as React from "react";
import { ViewProps } from "react-native";

import {
  LinkExit,
  LinkEvent,
  LinkSuccess,
} from "./ReactNativePlaidLinkSdk.types";

export type PlaidEmbeddedSearchViewProps = {
  token: string;
  onSuccess?: (success: LinkSuccess) => void;
  onExit?: (exit: LinkExit) => void;
  onEvent?: (event: LinkEvent) => void;
  onLoad?: () => void;
} & ViewProps;

const NativeView: React.ComponentType<any> = requireNativeViewManager(
  "ReactNativePlaidLinkSdk",
);

export function PlaidEmbeddedSearchView(props: PlaidEmbeddedSearchViewProps) {
  const { onSuccess, onExit, onEvent, onLoad, ...restProps } = props;

  return (
    <NativeView
      {...restProps}
      onSuccess={(event: any) => onSuccess?.(event.nativeEvent)}
      onExit={(event: any) => onExit?.(event.nativeEvent)}
      onEvent={(event: any) => onEvent?.(event.nativeEvent)}
      onLoad={(event: any) => onLoad?.()}
    />
  );
}
