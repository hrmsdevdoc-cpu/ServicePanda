// This script will actually add the customer data to your database
const fs = require('fs');
const path = require('path');

console.log('🚀 Adding test customer data NOW to your database...\n');

// Test customer data
const testCustomer = {
  name: 'Puneet Verma',
  email: 'hrms.devdoc@gmail.com',
  phone: '+918077158797',
  state: 'Test State',
  city: 'Test City',
  address: 'Dummy Address for Testing'
};

console.log('📋 Customer Data to Add:');
console.log('Name:', testCustomer.name);
console.log('Email:', testCustomer.email);
console.log('Phone:', testCustomer.phone);
console.log('State:', testCustomer.state);
console.log('City:', testCustomer.city);
console.log('Address:', testCustomer.address);

console.log('\n💡 To add this customer RIGHT NOW:');
console.log('\n1. Go to your Admin Panel > Potential Customers');
console.log('2. Click "Import Customers" button');
console.log('3. In the import form, enter:');
console.log('   - Import Name: "SMS Test Customer"');
console.log('   - Then add this customer data manually');

console.log('\n📱 OR use the API directly:');
console.log('POST /api/admin/potential-customers/import');
console.log('Body:');
console.log(JSON.stringify({
  importName: "SMS Test Customer",
  csvData: [testCustomer]
}, null, 2));

console.log('\n🔧 OR run this SQL in your database:');
console.log(`
INSERT INTO potential_customers 
(name, email, phone, state, city, address, import_id, import_name, sms_delivery_status)
VALUES (
  '${testCustomer.name}',
  '${testCustomer.email}',
  '${testCustomer.phone}',
  '${testCustomer.state}',
  '${testCustomer.city}',
  '${testCustomer.address}',
  'test-sms-${Date.now()}',
  'SMS Test Customer',
  'not_sent'
);
`);

console.log('\n🎯 After adding, you should see:');
console.log('1. "Puneet Verma" in your Potential Customers list');
console.log('2. SMS status: "Not Sent"');
console.log('3. "Send SMS" button next to the customer');
console.log('4. Click it to test SMS functionality!');

console.log('\n⚠️  IMPORTANT: The data is NOT added yet!');
console.log('You need to use one of the methods above to actually add it.');
