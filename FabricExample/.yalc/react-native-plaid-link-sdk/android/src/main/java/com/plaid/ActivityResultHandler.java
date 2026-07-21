package com.plaid;

import android.content.Intent;

public interface ActivityResultHandler {
    void handleActivityResult(int requestCode, int resultCode, Intent data);
}