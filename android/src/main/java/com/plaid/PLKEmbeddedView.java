package com.plaid;

import android.app.Activity;
import android.app.Application;
import android.content.Intent;
import android.util.Log;
import android.view.View;
import android.view.ViewTreeObserver;
import android.widget.LinearLayout;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.events.RCTEventEmitter;


import static com.plaid.GlobalFunctionsKt.convertJsonToMap;

import com.plaid.gson.PlaidJsonConverter;
import com.plaid.link.Plaid;
import com.plaid.link.PlaidHandler;
import com.plaid.link.configuration.LinkTokenConfiguration;
import com.plaid.link.result.LinkExit;
import com.plaid.link.result.LinkResult;
import com.plaid.link.result.LinkSuccess;
import com.plaid.link.OpenPlaidLink;

import kotlin.Unit;

import org.json.JSONException;
import org.json.JSONObject;

public class PLKEmbeddedView extends LinearLayout implements ActivityResultHandler {

    private ThemedReactContext themedReactContext;
    private String token = "";

    private final String TAG = "EmbeddedSearch";
    private final Integer LINK_ACTIVITY_REQUEST_CODE = 3364;
    private final String EVENT_NAME = "OnEmbeddedEvent";
    private final PlaidJsonConverter jsonConverter = new PlaidJsonConverter();

    public PLKEmbeddedView(ThemedReactContext context) {
        super(context);
        this.themedReactContext = context;

        initView();
        setupOnEventListener();
    }

    public void onFinishInflate(){
        super.onFinishInflate();
    }

    public void setToken(String token) {
        this.token = token;
        addEmbeddedView();
    }

    @Override
    protected void onAttachedToWindow() {
        super.onAttachedToWindow();

        NativeModule nativeModule = themedReactContext.getNativeModule(PlaidModule.class);

        if (nativeModule instanceof PlaidModule) {
            PlaidModule plaidModule = (PlaidModule) nativeModule;
            // Add our handler so we can get the callback result.
            plaidModule.getMActivityResultManager().put(LINK_ACTIVITY_REQUEST_CODE, this);
        }
    }

    @Override
    protected void onDetachedFromWindow() {
        super.onDetachedFromWindow();

        NativeModule nativeModule = themedReactContext.getNativeModule(PlaidModule.class);

        if (nativeModule instanceof PlaidModule) {
            PlaidModule plaidModule = (PlaidModule) nativeModule;
            // Remove the handler so the module can handle it.
            plaidModule.getMActivityResultManager().remove(LINK_ACTIVITY_REQUEST_CODE);
        }
    }

    private void initView() {
        inflate(getContext(), R.layout.plk_embedded_view, this);
    }

    private View createEmbedded(String token) {
        LinkTokenConfiguration linkTokenConfiguration = new LinkTokenConfiguration.Builder()
                .token(token)
                .build();

        Activity activity = themedReactContext.getCurrentActivity();
        if (activity == null) {
            return null;
        }
        return Plaid.createLinkEmbeddedView(
                activity,
                linkTokenConfiguration,
            (LinkTokenConfiguration config) -> {
                PlaidHandler plaidHandler = Plaid.create( (Application) themedReactContext.getApplicationContext(), config);
                Activity currentActivity = themedReactContext.getCurrentActivity();
                if (currentActivity != null) { plaidHandler.open(currentActivity); }
                return null;
            },
            (LinkExit linkExit) -> {
                    handleLinkExit(linkExit);
                    return null;
            });
    }

    private void addEmbeddedView() {
        View embeddedView = createEmbedded(token);
        LayoutParams embeddedLayout = new LinearLayout.LayoutParams(LayoutParams.MATCH_PARENT, LayoutParams.MATCH_PARENT);
        embeddedView.setLayoutParams(embeddedLayout);
        LinearLayout linearLayout = findViewById(R.id.embedded_linear_layout);
        linearLayout.addView(embeddedView);
    }

    private void setupOnEventListener() {
        Plaid.setLinkEventListener(event -> {
            Log.d(TAG, "onEvent " + event.toString());

            try {
                String jsonString = jsonConverter.convert(event);
                JSONObject jsonObject = new JSONObject(jsonString);
                WritableMap eventMap = convertJsonToMap(jsonObject);

                String eventName = PLKEmbeddedViewManager.EVENT_NAME;
                eventMap.putString("embeddedEventName", "onEvent");

                ReactContext reactContext = (ReactContext)getContext();
                reactContext.getJSModule(RCTEventEmitter.class)
                        .receiveEvent(getId(), eventName, eventMap);

                return Unit.INSTANCE;
            } catch (JSONException e) {
                Log.e(TAG, "JSON Exception: " + e);
                return Unit.INSTANCE;
            }
        });
    }

    private void observeVisibility() {
        setTag(getVisibility());

        getViewTreeObserver().addOnGlobalLayoutListener(new ViewTreeObserver.OnGlobalLayoutListener() {
            @Override
            public void onGlobalLayout() {
                int newVisibility = getVisibility();
                if ((int) getTag() != newVisibility) {

                    setTag(getVisibility());

                    switch (newVisibility) {
                        case View.VISIBLE: setupOnEventListener();
                        default: break;
                    }
                }
            }
        });
    }

    @Override
    public void handleActivityResult(int requestCode, int resultCode, Intent data) {
        if (requestCode == LINK_ACTIVITY_REQUEST_CODE) {
            OpenPlaidLink openPlaidLink = new OpenPlaidLink();
            LinkResult linkResult = openPlaidLink.parseResult(resultCode, data);

            if (linkResult instanceof LinkSuccess) {
                Log.d(TAG, "Link Success: " + linkResult);
                LinkSuccess linkSuccess = (LinkSuccess) linkResult;

                try {
                    String jsonString = jsonConverter.convert(linkSuccess);
                    JSONObject jsonObject = new JSONObject(jsonString);
                    WritableMap successMap = convertJsonToMap(jsonObject);
                    String eventName = PLKEmbeddedViewManager.EVENT_NAME;
                    successMap.putString("embeddedEventName", "onSuccess");

                    ReactContext reactContext = (ReactContext)getContext();
                    reactContext.getJSModule(RCTEventEmitter.class)
                            .receiveEvent(getId(), eventName, successMap);

                } catch (JSONException e) {
                    Log.e(TAG, "JSON Exception: " + e);
                    sendLinkExitFrom(e);
                }

            } else if (linkResult instanceof LinkExit) {
                Log.d(TAG, "Link Exit: " + linkResult);
                LinkExit linkExit = (LinkExit) linkResult;
                handleLinkExit(linkExit);
            } else {
                Log.d(TAG, "Unhandled Result: " + linkResult);
            }
        }
    }

    private void handleLinkExit(LinkExit linkExit) {
        try {
            String jsonString = jsonConverter.convert(linkExit);
            JSONObject jsonObject = new JSONObject(jsonString);
            WritableMap exitMap = convertJsonToMap(jsonObject);
            String eventName = PLKEmbeddedViewManager.EVENT_NAME;
            exitMap.putString("embeddedEventName", "onExit");

            ReactContext reactContext = (ReactContext)getContext();
            reactContext.getJSModule(RCTEventEmitter.class)
                .receiveEvent(getId(), eventName, exitMap);

        } catch (JSONException e) {
            Log.e(TAG, "JSON Exception: " + e);
            sendLinkExitFrom(e);
        }
    }

    private void sendLinkExitFrom(JSONException e) {
        WritableMap map = Arguments.createMap();
        WritableMap errorMap = Arguments.createMap();
        WritableMap exitMetadataMap = Arguments.createMap();

        errorMap.putString("error_message", e.getMessage());
        errorMap.putString("json", e.getMessage());
        errorMap.putString("error_type", "JSONException");
        errorMap.putInt("error_code", 499);

        exitMetadataMap.putString("error_message", e.getMessage());
        exitMetadataMap.putString("json", e.getMessage());
        exitMetadataMap.putString("error_type", "JSONException");
        exitMetadataMap.putInt("error_code", 499);

        map.putString("eventName", "EXIT");
        map.putMap("metadata", exitMetadataMap);
        map.putMap("error", errorMap);
        map.putString("embeddedEventName", "onExit");

        ReactContext reactContext = (ReactContext)getContext();
        reactContext.getJSModule(RCTEventEmitter.class)
                .receiveEvent(getId(), PLKEmbeddedViewManager.EVENT_NAME, map);
    }
}