# Release Build Troubleshooting Guide

## Common Issues and Solutions

### 1. "Unable to load script" Error
**Symptoms:** App works in development/emulator but crashes on physical device with "Unable to load script" error.

**Causes:**
- Missing or corrupted `index.android.bundle` file
- Bundle not generated for release build
- Assets not properly included in APK

**Solutions:**
1. **Generate Bundle Manually:**
   ```bash
   npx react-native bundle --platform android --dev false --entry-file index.js --bundle-output android/app/src/main/assets/index.android.bundle --assets-dest android/app/src/main/res
   ```

2. **Use the Build Script:**
   ```bash
   build-release.bat
   ```

3. **Check Bundle Location:**
   Ensure `android/app/src/main/assets/index.android.bundle` exists before building APK.

### 2. Bundle Generation Fails
**Symptoms:** Bundle generation command fails or produces errors.

**Solutions:**
1. **Clean Project:**
   ```bash
   cd android
   gradlew clean
   cd ..
   ```

2. **Clear Metro Cache:**
   ```bash
   npx react-native start --reset-cache
   ```

3. **Check Dependencies:**
   ```bash
   npm install
   ```

### 3. APK Build Fails
**Symptoms:** Gradle build fails during APK generation.

**Solutions:**
1. **Check Java Version:**
   Ensure Java 17 is installed and JAVA_HOME is set correctly.

2. **Increase Memory:**
   In `android/gradle.properties`:
   ```
   org.gradle.jvmargs=-Xmx4g -XX:+UseParallelGC
   ```

3. **Check ProGuard Rules:**
   Ensure ProGuard rules don't interfere with React Native classes.

### 4. App Crashes on Launch
**Symptoms:** APK installs but crashes immediately on launch.

**Solutions:**
1. **Check Logs:**
   ```bash
   adb logcat | grep -E "(ReactNative|AndroidRuntime|FATAL)"
   ```

2. **Verify Bundle:**
   Check if bundle file is properly included in APK:
   ```bash
   aapt list -a app-release.apk | grep assets
   ```

3. **Test Debug Build:**
   Try debug build first to isolate release-specific issues.

## Build Process Checklist

### Before Building:
- [ ] All dependencies installed (`npm install`)
- [ ] Metro cache cleared if needed
- [ ] Android project cleaned (`gradlew clean`)

### Bundle Generation:
- [ ] Assets directory exists (`android/app/src/main/assets/`)
- [ ] Bundle file generated (`index.android.bundle`)
- [ ] Bundle size is reasonable (usually 1-10 MB)

### APK Build:
- [ ] Bundle file is in correct location
- [ ] All assets are included
- [ ] ProGuard rules are correct
- [ ] Signing configuration is valid

### Testing:
- [ ] APK installs on device
- [ ] App launches without crash
- [ ] All features work as expected
- [ ] Performance is acceptable

## Quick Fix Commands

```bash
# Complete rebuild process
cd ServicePandaProvider
build-release.bat

# Manual bundle generation
npx react-native bundle --platform android --dev false --entry-file index.js --bundle-output android/app/src/main/assets/index.android.bundle --assets-dest android/app/src/main/res

# Build APK only
cd android
gradlew assembleRelease
cd ..

# Clean everything and rebuild
cd android
gradlew clean
cd ..
rm -rf android/app/src/main/assets
mkdir android/app/src/main/assets
npx react-native bundle --platform android --dev false --entry-file index.js --bundle-output android/app/src/main/assets/index.android.bundle --assets-dest android/app/src/main/res
cd android
gradlew assembleRelease
cd ..
```

## Common Error Messages

### "Unable to load script"
- **Solution:** Generate bundle manually before building APK

### "Bundle not found"
- **Solution:** Check assets directory and bundle file location

### "Metro bundler not running"
- **Solution:** Bundle should be generated offline for release builds

### "ProGuard obfuscation failed"
- **Solution:** Check ProGuard rules and disable minification if needed

## Performance Tips

1. **Bundle Optimization:**
   - Use `--dev false` flag for production bundles
   - Enable Hermes engine
   - Minimize bundle size by removing unused code

2. **Build Optimization:**
   - Use parallel builds in Gradle
   - Enable build cache
   - Use appropriate memory settings

3. **Testing:**
   - Test on multiple devices
   - Test with different Android versions
   - Monitor memory usage and performance
