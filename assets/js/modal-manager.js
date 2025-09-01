import { preloader } from './preloader.js'

class ModalManager {
  constructor() {
    this.modalAnimations = null
    this.isLoading = false
    this.pendingShow = false
  }

  // Lazy load modal animations module
  async loadModalAnimations() {
    if (this.modalAnimations || this.isLoading) {
      return this.modalAnimations
    }

    this.isLoading = true
    console.log('Loading modal animations module...')

    try {
      const module = await import('./modal-animations.js')
      this.modalAnimations = module
      console.log('Modal animations module loaded')
      return this.modalAnimations
    } catch (error) {
      console.error('Failed to load modal animations:', error)
      return null
    } finally {
      this.isLoading = false
    }
  }

  // Show modal with loading check
  async showModal() {
    // If already trying to show, don't duplicate
    if (this.pendingShow) {
      return
    }

    this.pendingShow = true
    console.log('Attempting to show modal...')

    try {
      // Wait for modal images to be loaded
      if (!preloader.isModalReady()) {
        console.log('Modal images not ready, waiting...')
        await this.waitForModalImages()
      }

      // Load modal animations module if not loaded
      const modalModule = await this.loadModalAnimations()
      if (!modalModule) {
        console.error('Failed to load modal module')
        return
      }

      // Show the modal
      console.log('Modal is ready, showing...')
      modalModule.showModal()

    } catch (error) {
      console.error('Error showing modal:', error)
    } finally {
      this.pendingShow = false
    }
  }

  // Wait for modal images with timeout
  async waitForModalImages(timeout = 10000) {
    return new Promise((resolve) => {
      const startTime = Date.now()
      
      const checkReady = () => {
        if (preloader.isModalReady()) {
          console.log('Modal images ready!')
          resolve()
        } else if (Date.now() - startTime > timeout) {
          console.warn('Modal images loading timed out, showing anyway')
          resolve() // Don't block forever
        } else {
          setTimeout(checkReady, 100) // Check every 100ms
        }
      }

      checkReady()
    })
  }

  // Hide modal
  async hideModal() {
    if (this.modalAnimations) {
      this.modalAnimations.hideModal()
    }
  }
}

// Create singleton instance
const modalManager = new ModalManager()

export { modalManager }