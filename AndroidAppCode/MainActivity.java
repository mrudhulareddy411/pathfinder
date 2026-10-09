package com.simats.pathfinder;

import android.annotation.SuppressLint;
import android.os.Bundle;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import androidx.appcompat.app.AppCompatActivity;

public class MainActivity extends AppCompatActivity {

    private WebView webView;

    @SuppressLint("SetJavaScriptEnabled")
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        
        // Hide the action bar for a full-screen app experience
        if (getSupportActionBar() != null) {
            getSupportActionBar().hide();
        }

        // Initialize WebView
        webView = new WebView(this);
        setContentView(webView);

        // Configure WebView Settings
        WebSettings webSettings = webView.getSettings();
        webSettings.setJavaScriptEnabled(true);
        webSettings.setDomStorageEnabled(true); // Required for React/Vite
        webSettings.setLoadsImagesAutomatically(true);
        webSettings.setMixedContentMode(WebSettings.MIXED_CONTENT_ALWAYS_ALLOW);

        // Ensure links open within the app, not in the external browser
        webView.setWebViewClient(new WebViewClient());

        // Connect to your local Vite development server
        // Replace this IP with your current Wi-Fi IP if it changes.
        webView.loadUrl("http://10.248.189.208:5174"); 
    }

    // Handle back button presses to navigate within the web app
    @Override
    public void onBackPressed() {
        if (webView.canGoBack()) {
            webView.goBack();
        } else {
            super.onBackPressed();
        }
    }
}
