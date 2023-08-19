package com.plaid;

import android.content.Context;
import android.content.Intent;
import android.util.AttributeSet;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.LinearLayout;
import android.widget.TextView;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.events.RCTEventEmitter;

import com.plaid.link.result.LinkExit;
import com.plaid.link.result.LinkResult;
import com.plaid.link.result.LinkSuccess;
import com.plaid.link.OpenPlaidLink;

public class PLKEmbeddedView extends LinearLayout implements ActivityResultHandler {

    private ThemedReactContext themedReactContext;
    private PLKEmbeddedSearchActivity plkEmbeddedSearchActivity;
    private String token = "";

    private String TAG = "EmbeddedSearch";
    private final Integer LINK_ACTIVITY_REQUEST_CODE = 3364;

    public PLKEmbeddedView(ThemedReactContext context) {
        super(context);
        this.themedReactContext = context;
        this.plkEmbeddedSearchActivity = new PLKEmbeddedSearchActivity(context);
        initView();
    }

    public void onFinishInflate(){
        super.onFinishInflate();
    }

    public void setToken(String token) {
        this.token = token;
        addEmbeddedView();

        NativeModule nativeModule = themedReactContext.getNativeModule(PlaidModule.class);

        if (nativeModule instanceof PlaidModule) {
            PlaidModule plaidModule = (PlaidModule) nativeModule;
            plaidModule.getMActivityResultManager().put(LINK_ACTIVITY_REQUEST_CODE, this); // qwe have to remove this?
        } else {

            Log.d(TAG, "nativeMode: " + nativeModule);

            throw new RuntimeException("no plaid module");
        }
    }

    private void initView() {
        inflate(getContext(), R.layout.plk_embedded_view, this);
    }

    private void addEmbeddedView() {
        View embeddedView = plkEmbeddedSearchActivity.createEmbedded(token);
        LayoutParams embeddedLayout = new LinearLayout.LayoutParams(LayoutParams.MATCH_PARENT, LayoutParams.MATCH_PARENT);
        embeddedView.setLayoutParams(embeddedLayout);
        LinearLayout linearLayout = findViewById(R.id.embedded_linear_layout);
        linearLayout.addView(embeddedView);
    }

    @Override
    public void handleActivityResult(int requestCode, int resultCode, Intent data) {
        if (requestCode == LINK_ACTIVITY_REQUEST_CODE) {
            OpenPlaidLink openPlaidLink = new OpenPlaidLink();
            LinkResult linkResult = openPlaidLink.parseResult(resultCode, data);

            if (linkResult instanceof LinkSuccess) {
                Log.d(TAG, "Link Success: " + linkResult);

                WritableMap metadataMap = Arguments.createMap();
                metadataMap.putString("linkSessionId", "abc123");
                metadataMap.putString("viewName", "CONSENT");

                WritableMap event = Arguments.createMap();
                event.putString("eventName","TRANSITION_VIEW");
                event.putMap("metadata", metadataMap);

                ReactContext reactContext = (ReactContext)getContext();
                reactContext.getJSModule(RCTEventEmitter.class).receiveEvent(getId(), "onEventEvent", event);


            } else if (linkResult instanceof LinkExit) {
                Log.d(TAG, "Link Exit: " + linkResult);

                WritableMap metadataMap = Arguments.createMap();
                metadataMap.putString("linkSessionId", "abc123");
                metadataMap.putString("viewName", "CONSENT");

                WritableMap event = Arguments.createMap();
                event.putString("eventName","TRANSITION_VIEW");
                event.putMap("metadata", metadataMap);

                ReactContext reactContext = (ReactContext)getContext();
                reactContext.getJSModule(RCTEventEmitter.class).receiveEvent(getId(), "onEventEvent", event);

            } else {
                Log.d(TAG, "Unhandled Result: " + linkResult);
            }
        }
    }
}