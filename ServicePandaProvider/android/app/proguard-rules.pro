# Add project specific ProGuard rules here.
# You can control the set of applied configuration files using the
# proguardFiles setting in build.gradle.

# React Native specific rules
-keep class com.facebook.react.** { *; }
-keep class com.facebook.hermes.** { *; }
-keep class com.facebook.jni.** { *; }

# Keep JavaScript bundle
-keep class com.facebook.react.bridge.** { *; }
-keep class com.facebook.react.uimanager.** { *; }

# Keep native modules
-keep class com.facebook.react.modules.** { *; }

# Keep AsyncStorage
-keep class com.reactnativecommunity.asyncstorage.** { *; }

# Keep Image Picker
-keep class com.imagepicker.** { *; }

# Keep React Native Vector Icons
-keep class com.oblador.vectoricons.** { *; }

# Keep React Native Paper
-keep class com.callstack.reactnativepaper.** { *; }

# Keep React Navigation
-keep class com.swmansion.reanimated.** { *; }
-keep class com.reactnavigation.** { *; }

# Keep Stripe
-keep class com.stripe.** { *; }

# Keep React Query
-keep class com.tanstack.** { *; }

# General Android rules
-keepattributes *Annotation*
-keepattributes SourceFile,LineNumberTable
-keep public class * extends java.lang.Exception

# Keep JavaScript bundle file
-keep class com.facebook.react.bridge.JSBundleLoader { *; }
