#!/usr/bin/env node

// Check what endpoints are available on the server
async function checkServerEndpoints() {
  console.log('🔍 Checking server endpoints...');
  
  const endpoints = [
    'http://localhost:3000/',
    'http://localhost:3000/api/health',
    'http://localhost:3000/api/service-categories',
    'http://localhost:3000/api/auth/login'
  ];
  
  for (const endpoint of endpoints) {
    try {
      console.log(`\n📡 Testing: ${endpoint}`);
      const response = await fetch(endpoint);
      console.log(`   Status: ${response.status}`);
      console.log(`   Content-Type: ${response.headers.get('content-type')}`);
      
      const text = await response.text();
      if (text.includes('<!DOCTYPE')) {
        console.log('   Response: HTML page (frontend)');
      } else if (text.startsWith('{') || text.startsWith('[')) {
        console.log('   Response: JSON API');
        console.log('   Data:', text.substring(0, 100) + '...');
      } else {
        console.log('   Response:', text.substring(0, 100) + '...');
      }
      
    } catch (error) {
      console.log(`   Error: ${error.message}`);
    }
  }
  
  console.log('\n💡 Analysis:');
  console.log('   If all endpoints return HTML, the frontend is running but API routes might not be set up');
  console.log('   If you get JSON responses, the API is working');
  console.log('   If you get connection errors, the server is not running');
}

checkServerEndpoints();
