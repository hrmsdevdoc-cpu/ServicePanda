@echo off
echo 🔍 OneSignal Integration Troubleshooting Script
echo ============================================
echo.
echo App ID: a3f5070d-9c46-44cd-8b0a-259df155ae94
echo Bundle ID: com.servicepandaprovider
echo.

echo 📱 Step 1: Clean build to ensure proper linking...
cd android
call .\gradlew clean
cd ..

echo 📱 Step 2: Clear React Native cache...
npx react-native start --reset-cache &

echo 📱 Step 3: Start ADB logcat to monitor OneSignal logs...
echo Run this in a separate terminal: adb logcat | grep -i onesignal
echo.

echo 📱 Step 4: Build and run app in debug mode...
npx react-native run-android --variant=debug

echo.
echo 🔍 Troubleshooting Steps:
echo 1. Watch the Metro bundler logs for OneSignal initialization
echo 2. Check ADB logcat for OneSignal debug messages:
echo    adb logcat | findstr OneSignal
echo 3. Look for these success messages:
echo    - "OneSignal DEBUG logging enabled"
echo    - "OneSignal initialized with App ID"
echo    - "Push subscription status: true"
echo    - "SUCCESS: Device is fully registered"
echo.
echo 4. If device doesn't register, check:
echo    - Internet connection
echo    - Google Play Services on device
echo    - Notification permissions granted
echo    - Bundle ID matches OneSignal app configuration
echo.
echo 5. Test on REAL DEVICE (not emulator) for best results
echo.

pause
