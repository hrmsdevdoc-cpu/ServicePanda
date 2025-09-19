const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Setting up ServicePanda Provider React Native App...\n');

// Check if we're in the right directory
if (!fs.existsSync('package.json')) {
  console.error('❌ Error: package.json not found. Please run this script from the ServicePandaProvider directory.');
  process.exit(1);
}

try {
  console.log('📦 Installing React Native CLI globally...');
  execSync('npm install -g @react-native-community/cli', { stdio: 'inherit' });
  
  console.log('\n🔧 Creating proper React Native project structure...');
  
  // Remove existing files that might conflict
  if (fs.existsSync('android')) {
    console.log('🗑️  Removing existing android directory...');
    execSync('rmdir /s /q android', { stdio: 'inherit' });
  }
  
  if (fs.existsSync('ios')) {
    console.log('🗑️  Removing existing ios directory...');
    execSync('rmdir /s /q ios', { stdio: 'inherit' });
  }
  
  console.log('\n📱 Initializing React Native project...');
  execSync('npx @react-native-community/cli init . --version 0.74.5 --skip-install', { stdio: 'inherit' });
  
  console.log('\n📦 Installing dependencies...');
  execSync('npm install', { stdio: 'inherit' });
  
  console.log('\n✅ Setup complete! You can now run:');
  console.log('   npm run android  - to run on Android');
  console.log('   npm run ios      - to run on iOS');
  console.log('   npm start        - to start Metro bundler');
  
} catch (error) {
  console.error('❌ Setup failed:', error.message);
  console.log('\n💡 Manual setup instructions:');
  console.log('1. Delete the current ServicePandaProvider folder');
  console.log('2. Run: npx @react-native-community/cli init ServicePandaProvider --version 0.74.5');
  console.log('3. Copy the src/ folder and other custom files');
  console.log('4. Run: npm install');
  console.log('5. Run: npm run android');
}
