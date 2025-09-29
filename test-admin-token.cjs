const jwt = require('jsonwebtoken');

// Generate a test admin token
const JWT_SECRET = process.env.ADMIN_JWT_SECRET || "admin-jwt-secret-key";

const token = jwt.sign(
  { username: "admin", role: "admin", type: "admin" },
  JWT_SECRET,
  { expiresIn: "24h" }
);

console.log('Generated admin token:', token);

// Test the API with the token
const fetch = require('node-fetch');

async function testAPI() {
  try {
    const response = await fetch('http://localhost:3000/api/admin/providers/report', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'x-admin-token': token
      }
    });
    
    console.log('Response status:', response.status);
    
    if (response.ok) {
      const data = await response.json();
      console.log('Success! Data:', JSON.stringify(data, null, 2));
    } else {
      const errorText = await response.text();
      console.log('Error response:', errorText);
    }
  } catch (error) {
    console.error('Error:', error.message);
  }
}

testAPI();

