const { SmsService } = require('./server/smsService.ts');

async function testSmsDirectDebug() {
  console.log('🔍 Testing SMS service directly with debug...');
  
  try {
    const smsService = new SmsService();
    
    // Test with John Smith's number
    const phone = '0463333334';
    const message = `Test SMS from ServicePanda Campaign System - ${new Date().toLocaleTimeString()}`;
    
    console.log(`📱 Sending SMS to: ${phone}`);
    console.log(`📝 Message: ${message}`);
    
    const result = await smsService.sendSms(phone, message, {
      adminName: 'admin',
      customerId: 2,
      smsType: '1st_sent'
    });
    
    console.log(`✅ SMS Result: ${result}`);
    
    if (result) {
      console.log('🎉 SMS sent successfully!');
    } else {
      console.log('❌ SMS failed to send');
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('Stack:', error.stack);
  }
}

testSmsDirectDebug();
