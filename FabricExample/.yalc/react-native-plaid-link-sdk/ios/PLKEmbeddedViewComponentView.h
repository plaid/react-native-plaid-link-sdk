#ifdef RCT_NEW_ARCH_ENABLED

#import <UIKit/UIKit.h>
#import <React/RCTUIManager.h>
#import <React/RCTViewComponentView.h>

NS_ASSUME_NONNULL_BEGIN

/**
 * This file is required for compatibility with React Native's New Architecture (Fabric Renderer).
 * 
 * - PLKEmbeddedViewComponentView extends `RCTViewComponentView` to define a custom native view 
 *   that works with the Fabric rendering system, improving UI performance and concurrency.
 * - The `#ifdef RCT_NEW_ARCH_ENABLED` directive ensures this code is only compiled when the 
 *   New Architecture is enabled, avoiding compatibility issues with older architectures.
 * - Custom native views like this are essential when integrating UIKit-based components into 
 *   React Native apps under the New Architecture.
 * - `RCTUIManager` handles the interaction between the native view and the React Native bridge, 
 *   enabling updates and commands from the JavaScript side.
 * 
 * Ref - https://github.com/reactwg/react-native-new-architecture/blob/main/docs/backwards-compat-turbo-modules.md
 */
@interface PLKEmbeddedViewComponentView : RCTViewComponentView
@end

NS_ASSUME_NONNULL_END

#endif // RCT_NEW_ARCH_ENABLED
