package com.plaid;

import android.app.Activity;
import android.app.Application;
import android.content.Intent;
import android.util.Log;
import android.view.View;

import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;

import com.facebook.react.uimanager.ThemedReactContext;

import com.plaid.link.Plaid;
import com.plaid.link.PlaidHandler;
import com.plaid.link.configuration.EmbeddedSessionInfo;
import com.plaid.link.configuration.LinkTokenConfiguration;
import com.plaid.link.result.LinkExit;
import com.plaid.link.result.LinkResult;
import com.plaid.link.result.LinkSuccess;
import com.plaid.link.OpenPlaidLink;

public class PLKEmbeddedSearchActivity extends AppCompatActivity implements ActivityResultHandler {

    private final ThemedReactContext themedReactContext;
    private final Integer LINK_ACTIVITY_REQUEST_CODE = 3364;
    private String TAG = "EmbeddedSearch";

    PLKEmbeddedSearchActivity(ThemedReactContext context) {
        super();
        this.themedReactContext = context;

        // qwe

//        if (themedReactContext.hasCurrentActivity()) {
//            Activity activity =  themedReactContext.getCurrentActivity();
//
//            if (activity instanceof MainActivity) {
//                MainActivity mainActivity = (MainActivity) activity;
//                mainActivity.getActivityResultManager().put(LINK_ACTIVITY_REQUEST_CODE, this);
//            }
//        }
    }

    View createEmbedded(String token) {
        LinkTokenConfiguration linkTokenConfiguration = new LinkTokenConfiguration.Builder()
                .token(token)
                .build();

        Plaid.EmbeddedViewResultCallback callback = new Plaid.EmbeddedViewResultCallback() {
            @Override
            public void onEmbeddedSessionInfoReceived(@NonNull EmbeddedSessionInfo embeddedSessionInfo) {
                PlaidHandler plaidHandler = Plaid.create( (Application) themedReactContext.getApplicationContext(), embeddedSessionInfo);
                plaidHandler.open(themedReactContext.getCurrentActivity());
            }
        };

        return Plaid.createLinkEmbeddedViewReact(themedReactContext, linkTokenConfiguration, callback);
    }

    @Override
    public void handleActivityResult(int requestCode, int resultCode, Intent data) {
        if (requestCode == LINK_ACTIVITY_REQUEST_CODE) {
            OpenPlaidLink openPlaidLink = new OpenPlaidLink();
            LinkResult linkResult = openPlaidLink.parseResult(resultCode, data);

            if (linkResult instanceof LinkSuccess) {
                Log.d(TAG, "Link Success: " + linkResult); // qwe
            } else if (linkResult instanceof LinkExit) {
                Log.d(TAG, "Link Exit: " + linkResult);
            } else {
                Log.d(TAG, "Unhandled Result: " + linkResult);
            }
        }
    }
}
