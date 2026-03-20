const fs = require('fs');
const { spawn } = require('child_process');

// Read DATABASE_URL from .env.local
const env = fs.readFileSync('C:\\Users\\edgar\\OneDrive\\Desktop\\MLS\\web\\.env.local', 'utf8');
const m = env.match(/DATABASE_URL="([^"]+)"/);
if (!m) { console.error('Not found'); process.exit(1); }
const url = m[1].trim();
console.log('URL length:', url.length);
console.log('URL prefix:', url.substring(0, 30) + '...');

// Run: npx vercel env add MLS_DATABASE_URL production
const child = spawn('npx', ['vercel', 'env', 'add', 'MLS_DATABASE_URL', 'production'], {
    cwd: 'C:\\Users\\edgar\\OneDrive\\Desktop\\MLS\\web',
    stdio: ['pipe', 'pipe', 'pipe'],
    shell: true
});

// Write the URL to stdin WITHOUT any newline
child.stdin.write(url);
child.stdin.end();

let stdout = '';
let stderr = '';
child.stdout.on('data', d => { stdout += d.toString(); });
child.stderr.on('data', d => { stderr += d.toString(); });

child.on('close', code => {
    console.log('Exit code:', code);
    console.log('STDOUT:', stdout);
    if (stderr) console.log('STDERR:', stderr);
});
