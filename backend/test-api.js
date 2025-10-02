/**
 * SecondMarket API Testing Script
 * 
 * This script tests all major API endpoints to validate functionality.
 * Run with: node backend/test-api.js
 * 
 * Prerequisites:
 * - MongoDB running
 * - Backend server running on port 5000
 * - Database seeded with estados and municipios
 */

const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

const API_URL = 'http://localhost:5000/api';
let authToken = '';
let userId = '';
let listingId = '';
let estadoId = '';
let municipioId = '';
let secondUserId = '';
let secondAuthToken = '';

// Test results tracking
const results = {
  passed: 0,
  failed: 0,
  tests: []
};

// Helper functions
const log = (message, type = 'info') => {
  const colors = {
    info: '\x1b[36m',
    success: '\x1b[32m',
    error: '\x1b[31m',
    warning: '\x1b[33m',
    reset: '\x1b[0m'
  };
  console.log(`${colors[type]}${message}${colors.reset}`);
};

const test = async (name, fn) => {
  try {
    await fn();
    log(`✓ ${name}`, 'success');
    results.passed++;
    results.tests.push({ name, status: 'passed' });
  } catch (error) {
    log(`✗ ${name}`, 'error');
    log(`  Error: ${error.message}`, 'error');
    results.failed++;
    results.tests.push({ name, status: 'failed', error: error.message });
  }
};

const assert = (condition, message) => {
  if (!condition) {
    throw new Error(message);
  }
};

// Test suites
const testLocations = async () => {
  log('\n=== Testing Location Endpoints ===', 'info');

  await test('GET /api/locations/estados - List all states', async () => {
    const response = await axios.get(`${API_URL}/locations/estados`);
    assert(response.status === 200, 'Status should be 200');
    assert(Array.isArray(response.data.data), 'Should return array');
    assert(response.data.data.length === 32, 'Should have 32 states');
    estadoId = response.data.data[0]._id;
  });

  await test('GET /api/locations/estados/:id/municipios - List municipalities by state', async () => {
    const response = await axios.get(`${API_URL}/locations/estados/${estadoId}/municipios`);
    assert(response.status === 200, 'Status should be 200');
    assert(Array.isArray(response.data.data), 'Should return array');
    assert(response.data.data.length > 0, 'Should have municipalities');
    municipioId = response.data.data[0]._id;
  });

  await test('GET /api/locations/municipios/:id - Get specific municipality', async () => {
    const response = await axios.get(`${API_URL}/locations/municipios/${municipioId}`);
    assert(response.status === 200, 'Status should be 200');
    assert(response.data.data._id === municipioId, 'Should return correct municipality');
  });
};

const testAuth = async () => {
  log('\n=== Testing Authentication Endpoints ===', 'info');

  const timestamp = Date.now();
  const testEmail = `test${timestamp}@example.com`;
  const testPassword = '12345678';

  await test('POST /api/auth/register - Register new user', async () => {
    const response = await axios.post(`${API_URL}/auth/register`, {
      email: testEmail,
      password: testPassword,
      nombre: 'Test User',
      telefono: '5551234567',
      estado: estadoId,
      municipio: municipioId
    });
    assert(response.status === 201, 'Status should be 201');
    assert(response.data.token, 'Should return token');
    assert(response.data.data.email === testEmail, 'Should return user data');
    authToken = response.data.token;
    userId = response.data.data._id;
  });

  await test('POST /api/auth/register - Reject duplicate email', async () => {
    try {
      await axios.post(`${API_URL}/auth/register`, {
        email: testEmail,
        password: testPassword,
        nombre: 'Test User 2',
        telefono: '5551234568',
        estado: estadoId,
        municipio: municipioId
      });
      throw new Error('Should have rejected duplicate email');
    } catch (error) {
      assert(error.response.status === 400, 'Should return 400 for duplicate');
    }
  });

  await test('POST /api/auth/register - Reject invalid password length', async () => {
    try {
      await axios.post(`${API_URL}/auth/register`, {
        email: `test${timestamp + 1}@example.com`,
        password: '1234567', // 7 characters
        nombre: 'Test User',
        telefono: '5551234567',
        estado: estadoId,
        municipio: municipioId
      });
      throw new Error('Should have rejected short password');
    } catch (error) {
      assert(error.response.status === 400, 'Should return 400 for invalid password');
    }
  });

  await test('POST /api/auth/login - Login with correct credentials', async () => {
    const response = await axios.post(`${API_URL}/auth/login`, {
      email: testEmail,
      password: testPassword
    });
    assert(response.status === 200, 'Status should be 200');
    assert(response.data.token, 'Should return token');
    authToken = response.data.token;
  });

  await test('POST /api/auth/login - Reject incorrect password', async () => {
    try {
      await axios.post(`${API_URL}/auth/login`, {
        email: testEmail,
        password: 'wrongpass'
      });
      throw new Error('Should have rejected incorrect password');
    } catch (error) {
      assert(error.response.status === 401, 'Should return 401 for wrong password');
    }
  });

  await test('GET /api/auth/me - Get current user', async () => {
    const response = await axios.get(`${API_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    assert(response.status === 200, 'Status should be 200');
    assert(response.data.data._id === userId, 'Should return current user');
  });

  // Create second user for interest testing
  const secondEmail = `test${timestamp + 100}@example.com`;
  await test('Create second user for interest testing', async () => {
    const response = await axios.post(`${API_URL}/auth/register`, {
      email: secondEmail,
      password: testPassword,
      nombre: 'Second Test User',
      telefono: '5551234569',
      estado: estadoId,
      municipio: municipioId
    });
    secondAuthToken = response.data.token;
    secondUserId = response.data.data._id;
  });
};

const testUsers = async () => {
  log('\n=== Testing User Endpoints ===', 'info');

  await test('GET /api/users/:id - Get user profile', async () => {
    const response = await axios.get(`${API_URL}/users/${userId}`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    assert(response.status === 200, 'Status should be 200');
    assert(response.data.data._id === userId, 'Should return correct user');
  });

  await test('PUT /api/users/:id - Update user profile', async () => {
    const response = await axios.put(`${API_URL}/users/${userId}`, {
      nombre: 'Updated Test User',
      telefono: '5559876543'
    }, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    assert(response.status === 200, 'Status should be 200');
    assert(response.data.data.nombre === 'Updated Test User', 'Should update name');
  });

  await test('PUT /api/users/:id - Reject unauthorized update', async () => {
    try {
      await axios.put(`${API_URL}/users/${userId}`, {
        nombre: 'Hacker'
      }, {
        headers: { Authorization: `Bearer ${secondAuthToken}` }
      });
      throw new Error('Should have rejected unauthorized update');
    } catch (error) {
      assert(error.response.status === 403, 'Should return 403 for unauthorized');
    }
  });
};

const testListings = async () => {
  log('\n=== Testing Listing Endpoints ===', 'info');

  await test('POST /api/listings - Create listing (without images for simplicity)', async () => {
    const response = await axios.post(`${API_URL}/listings`, {
      titulo: 'iPhone 12 Pro Test',
      descripcion: 'Test listing for automated testing',
      precio: 8500,
      estado: estadoId,
      municipio: municipioId,
      imagenes: ['https://via.placeholder.com/400'] // Placeholder for testing
    }, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    assert(response.status === 201, 'Status should be 201');
    assert(response.data.data.titulo === 'iPhone 12 Pro Test', 'Should create listing');
    listingId = response.data.data._id;
  });

  await test('GET /api/listings - List all listings (public)', async () => {
    const response = await axios.get(`${API_URL}/listings`);
    assert(response.status === 200, 'Status should be 200');
    assert(Array.isArray(response.data.data), 'Should return array');
    assert(response.data.data.length > 0, 'Should have listings');
  });

  await test('GET /api/listings?estado=X - Filter by state', async () => {
    const response = await axios.get(`${API_URL}/listings?estado=${estadoId}`);
    assert(response.status === 200, 'Status should be 200');
    assert(response.data.data.every(l => l.estado._id === estadoId), 'All listings should be from selected state');
  });

  await test('GET /api/listings?municipio=X - Filter by municipality', async () => {
    const response = await axios.get(`${API_URL}/listings?municipio=${municipioId}`);
    assert(response.status === 200, 'Status should be 200');
    assert(response.data.data.every(l => l.municipio._id === municipioId), 'All listings should be from selected municipality');
  });

  await test('GET /api/listings/:id - Get specific listing (public)', async () => {
    const response = await axios.get(`${API_URL}/listings/${listingId}`);
    assert(response.status === 200, 'Status should be 200');
    assert(response.data.data._id === listingId, 'Should return correct listing');
    assert(response.data.data.vistas >= 1, 'Should increment views');
  });

  await test('PUT /api/listings/:id - Update listing', async () => {
    const response = await axios.put(`${API_URL}/listings/${listingId}`, {
      precio: 8000,
      descripcion: 'Updated description'
    }, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    assert(response.status === 200, 'Status should be 200');
    assert(response.data.data.precio === 8000, 'Should update price');
  });

  await test('PUT /api/listings/:id - Reject unauthorized update', async () => {
    try {
      await axios.put(`${API_URL}/listings/${listingId}`, {
        precio: 1
      }, {
        headers: { Authorization: `Bearer ${secondAuthToken}` }
      });
      throw new Error('Should have rejected unauthorized update');
    } catch (error) {
      assert(error.response.status === 403, 'Should return 403 for unauthorized');
    }
  });

  await test('GET /api/listings/user/:userId - Get user listings', async () => {
    const response = await axios.get(`${API_URL}/listings/user/${userId}`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    assert(response.status === 200, 'Status should be 200');
    assert(response.data.data.every(l => l.usuario._id === userId), 'All listings should belong to user');
  });
};

const testInterests = async () => {
  log('\n=== Testing Interest Endpoints ===', 'info');

  await test('POST /api/interests - Express interest in listing', async () => {
    const response = await axios.post(`${API_URL}/interests`, {
      listing: listingId,
      mensaje: 'Estoy interesado en este producto'
    }, {
      headers: { Authorization: `Bearer ${secondAuthToken}` }
    });
    assert(response.status === 201, 'Status should be 201');
    assert(response.data.data.listing === listingId, 'Should create interest');
  });

  await test('POST /api/interests - Reject duplicate interest', async () => {
    try {
      await axios.post(`${API_URL}/interests`, {
        listing: listingId,
        mensaje: 'Duplicate interest'
      }, {
        headers: { Authorization: `Bearer ${secondAuthToken}` }
      });
      throw new Error('Should have rejected duplicate interest');
    } catch (error) {
      assert(error.response.status === 400, 'Should return 400 for duplicate');
    }
  });

  await test('POST /api/interests - Reject interest in own listing', async () => {
    try {
      await axios.post(`${API_URL}/interests`, {
        listing: listingId,
        mensaje: 'Interest in own listing'
      }, {
        headers: { Authorization: `Bearer ${authToken}` }
      });
      throw new Error('Should have rejected interest in own listing');
    } catch (error) {
      assert(error.response.status === 400, 'Should return 400 for own listing');
    }
  });

  await test('GET /api/interests/received - Get received interests', async () => {
    const response = await axios.get(`${API_URL}/interests/received`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    assert(response.status === 200, 'Status should be 200');
    assert(Array.isArray(response.data.data), 'Should return array');
    assert(response.data.data.length > 0, 'Should have received interests');
  });

  await test('GET /api/interests/sent - Get sent interests', async () => {
    const response = await axios.get(`${API_URL}/interests/sent`, {
      headers: { Authorization: `Bearer ${secondAuthToken}` }
    });
    assert(response.status === 200, 'Status should be 200');
    assert(Array.isArray(response.data.data), 'Should return array');
    assert(response.data.data.length > 0, 'Should have sent interests');
  });
};

const testCleanup = async () => {
  log('\n=== Cleanup ===', 'info');

  await test('DELETE /api/listings/:id - Delete listing', async () => {
    const response = await axios.delete(`${API_URL}/listings/${listingId}`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    assert(response.status === 200, 'Status should be 200');
  });

  await test('DELETE /api/users/:id - Delete first user', async () => {
    const response = await axios.delete(`${API_URL}/users/${userId}`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    assert(response.status === 200, 'Status should be 200');
  });

  await test('DELETE /api/users/:id - Delete second user', async () => {
    const response = await axios.delete(`${API_URL}/users/${secondUserId}`, {
      headers: { Authorization: `Bearer ${secondAuthToken}` }
    });
    assert(response.status === 200, 'Status should be 200');
  });
};

// Main test runner
const runTests = async () => {
  log('\n╔════════════════════════════════════════════╗', 'info');
  log('║   SecondMarket API Testing Suite          ║', 'info');
  log('╚════════════════════════════════════════════╝', 'info');

  try {
    // Check if server is running
    await axios.get(`${API_URL}/locations/estados`);
  } catch (error) {
    log('\n✗ Backend server is not running!', 'error');
    log('  Please start the server with: cd backend && npm start', 'warning');
    process.exit(1);
  }

  await testLocations();
  await testAuth();
  await testUsers();
  await testListings();
  await testInterests();
  await testCleanup();

  // Print summary
  log('\n╔════════════════════════════════════════════╗', 'info');
  log('║   Test Summary                             ║', 'info');
  log('╚════════════════════════════════════════════╝', 'info');
  log(`\nTotal Tests: ${results.passed + results.failed}`, 'info');
  log(`Passed: ${results.passed}`, 'success');
  log(`Failed: ${results.failed}`, results.failed > 0 ? 'error' : 'success');
  log(`Success Rate: ${((results.passed / (results.passed + results.failed)) * 100).toFixed(2)}%\n`, 'info');

  if (results.failed > 0) {
    log('Failed Tests:', 'error');
    results.tests
      .filter(t => t.status === 'failed')
      .forEach(t => log(`  - ${t.name}: ${t.error}`, 'error'));
  }

  process.exit(results.failed > 0 ? 1 : 0);
};

// Run tests
runTests().catch(error => {
  log(`\n✗ Unexpected error: ${error.message}`, 'error');
  process.exit(1);
});
