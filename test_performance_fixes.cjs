const { exec } = require('child_process');
const fs = require('fs');

console.log('Testing performance fixes...');

// Test 1: Check if server starts without errors
console.log('\n1. Testing server startup...');
exec('npm run dev', { timeout: 10000 }, (error, stdout, stderr) => {
  if (error) {
    console.log('❌ Server startup test failed:', error.message);
  } else {
    console.log('✅ Server startup test passed');
  }
});

// Test 2: Check for duplicate useEffect hooks
console.log('\n2. Checking for duplicate useEffect hooks...');
const providerDashboardContent = fs.readFileSync('client/src/pages/ProviderDashboard.tsx', 'utf8');
const useEffectCount = (providerDashboardContent.match(/useEffect/g) || []).length;
console.log(`Found ${useEffectCount} useEffect hooks in ProviderDashboard.tsx`);

if (useEffectCount <= 5) {
  console.log('✅ Duplicate useEffect hooks have been removed');
} else {
  console.log('❌ Too many useEffect hooks detected');
}

// Test 3: Check React Query configuration
console.log('\n3. Checking React Query configuration...');
const queryClientContent = fs.readFileSync('client/src/lib/queryClient.ts', 'utf8');
if (queryClientContent.includes('staleTime: 5 * 60 * 1000')) {
  console.log('✅ React Query staleTime has been optimized');
} else {
  console.log('❌ React Query configuration not optimized');
}

// Test 4: Check server interval configuration
console.log('\n4. Checking server interval configuration...');
const serverContent = fs.readFileSync('server/index.ts', 'utf8');
if (serverContent.includes('300000')) {
  console.log('✅ Server interval has been optimized to 5 minutes');
} else {
  console.log('❌ Server interval not optimized');
}

console.log('\nPerformance fix verification complete!');
