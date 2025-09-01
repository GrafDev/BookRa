// Eraser effect for PNG images
import { images } from './images-loader.js'

export class ImageEraser {
  constructor(imageElement, options = {}) {
    this.image = imageElement;
    this.canvas = null;
    this.ctx = null;
    this.lastStrokeEnd = null;
    this.eraserTexture = null;
    
    // Default options
    this.options = {
      eraserSize: 20,
      eraserOpacity: 1.0,
      ...options
    };
    
    this.init();
    this.loadEraserTexture();
  }
  
  init() {
    // Create canvas overlay
    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d');
    
    // Set canvas size to match image
    this.canvas.width = this.image.naturalWidth || this.image.width;
    this.canvas.height = this.image.naturalHeight || this.image.height;
    
    // Style canvas to overlay image  
    this.canvas.style.position = 'absolute';
    this.canvas.style.top = '0';
    this.canvas.style.left = '0';
    this.canvas.style.width = '100%';
    this.canvas.style.height = '100%';
    this.canvas.style.pointerEvents = 'none';
    this.canvas.style.zIndex = '5';
    this.canvas.style.opacity = '1';
    
    // Make image container relative
    this.image.parentElement.style.position = 'relative';
    
    // Draw image onto canvas
    this.drawImageOnCanvas();
    
    // Position canvas over image
    this.image.parentElement.appendChild(this.canvas);
    
    // Hide original image completely after canvas is ready
    setTimeout(() => {
      this.image.style.display = 'none';
    }, 100);
    
    // Add event listeners
    this.addEventListeners();
  }
  
  loadEraserTexture() {
    const img = new Image();
    img.onload = () => {
      this.eraserTexture = img;
    };
    img.onerror = () => {
      console.error('Failed to load eraser texture');
    };
    img.src = images.scratch;
  }
  
  drawImageOnCanvas() {
    const img = new Image();
    img.onload = () => {
      this.ctx.drawImage(img, 0, 0);
    };
    img.onerror = () => {
      console.error('Failed to load image for canvas:', this.image.src);
    };
    img.src = this.image.src;
  }
  
  addEventListeners() {
    // Only pointer events disabled - automatic erasing only
    this.canvas.style.pointerEvents = 'none';
  }
  
  // Get erased percentage
  getErasedPercentage() {
    const imageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
    const pixels = imageData.data;
    let transparentPixels = 0;
    let totalPixels = 0;
    
    for (let i = 0; i < pixels.length; i += 4) {
      const alpha = pixels[i + 3];
      if (alpha < 128) { // Consider semi-transparent as erased
        transparentPixels++;
      }
      totalPixels++;
    }
    
    const percentage = (transparentPixels / totalPixels) * 100;
    return percentage;
  }
  
  // Reset image
  reset() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.drawImageOnCanvas();
  }
  
  // Cloth wiping effect - connected strokes like cleaning dirty glass
  autoErase(targetPercentage = 70, duration = 1000) {
    return new Promise((resolve) => {
      const startTime = Date.now();
      const totalStrokes = 10;
      let strokesCreated = 0;
      this.lastStrokeEnd = null;
      
      console.log(`Starting cloth wipe effect: ${totalStrokes} strokes over ${duration}ms`);
      
      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = elapsed / duration;
        const targetStrokes = Math.floor(progress * totalStrokes);
        
        while (strokesCreated < targetStrokes && strokesCreated < totalStrokes) {
          this.createWipeStroke();
          strokesCreated++;
        }
        
        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          // Add final horizontal stroke across center
          this.createCenterHorizontalStroke();
          
          this.ctx.globalCompositeOperation = 'source-over';
          console.log(`Wipe complete: ${strokesCreated} strokes created + center stroke`);
          resolve(targetPercentage);
        }
      };
      
      animate();
    });
  }
  
  // Create a sponge-like wipe stroke with irregular texture
  createWipeStroke() {
    // All strokes start from middle line (center Y)
    const canvasCenterY = this.canvas.height / 2;
    
    // Start from center area of middle line (1/2 width from center)
    const canvasCenterX = this.canvas.width / 2;
    const centerAreaWidth = this.canvas.width / 2; // Half of canvas width
    const centerX = canvasCenterX - centerAreaWidth/2 + Math.random() * centerAreaWidth;
    const centerY = canvasCenterY; // Always start from middle line
    
    // Stroke always goes from center line to edge
    const angle = Math.random() * Math.PI * 2;
    
    // Calculate maximum distance to canvas edge in this direction
    let maxDistance;
    if (angle >= 0 && angle < Math.PI / 2) {
      // Top-right quadrant
      maxDistance = Math.min((this.canvas.width - centerX) / Math.cos(angle), centerY / Math.sin(angle));
    } else if (angle >= Math.PI / 2 && angle < Math.PI) {
      // Top-left quadrant
      maxDistance = Math.min(centerX / Math.abs(Math.cos(angle)), centerY / Math.sin(angle));
    } else if (angle >= Math.PI && angle < 3 * Math.PI / 2) {
      // Bottom-left quadrant
      maxDistance = Math.min(centerX / Math.abs(Math.cos(angle)), (this.canvas.height - centerY) / Math.abs(Math.sin(angle)));
    } else {
      // Bottom-right quadrant
      maxDistance = Math.min((this.canvas.width - centerX) / Math.cos(angle), (this.canvas.height - centerY) / Math.abs(Math.sin(angle)));
    }
    
    // Pass full distance to edge, 80% reduction happens in animateMovingDots
    this.ctx.globalCompositeOperation = 'destination-out';
    
    // Animate dots moving along the stroke path
    this.animateMovingDots(centerX, centerY, angle, maxDistance);
  }
  
  // Move eraser image along stroke path
  animateMovingDots(startX, startY, angle, maxLength) {
    if (!this.eraserTexture) {
      console.warn('Eraser texture not loaded yet');
      return;
    }
    
    const strokeLength = maxLength * 0.8;
    const endX = startX + Math.cos(angle) * strokeLength;
    const endY = startY + Math.sin(angle) * strokeLength;
    
    // Draw the eraser image as it moves from start to end
    const imageWidth = this.options.eraserSize * 6;
    const imageHeight = this.options.eraserSize * 6;
    
    // Create smooth path by drawing image at multiple positions
    const steps = 100;
    for (let i = 0; i <= steps; i++) {
      const progress = i / steps;
      const currentX = startX + (endX - startX) * progress;
      const currentY = startY + (endY - startY) * progress;
      
      // Check canvas boundaries
      const drawX = Math.max(0, Math.min(this.canvas.width - imageWidth, currentX - imageWidth/2));
      const drawY = Math.max(0, Math.min(this.canvas.height - imageHeight, currentY - imageHeight/2));
      
      // Draw eraser image at current position
      this.ctx.drawImage(
        this.eraserTexture,
        drawX,
        drawY,
        imageWidth,
        imageHeight
      );
    }
  }
  
  // Create horizontal stroke across center of card
  createCenterHorizontalStroke() {
    if (!this.eraserTexture) {
      return;
    }
    
    const centerY = this.canvas.height / 2;
    const strokeWidth = this.canvas.width * 0.55; // 55% of card width  
    const strokeStart = (this.canvas.width - strokeWidth) / 2; // Center the stroke
    const strokeEnd = strokeStart + strokeWidth;
    
    this.ctx.globalCompositeOperation = 'destination-out';
    
    // Draw horizontal stroke with eraser texture
    const imageWidth = this.options.eraserSize * 6;
    const imageHeight = this.options.eraserSize * 6;
    const steps = 80;
    
    for (let i = 0; i <= steps; i++) {
      const progress = i / steps;
      const currentX = strokeStart + (strokeEnd - strokeStart) * progress;
      const currentY = centerY;
      
      // Draw eraser image at current position
      this.ctx.drawImage(
        this.eraserTexture,
        currentX - imageWidth/2,
        currentY - imageHeight/2,
        imageWidth,
        imageHeight
      );
    }
  }
}