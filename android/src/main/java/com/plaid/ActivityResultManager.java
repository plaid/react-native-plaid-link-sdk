package com.plaid;

import android.content.Intent;

import java.util.HashMap;

public class ActivityResultManager extends HashMap<Integer, ActivityResultHandler> {

    public void dispatch(int requestCode, int resultCode, Intent data) {
        ActivityResultHandler handler = get(requestCode);
        if (handler != null) {
            handler.handleActivityResult(requestCode, resultCode, data);
        }
    }
}