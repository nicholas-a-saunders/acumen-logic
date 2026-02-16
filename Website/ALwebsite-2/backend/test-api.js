/**
 * Simple API test script
 * Run with: node test-api.js
 */

const BASE_URL = process.env.BASE_URL || 'http://localhost:3001';

async function testHealth() {
  console.log('Testing /api/health...');
  try {
    const response = await fetch(`${BASE_URL}/api/health`);
    const data = await response.json();
    console.log('✓ Health check passed:', data);
    return true;
  } catch (err) {
    console.error('✗ Health check failed:', err.message);
    return false;
  }
}

async function testLeadSubmission() {
  console.log('\nTesting /api/lead...');
  const testPayload = {
    name: 'Test User',
    email: 'test@example.com',
    firm: 'Deloitte',
    termsAccepted: true,
    roadmapOptIn: true,
    scores: {
      numerical: { correct: 5, total: 7 },
      data: { correct: 6, total: 7 },
      logical: { correct: 4, total: 6 },
      overall: { correct: 15, total: 20 }
    },
    answers: { '1': 0, '2': 1, '3': 2 },
    timeRemaining: 120,
    timestamp: new Date().toISOString(),
    source: 'http://localhost:3000/diagnostic.html'
  };

  try {
    const response = await fetch(`${BASE_URL}/api/lead`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testPayload)
    });
    
    const data = await response.json();
    
    if (response.ok && data.success) {
      console.log('✓ Lead submission passed:', data);
      return true;
    } else {
      console.error('✗ Lead submission failed:', data);
      return false;
    }
  } catch (err) {
    console.error('✗ Lead submission error:', err.message);
    return false;
  }
}

async function testGetLeads() {
  console.log('\nTesting /api/leads...');
  try {
    const response = await fetch(`${BASE_URL}/api/leads`);
    const data = await response.json();
    console.log('✓ Get leads passed:', {
      total: data.total,
      count: data.count,
      leads_returned: data.leads ? data.leads.length : 0
    });
    return true;
  } catch (err) {
    console.error('✗ Get leads failed:', err.message);
    return false;
  }
}

async function testStats() {
  console.log('\nTesting /api/stats...');
  try {
    const response = await fetch(`${BASE_URL}/api/stats`);
    const data = await response.json();
    console.log('✓ Stats check passed:', data);
    return true;
  } catch (err) {
    console.error('✗ Stats check failed:', err.message);
    return false;
  }
}

async function runTests() {
  console.log('='.repeat(50));
  console.log('Acumen Logic Backend API Tests');
  console.log('='.repeat(50));
  console.log(`Base URL: ${BASE_URL}\n`);

  const results = {
    health: await testHealth(),
    lead: await testLeadSubmission(),
    leads: await testGetLeads(),
    stats: await testStats()
  };

  console.log('\n' + '='.repeat(50));
  console.log('Test Results Summary');
  console.log('='.repeat(50));
  Object.entries(results).forEach(([test, passed]) => {
    console.log(`${passed ? '✓' : '✗'} ${test}`);
  });

  const allPassed = Object.values(results).every(r => r);
  console.log('\n' + (allPassed ? '✓ All tests passed!' : '✗ Some tests failed'));
  process.exit(allPassed ? 0 : 1);
}

// Check if fetch is available (Node.js 18+)
if (typeof fetch === 'undefined') {
  console.error('Error: This script requires Node.js 18+ or install node-fetch');
  process.exit(1);
}

runTests().catch(err => {
  console.error('Test runner error:', err);
  process.exit(1);
});
