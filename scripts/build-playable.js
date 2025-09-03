const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

async function buildPlayable() {
    console.log('Building wheel-click playable...');
    
    // 1. Build wheel-click variant first
    console.log('Building wheel-click variant...');
    try {
        execSync('npm run build -- --mode wheel-click', { stdio: 'inherit' });
    } catch (error) {
        console.error('Build failed:', error.message);
        return;
    }
    
    const distPath = path.join(__dirname, '../dist/wheel-click');
    const outputPath = path.join(__dirname, '../wheel-click.html');
    
    if (!fs.existsSync(distPath)) {
        console.error('Build directory not found:', distPath);
        return;
    }
    
    // 2. Read the built index.html as base
    const indexPath = path.join(distPath, 'index.html');
    if (!fs.existsSync(indexPath)) {
        console.error('index.html not found in build');
        return;
    }
    
    let htmlContent = fs.readFileSync(indexPath, 'utf8');
    console.log('Read index.html as base');
    
    // 3. Create image base64 map for all images
    console.log('Loading all images...');
    const imageMap = new Map();
    
    function loadImagesFromDir(dirPath, basePath = '') {
        if (!fs.existsSync(dirPath)) return;
        
        const files = fs.readdirSync(dirPath);
        files.forEach(file => {
            const filePath = path.join(dirPath, file);
            const relativePath = path.join(basePath, file);
            
            if (fs.statSync(filePath).isDirectory()) {
                loadImagesFromDir(filePath, relativePath);
            } else if (/\.(png|jpg|jpeg|gif|webp|svg)$/i.test(file)) {
                try {
                    const imageBuffer = fs.readFileSync(filePath);
                    const ext = path.extname(file).slice(1).toLowerCase();
                    const mimeType = ext === 'svg' ? 'image/svg+xml' : `image/${ext}`;
                    const base64 = imageBuffer.toString('base64');
                    const dataUrl = `data:${mimeType};base64,${base64}`;
                    
                    // Store with different path formats
                    const normalizedPath = relativePath.replace(/\\/g, '/');
                    imageMap.set(`./${normalizedPath}`, dataUrl);
                    imageMap.set(`${normalizedPath}`, dataUrl);
                    
                    console.log(`Loaded: ${normalizedPath}`);
                } catch (error) {
                    console.warn(`Failed to load ${relativePath}:`, error.message);
                }
            }
        });
    }
    
    // Load all assets
    const assetsPath = path.join(distPath, 'assets');
    loadImagesFromDir(assetsPath, 'assets');
    
    // 4. Replace CSS links with inline styles
    console.log('Inlining CSS files...');
    const cssRegex = /<link[^>]+href="([^"]+\.css)"[^>]*>/g;
    let cssMatch;
    
    while ((cssMatch = cssRegex.exec(htmlContent)) !== null) {
        const cssFile = cssMatch[1];
        const cssPath = path.join(distPath, cssFile);
        
        if (fs.existsSync(cssPath)) {
            const cssContent = fs.readFileSync(cssPath, 'utf8');
            const inlineStyles = `<style>\n${cssContent}\n</style>`;
            htmlContent = htmlContent.replace(cssMatch[0], inlineStyles);
            console.log(`Inlined: ${cssFile}`);
        }
    }
    
    // 5. Replace JS script tags with inline scripts
    console.log('Inlining JS files...');
    const jsRegex = /<script[^>]+src="([^"]+\.js)"[^>]*><\/script>/g;
    let jsMatch;
    
    while ((jsMatch = jsRegex.exec(htmlContent)) !== null) {
        const jsFile = jsMatch[1];
        const jsPath = path.join(distPath, jsFile);
        
        if (fs.existsSync(jsPath)) {
            const jsContent = fs.readFileSync(jsPath, 'utf8');
            const inlineScript = `<script>\n${jsContent}\n</script>`;
            htmlContent = htmlContent.replace(jsMatch[0], inlineScript);
            console.log(`Inlined: ${jsFile}`);
        }
    }
    
    // 6. Replace all image references with base64
    console.log('Converting images to base64...');
    
    // Replace images in HTML attributes (src, href)
    for (const [imagePath, dataUrl] of imageMap) {
        const escapedPath = imagePath.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        
        // Replace in HTML attributes
        const htmlAttrRegex = new RegExp(`(src|href)=["']${escapedPath}["']`, 'g');
        const htmlMatches = htmlContent.match(htmlAttrRegex);
        if (htmlMatches) {
            htmlContent = htmlContent.replace(htmlAttrRegex, `$1="${dataUrl}"`);
            console.log(`Converted to base64 in HTML: ${imagePath}`);
        }
        
        // Replace in JavaScript strings
        const jsStringRegex = new RegExp(`["']${escapedPath}["']`, 'g');
        const jsMatches = htmlContent.match(jsStringRegex);
        if (jsMatches) {
            htmlContent = htmlContent.replace(jsStringRegex, `"${dataUrl}"`);
            console.log(`Converted to base64 in JS: ${imagePath}`);
        }
    }
    
    // 7. Add Playable Ad functions and CTA clicks
    console.log('Adding playable ad functions...');
    
    const playableScript = `
// Facebook Playable Ad functions
window.FbPlayableAd = window.FbPlayableAd || {};
FbPlayableAd.onCTAClick = function() {
    console.log('CTA clicked - redirecting to store');
};

// Auto-add CTA click to modal buttons and main action buttons
document.addEventListener('DOMContentLoaded', function() {
    // Find modal buttons (download/action buttons)
    const modalButtons = document.querySelectorAll('.modal-button, [href*="offer_link"]');
    modalButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            FbPlayableAd.onCTAClick();
        });
    });
    
    // Find wheel center button (main game action)
    const wheelButton = document.querySelector('.wheel-center-button, .wheel-center');
    if (wheelButton) {
        wheelButton.addEventListener('click', function() {
            // Add small delay to show result first, then CTA
            setTimeout(() => {
                FbPlayableAd.onCTAClick();
            }, 2000);
        });
    }
});

`;
    
    // Insert playable script before closing </body> tag
    htmlContent = htmlContent.replace('</body>', `<script>\n${playableScript}\n</script>\n</body>`);
    
    // 8. Clean up for playable requirements
    // Remove external links and resources
    htmlContent = htmlContent.replace(/<link[^>]+rel="icon"[^>]*>/g, '');
    htmlContent = htmlContent.replace(/href="\{offer_link\}"/g, 'href="#" onclick="FbPlayableAd.onCTAClick(); return false;"');
    
    // Ensure responsive meta tags
    if (!htmlContent.includes('user-scalable=no')) {
        htmlContent = htmlContent.replace(
            /<meta[^>]+viewport[^>]*>/,
            '<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no, viewport-fit=cover">'
        );
    }
    
    // 9. Write final playable HTML
    fs.writeFileSync(outputPath, htmlContent);
    
    // 10. Check file size
    const stats = fs.statSync(outputPath);
    const fileSizeMB = (stats.size / (1024 * 1024)).toFixed(2);
    
    console.log(`\n✅ Playable created successfully!`);
    console.log(`📁 Output: ${outputPath}`);
    console.log(`📊 File size: ${fileSizeMB} MB`);
    
    if (fileSizeMB > 5) {
        console.warn(`⚠️  File size (${fileSizeMB} MB) exceeds 5MB limit for playable ads`);
    } else {
        console.log(`✅ File size is within 5MB limit`);
    }
}

buildPlayable().catch(console.error);