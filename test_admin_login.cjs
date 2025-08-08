const https = require('https');
const http = require('http');

// Disable SSL verification for local testing
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

async function testAdminLogin() {
  try {
    console.log('Testing admin login...');
    
    const loginData = {
      username: 'admin',
      password: 'admin123'
    };
    
    const postData = JSON.stringify(loginData);
    
    const options = {
      hostname: 'localhost',
      port: 4000,
      path: '/api/admin/login',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };
    
    const req = http.request(options, (res) => {
      console.log('Status:', res.statusCode);
      console.log('Headers:', res.headers);
      
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const response = JSON.parse(data);
          console.log('Login response:', response);
          
          if (response.token) {
            console.log('\n✅ Admin login successful!');
            console.log('Token:', response.token);
            
            // Now test the service category creation
            testServiceCategoryCreation(response.token);
          } else {
            console.log('❌ Login failed - no token received');
          }
        } catch (error) {
          console.error('Error parsing response:', error);
          console.log('Raw response:', data);
        }
      });
    });
    
    req.on('error', (error) => {
      console.error('Request error:', error);
    });
    
    req.write(postData);
    req.end();
    
  } catch (error) {
    console.error('Error:', error);
  }
}

async function testServiceCategoryCreation(token) {
  try {
    console.log('\nTesting service category creation...');
    
    const categoryData = {
      name: 'Test Service Type',
      description: 'This is a test service type',
      icon: 'home',
      active: true,
      popular: false
    };
    
    const postData = JSON.stringify(categoryData);
    
    const options = {
      hostname: 'localhost',
      port: 4000,
      path: '/api/admin/service-categories',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-admin-token': token,
        'Content-Length': Buffer.byteLength(postData)
      }
    };
    
    const req = http.request(options, (res) => {
      console.log('Service category creation status:', res.statusCode);
      
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const response = JSON.parse(data);
          console.log('Service category creation response:', response);
          
          if (res.statusCode === 200) {
            console.log('✅ Service category created successfully!');
          } else {
            console.log('❌ Service category creation failed');
          }
        } catch (error) {
          console.error('Error parsing response:', error);
          console.log('Raw response:', data);
        }
      });
    });
    
    req.on('error', (error) => {
      console.error('Request error:', error);
    });
    
    req.write(postData);
    req.end();
    
  } catch (error) {
    console.error('Error:', error);
  }
}

testAdminLogin(); 