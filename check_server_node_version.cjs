/**
 * Check Server Node.js Version
 * Check if server has built-in fetch support
 */

console.log('🔍 Checking Node.js version and fetch support...');
console.log('');

function checkNodeVersion() {
  console.log('📊 Node.js Version:', process.version);
  console.log('📱 Node.js Major Version:', process.version.split('.')[0].replace('v', ''));
  
  const majorVersion = parseInt(process.version.split('.')[0].replace('v', ''));
  
  if (majorVersion >= 18) {
    console.log('✅ Node.js 18+ detected - built-in fetch available');
  } else {
    console.log('❌ Node.js < 18 - built-in fetch NOT available');
    console.log('💡 Need to use node-fetch or upgrade Node.js');
  }
  
  console.log('');
}

async function testFetch() {
  console.log('🧪 Testing fetch availability...');
  
  try {
    if (typeof fetch === 'undefined') {
      console.log('❌ fetch is undefined - not available');
      console.log('💡 Need to import node-fetch or use polyfill');
      return false;
    } else {
      console.log('✅ fetch is available globally');
      
      // Test actual fetch call
      const response = await fetch('https://httpbin.org/json');
      if (response.ok) {
        console.log('✅ fetch working - successful HTTP call');
        return true;
      } else {
        console.log('⚠️ fetch available but HTTP call failed');
        return false;
      }
    }
  } catch (error) {
    console.log('❌ fetch test failed:', error.message);
    return false;
  }
}

function provideSolution(fetchWorking) {
  console.log('');
  console.log('🎯 SOLUTION:');
  
  if (fetchWorking) {
    console.log('   ✅ fetch working - server should work fine');
    console.log('   💡 Check if there are other imports causing issues');
  } else {
    console.log('   ❌ fetch not working - need to add polyfill');
    console.log('   🔧 Add this to top of oneSignalAdminService.ts:');
    console.log('   ');
    console.log('   // Polyfill for older Node.js versions');
    console.log('   import fetch from "node-fetch";');
    console.log('   ');
    console.log('   OR install node-fetch: npm install node-fetch');
  }
}

// Run checks
async function runServerCheck() {
  console.log('⏰ Time:', new Date().toLocaleString());
  console.log('🚀 Checking server environment...');
  console.log('');
  
  checkNodeVersion();
  const fetchWorking = await testFetch();
  provideSolution(fetchWorking);
  
  console.log('');
  console.log('📋 SUMMARY:');
  console.log(`   Node.js: ${process.version}`);
  console.log(`   Fetch: ${fetchWorking ? 'Working' : 'Not Working'}`);
}

runServerCheck();
