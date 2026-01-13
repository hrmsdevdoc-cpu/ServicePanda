@echo off
echo 🔧 Fixing React Native Push Notification Linking...

echo 📱 Step 1: Cleaning Android build...
cd android
call .\gradlew clean
cd ..

echo 📱 Step 2: Clearing React Native cache...
npx react-native start --reset-cache

echo 📱 Step 3: Rebuilding Android app...
npx react-native run-android

echo ✅ Push notification linking fix completed!
echo 📝 If you still get errors, try:
echo    1. Restart Metro bundler
echo    2. Uninstall and reinstall the app
echo    3. Check that react-native-push-notification is properly auto-linked

pause
