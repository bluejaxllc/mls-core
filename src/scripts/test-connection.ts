
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const AGENCY_KEY = process.env.BLUE_JAX_AGENCY_KEY;
const LOCATION_ID = "GC3Q5eqwDKw2MhZQ0KSj"; // Extracted from JWT
const USER_ID = "OxSwavzjg950Ub4m3tIY"; // Extracted from JWT

async function testEndpoint(name: string, url: string, token: string) {
    console.log(`\n--- Testing ${name} ---`);
    console.log(`URL: ${url}`);

    const headers: Record<string, string> = {
        'Authorization': `Bearer ${token}`,
        'Version': '2021-07-28',
        'Accept': 'application/json'
    };

    try {
        const response = await fetch(url, { method: 'GET', headers });
        console.log(`Status: ${response.status}`);
        const data = await response.json();

        if (response.ok) {
            console.log('✅ SUCCESS');
            console.log('Sample Data:', JSON.stringify(data, null, 2).substring(0, 500) + '...');
            return true;
        } else {
            console.log('❌ FAILED');
            console.log('Response:', JSON.stringify(data, null, 2));
            return false;
        }
    } catch (err: any) {
        console.log('❌ NETWORK ERROR:', err.message);
        return false;
    }
}

async function runTests() {
    if (!AGENCY_KEY) {
        console.error("Missing BLUE_JAX_AGENCY_KEY");
        return;
    }

    // Test 1: Get Location Details
    await testEndpoint('Get Location Details', `https://services.leadconnectorhq.com/locations/${LOCATION_ID}`, AGENCY_KEY);

    // Test 2: Get User Details
    await testEndpoint('Get User Details', `https://services.leadconnectorhq.com/users/${USER_ID}`, AGENCY_KEY);

    // Test 3: List Users in Location
    await testEndpoint('List Users (Location)', `https://services.leadconnectorhq.com/users/?locationId=${LOCATION_ID}`, AGENCY_KEY);
}

runTests();
