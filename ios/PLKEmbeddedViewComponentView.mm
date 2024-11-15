#ifdef RCT_NEW_ARCH_ENABLED

#import "PLKEmbeddedViewComponentView.h"
#import "PLKFabricHelpers.h"

#import <React/RCTBridge+Private.h>
#import <React/RCTConversions.h>
#import <React/RCTFabricComponentsPlugins.h>

#import <react/renderer/components/rnplaidlink/ComponentDescriptors.h>
#import <react/renderer/components/rnplaidlink/EventEmitters.h>
#import <react/renderer/components/rnplaidlink/Props.h>
#import <react/renderer/components/rnplaidlink/RCTComponentViewHelpers.h>

using namespace facebook::react;

@implementation PLKEmbeddedViewComponentView {
    PLKEmbeddedView *_view;
}

// Needed because of this: https://github.com/facebook/react-native/pull/37274
+ (void)load
{
  [super load];
}

- (instancetype)initWithFrame:(CGRect)frame
{
    if (self = [super initWithFrame:frame]) {
        static const auto defaultProps = std::make_shared<const PLKEmbeddedViewProps>();
        _props = defaultProps;
        [self prepareView];
    }

    return self;
}

- (void)prepareView
{
    _view =  [[PLKEmbeddedView alloc] init];

    __weak __typeof__(self) weakSelf = self;

    [_view setOnEmbeddedEvent:^(NSDictionary* event) {
            __typeof__(self) strongSelf = weakSelf;

            if (strongSelf != nullptr && strongSelf->_eventEmitter != nullptr) {
                std::dynamic_pointer_cast<const facebook::react::PLKEmbeddedViewEventEmitter>(strongSelf->_eventEmitter)->onEmbeddedEvent({
                    .embeddedEventName = RCTStringFromNSString(event[@"embeddedEventName"]),
                    .eventName = RCTStringFromNSString(event[@"eventName"]),
                    .error = PLKConvertIdToFollyDynamic(event[@"error"]),
                    .publicToken = RCTStringFromNSString(event[@"publicToken"]),
                    .metadata = PLKConvertIdToFollyDynamic(event[@"metadata"]),
                });
              }
        }];
    self.contentView = _view;
}

#pragma mark - RCTComponentViewProtocol

+ (ComponentDescriptorProvider)componentDescriptorProvider
{
  return concreteComponentDescriptorProvider<PLKEmbeddedViewComponentDescriptor>();
}


- (void)updateProps:(const Props::Shared &)props oldProps:(const Props::Shared &)oldProps
{
  const auto &newProps = static_cast<const PLKEmbeddedViewProps &>(*props);
  _view.token = RCTNSStringFromStringNilIfEmpty(newProps.token);
  _view.iOSPresentationStyle = RCTNSStringFromStringNilIfEmpty(newProps.token);
    
  [super updateProps:props oldProps:oldProps];
}

- (void)prepareForRecycle
{
    [super prepareForRecycle];
    [self prepareView];
}


@end

Class<RCTComponentViewProtocol> PLKEmbeddedViewCls(void)
{
  return PLKEmbeddedViewComponentView.class;
}

#endif // RCT_NEW_ARCH_ENABLED
