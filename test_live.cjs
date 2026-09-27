// Reproduce the exact checkout flow against the live server
const https = require('https');

// First, get a valid Clerk token by signing in via the API
// We can't do that without credentials, so let's check what happens
// when we hit the endpoint with the exact same payload the frontend sends

console.log('=== Testing live endpoint behavior ===\n');

// Test 1: POST with no auth - should get 401
const data1 = JSON.stringify({ plan: 'STARTER' });
const req1 = https.request({
  hostname: 'quantum-blue.in',
  path: '/api/billing/checkout',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(data1),
  }
}, (res) => {
  let body = '';
  res.on('data', c => body += c);
  res.on('end', () => {
    console.log('Test 1 - No auth:');
    console.log('  Status:', res.statusCode);
    console.log('  Body:', body.substring(0, 200));
    console.log('  Expected: 401\n');
    
    // Test 2: POST with invalid Bearer token - should get 401
    const data2 = JSON.stringify({ plan: 'STARTER' });
    const req2 = https.request({
      hostname: 'quantum-blue.in',
      path: '/api/billing/checkout',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer invalidtoken123',
        'Content-Length': Buffer.byteLength(data2),
      }
    }, (res2) => {
      let body2 = '';
      res2.on('data', c => body2 += c);
      res2.on('end', () => {
        console.log('Test 2 - Invalid Bearer token:');
        console.log('  Status:', res2.statusCode);
        console.log('  Body:', body2.substring(0, 300));
        console.log('  Expected: 401\n');
        
        // Test 3: POST with valid-looking but unverifiable token
        // This simulates what happens when Clerk middleware fails
        const data3 = JSON.stringify({ plan: 'STARTER' });
        const req3 = https.request({
          hostname: 'quantum-blue.in',
          path: '/api/billing/checkout',
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
            'Content-Length': Buffer.byteLength(data3),
          }
        }, (res3) => {
          let body3 = '';
          res3.on('data', c => body3 += c);
          res3.on('end', () => {
            console.log('Test 3 - Fake but well-formed JWT:');
            console.log('  Status:', res3.statusCode);
            console.log('  Body:', body3.substring(0, 500));
            console.log('  Expected: 401 (token verification fails)\n');
            
            // Test 4: POST with valid plan but no body
            const req4 = https.request({
              hostname: 'quantum-blue.in',
              path: '/api/billing/checkout',
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Content-Length': 0,
              }
            }, (res4) => {
              let body4 = '';
              res4.on('data', c => body4 += c);
              res4.on('end', () => {
                console.log('Test 4 - Empty body:');
                console.log('  Status:', res4.statusCode);
                console.log('  Body:', body4.substring(0, 200));
                console.log('  Expected: 400 or 500 (JSON parse error)\n');
              });
            });
            req4.end();
          });
        });
        req3.end();
      });
    });
    req2.end();
  });
});
req1.write(data1);
req1.end();
