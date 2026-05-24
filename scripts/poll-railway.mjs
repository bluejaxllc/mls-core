import https from 'https';

const url = "https://mls-core-production.up.railway.app/";

function check() {
    https.get(url, (res) => {
        console.log("Status:", res.statusCode);
        if (res.statusCode === 200) {
            console.log("Next.js App is UP AND RUNNING!");
            process.exit(0);
        } else {
            setTimeout(check, 10000);
        }
    }).on('error', (e) => {
        console.log("Error:", e.message);
        setTimeout(check, 10000);
    });
}

check();
