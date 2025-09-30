#!/usr/bin/env node

// Create a test customer for notification testing
// Use built-in fetch (Node.js 18+) or fallback
if (typeof fetch === 'undefined') {
  global.fetch = require('node-fetch');
}

const SERVER_URL = 'http://localhost:3000';

async function createTestCustomer() {
  console.log('👤 Creating test customer for notification testing...');
  
  try {
    const response = await fetch(`${SERVER_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'test@customer.com',
        password: 'password123',
        firstName: 'Test',
        lastName: 'Customer',
        phone: '+1234567890',
        userType: 'customer'
      })
    });

    if (response.ok) {
      const data = await response.json();
      console.log('✅ Test customer created successfully!');
      console.log(`📧 Email: test@customer.com`);
      console.log(`🔑 Password: password123`);
      console.log(`👤 User ID: ${data.user?.id}`);
    } else if (response.status === 400) {
      console.log('ℹ️ Test customer already exists - that\'s fine!');
    } else {
      const errorData = await response.text();
      console.error('❌ Failed to create test customer:', errorData);
    }
  } catch (error) {
    console.error('❌ Error creating test customer:', error.message);
  }
}

createTestCustomer();
