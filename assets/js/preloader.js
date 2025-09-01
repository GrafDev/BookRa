import { criticalImages, modalImages } from './images-loader.js'

// Preloader functionality
export class Preloader {
  constructor() {
    this.preloader = document.getElementById('preloader')
    this.progressBar = document.getElementById('progressBar')
    this.progressText = document.getElementById('progressText')
    this.loadedImages = 0
    this.totalImages = 0
    this.imageUrls = []
    this.modalImagesLoaded = false
  }

  // Extract critical image URLs
  extractCriticalImageUrls() {
    this.imageUrls = Object.values(criticalImages)
    this.totalImages = this.imageUrls.length
    console.log(`Preloading ${this.totalImages} critical images:`, this.imageUrls)
  }
  
  // Extract modal image URLs
  extractModalImageUrls() {
    return Object.values(modalImages)
  }

  // Update progress bar and percentage
  updateProgress() {
    const progress = Math.round((this.loadedImages / this.totalImages) * 100)
    this.progressBar.style.width = `${progress}%`
    this.progressText.textContent = `${progress}%`
  }

  // Load single image
  loadImage(url) {
    return new Promise((resolve, reject) => {
      const img = new Image()
      
      img.onload = () => {
        this.loadedImages++
        this.updateProgress()
        console.log(`Loaded: ${url} (${this.loadedImages}/${this.totalImages})`)
        resolve(url)
      }
      
      img.onerror = () => {
        console.error(`Failed to load: ${url}`)
        this.loadedImages++
        this.updateProgress()
        resolve(url) // Continue even if image fails
      }
      
      img.src = url
    })
  }

  // Load critical images only
  async loadCriticalImages() {
    this.extractCriticalImageUrls()
    
    if (this.totalImages === 0) {
      console.warn('No critical images to preload')
      return
    }

    const loadPromises = this.imageUrls.map(url => this.loadImage(url))
    
    try {
      await Promise.all(loadPromises)
      console.log('Critical images loaded successfully')
    } catch (error) {
      console.error('Error loading critical images:', error)
    }
  }
  
  // Load modal images in background
  async loadModalImages() {
    if (this.modalImagesLoaded) {
      return
    }
    
    const modalUrls = this.extractModalImageUrls()
    console.log(`Loading ${modalUrls.length} modal images in background:`, modalUrls)
    
    const loadPromises = modalUrls.map(url => {
      return new Promise((resolve) => {
        const img = new Image()
        img.onload = () => {
          console.log(`Modal image loaded: ${url}`)
          resolve(url)
        }
        img.onerror = () => {
          console.warn(`Failed to load modal image: ${url}`)
          resolve(url) // Don't block on errors
        }
        img.src = url
      })
    })
    
    try {
      await Promise.all(loadPromises)
      this.modalImagesLoaded = true
      console.log('All modal images loaded successfully')
    } catch (error) {
      console.error('Error loading modal images:', error)
      this.modalImagesLoaded = true // Mark as loaded anyway
    }
  }
  
  // Check if modal images are ready
  isModalReady() {
    return this.modalImagesLoaded
  }

  // Hide preloader with animation
  hide() {
    return new Promise((resolve) => {
      this.preloader.classList.add('fade-out')
      
      setTimeout(() => {
        this.preloader.style.display = 'none'
        resolve()
      }, 500) // Match CSS transition duration
    })
  }

  // Main preloader function - only critical images
  async load() {
    console.log('Starting critical preloader...')
    
    try {
      await this.loadCriticalImages()
      
      // Small delay to show 100% briefly
      await new Promise(resolve => setTimeout(resolve, 300))
      
      await this.hide()
      console.log('Critical preloader complete')
      
      // Start loading modal images in background
      this.loadModalImages() // Don't await - run in background
      
    } catch (error) {
      console.error('Preloader error:', error)
      await this.hide() // Hide anyway
      // Still try to load modal images
      this.loadModalImages()
    }
  }
}

// Export instance
export const preloader = new Preloader()