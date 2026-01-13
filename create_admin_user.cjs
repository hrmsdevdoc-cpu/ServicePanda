const axios = require('axios');

async function createAdminUser() {
  const baseUrl = 'http://localhost:3000';
  
  console.log('🔧 Creating Admin User...');
  
  try {
    // Create admin user
    console.log('1. Creating admin user...');
    
    const createResponse = await axios.post(`${baseUrl}/api/setup/admin-user`, {
      username: 'admin',
      password: 'admin123'
    });
    
    console.log('✅ Admin user created successfully!');
    console.log('Response:', createResponse.data);
    
    // Test login
    console.log('\n2. Testing admin login...');
    
    const loginResponse = await axios.post(`${baseUrl}/api/admin/login`, {
      username: 'admin',
      password: 'admin123'
    });
    
    const token = loginResponse.data.token;
    console.log('✅ Admin login successful!');
    console.log(`   Token: ${token.substring(0, 30)}...`);
    
    console.log('\n🎉 Admin setup complete! You can now:');
    console.log('   1. Go to your admin panel');
    console.log('   2. Login with username: admin, password: admin123');
    console.log('   3. Send SMS campaigns successfully!');
    
  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
    
    if (error.response?.status === 400 && error.response?.data?.message?.includes('already exists')) {
      console.log('\n💡 Admin user already exists. Trying to login...');
      
      try {
        const loginResponse = await axios.post(`${baseUrl}/api/admin/login`, {
          username: 'admin',
          password: 'admin123'
        });
        
        const token = loginResponse.data.token;
        console.log('✅ Admin login successful!');
        console.log(`   Token: ${token.substring(0, 30)}...`);
        
        console.log('\n🎉 Admin is ready! You can now send campaigns.');
        
      } catch (loginError) {
        console.error('❌ Login failed:', loginError.response?.data || loginError.message);
      }
    }
  }
}

createAdminUser();
