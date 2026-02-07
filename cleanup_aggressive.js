
const fs = require('fs');
const path = require('path');

const srcDir = path.join(process.cwd(), 'src');
const whitelist = [
    'server.ts',
    // Directories are automatically kept if I only delete files
];

// Read all items in src
const items = fs.readdirSync(srcDir);

items.forEach(item => {
    const itemPath = path.join(srcDir, item);
    const stat = fs.statSync(itemPath);

    if (stat.isFile()) {
        if (!whitelist.includes(item)) {
            // Delete it
            try {
                fs.unlinkSync(itemPath);
                console.log(`Deleted junk file: ${item}`);
            } catch (e) {
                console.error(`Failed to delete ${item}: ${e.message}`);
            }
        } else {
            console.log(`Kept: ${item}`);
        }
    }
    // Directories are untouched
});
