// Simple script to add test customer data
console.log('🧪 Adding test potential customer for SMS testing...\n');

// Test customer data
const testCustomer = {
  name: 'Puneet Verma',
  email: 'hrms.devdoc@gmail.com',
  phone: '+918077158797',
  state: 'Test State',
  city: 'Test City',
  address: 'Dummy Address for Testing',
  importId: 'test-sms-' + Date.now(),
  importName: 'SMS Test Customer'
};

console.log('Customer Data to Add:');
console.log('Name:', testCustomer.name);
console.log('Email:', testCustomer.email);
console.log('Phone:', testCustomer.phone);
console.log('State:', testCustomer.state);
console.log('City:', testCustomer.city);
console.log('Address:', testCustomer.address);
console.log('Import ID:', testCustomer.importId);
console.log('Import Name:', testCustomer.importName);

console.log('\n📋 To add this customer, you can:');
console.log('\nOption 1: Use Admin Panel');
console.log('1. Go to Admin Panel > Potential Customers');
console.log('2. Click "Import Customers"');
console.log('3. Create a CSV with this data or use the manual import');

console.log('\nOption 2: Use API Endpoint');
console.log('POST /api/admin/potential-customers/import');
console.log('Body: { "importName": "' + testCustomer.importName + '", "csvData": [...] }');

console.log('\nOption 3: Direct Database Insert');
console.log('Run this SQL in your database:');
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
  '${testCustomer.importId}',
  '${testCustomer.importName}',
  'not_sent'
);
`);

console.log('\n📱 After adding the customer, you can test SMS by:');
console.log('1. Finding "Puneet Verma" in the Potential Customers list');
console.log('2. Clicking the "Send SMS" button');
console.log('3. Or using API: POST /api/admin/potential-customers/{id}/send-sms');

