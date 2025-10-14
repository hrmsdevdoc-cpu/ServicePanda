const { SmsService } = require('./server/smsService.ts');

async function testSmsService() {
  const smsService = new SmsService();
  
  console.log('🔍 Testing SMS Service with phone number formatting...');
  
  try {
    const success = await smsService.sendSms(
      '0485901942', // Your test number
      'Test SMS from ServicePanda SMS Service!\n\nThis message is sent using the updated SMS service with proper phone number formatting.\n\nIf you receive this, everything is working correctly!\n\nBest regards,\nServicePanda Team',
      {
        adminName: 'Test Admin',
        customerId: 999,
        smsType: '1st_sent'
      }
    );
    
    if (success) {
      console.log('🎉 SMS sent successfully through SMS Service!');
    } else {
      console.log('❌ SMS failed through SMS Service');
    }
    
  } catch (error) {
    console.error('❌ Error testing SMS Service:', error);
  }
}

testSmsService();