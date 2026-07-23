const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');

function walkDir(dir) {
    fs.readdirSync(dir).forEach(file => {
        let fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            walkDir(fullPath);
        } else if (fullPath.endsWith('.jsx') || fullPath.endsWith('.js')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            let updated = content.replace(/'http:\/\/127\.0\.0\.1:8000(\/[^']*)'/g, "`${import.meta.env.VITE_API_URL}$1`");
            updated = updated.replace(/`http:\/\/127\.0\.0\.1:8000(\/[^`]*)`/g, "`${import.meta.env.VITE_API_URL}$1`");
            
            if (content !== updated) {
                fs.writeFileSync(fullPath, updated, 'utf8');
                console.log(`Updated ${fullPath}`);
            }
        }
    });
}

walkDir(srcDir);
console.log('Done!');
