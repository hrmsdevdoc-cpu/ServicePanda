async function testDynamicData() {
  console.log('Testing provider reports API for dynamic data...');
  
  try {
    // First, let's create a simple admin token for testing
    const adminToken = 'test-admin-token-' + Date.now();
    
    const response = await fetch('http://localhost:4000/api/admin/reports/providers', {
      headers: {
        'x-admin-token': adminToken
      }
    });
    
    console.log(`Status: ${response.status}`);
    
    if (response.ok) {
      const data = await response.json();
      console.log('=== PROVIDER REPORTS DATA ===');
      console.log('Total Providers:', data.totalProviders);
      console.log('Approved Providers:', data.approvedProviders);
      console.log('Pending Providers:', data.pendingProviders);
      console.log('Rejected Providers:', data.rejectedProviders);
      console.log('New This Month:', data.newProvidersThisMonth);
      console.log('Approval Rate:', data.approvalRate + '%');
      console.log('Average Rating:', data.avgRating);
      console.log('Job Completion Rate:', data.jobCompletionRate + '%');
      console.log('Average Response Time:', data.avgResponseTime);
      console.log('Average Approval Time:', data.avgApprovalTime);
      
      console.log('\n=== MONTHLY DATA ===');
      if (data.monthlyJoins && data.monthlyJoins.length > 0) {
        data.monthlyJoins.forEach((month, index) => {
          console.log(`${month.month}: Total=${month.count}, Approved=${month.approved}, Pending=${month.pending}, Rejected=${month.rejected}`);
        });
      } else {
        console.log('No monthly data available');
      }
      
      console.log('\n=== TOP SERVICE CATEGORIES ===');
      if (data.topServiceCategories && data.topServiceCategories.length > 0) {
        data.topServiceCategories.forEach((cat, index) => {
          console.log(`${cat.category}: ${cat.providerCount} providers`);
        });
      } else {
        console.log('No service categories data available');
      }
      
      // Check if data is dynamic by making another request
      console.log('\n=== TESTING DATA DYNAMICS ===');
      setTimeout(async () => {
        const response2 = await fetch('http://localhost:4000/api/admin/reports/providers', {
          headers: {
            'x-admin-token': adminToken
          }
        });
        
        if (response2.ok) {
          const data2 = await response2.json();
          console.log('Second request - Total Providers:', data2.totalProviders);
          console.log('Data is dynamic if values change between requests');
        }
      }, 1000);
      
    } else {
      const errorText = await response.text();
      console.log('Error:', errorText);
    }
  } catch (error) {
    console.error('Request failed:', error.message);
  }
}

testDynamicData();
