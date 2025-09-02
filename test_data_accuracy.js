async function testDataAccuracy() {
  console.log('Testing data accuracy for provider reports...');
  
  try {
    // Create a simple admin token for testing
    const adminToken = 'test-admin-token-' + Date.now();
    
    const response = await fetch('http://localhost:4000/api/admin/reports/providers', {
      headers: {
        'x-admin-token': adminToken
      }
    });
    
    console.log(`Status: ${response.status}`);
    
    if (response.ok) {
      const data = await response.json();
      
      console.log('=== DATA ACCURACY CHECK ===');
      console.log('Total Providers (from summary):', data.totalProviders);
      console.log('Approved Providers:', data.approvedProviders);
      console.log('Pending Providers:', data.pendingProviders);
      console.log('Rejected Providers:', data.rejectedProviders);
      
      // Calculate total from monthly data
      let totalFromMonthlyData = 0;
      let approvedFromMonthlyData = 0;
      let pendingFromMonthlyData = 0;
      let rejectedFromMonthlyData = 0;
      
      console.log('\n=== MONTHLY DATA BREAKDOWN ===');
      if (data.monthlyJoins && data.monthlyJoins.length > 0) {
        data.monthlyJoins.forEach((month, index) => {
          console.log(`${month.month}: Total=${month.count}, Approved=${month.approved}, Pending=${month.pending}, Rejected=${month.rejected}`);
          totalFromMonthlyData += month.count;
          approvedFromMonthlyData += month.approved;
          pendingFromMonthlyData += month.pending;
          rejectedFromMonthlyData += month.rejected;
        });
      } else {
        console.log('No monthly data available');
      }
      
      console.log('\n=== ACCURACY ANALYSIS ===');
      console.log('Total from summary:', data.totalProviders);
      console.log('Total from monthly data:', totalFromMonthlyData);
      console.log('Difference:', data.totalProviders - totalFromMonthlyData);
      
      console.log('\nApproved from summary:', data.approvedProviders);
      console.log('Approved from monthly data:', approvedFromMonthlyData);
      console.log('Difference:', data.approvedProviders - approvedFromMonthlyData);
      
      console.log('\nPending from summary:', data.pendingProviders);
      console.log('Pending from monthly data:', pendingFromMonthlyData);
      console.log('Difference:', data.pendingProviders - pendingFromMonthlyData);
      
      console.log('\nRejected from summary:', data.rejectedProviders);
      console.log('Rejected from monthly data:', rejectedFromMonthlyData);
      console.log('Difference:', data.rejectedProviders - rejectedFromMonthlyData);
      
      if (data.totalProviders === totalFromMonthlyData) {
        console.log('\n✅ DATA IS ACCURATE - Summary and monthly data match!');
      } else {
        console.log('\n❌ DATA MISMATCH - Summary and monthly data do not match!');
        console.log('This explains why the chart shows different numbers than the summary cards.');
      }
      
    } else {
      const errorText = await response.text();
      console.log('Error:', errorText);
    }
  } catch (error) {
    console.error('Request failed:', error.message);
  }
}

testDataAccuracy();
