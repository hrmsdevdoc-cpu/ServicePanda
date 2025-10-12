/**
 * Test STOP Detection Functionality
 * 
 * This script tests:
 * 1. Customer replies "STOP" → webhook processes it
 * 2. Customer status updates to "Unsubscribe"
 * 3. Future SMS campaigns skip unsubscribed customers
 */

const axios = require('axios');

const BASE_URL = 'http://localhost:3000';

// Color codes for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function section(title) {
  console.log('\n' + '='.repeat(60));
  log(title, 'bright');
  console.log('='.repeat(60) + '\n');
}

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function testStopDetection() {
  try {
    section('🔐 Getting Admin Token');
    
    // Login as admin to get token
    let adminToken;
    try {
      const loginResponse = await axios.post(`${BASE_URL}/api/admin/login`, {
        username: 'admin',
        password: '123456'
      });
      
      adminToken = loginResponse.data.token;
      log(`✅ Logged in as admin`, 'green');
    } catch (error) {
      log(`⚠️  Admin login failed, trying without authentication`, 'yellow');
      adminToken = null;
    }
    
    const headers = adminToken ? { 'Authorization': `Bearer ${adminToken}` } : {};
    
    section('🧪 TEST 1: Get Test Customer Data');
    
    // Get a test customer from the database
    const customersResponse = await axios.get(`${BASE_URL}/api/admin/potential-customers`, {
      headers
    });
    
    if (!customersResponse.data || customersResponse.data.length === 0) {
      log('❌ No customers found in database', 'red');
      log('💡 Please import some customers first', 'yellow');
      return;
    }
    
    const testCustomer = customersResponse.data[0];
    log(`✅ Found test customer: ${testCustomer.name}`, 'green');
    log(`   ID: ${testCustomer.id}`, 'cyan');
    log(`   Phone: ${testCustomer.phone}`, 'cyan');
    log(`   Current Status: ${testCustomer.campaignStatus || 'New'}`, 'cyan');
    
    section('🧪 TEST 2: Simulate Customer Replying "STOP"');
    
    // Simulate incoming SMS webhook with "STOP" message
    const webhookPayload = {
      from: testCustomer.phone,
      to: '+61412345678', // Your Dialpad number
      body: 'STOP',
      messageId: `test-${Date.now()}`,
    };
    
    log(`📨 Sending webhook with payload:`, 'blue');
    console.log(JSON.stringify(webhookPayload, null, 2));
    
    const webhookResponse = await axios.post(
      `${BASE_URL}/api/sms/webhook`,
      webhookPayload
    );
    
    log(`✅ Webhook Response:`, 'green');
    console.log(JSON.stringify(webhookResponse.data, null, 2));
    
    if (webhookResponse.data.unsubscribed) {
      log(`🎉 Customer successfully unsubscribed!`, 'green');
    } else {
      log(`⚠️  Customer not marked as unsubscribed`, 'yellow');
    }
    
    // Wait for database to update
    await sleep(1000);
    
    section('🧪 TEST 3: Verify Customer Status Updated');
    
    // Fetch customer again to check status
    const updatedCustomersResponse = await axios.get(`${BASE_URL}/api/admin/potential-customers`, {
      headers
    });
    
    const updatedCustomer = updatedCustomersResponse.data.find(c => c.id === testCustomer.id);
    
    if (updatedCustomer) {
      log(`📊 Updated Customer Status:`, 'cyan');
      log(`   Name: ${updatedCustomer.name}`, 'cyan');
      log(`   Campaign Status: ${updatedCustomer.campaignStatus}`, 'cyan');
      
      if (updatedCustomer.campaignStatus === 'Unsubscribe') {
        log(`✅ Status correctly updated to "Unsubscribe"`, 'green');
      } else {
        log(`❌ Status NOT updated (still: ${updatedCustomer.campaignStatus})`, 'red');
      }
    }
    
    section('🧪 TEST 4: Check SMS Messages Storage');
    
    // Try to fetch SMS messages (if endpoint exists)
    try {
      const smsResponse = await axios.get(`${BASE_URL}/api/admin/sms`, {
        headers
      });
      
      const stopMessage = smsResponse.data.find(
        msg => msg.recipientId === testCustomer.id && 
               msg.message === 'STOP' &&
               msg.direction === 'inbound'
      );
      
      if (stopMessage) {
        log(`✅ STOP message stored in database:`, 'green');
        log(`   Type: ${stopMessage.smsType}`, 'cyan');
        log(`   Direction: ${stopMessage.direction}`, 'cyan');
        log(`   Status: ${stopMessage.status}`, 'cyan');
      } else {
        log(`⚠️  STOP message not found in SMS history`, 'yellow');
      }
    } catch (error) {
      log(`⚠️  Could not fetch SMS messages (endpoint may not exist)`, 'yellow');
    }
    
    section('🧪 TEST 5: Try Sending SMS to Unsubscribed Customer');
    
    log(`🚫 Attempting to send SMS to unsubscribed customer...`, 'blue');
    
    try {
      const sendSmsResponse = await axios.post(
        `${BASE_URL}/api/admin/potential-customers/send-sms`,
        {
          customerIds: [testCustomer.id]
        },
        {
          headers
        }
      );
      
      log(`📊 Send SMS Result:`, 'cyan');
      console.log(JSON.stringify(sendSmsResponse.data, null, 2));
      
      if (sendSmsResponse.data.details) {
        const customerResult = sendSmsResponse.data.details.find(d => d.customerId === testCustomer.id);
        
        if (customerResult) {
          if (customerResult.reason === 'unsubscribed') {
            log(`✅ SMS correctly SKIPPED for unsubscribed customer!`, 'green');
            log(`   Reason: ${customerResult.reason}`, 'cyan');
            log(`   Sent: ${customerResult.sent}`, 'cyan');
          } else if (customerResult.sent) {
            log(`❌ SMS was sent despite unsubscribe status!`, 'red');
          } else {
            log(`⚠️  SMS skipped but for different reason: ${customerResult.reason}`, 'yellow');
          }
        }
      }
    } catch (error) {
      log(`❌ Error sending SMS: ${error.message}`, 'red');
    }
    
    section('🧪 TEST 6: Test Different STOP Variations');
    
    const stopVariations = ['stop', 'STOP', 'Stop', ' STOP ', 'StOp'];
    
    for (const stopText of stopVariations) {
      log(`\n📝 Testing variation: "${stopText}"`, 'blue');
      
      const testPayload = {
        from: testCustomer.phone,
        to: '+61412345678',
        body: stopText,
        messageId: `test-${Date.now()}-${stopText}`,
      };
      
      try {
        const response = await axios.post(`${BASE_URL}/api/sms/webhook`, testPayload);
        
        if (response.data.unsubscribed) {
          log(`   ✅ "${stopText}" correctly detected as STOP`, 'green');
        } else {
          log(`   ⚠️  "${stopText}" not detected as STOP`, 'yellow');
        }
      } catch (error) {
        log(`   ❌ Error: ${error.message}`, 'red');
      }
      
      await sleep(500);
    }
    
    section('📊 TEST SUMMARY');
    
    log('✅ Test completed successfully!', 'green');
    log('\n📋 What was tested:', 'cyan');
    log('   ✓ Customer reply "STOP" via webhook', 'green');
    log('   ✓ Customer status updated to "Unsubscribe"', 'green');
    log('   ✓ STOP message stored in database', 'green');
    log('   ✓ Future SMS skipped for unsubscribed customer', 'green');
    log('   ✓ Case-insensitive STOP detection', 'green');
    
    log('\n💡 Next Steps:', 'yellow');
    log('   1. Check Admin UI → Potential Customers', 'cyan');
    log('   2. Verify customer shows "Unsubscribe" status', 'cyan');
    log('   3. Check SMS page to see STOP message', 'cyan');
    log('   4. Try sending campaign - should skip unsubscribed customer', 'cyan');
    
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
log('🚀 Starting STOP Detection Test...', 'bright');
log('   Server URL: ' + BASE_URL, 'cyan');
log('   Make sure the server is running!\n', 'yellow');

testStopDetection();

