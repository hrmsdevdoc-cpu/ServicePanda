#!/usr/bin/env node

/**
 * OneSignal iOS Test Script
 * 
 * This script tests OneSignal integration for iOS
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🧪 Testing OneSignal iOS Integration...\n');

// Test 1: Check if OneSignal package is installed
console.log('1️⃣ Checking OneSignal package installation...');
try {
  const packageJsonPath = path.join(__dirname, 'package.json');
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  
  if (packageJson.dependencies && packageJson.dependencies['react-native-onesignal']) {
    console.log('✅ react-native-onesignal found in dependencies');
    console.log(`   Version: ${packageJson.dependencies['react-native-onesignal']}`);
  } else {
    console.log('❌ react-native-onesignal not found in dependencies');
  }
} catch (error) {
  console.log('❌ Error reading package.json:', error.message);
}

// Test 2: Check if OneSignal is in Pods
console.log('\n2️⃣ Checking OneSignal in iOS Pods...');
try {
  const oneSignalPath = path.join(__dirname, 'ios', 'Pods', 'OneSignalXCFramework');
  if (fs.existsSync(oneSignalPath)) {
    console.log('✅ OneSignalXCFramework found in Pods');
  } else {
    console.log('❌ OneSignalXCFramework not found in Pods');
  }
  
  const reactNativeOneSignalPath = path.join(__dirname, 'ios', 'Pods', 'react-native-onesignal');
  if (fs.existsSync(reactNativeOneSignalPath)) {
    console.log('✅ react-native-onesignal found in Pods');
  } else {
    console.log('❌ react-native-onesignal not found in Pods');
  }
} catch (error) {
  console.log('❌ Error checking Pods:', error.message);
}

// Test 3: Check AppDelegate.mm configuration
console.log('\n3️⃣ Checking AppDelegate.mm configuration...');
try {
  const appDelegatePath = path.join(__dirname, 'ios', 'ServicePandaProvider', 'AppDelegate.mm');
  const appDelegateContent = fs.readFileSync(appDelegatePath, 'utf8');
  
  if (appDelegateContent.includes('#import <OneSignalFramework/OneSignalFramework.h>')) {
    console.log('✅ OneSignal import found in AppDelegate.mm');
  } else {
    console.log('❌ OneSignal import not found in AppDelegate.mm');
  }
  
  if (appDelegateContent.includes('[OneSignal initializeWithAppId:')) {
    console.log('✅ OneSignal initialization found in AppDelegate.mm');
  } else {
    console.log('❌ OneSignal initialization not found in AppDelegate.mm');
  }
} catch (error) {
  console.log('❌ Error reading AppDelegate.mm:', error.message);
}

// Test 4: Check Info.plist configuration
console.log('\n4️⃣ Checking Info.plist configuration...');
try {
  const infoPlistPath = path.join(__dirname, 'ios', 'ServicePandaProvider', 'Info.plist');
  const infoPlistContent = fs.readFileSync(infoPlistPath, 'utf8');
  
  if (infoPlistContent.includes('UIBackgroundModes')) {
    console.log('✅ Background modes found in Info.plist');
  } else {
    console.log('❌ Background modes not found in Info.plist');
  }
  
  if (infoPlistContent.includes('remote-notification')) {
    console.log('✅ Remote notifications enabled in Info.plist');
  } else {
    console.log('❌ Remote notifications not enabled in Info.plist');
  }
} catch (error) {
  console.log('❌ Error reading Info.plist:', error.message);
}

// Test 5: Check OneSignal service implementation
console.log('\n5️⃣ Checking OneSignal service implementation...');
try {
  const oneSignalServicePath = path.join(__dirname, 'src', 'services', 'oneSignalService.ts');
  if (fs.existsSync(oneSignalServicePath)) {
    console.log('✅ OneSignal service file exists');
    
    const serviceContent = fs.readFileSync(oneSignalServicePath, 'utf8');
    if (serviceContent.includes('react-native-onesignal')) {
      console.log('✅ OneSignal import found in service');
    } else {
      console.log('❌ OneSignal import not found in service');
    }
    
    if (serviceContent.includes('a3f5070d-9c46-44cd-8b0a-259df155ae94')) {
      console.log('✅ OneSignal App ID found in service');
    } else {
      console.log('❌ OneSignal App ID not found in service');
    }
  } else {
    console.log('❌ OneSignal service file not found');
  }
} catch (error) {
  console.log('❌ Error checking OneSignal service:', error.message);
}

console.log('\n🎯 Next Steps:');
console.log('1. Build and run the iOS app: npx react-native run-ios');
console.log('2. Check console logs for OneSignal initialization');
console.log('3. Test notification permissions');
console.log('4. Send a test notification from OneSignal dashboard');
console.log('5. Verify device appears in OneSignal dashboard');

console.log('\n📱 OneSignal App ID: a3f5070d-9c46-44cd-8b0a-259df155ae94');
console.log('🔧 Bundle ID: com.servicepandaprovider');

console.log('\n✨ OneSignal iOS Integration Test Complete!');
