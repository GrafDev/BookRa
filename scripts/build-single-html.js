const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('Building playable HTML files for click variants...');

// Build all variants first
console.log('Running build:all...');
execSync('npm run build:all', { stdio: 'inherit' });

// Define variants to process (only click variants)
const variants = [
  { mode: 'scratch-click', output: 'playable-scratch-click.html' },
  { mode: 'wheel-click', output: 'playable-wheel-click.html' }
];

const distDir = path.join(__dirname, '../dist');

function processHtmlFile(htmlPath, outputPath, variantMode) {
  console.log(`Processing ${variantMode}/index.html...`);
  
  // Read the built HTML file
  let htmlContent = fs.readFileSync(htmlPath, 'utf8');

  // Find all JS and CSS files referenced in HTML
  const jsMatches = htmlContent.match(/<script[^>]*src="([^"]*)"[^>]*><\/script>/g) || [];
  const cssMatches = htmlContent.match(/<link[^>]*href="([^"]*\.css)"[^>]*>/g) || [];

  // Process CSS files
  cssMatches.forEach(match => {
    const hrefMatch = match.match(/href="([^"]*)"/);
    if (hrefMatch) {
      const cssFile = hrefMatch[1];
      const cssPath = path.join(path.dirname(htmlPath), cssFile);
      
      if (fs.existsSync(cssPath)) {
        const cssContent = fs.readFileSync(cssPath, 'utf8');
        const inlineCSS = `<style>${cssContent}</style>`;
        htmlContent = htmlContent.replace(match, inlineCSS);
        console.log(`Inlined CSS: ${cssFile}`);
      }
    }
  });

  // Process JS files
  jsMatches.forEach(match => {
    const srcMatch = match.match(/src="([^"]*)"/);
    if (srcMatch) {
      const jsFile = srcMatch[1];
      const jsPath = path.join(path.dirname(htmlPath), jsFile);
      
      if (fs.existsSync(jsPath)) {
        let jsContent = fs.readFileSync(jsPath, 'utf8');
        
        // Replace image references in JS code with base64 data
        const base64Dir = path.join(__dirname, '../assets/base64');
        if (fs.existsSync(base64Dir)) {
          const base64Files = fs.readdirSync(base64Dir).filter(file => file.endsWith('.js'));
          base64Files.forEach(base64File => {
            const base64Path = path.join(base64Dir, base64File);
            const base64Content = fs.readFileSync(base64Path, 'utf8');
            const match = base64Content.match(/const\s+\w+\s*=\s*"([^"]+)"/);
            if (match) {
              const base64Data = match[1];
              const imageName = path.parse(base64File).name;
              
              // Replace import references in JS - need to escape special chars and match whole property
              const escapedImageName = imageName.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
              jsContent = jsContent.replace(new RegExp(`\\bimages\\.${escapedImageName}\\b`, 'g'), `"${base64Data}"`);
              jsContent = jsContent.replace(new RegExp(`\\bD\\.${escapedImageName}\\b`, 'g'), `"${base64Data}"`);
            }
          });
        }
        
        // Replace dynamic imports of modal-animations with direct access to global functions
        jsContent = jsContent.replace(
          /import\(['"]\.\/modal-animations\.js['"]\)/g,
          'Promise.resolve({ showModal: window.showModal, hideModal: window.hideModal })'
        );
        
        // Make modal functions global if this is modal-animations file
        if (jsFile.includes('modal-animations')) {
          jsContent = jsContent.replace(
            /export\s*{\s*(\w+)\s*as\s*(\w+),\s*(\w+)\s*as\s*(\w+)\s*}/,
            'export { $1 as $2, $3 as $4 }; window.$2 = $1; window.$4 = $3;'
          );
          jsContent = jsContent.replace(
            /export\s*{\s*(\w+),\s*(\w+)\s*}/,
            'export { $1, $2 }; window.$1 = $1; window.$2 = $2;'
          );
        }
        
        const inlineJS = `<script type="module">${jsContent}</script>`;
        htmlContent = htmlContent.replace(match, inlineJS);
        console.log(`Inlined JS: ${jsFile}`);
      }
    }
  });

  // Replace image paths with base64 data
  const base64Dir = path.join(__dirname, '../assets/base64');
  if (fs.existsSync(base64Dir)) {
    console.log('Processing base64 image replacements...');
    const base64Files = fs.readdirSync(base64Dir).filter(file => file.endsWith('.js'));
    
    base64Files.forEach(base64File => {
      const base64Path = path.join(base64Dir, base64File);
      const base64Content = fs.readFileSync(base64Path, 'utf8');
      
      // Extract base64 data from the file
      const match = base64Content.match(/const\s+\w+\s*=\s*"([^"]+)"/);
      if (match) {
        const base64Data = match[1];
        const imageName = path.parse(base64File).name;
        
        console.log(`Processing: ${imageName} (from ${base64File})`);
        
        // Replace image references with version hashes using regex (both src and CSS url)
        const imagePatterns = [
          // HTML src attributes
          `src="\\./assets/images/${imageName}-[^"]*\\.png"`,
          `src="\\./assets/images/${imageName}-[^"]*\\.webp"`,
          `src="\\./assets/images/${imageName}-[^"]*\\.jpg"`,
          `src="\\./assets/images/${imageName}-[^"]*\\.jpeg"`,
          `src="\\./assets/images/${imageName}\\.png"`,
          `src="\\./assets/images/${imageName}\\.webp"`,
          `src="\\./assets/images/${imageName}\\.jpg"`,
          `src="\\./assets/images/${imageName}\\.jpeg"`,
          // CSS url() references
          `url\\(\\.\\./images/${imageName}-[^)]*\\.png\\)`,
          `url\\(\\.\\./images/${imageName}-[^)]*\\.webp\\)`,
          `url\\(\\.\\./images/${imageName}-[^)]*\\.jpg\\)`,
          `url\\(\\.\\./images/${imageName}-[^)]*\\.jpeg\\)`,
          `url\\(\\.\\./images/${imageName}\\.png\\)`,
          `url\\(\\.\\./images/${imageName}\\.webp\\)`,
          `url\\(\\.\\./images/${imageName}\\.jpg\\)`,
          `url\\(\\.\\./images/${imageName}\\.jpeg\\)`
        ];
        
        let replacedAny = false;
        imagePatterns.forEach(pattern => {
          const regex = new RegExp(pattern, 'g');
          const matches = htmlContent.match(regex);
          if (matches) {
            // Choose replacement based on pattern type
            const replacement = pattern.includes('url\\(') ? `url(${base64Data})` : `src="${base64Data}"`;
            htmlContent = htmlContent.replace(regex, replacement);
            console.log(`✓ Replaced ${matches.length} references for: ${imageName} with pattern: ${pattern}`);
            replacedAny = true;
          }
        });
        
        if (!replacedAny) {
          console.log(`⚠ No matches found for: ${imageName}`);
        }
      }
    });
    
    // Show remaining image references that weren't replaced
    const remainingImages = htmlContent.match(/src="\.\/assets\/images\/[^"]+"/g);
    if (remainingImages && remainingImages.length > 0) {
      console.log('❌ Remaining unreplaced images:');
      remainingImages.forEach(img => console.log(`   ${img}`));
    }
  }

  // Clean up any remaining relative paths and external JS imports
  htmlContent = htmlContent.replace(/href="\.\/[^"]*"/g, 'href=""');

  // Remove any remaining external JS imports
  htmlContent = htmlContent.replace(/import\{[^}]*\}from"\.\/[^"]*\.js"/g, '');
  htmlContent = htmlContent.replace(/from"\.\/[^"]*\.js"/g, '');

  // Replace offer_link placeholder with FbPlayableAd.onCTAClick() for INAPP compliance
  htmlContent = htmlContent.replace(
    'href="{offer_link}"',
    'href="#" onclick="FbPlayableAd.onCTAClick()"'
  );

  // Add meta tags for playable ads
  const metaTags = `
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width,initial-scale=1,user-scalable=no">
    <meta name="ad-type" content="playable">`;

  htmlContent = htmlContent.replace('<head>', '<head>' + metaTags);

  // Write the final single HTML file
  fs.writeFileSync(outputPath, htmlContent);

  console.log(`✓ Single HTML file created: ${outputPath}`);
  console.log(`File size: ${Math.round(fs.statSync(outputPath).size / 1024)} KB`);
}

// Process each variant
variants.forEach(variant => {
  console.log(`\n=== Processing ${variant.mode} ===`);
  
  const htmlPath = path.join(distDir, variant.mode, 'index.html');
  const outputPath = path.join(distDir, variant.output);
  
  if (!fs.existsSync(htmlPath)) {
    console.error(`HTML file not found: ${htmlPath}`);
    return;
  }
  
  processHtmlFile(htmlPath, outputPath, variant.mode);
});

// Clean up variant directories, keep only playable files
const filesToKeep = ['playable-scratch-click.html', 'playable-wheel-click.html'];
fs.readdirSync(distDir).forEach(file => {
  if (!filesToKeep.includes(file)) {
    const filePath = path.join(distDir, file);
    if (fs.statSync(filePath).isDirectory() || !filesToKeep.some(keep => file === keep)) {
      fs.rmSync(filePath, { recursive: true, force: true });
    }
  }
});

console.log('\n✓ Cleaned up dist directory (kept playable files)');
console.log('Build complete!');