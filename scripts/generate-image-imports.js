const fs = require('fs');
const path = require('path');

const base64Dir = path.join(__dirname, '../assets/base64');
const outputPath = path.join(__dirname, '../assets/js/images-base64-direct.js');

console.log('Generating direct base64 imports...');

// Get all base64 JS files
const base64Files = fs.readdirSync(base64Dir).filter(file => file.endsWith('.js'));

let outputContent = '// Direct base64 images - generated file\n\n';

// Read each base64 file and extract the variable
base64Files.forEach(file => {
  const filePath = path.join(base64Dir, file);
  const content = fs.readFileSync(filePath, 'utf8');
  
  // Extract variable name and value
  const match = content.match(/const\s+(\w+)\s*=\s*"([^"]+)"/);
  if (match) {
    // Convert underscore names to camelCase
    const originalName = match[1];
    const varName = originalName.replace(/_([a-z])/g, (match, letter) => letter.toUpperCase());
    const base64Value = match[2];
    
    outputContent += `export const ${varName} = "${base64Value}";\n`;
    console.log(`✓ Added ${varName} from ${file}`);
  }
});

// Create the exports object
outputContent += '\n// Critical images for game start\n';
outputContent += 'export const criticalImages = {\n';

// Add the mapping based on original structure
const criticalMappings = [
  // Cards
  'backCart', 'firstCart', 'secondCart', 'thirdCart', 'blanketCart', 'borderCart', 'scratch',
  // Wheel  
  'arrowPart1', 'arrowPart2', 'wheelPart1', 'wheelPart2', 'wheelPart3', 'wheelPart4', 'wheelPart5', 'wheelPart6', 'wheelText1', 'wheelText2',
  // Background
  'bgDesktop', 'bgMobile',
  // Logo
  'logo1Part1', 'logo1Part2', 'logo2Part1', 'logo2Part2',
  // Title
  'title', 'titleMobile',
  // Characters
  'man1Part1', 'man2', 'man3Part1', 'man3Part2', 'man4Part1', 'man4Part2',
  // Music
  'stopMusic', 'playMusic'
];

criticalMappings.forEach(varName => {
  outputContent += `  ${varName},\n`;
});

// Add wheel-part3-1 with alias
outputContent += `  wheelPart31: wheelPart3_1,\n`;

outputContent += '};\n\n';

outputContent += '// Modal images - can be loaded later\n';
outputContent += 'export const modalImages = {\n';

const modalMappings = [
  'bgModalCenter', 'bgModalLeft', 'bgModalRight', 'buttonModal', 
  'scratchModalText', 'wheelModalText'
];

modalMappings.forEach(varName => {
  outputContent += `  ${varName},\n`;
});

outputContent += '};\n\n';

outputContent += '// Combined for backward compatibility\n';
outputContent += 'export const images = {\n';
outputContent += '  ...criticalImages,\n';
outputContent += '  ...modalImages\n';
outputContent += '};\n';

fs.writeFileSync(outputPath, outputContent);

console.log(`✓ Generated ${outputPath}`);
console.log(`✓ Processed ${base64Files.length} base64 files`);