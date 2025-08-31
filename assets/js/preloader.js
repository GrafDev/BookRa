import { images } from './images-loader.js'

// Preloader functionality
export class Preloader {
  constructor() {
    this.preloader = document.getElementById('preloader')
    this.progressBar = document.getElementById('progressBar')
    this.progressText = document.getElementById('progressText')
    this.loadedImages = 0
    this.totalImages = 0
    this.imageUrls = []
  }

  // Extract all image URLs from images object
  extractImageUrls() {
    this.imageUrls = Object.values(images)
    this.totalImages = this.imageUrls.length
    console.log(`Preloading ${this.totalImages} images:`, this.imageUrls)
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

  // Load all images
  async loadAllImages() {
    this.extractImageUrls()
    
    if (this.totalImages === 0) {
      console.warn('No images to preload')
      return
    }

    const loadPromises = this.imageUrls.map(url => this.loadImage(url))
    
    try {
      await Promise.all(loadPromises)
      console.log('All images loaded successfully')
    } catch (error) {
      console.error('Error loading images:', error)
    }
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

  // Main preloader function
  async load() {
    console.log('Starting preloader...')
    
    try {
      await this.loadAllImages()
      
      // Small delay to show 100% briefly
      await new Promise(resolve => setTimeout(resolve, 500))
      
      await this.hide()
      console.log('Preloader complete')
      
    } catch (error) {
      console.error('Preloader error:', error)
      await this.hide() // Hide anyway
    }
  }
}

// Export instance
export const preloader = new Preloader()