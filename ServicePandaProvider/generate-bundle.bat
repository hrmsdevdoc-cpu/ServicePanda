@echo off
echo Generating React Native bundle for Android...

REM Clean previous builds
echo Cleaning previous builds...
cd android
call gradlew clean
cd ..

REM Remove existing bundle
if exist "android/app/src/main/assets" (
    echo Removing existing assets folder...
    rmdir /s /q "android/app/src/main/assets"
)

REM Create assets directory
echo Creating assets directory...
mkdir "android/app/src/main/assets"

REM Generate the bundle
echo Generating bundle...
npx react-native bundle --platform android --dev false --entry-file index.js --bundle-output android/app/src/main/assets/index.android.bundle --assets-dest android/app/src/main/res

echo Bundle generation complete!
echo Now build your APK with: cd android && gradlew assembleRelease
pause
