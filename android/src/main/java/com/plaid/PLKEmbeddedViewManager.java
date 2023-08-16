package com.plaid;

import android.content.Context;
import android.view.LayoutInflater;

import com.facebook.react.uimanager.SimpleViewManager;
import com.facebook.react.uimanager.ThemedReactContext;

public class PLKEmbeddedViewManager extends SimpleViewManager<PLKEmbeddedView> {

    public static final String REACT_CLASS = "PLKEmbeddedView";
    String eventName = "onClick";

    @Override
    public String getName() { return REACT_CLASS; }

    @Override
    public PLKEmbeddedView createViewInstance(ThemedReactContext context) {
        PLKEmbeddedView view = new PLKEmbeddedView(context);
        return  view;
    }
}
