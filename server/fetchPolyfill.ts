/**
 * Fetch Polyfill for Server
 * Ensures fetch is available in all environments
 */

// Check if fetch is already available (Node.js 18+)
if (typeof globalThis.fetch === 'undefined') {
  console.log('⚠️ Built-in fetch not available, using polyfill');
  
  // Simple fetch polyfill using require
  try {
    const nodeFetch = require('node-fetch');
    globalThis.fetch = nodeFetch.default || nodeFetch;
    console.log('✅ Fetch polyfill loaded successfully');
  } catch (error) {
    console.log('❌ Could not load node-fetch polyfill:', error.message);
    
    // Fallback: Basic fetch implementation
    globalThis.fetch = async (url, options = {}) => {
      throw new Error('Fetch not available and no polyfill found');
    };
  }
} else {
  console.log('✅ Built-in fetch available');
}

export {};
