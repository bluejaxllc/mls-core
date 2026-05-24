import fs from 'fs';
const html = fs.readFileSync('web/ml_dump.html', 'utf8');
const scriptMatch = html.match(/<script id="__NORDIC_RENDERING_CTX__"[^>]*>_n\.ctx\.r=([\s\S]*?);?<\/script>/);
const stateObj = JSON.parse(scriptMatch[1]);

console.log("ROOT KEYS:", Object.keys(stateObj));
if (stateObj.appProps) console.log("APP_PROPS KEYS:", Object.keys(stateObj.appProps));
if (stateObj.appProps?.pageProps) console.log("PAGE_PROPS KEYS:", Object.keys(stateObj.appProps.pageProps));
if (stateObj.appProps?.pageProps?.initialState) console.log("INITIAL_STATE KEYS:", Object.keys(stateObj.appProps.pageProps.initialState));

function check(name, arr) {
    if (Array.isArray(arr) && arr.length > 0) {
        if (arr[0].id === 'POLYCARD') {
            console.log(`✅ FOUND POLYCARD AT: ${name}`);
        } else if (typeof arr[0] === 'string') {
            console.log(`⚠️ Array of Strings at: ${name}`);
        } else {
            console.log(`⚠️ Array of Objects but not POLYCARD at: ${name}`);
            console.log(Object.keys(arr[0]));
        }
    }
}

check('stateObj.appProps.pageProps.results', stateObj.appProps?.pageProps?.results);
check('stateObj.appProps.pageProps.initialState.results', stateObj.appProps?.pageProps?.initialState?.results);
