import PropTypes from 'prop-types';
import React, { useEffect, useRef, useState } from 'react';
import {
    Linking,
    NativeEventEmitter,
    NativeModules,
    Platform,
    TouchableOpacity,
} from 'react-native';
import {
    LinkError,
    LinkEventListener, 
    LinkExit, 
    LinkPublicKeyConfiguration, 
    LinkSuccess, 
    PlaidLinkProps, 
    PlaidProduct,

} from './types/Types';

/**
 * A hook that registers a listener on the plaid emitter for the 'onEvent' type.
 * The listener is cleaned up when this view is unmounted
 *
 * @param LinkEventListener the listener to call
 */
export const usePlaidEmitter = (LinkEventListener: LinkEventListener) => {
    useEffect(() => {
        const emitter = new NativeEventEmitter(
            Platform.OS === 'ios'
                ? NativeModules.RNLinksdk
                : NativeModules.PlaidAndroid,
        );
        const listener = emitter.addListener('onEvent', LinkEventListener);
        // Clean up after this effect:
        return function cleanup() {
            listener.remove();
        };
    }, []);
};

export const openLink = async ({ onExit, onSuccess, ...serializable }: any) => {
    if (Platform.OS === 'android') {
        NativeModules.PlaidAndroid.startLinkActivityForResult(
            JSON.stringify(serializable),
            (result: LinkSuccess) => {
                if (onSuccess != null) {
                    onSuccess(result);
                }
            },
            (result: LinkExit) => {
                if (onExit != null) {
                    onExit(result);
                }
            },
        );
    } else {
        NativeModules.RNLinksdk.create(serializable);
        NativeModules.RNLinksdk.open((error: LinkError, metadata: any) => {
            if (error) {
                if (onExit != null) {
                    var data = metadata || {};
                    data.error = error;
                    onExit(data);
                }
            } else {
                switch (metadata.status) {
                    case 'connected':
                        if (onSuccess != null) {
                            delete metadata.status;
                            onSuccess(metadata);
                        }
                        break;
                    default:
                        if (onExit != null) {
                            delete metadata.status;
                            onExit(metadata);
                        }
                        break;
                }
            }
        });
    }
};

export const dismissLink = () => {
    if (Platform.OS === 'ios') {
        NativeModules.RNLinksdk.dismiss();
    }
};

const handlePress = (linkProps: PlaidLinkProps, componentProps: any) => {
    openLink(linkProps);
    if (componentProps && componentProps.onPress) {
        componentProps.onPress();
    }
};

const useMount = (func: any) => useEffect(() => func(), []);

export const useDeepLinkRedirector = () => {
    const _handleListenerChange = (event: any) => {
        if (event.url !== null && Platform.OS === 'ios') {
            NativeModules.RNLinksdk.continueFromRedirectUriString(event.url);
        }
    };

    useEffect(() => {
        Linking.addEventListener('url', _handleListenerChange);

        return function cleanup() {
            Linking.removeEventListener('url', _handleListenerChange);
        };
    }, []);
};

export const PlaidLink = ({
    component,
    componentProps,
    children,
    ...linkProps
}: any) => {
    const Component = component;

    useDeepLinkRedirector();

    return (
        <Component
            {...componentProps}
            onPress={() => handlePress(linkProps, componentProps)}
        >
            {children}
        </Component>
    );
};
