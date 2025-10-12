/**
 * Test Automatic "Won" Status
 * 
 * When a potential customer creates a service request,
 * their status should automatically update to "Won"
 */

const axios = require('axios');

const BASE_URL = 'http://localhost:3000';

// Create axios instance with cookie support
const httpClient = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Color codes
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  magenta: '\x1b[35m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function section(title) {
  console.log('\n' + '='.repeat(70));
  log(title, 'bright');
  console.log('='.repeat(70) + '\n');
}

async function testWonStatusAutomation() {
  try {
    section('🔐 Step 1: Admin Login');
    
    const adminLogin = await axios.post(`${BASE_URL}/api/admin/login`, {
      username: 'admin',
      password: '123456'
    });
    
    const adminToken = adminLogin.data.token;
    log(`✅ Admin logged in successfully`, 'green');
    
    const adminHeaders = { 'Authorization': `Bearer ${adminToken}` };
    
    section('📋 Step 2: Get Potential Customer');
    
    const customersResponse = await axios.get(`${BASE_URL}/api/admin/potential-customers`, {
      headers: adminHeaders
    });
    
    // Find a customer with "New" or "1st SMS" status
    const testCustomer = customersResponse.data.find(c => 
      c.campaignStatus === 'New' || 
      c.campaignStatus === 'Added to Campaign' ||
      c.campaignStatus === '1st SMS'
    );
    
    if (!testCustomer) {
      log('❌ No suitable test customer found', 'red');
      log('💡 Need a customer with "New" or "1st SMS" status', 'yellow');
      return;
    }
    
    log(`✅ Found test customer:`, 'green');
    log(`   Name: ${testCustomer.name}`, 'cyan');
    log(`   Phone: ${testCustomer.phone}`, 'cyan');
    log(`   Current Status: ${testCustomer.campaignStatus}`, 'cyan');
    log(`   ID: ${testCustomer.id}`, 'cyan');
    
    section('👤 Step 3: Find or Create Matching User Account');
    
    // Check if user exists with this phone
    let customerUser;
    let customerToken;
    
    try {
      // Try to login (user might already exist)
      const loginAttempt = await httpClient.post('/api/login', {
        email: testCustomer.email,
        password: 'Test@123'
      });
      
      customerUser = loginAttempt.data;
      customerToken = loginAttempt.data.token || 'session-based-auth';
      log(`✅ User already exists - logged in successfully`, 'green');
      log(`   User ID: ${customerUser.id}`, 'cyan');
      log(`   Email: ${customerUser.email}`, 'cyan');
    } catch (error) {
      log(`⚠️  User doesn't exist - creating new account...`, 'yellow');
      
      // Create new user account with matching phone
      try {
        const nameParts = testCustomer.name.split(' ');
        const firstName = nameParts[0] || 'Test';
        const lastName = nameParts.slice(1).join(' ') || 'User';
        
        const registerResponse = await httpClient.post('/api/register', {
          email: testCustomer.email,
          password: 'Test@123',
          firstName: firstName,
          lastName: lastName,
          phoneNumber: testCustomer.phone
        });
        
        customerUser = registerResponse.data;
        customerToken = 'session-cookie';
        log(`✅ New user created successfully`, 'green');
        log(`   User ID: ${customerUser.id}`, 'cyan');
        log(`   Email: ${customerUser.email}`, 'cyan');
        log(`   Phone: ${customerUser.phoneNumber}`, 'cyan');
        log(`   Session authenticated via cookies ✓`, 'green');
      } catch (regError) {
        log(`❌ Failed to create user: ${regError.response?.data?.message || regError.message}`, 'red');
        return;
      }
    }
    
    const customerHeaders = { 'Authorization': `Bearer ${customerToken}` };
    
    section('🔍 Step 4: Verify Customer Status BEFORE Service Request');
    
    const beforeStatus = await axios.get(`${BASE_URL}/api/admin/potential-customers`, {
      headers: adminHeaders
    });
    
    const customerBefore = beforeStatus.data.find(c => c.id === testCustomer.id);
    log(`📊 Status BEFORE: ${customerBefore.campaignStatus}`, 'yellow');
    
    section('🛠️  Step 5: Create Service Request');
    
    log(`📝 Creating service request as customer...`, 'blue');
    
    const serviceRequestData = {
      categoryId: 1, // Assuming category 1 exists
      postcode: testCustomer.postcode || '2000',
      description: 'Test service request for Won status automation',
      preferredContactTime: 'morning',
      urgency: 'within_week'
    };
    
    try {
      const serviceRequestResponse = await httpClient.post(
        '/api/service-requests',
        serviceRequestData
      );
      
      log(`✅ Service request created successfully!`, 'green');
      log(`   Request ID: ${serviceRequestResponse.data.request.id}`, 'cyan');
      log(`   Message: ${serviceRequestResponse.data.message}`, 'cyan');
    } catch (error) {
      log(`❌ Failed to create service request: ${error.response?.data?.message || error.message}`, 'red');
      return;
    }
    
    // Wait for database update
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    section('✅ Step 6: Verify Customer Status AFTER Service Request');
    
    const afterStatus = await axios.get(`${BASE_URL}/api/admin/potential-customers`, {
      headers: adminHeaders
    });
    
    const customerAfter = afterStatus.data.find(c => c.id === testCustomer.id);
    
    log(`📊 Status Comparison:`, 'cyan');
    log(`   BEFORE: ${customerBefore.campaignStatus}`, 'yellow');
    log(`   AFTER:  ${customerAfter.campaignStatus}`, 'magenta');
    
    if (customerAfter.campaignStatus === 'Won') {
      log(`\n🎉 SUCCESS! Customer automatically marked as "Won"!`, 'green');
    } else {
      log(`\n❌ FAILED! Customer status did not update to "Won"`, 'red');
      log(`   Expected: Won`, 'red');
      log(`   Got: ${customerAfter.campaignStatus}`, 'red');
    }
    
    section('📊 TEST SUMMARY');
    
    log('✅ Test completed!', 'green');
    log('\n📋 What was tested:', 'cyan');
    log('   ✓ Potential customer identified', 'green');
    log('   ✓ User account created/verified', 'green');
    log('   ✓ Service request submitted', 'green');
    log('   ✓ Status automatically updated', customerAfter.campaignStatus === 'Won' ? 'green' : 'red');
    
    log('\n💡 Business Logic:', 'yellow');
    log('   When a potential customer submits a service request,', 'cyan');
    log('   their status should automatically change to "Won"', 'cyan');
    log('   because they converted from lead → actual customer!', 'cyan');
    
  } catch (error) {
    log(`\n❌ TEST FAILED: ${error.message}`, 'red');
    if (error.response) {
      log(`   Status: ${error.response.status}`, 'red');
      log(`   Data: ${JSON.stringify(error.response.data, null, 2)}`, 'red');
    }
    if (error.stack) {
      console.log('\n📋 Stack Trace:');
      console.log(error.stack);
    }
  }
}

// Run the test
log('🚀 Starting Won Status Automation Test...', 'bright');
log('   Server URL: ' + BASE_URL, 'cyan');
log('   Make sure the server is running!\n', 'yellow');

testWonStatusAutomation();

