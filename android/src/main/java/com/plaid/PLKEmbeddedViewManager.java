package com.plaid;

import android.content.Context;
import android.view.LayoutInflater;

import com.facebook.react.common.MapBuilder;
import com.facebook.react.uimanager.SimpleViewManager;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.annotations.ReactProp;

import java.util.Map;

public class PLKEmbeddedViewManager extends SimpleViewManager<PLKEmbeddedView> {

    public static final String REACT_CLASS = "PLKEmbeddedView";
    @Override
    public String getName() { return REACT_CLASS; }

    @Override
    public PLKEmbeddedView createViewInstance(ThemedReactContext context) {
        PLKEmbeddedView view = new PLKEmbeddedView(context);
        return  view;
    }

    @ReactProp(name ="token")
    public void setToken(PLKEmbeddedView view, String token) {
        view.setToken(token);
    }

    public Map getExportedCustomBubblingEventTypeConstants() {
        String eventName = "onEventEvent";
        String propName = "onEvent";
        Map onClickHandler = MapBuilder.of("phasedRegistrationNames",MapBuilder.of("bubbled", propName));

        MapBuilder.Builder events = MapBuilder.builder();
        events.put(eventName, onClickHandler); // qwe rename
        return events.build();
    }
}
