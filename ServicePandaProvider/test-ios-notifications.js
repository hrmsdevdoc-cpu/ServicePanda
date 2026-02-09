#!/usr/bin/env node

/**
 * iOS Push Notification Test Script
 * 
 * This script tests the iOS push notification setup for ServicePandaProvider
 * Run this after completing the iOS configuration steps
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🧪 Testing iOS Push Notification Setup for ServicePandaProvider...\n');

// Test 1: Check if OneSignal pod is installed
console.log('1️⃣ Checking OneSignal pod installation...');
try {
  const podfilePath = path.join(__dirname, 'ios', 'Podfile');
  const podfileContent = fs.readFileSync(podfilePath, 'utf8');
  
  if (podfileContent.includes('OneSignalXCFramework') || podfileContent.includes('react-native-onesignal')) {
    console.log('✅ OneSignal configuration found in Podfile');
  } else {
    console.log('❌ OneSignal configuration not found in Podfile');
    console.log('💡 OneSignal is automatically included via react-native-onesignal');
  }
} catch (error) {
  console.log('❌ Error reading Podfile:', error.message);
}

// Test 2: Check AppDelegate.mm configuration
console.log('\n2️⃣ Checking AppDelegate.mm configuration...');
try {
  const appDelegatePath = path.join(__dirname, 'ios', 'ServicePandaProvider', 'AppDelegate.mm');
  const appDelegateContent = fs.readFileSync(appDelegatePath, 'utf8');
  
  if (appDelegateContent.includes('#import <OneSignal/OneSignal.h>')) {
    console.log('✅ OneSignal import found in AppDelegate.mm');
  } else {
    console.log('❌ OneSignal import not found in AppDelegate.mm');
  }
  
  if (appDelegateContent.includes('[OneSignal initialize:')) {
    console.log('✅ OneSignal initialization found in AppDelegate.mm');
  } else {
    console.log('❌ OneSignal initialization not found in AppDelegate.mm');
  }
} catch (error) {
  console.log('❌ Error reading AppDelegate.mm:', error.message);
}

// Test 3: Check Info.plist configuration
console.log('\n3️⃣ Checking Info.plist configuration...');
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
  
  if (infoPlistContent.includes('processing')) {
    console.log('✅ Background processing enabled in Info.plist');
  } else {
    console.log('❌ Background processing not enabled in Info.plist');
  }
  
  if (infoPlistContent.includes('fetch')) {
    console.log('✅ Background fetch enabled in Info.plist');
  } else {
    console.log('❌ Background fetch not enabled in Info.plist');
  }
  
  if (infoPlistContent.includes('UIUserNotificationSettings')) {
    console.log('✅ Notification actions configured in Info.plist');
  } else {
    console.log('❌ Notification actions not configured in Info.plist');
  }
} catch (error) {
  console.log('❌ Error reading Info.plist:', error.message);
}

// Test 4: Check iOS notification service
console.log('\n4️⃣ Checking iOS notification service...');
try {
  const iosServicePath = path.join(__dirname, 'src', 'services', 'iosNotificationService.ts');
  if (fs.existsSync(iosServicePath)) {
    console.log('✅ iOS notification service file exists');
  } else {
    console.log('❌ iOS notification service file not found');
  }
} catch (error) {
  console.log('❌ Error checking iOS notification service:', error.message);
}

// Test 5: Check package.json dependencies
console.log('\n5️⃣ Checking package.json dependencies...');
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

// Test 6: Check if pods are installed
console.log('\n6️⃣ Checking if pods are installed...');
try {
  const podsPath = path.join(__dirname, 'ios', 'Pods');
  if (fs.existsSync(podsPath)) {
    console.log('✅ Pods directory exists');
    
    // Check if OneSignal is in Pods
    const oneSignalPath = path.join(podsPath, 'OneSignalXCFramework');
    if (fs.existsSync(oneSignalPath)) {
      console.log('✅ OneSignalXCFramework found in Pods');
    } else {
      console.log('❌ OneSignalXCFramework not found in Pods');
      console.log('💡 Run: cd ios && pod install');
    }
  } else {
    console.log('❌ Pods directory not found');
    console.log('💡 Run: cd ios && pod install');
  }
} catch (error) {
  console.log('❌ Error checking pods:', error.message);
}

console.log('\n🎯 Next Steps:');
console.log('1. Open ServicePandaProvider.xcworkspace in Xcode');
console.log('2. Enable Push Notifications capability');
console.log('3. Enable Background Modes capability');
console.log('4. Enable Remote notifications (optionally Background fetch / Background processing if you use them)');
console.log('5. Configure APNs certificate in OneSignal dashboard');
console.log('6. Build and run on a physical iOS device');
console.log('7. Test notification permissions and delivery');
console.log('8. Test notification actions (Accept/Decline Lead)');

console.log('\n📚 For detailed setup instructions, see: IOS_PUSH_NOTIFICATION_SETUP.md');

console.log('\n✨ iOS Push Notification Setup Test Complete!');
