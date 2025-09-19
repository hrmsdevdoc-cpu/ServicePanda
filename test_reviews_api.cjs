const https = require('https');

// Test the reviews API endpoint
function testReviewsAPI() {
  const options = {
    hostname: 'api.servicepanda.com.au',
    path: '/api/customer/reviews',
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      // You'll need to update this with your actual session cookie
      'Cookie': 'connect.sid=s%3AjjL6Yn4sjcJM2l6PHMQNxF2yU9aUQQJT.L9JGjEQT5tGnGxlrBJYXmLJTzfHLn7BhSE4XQZS40aA'
    },
    rejectUnauthorized: false
  };

  const req = https.request(options, (res) => {
    console.log(`Status: ${res.statusCode}`);
    console.log(`Headers: ${JSON.stringify(res.headers, null, 2)}`);

    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });

    res.on('end', () => {
      console.log('\nResponse Body:');
      try {
        const jsonData = JSON.parse(data);
        console.log(JSON.stringify(jsonData, null, 2));
      } catch (err) {
        console.log('Raw response:', data);
      }
    });
  });

  req.on('error', (error) => {
    console.error('Error:', error);
  });

  req.end();
}

console.log('🔍 Testing customer reviews API...');
testReviewsAPI();
