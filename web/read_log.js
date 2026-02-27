const fs = require('fs');
const content = fs.readFileSync('dev_output.log', 'utf16le');
console.log(content.slice(-2000));
