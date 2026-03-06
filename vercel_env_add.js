const { spawn } = require('child_process');
const fs = require('fs');

const val = fs.readFileSync('vercel_db_val.txt', 'utf8');

const proc = spawn('npx', ['vercel', 'env', 'add', 'INTELLIGENCE_DATABASE_URL', 'production', '--cwd', 'web'], {
    shell: true,
    cwd: 'c:/Users/edgar/OneDrive/Desktop/AI APPS/MLS'
});

proc.stdout.on('data', d => console.log(d.toString()));
proc.stderr.on('data', d => console.error(d.toString()));
proc.on('close', code => console.log('Exited with', code));

proc.stdin.write(val);
proc.stdin.end();
