// Simple test script to verify the compiled server is working
import { spawn } from 'child_process';
import { setTimeout } from 'timers/promises';

console.log('🧪 Testing compiled JavaScript server...\n');

// Start the server
const server = spawn('node', ['server-js/index.js'], {
  stdio: 'pipe',
  cwd: process.cwd()
});

// Wait for server to start
await setTimeout(3000);

// Test the health endpoint
try {
  const response = await fetch('http://localhost:3000/api/health');
  const data = await response.json();
  
  console.log('✅ Server is running!');
  console.log('📱 Health check response:', data);
  console.log('\n🎯 Your server is ready for cPanel deployment!');
  console.log('\n📋 Next steps:');
  console.log('1. Upload the server-js folder to your server');
  console.log('2. Set cPanel startup file to: server-js/index.js');
  console.log('3. Make sure your .env file is uploaded');
  console.log('4. Run npm install in the server-js directory');
  
} catch (error) {
  console.log('❌ Health check failed:', error.message);
}

// Stop the server
server.kill();
console.log('\n🛑 Test server stopped');
