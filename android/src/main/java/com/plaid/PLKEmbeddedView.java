package com.plaid;

import android.content.Context;
import android.util.AttributeSet;
import android.widget.LinearLayout;

public class PLKEmbeddedView extends LinearLayout {

    public PLKEmbeddedView(Context context) {
        super(context);
        initView();
    }

    public PLKEmbeddedView(Context context, AttributeSet attrs, int defStyle) {
        super(context, attrs, defStyle);
        initView();
    }

    public PLKEmbeddedView(Context context, AttributeSet attrs) {
        super(context, attrs);
        initView();
    }

    public void onFinishInflate(){
        super.onFinishInflate();
    }

    private void initView() {
        inflate(getContext(), R.layout.plk_embedded_view, this);
    }
}