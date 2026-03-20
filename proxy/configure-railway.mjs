// Use Railway GraphQL API to configure mls-proxy service
const token = process.argv[2];
const svcId = '1fe23cfe-251c-43fd-97c3-d8c3aea79e34';
const envId = '4e23dc80-ab2c-4254-83e9-3e29f1ecfd1d';
const projectId = 'd2299445-c62a-42b8-b64c-2a78ca710daf';

async function gql(query) {
    const res = await fetch('https://backboard.railway.app/graphql/v2', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ query })
    });
    return await res.json();
}

// Step 1: Set rootDirectory on the service source config
console.log('=== Step 1: Set Root Directory ===');
const r1 = await gql(`mutation {
    serviceSourceUpdate(
        serviceId: "${svcId}"
        input: { rootDirectory: "/proxy" }
    )
}`);
console.log('serviceSourceUpdate:', JSON.stringify(r1));

// If that didn't work, try serviceConfigUpdate 
if (!r1.data || r1.errors) {
    console.log('Trying alternative: serviceInstanceUpdate with rootDirectory...');
    // Try with string input
    const r1b = await gql(`mutation {
        serviceInstanceUpdate(
            serviceId: "${svcId}"
            environmentId: "${envId}"
            input: { rootDirectory: "/proxy" }
        )  
    }`);
    console.log('serviceInstanceUpdate:', JSON.stringify(r1b));
}

// Step 2: Set PORT variable
console.log('\n=== Step 2: Set PORT=3007 ===');
const r2 = await gql(`mutation {
    variableUpsert(input: {
        projectId: "${projectId}"
        environmentId: "${envId}"
        serviceId: "${svcId}"
        name: "PORT"
        value: "3007"
    })
}`);
console.log('variableUpsert PORT:', JSON.stringify(r2));

// Step 3: Generate domain
console.log('\n=== Step 3: Generate Domain ===');
const r3 = await gql(`mutation {
    serviceDomainCreate(input: {
        environmentId: "${envId}"
        serviceId: "${svcId}"
    }) {
        domain
    }
}`);
console.log('serviceDomainCreate:', JSON.stringify(r3));

// Step 4: Check what we got
if (r3.data?.serviceDomainCreate?.domain) {
    const domain = r3.data.serviceDomainCreate.domain;
    console.log('\n=== DOMAIN: https://' + domain + ' ===');
    
    // Step 5: Update ML_PROXY_URL on mls-core service
    const mlsCoreId = '2fc1ffaa-ffb1-4432-88c0-edbd8e4dc402';
    console.log('\n=== Step 5: Update ML_PROXY_URL on mls-core ===');
    const r5 = await gql(`mutation {
        variableUpsert(input: {
            projectId: "${projectId}"
            environmentId: "${envId}"
            serviceId: "${mlsCoreId}"
            name: "ML_PROXY_URL"
            value: "https://${domain}"
        })
    }`);
    console.log('ML_PROXY_URL update:', JSON.stringify(r5));
}

// Step 6: Trigger redeploy
console.log('\n=== Step 6: Trigger Redeploy ===');
const r6 = await gql(`mutation {
    serviceInstanceRedeploy(
        serviceId: "${svcId}"
        environmentId: "${envId}"
    )
}`);
console.log('Redeploy:', JSON.stringify(r6));
