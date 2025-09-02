package com.servicepandaprovider;

import android.app.Application;
import com.facebook.react.ReactApplication;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint;
import com.facebook.react.defaults.DefaultReactNativeHost;
import com.facebook.soloader.SoLoader;
import com.reactnativecommunity.asyncstorage.AsyncStoragePackage;
// import com.imagepicker.ImagePickerPackage; // Temporarily commented out
import java.util.List;
import java.util.Arrays;

public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost =
      new DefaultReactNativeHost(this) {
        @Override
        public boolean getUseDeveloperSupport() {
          return true; // Default to true for development
        }

        @Override
        protected List<ReactPackage> getPackages() {
          return Arrays.asList(
              new MainReactPackage(),
              new AsyncStoragePackage()
              // new ImagePickerPackage() // Temporarily commented out
              // Add other packages here
          );
        }

        @Override
        protected String getJSMainModuleName() {
          return "index";
        }

        @Override
        protected boolean isNewArchEnabled() {
          return false; // Default to false for stability
        }

        @Override
        protected Boolean isHermesEnabled() {
          return true; // Enable Hermes for modern JavaScript engine
        }
      };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);
    // Default to false for stability
    if (false) {
      DefaultNewArchitectureEntryPoint.load();
    }
  }
}
