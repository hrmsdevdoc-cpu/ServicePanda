const axios = require('axios');

async function testAdminPasswords() {
  const baseUrl = 'http://localhost:3000';
  
  console.log('🔍 Testing different admin passwords...');
  
  const passwordsToTest = [
    'admin123',
    'admin',
    'password',
    '123456',
    'servicepanda',
    'ServicePanda123'
  ];
  
  for (const password of passwordsToTest) {
    try {
      console.log(`\n🔐 Testing password: "${password}"`);
      
      const loginResponse = await axios.post(`${baseUrl}/api/admin/login`, {
        username: 'admin',
        password: password
      });
      
      console.log('✅ LOGIN SUCCESS!');
      console.log(`   Username: admin`);
      console.log(`   Password: ${password}`);
      console.log(`   Token: ${loginResponse.data.token.substring(0, 30)}...`);
      
      // Test campaign sending with this token
      console.log('\n📱 Testing campaign sending...');
      
      const campaignResponse = await axios.post(
        `${baseUrl}/api/admin/sms/campaigns/1/send`,
        {
          customerIds: [9],
          adminName: 'admin'
        },
        {
          headers: {
            'Authorization': `Bearer ${loginResponse.data.token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      console.log('✅ CAMPAIGN SENT SUCCESSFULLY!');
      console.log(`   Success Count: ${campaignResponse.data.successCount}`);
      console.log(`   Fail Count: ${campaignResponse.data.failCount}`);
      
      console.log('\n🎉 FOUND THE CORRECT PASSWORD!');
      console.log('💡 Use these credentials in your admin panel:');
      console.log(`   Username: admin`);
      console.log(`   Password: ${password}`);
      
      return; // Exit on success
      
    } catch (error) {
      if (error.response?.status === 401) {
        console.log('❌ Invalid credentials');
      } else {
        console.log('❌ Error:', error.response?.data?.message || error.message);
      }
    }
  }
  
  console.log('\n❌ None of the tested passwords worked.');
  console.log('💡 You may need to reset the admin password or check the database directly.');
}

testAdminPasswords();
