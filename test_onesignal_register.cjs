'use strict';

// Usage:
// ONESIGNAL_APP_ID=xxxx ONESIGNAL_REST_API_KEY=yyyy node test_onesignal_register.cjs [external_id]
// If [external_id] is omitted, the script will create a generic OneSignal user
// without any identity attached (no external_id).

const APP_ID = process.env.ONESIGNAL_APP_ID;
const REST_API_KEY = process.env.ONESIGNAL_REST_API_KEY;
const externalId = process.argv[2] || process.env.EXTERNAL_ID || null;
const testEmail = process.env.TEST_EMAIL || null; // optional: create Email subscriber when no external_id

if (!APP_ID || !REST_API_KEY) {
  console.error('Missing env: ONESIGNAL_APP_ID and/or ONESIGNAL_REST_API_KEY');
  process.exit(1);
}

const BASE = 'https://api.onesignal.com';

async function request(method, path, body) {
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: {
      'Authorization': `Basic ${REST_API_KEY}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: body ? JSON.stringify(body) : undefined
  });

  const contentType = (res.headers.get('content-type') || '').toLowerCase();
  const text = await res.text();
  let data = null;
  if (contentType.includes('application/json')) {
    try { data = JSON.parse(text); } catch { /* ignore */ }
  }
  return { ok: res.ok, status: res.status, data, text };
}

async function main() {
  if (externalId) {
    console.log('OneSignal user test (with external_id):', externalId);

    // 1) Check if user exists by external_id
    let r = await request('GET', `/apps/${APP_ID}/users/by/external_id/${encodeURIComponent(externalId)}`);
    if (r.ok) {
      console.log('User already exists:', JSON.stringify(r.data || r.text, null, 2));
      return;
    } else {
      console.log(`User not found (status ${r.status}). Will attempt to create.`);
    }

    // 2) Try to create/attach identity for this external_id
    r = await request(
      'PUT',
      `/apps/${APP_ID}/users/by/external_id/${encodeURIComponent(externalId)}/identity`,
      { identity: { external_id: externalId } }
    );
    if (r.ok) {
      console.log('Created/updated user identity via PUT:', JSON.stringify(r.data || r.text, null, 2));
      return;
    } else {
      console.warn('PUT identity failed:', r.status, r.text);
    }

    // 3) Fallback: Create user with identity (Some accounts require POST route)
    r = await request('POST', `/apps/${APP_ID}/users`, { identity: { external_id: externalId } });
    if (r.ok) {
      console.log('Created user via POST:', JSON.stringify(r.data || r.text, null, 2));
      return;
    }

    console.error('Failed to create user. Status:', r.status, 'Response:', r.text);
    process.exit(2);
  } else {
    if (testEmail) {
      console.log('OneSignal user test (no external_id): creating Email subscriber:', testEmail);
      const r = await request('POST', `/apps/${APP_ID}/users`, {
        subscriptions: [
          {
            type: 'Email',
            token: testEmail,
            enabled: true
          }
        ]
      });
      if (r.ok) {
        console.log('Created Email-subscribed user:', JSON.stringify(r.data || r.text, null, 2));
        return;
      }
      console.error('Failed to create Email subscriber user. Status:', r.status, 'Response:', r.text);
      process.exit(2);
    }

    console.log('OneSignal user test (no external_id): creating user with a temporary alias');

    // OneSignal requires at least one alias or subscription.
    // We'll provide a temporary alias label that is NOT external_id.
    const tempAlias = `server_test_${Date.now()}`;
    const r = await request('POST', `/apps/${APP_ID}/users`, {
      identity: { temp_alias: tempAlias }
    });
    if (r.ok) {
      console.log('Created user (with temp_alias):', JSON.stringify(r.data || r.text, null, 2));
      return;
    }

    console.error('Failed to create temp-alias user. Status:', r.status, 'Response:', r.text);
    process.exit(2);
  }
}

main().catch(err => {
  console.error('Unexpected error:', err);
  process.exit(2);
});


