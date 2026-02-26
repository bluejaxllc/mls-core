async function test() {
    console.log("Fetching fake intelligence api...");
    const res = await fetch('http://localhost:3000/api/intelligence/does-not-exist', { redirect: 'manual' });
    console.log("Status:", res.status);
    console.log("Headers:", [...res.headers.entries()]);
    const text = await res.text();
    console.log("Body length:", text.length);
}
test();
