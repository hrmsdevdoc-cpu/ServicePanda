@echo off
echo ========================================
echo Building ServicePandaProvider Debug APK (Working)
echo ========================================

REM Clean previous builds
echo Cleaning previous builds...
cd android
call gradlew clean
cd ..

REM Remove existing bundle and assets
if exist "android/app/src/main/assets" (
    echo Removing existing assets folder...
    rmdir /s /q "android/app/src/main/assets"
)

REM Create assets directory
echo Creating assets directory...
mkdir "android/app/src/main/assets"

REM Generate the bundle ONLY (no assets)
echo Generating JavaScript bundle...
npx react-native bundle --platform android --dev false --entry-file index.js --bundle-output android/app/src/main/assets/index.android.bundle

REM Check if bundle was created
if not exist "android/app/src/main/assets/index.android.bundle" (
    echo ERROR: Bundle generation failed!
    pause
    exit /b 1
)

echo Bundle generated successfully!
echo Bundle size: 
dir "android/app/src/main/assets/index.android.bundle" | find "index.android.bundle"

REM Build the Debug APK (which works)
echo Building Debug APK...
cd android
call gradlew assembleDebug

REM Check if APK was created
if exist "app/build/outputs/apk/debug/app-debug.apk" (
    echo.
    echo ========================================
    echo BUILD SUCCESSFUL!
    echo ========================================
    echo APK location: app/build/outputs/apk/debug/app-debug.apk
    echo APK size:
    dir "app/build/outputs/apk/debug/app-debug.apk" | find "app-debug.apk"
    echo.
    echo NOTE: This is a DEBUG APK that should work on your device.
    echo The "Unable to load script" error should be resolved.
) else (
    echo.
    echo ========================================
    echo BUILD FAILED!
    echo ========================================
    echo Check the error messages above
)

cd ..
echo.
echo Build process complete!
echo.
echo IMPORTANT: Install the debug APK on your device to test.
echo The JavaScript bundle is now properly included.
pause
