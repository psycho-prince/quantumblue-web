// Test Clerk verifyToken with the actual package
const { verifyToken } = require('./node_modules/@clerk/nextjs/server');

// Create a minimal valid-looking JWT for testing
// This is just to test the API shape, not to actually verify
const testToken = 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';

async function test() {
  console.log('Testing verifyToken API...\n');
  
  try {
    console.log('Test 1: verifyToken with fake token (should fail with 401-like error)');
    const result1 = await verifyToken(testToken, { secretKey: 'test-secret' });
    console.log('  Result:', JSON.stringify(result1, null, 2).substring(0, 500));
  } catch(e) {
    console.log('  Error:', e.message);
    console.log('  Type:', e.constructor.name);
    console.log('  Has status?', 'status' in e);
    console.log('  Status:', e.status);
    console.log('  Is it catchable?', true);
  }
  
  console.log('\nTest 2: Check if verifyToken accepts secretKey option');
  try {
    // Try with a different option shape
    await verifyToken(testToken, { secretKey: 'test' });
  } catch(e) {
    console.log('  Error (expected):', e.message.substring(0, 100));
  }
  
  console.log('\nTest 3: Check verifyToken function signature');
  console.log('  verifyToken.length:', verifyToken.length);
  console.log('  verifyToken.name:', verifyToken.name);
}
test();
