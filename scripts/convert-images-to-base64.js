const fs = require('fs');
const path = require('path');

const imagesDir = path.join(__dirname, '../assets/images');
const outputDir = path.join(__dirname, '../assets/base64');

// Create output directory if it doesn't exist
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Get all image files from images directory
const imageFiles = fs.readdirSync(imagesDir).filter(file => {
  const ext = path.extname(file).toLowerCase();
  return ['.png', '.jpg', '.jpeg', '.gif', '.webp', '.svg'].includes(ext);
});

console.log(`Found ${imageFiles.length} image files to convert...`);

imageFiles.forEach(file => {
  const imagePath = path.join(imagesDir, file);
  const imageData = fs.readFileSync(imagePath);
  
  // Get file extension for MIME type
  const ext = path.extname(file).toLowerCase();
  let mimeType = 'image/png';
  
  switch(ext) {
    case '.jpg':
    case '.jpeg':
      mimeType = 'image/jpeg';
      break;
    case '.gif':
      mimeType = 'image/gif';
      break;
    case '.webp':
      mimeType = 'image/webp';
      break;
    case '.svg':
      mimeType = 'image/svg+xml';
      break;
  }
  
  // Convert to base64
  const base64 = imageData.toString('base64');
  const dataUrl = `data:${mimeType};base64,${base64}`;
  
  // Create variable name from filename (remove extension and make valid JS identifier)
  const baseName = path.parse(file).name;
  const varName = baseName.replace(/[^a-zA-Z0-9_$]/g, '_');
  
  // Create JS file content
  const jsContent = `// Generated from ${file}
const ${varName} = "${dataUrl}";

export default ${varName};
`;

  // Write JS file
  const outputFileName = `${baseName}.js`;
  const outputPath = path.join(outputDir, outputFileName);
  
  fs.writeFileSync(outputPath, jsContent);
  
  console.log(`✓ Converted ${file} -> ${outputFileName}`);
});

console.log(`\nConversion complete! ${imageFiles.length} files converted to assets/base64/`);