const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Read current version from version.js
const versionPath = path.join(__dirname, '../version.js');
const versionContent = fs.readFileSync(versionPath, 'utf8');
const currentVersion = versionContent.match(/VERSION = '(.+?)'/)[1];

// Parse and bump patch version
const [major, minor, patch] = currentVersion.split('.').map(Number);
const newVersion = `${major}.${minor}.${patch + 1}`;

// Update version.js
const newVersionContent = `export const VERSION = '${newVersion}';\n`;
fs.writeFileSync(versionPath, newVersionContent);

// Update package.json
const packagePath = path.join(__dirname, '../package.json');
const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
packageJson.version = newVersion;
fs.writeFileSync(packagePath, JSON.stringify(packageJson, null, 2) + '\n');

console.log(`Version bumped from ${currentVersion} to ${newVersion}`);

// Remove all old zip archives
const distPath = path.join(__dirname, '../dist');
const folders = ['scratch-click', 'scratch-auto', 'wheel-click', 'wheel-auto'];

// Delete all existing zip files
try {
    const files = fs.readdirSync(distPath);
    files.forEach(file => {
        if (file.endsWith('.zip')) {
            fs.unlinkSync(path.join(distPath, file));
            console.log(`Removed old archive: ${file}`);
        }
    });
} catch (error) {
    console.warn('No old archives to remove');
}

// Create new zip archives
folders.forEach(folderName => {
    const folderPath = path.join(distPath, folderName);
    
    if (fs.existsSync(folderPath)) {
        const zipName = `${folderName}-v${newVersion}.zip`;
        
        // Create new zip
        try {
            execSync(`cd "${distPath}" && zip -r "${zipName}" "${folderName}"`, { stdio: 'pipe' });
            console.log(`Created: ${zipName}`);
        } catch (error) {
            console.error(`Error creating ${zipName}:`, error.message);
        }
    } else {
        console.warn(`Folder ${folderName} not found, skipping...`);
    }
});

console.log(`Release completed! Version ${newVersion}`);