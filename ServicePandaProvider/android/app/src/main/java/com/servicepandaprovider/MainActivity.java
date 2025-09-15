package com.servicepandaprovider;

import android.content.Context;
import android.content.res.Configuration;
import android.os.Bundle;
import com.facebook.react.ReactActivity;
import com.facebook.react.ReactActivityDelegate;
import com.facebook.react.defaults.DefaultReactActivityDelegate;
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint;

public class MainActivity extends ReactActivity {

  @Override
  protected String getMainComponentName() {
    // This must match the name you used in AppRegistry.registerComponent in index.js
    return "ServicePandaProvider";
  }

  @Override
  protected void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
  }

  @Override
  protected void attachBaseContext(Context newBase) {
    // Prevent font scaling issues
    Configuration configuration = newBase.getResources().getConfiguration();
    configuration.fontScale = 1.0f; // Force font scale to 1.0
    Context context = newBase.createConfigurationContext(configuration);
    super.attachBaseContext(context);
  }

  @Override
  protected ReactActivityDelegate createReactActivityDelegate() {
    return new DefaultReactActivityDelegate(
        this,
        getMainComponentName(),
        DefaultNewArchitectureEntryPoint.getFabricEnabled());
  }
}
