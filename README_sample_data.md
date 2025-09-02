# Sample Data for Potential Customers Import

This directory contains sample CSV files that can be used to test the Potential Customers import functionality in the admin panel.

## 📁 Available Files

### 1. `sample_potential_customers.csv`
- **10 customers** across all Australian states
- Perfect for basic testing
- File size: ~1KB

### 2. `sample_potential_customers_large.csv`
- **25 customers** with more diverse locations
- Includes regional cities and towns
- File size: ~2KB

## 📋 Required CSV Format

The CSV files must have the following columns in this exact order:

| Column | Required | Description | Example |
|--------|----------|-------------|---------|
| Name | ✅ | Full name of the customer | "John Doe" |
| Email | ✅ | Valid email address | "john.doe@example.com" |
| Phone | ✅ | Australian phone number | "+61412345678" |
| State | ✅ | Australian state abbreviation | "QLD", "NSW", "VIC" |
| City | ✅ | City or town name | "Brisbane", "Sydney" |
| Address | ✅ | Full street address | "123 Main St, Brisbane QLD 4000" |

## 🚀 How to Test Import Functionality

### Method 1: Using the "Create Test Data" Button
1. Go to Admin Panel → Potential Customers
2. Click the **"Create Test Data"** button
3. This will create 50 customers across 5 import batches automatically

### Method 2: Using CSV File Import
1. Go to Admin Panel → Potential Customers
2. Click **"Import Customers"** button
3. Enter an **Import Name** (e.g., "Brisbane Campaign")
4. Click **"Choose File"** and select one of the sample CSV files
5. Click **"Import"** to upload the data

### Method 3: Using the Test Import API
```bash
curl -X POST http://localhost:4000/api/admin/potential-customers/test-import \
  -H "Content-Type: application/json" \
  -H "x-admin-token: YOUR_ADMIN_TOKEN" \
  -d '{"importName": "API Test Import"}'
```

## 📊 Sample Data Coverage

### States Covered:
- **QLD**: Brisbane, Gold Coast, Townsville, Cairns, Toowoomba
- **NSW**: Sydney, Newcastle, Wollongong, Central Coast, Wagga Wagga
- **VIC**: Melbourne, Geelong, Ballarat
- **WA**: Perth, Fremantle, Rockingham
- **SA**: Adelaide, Port Adelaide, Mount Gambier
- **TAS**: Hobart, Launceston
- **NT**: Darwin, Alice Springs
- **ACT**: Canberra, Belconnen

### Data Characteristics:
- ✅ **Realistic Names**: Common Australian names
- ✅ **Valid Emails**: Proper email format
- ✅ **Australian Phone Numbers**: +61 format
- ✅ **Real Addresses**: Actual Australian addresses
- ✅ **State Coverage**: All Australian states and territories
- ✅ **City Diversity**: Major cities and regional towns

## 🔧 CSV Format Requirements

### Important Notes:
1. **Headers Required**: First row must contain column names
2. **Comma Separated**: Use commas to separate values
3. **Quotes for Addresses**: Addresses with commas must be in quotes
4. **No Empty Rows**: Remove any blank lines
5. **UTF-8 Encoding**: Save files in UTF-8 format

### Example Format:
```csv
Name,Email,Phone,State,City,Address
John Doe,john.doe@example.com,+61412345678,QLD,Brisbane,"123 Main St, Brisbane QLD 4000"
```

## 🧪 Testing Scenarios

### 1. Basic Import Test
- Use `sample_potential_customers.csv`
- Expected: 10 customers imported
- Verify: All customers appear in the list

### 2. Large Import Test
- Use `sample_potential_customers_large.csv`
- Expected: 25 customers imported
- Verify: Filtering works by state and import group

### 3. SMS Functionality Test
- Import customers using either file
- Select customers and click "Send SMS"
- Verify: SMS status badges update correctly

### 4. Filtering Test
- Import multiple batches using "Create Test Data"
- Test filters by:
  - Import Group (dropdown)
  - State (dropdown)
  - Search term (text input)

## 📈 Expected Results

After importing the sample data, you should see:

### Customer List:
- ✅ All customers displayed with their details
- ✅ SMS status badges (initially "Not Sent")
- ✅ Import group information
- ✅ Creation date and time

### Import Groups:
- ✅ Grouped by import name
- ✅ Customer count per group
- ✅ Creation date for each group

### SMS Campaigns:
- ✅ Ability to select customers
- ✅ Send SMS functionality
- ✅ Status tracking (1st SMS, 2nd SMS)

## 🐛 Troubleshooting

### Common Issues:
1. **File not uploading**: Check file format and size
2. **Import fails**: Verify CSV headers match exactly
3. **Data not appearing**: Check admin authentication
4. **SMS not sending**: Verify SMS service integration

### Debug Steps:
1. Check browser console for errors
2. Verify server logs for import errors
3. Test with smaller file first
4. Ensure proper admin authentication

## 📞 Support

If you encounter issues with the import functionality:
1. Check the server logs for detailed error messages
2. Verify the CSV format matches the requirements
3. Test with the provided sample files first
4. Ensure all required fields are present and valid 