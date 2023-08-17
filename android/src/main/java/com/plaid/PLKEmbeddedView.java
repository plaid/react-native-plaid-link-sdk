package com.plaid;

import android.content.Context;
import android.util.AttributeSet;
import android.view.View;
import android.widget.Button;
import android.widget.LinearLayout;
import android.widget.TextView;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.events.RCTEventEmitter;

public class PLKEmbeddedView extends LinearLayout {

    private ThemedReactContext themedReactContext;
    private String token = "";

    public PLKEmbeddedView(ThemedReactContext context) {
        super(context);
        this.themedReactContext = context;
        initView();
    }

    public PLKEmbeddedView(ThemedReactContext context, AttributeSet attrs, int defStyle) {
        super(context, attrs, defStyle);
        this.themedReactContext = context;
        initView();
    }

    public PLKEmbeddedView(ThemedReactContext context, AttributeSet attrs) {
        super(context, attrs);
        this.themedReactContext = context;
        initView();
    }

    public void onFinishInflate(){
        super.onFinishInflate();
    }

    public void setToken(String token) {
        this.token = token;

        TextView textView = findViewById(R.id.randomNumber);
        textView.setText("Token " + this.token);
    }

    private void initView() {
        inflate(getContext(), R.layout.plk_embedded_view, this);

        Button button = findViewById(R.id.randomButton);
        button.setOnClickListener(onClickListener);
    }

    private OnClickListener onClickListener = new View.OnClickListener() {
        @Override
        public void onClick(View view) {
            WritableMap metadataMap = Arguments.createMap();
            metadataMap.putString("linkSessionId", "abc123");
            metadataMap.putString("viewName", "CONSENT");

            WritableMap event = Arguments.createMap();
            event.putString("eventName","TRANSITION_VIEW");
            event.putMap("metadata", metadataMap);

            ReactContext reactContext = (ReactContext)getContext();
            reactContext.getJSModule(RCTEventEmitter.class).receiveEvent(getId(), "onEventEvent", event);
        }
    };
}