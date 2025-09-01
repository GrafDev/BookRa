import { images } from './images-loader.js'
import sound1Mp3 from '../media/sound1.mp3'

class AudioManager {
  constructor() {
    this.isEnabled = true; // По умолчанию звук включен
    this.winSoundAudio = null;
    this.musicButton = null;
    this.musicIcon = null;
    
    this.init();
  }

  init() {
    // Only initialize for scratch game type
    const gameType = this.getGameType();
    if (gameType === 'scratch') {
      this.setupButton();
      this.loadSounds();
    } else {
      // Hide button for non-scratch games
      this.hideButton();
    }
  }

  getGameType() {
    const isDevelopment = import.meta.env.DEV;
    let gameType = import.meta.env.VITE_GAME_TYPE || 'scratch';
    
    if (isDevelopment) {
      try {
        const savedState = JSON.parse(localStorage.getItem('bookra_dev_state') || '{}');
        if (savedState.gameType) {
          gameType = savedState.gameType;
        }
      } catch (error) {
        console.warn('Failed to load dev state for audio:', error);
      }
    }
    
    return gameType;
  }

  hideButton() {
    this.musicButton = document.getElementById('musicToggle');
    if (this.musicButton) {
      this.musicButton.style.display = 'none';
    }
  }

  setupButton() {
    this.musicButton = document.getElementById('musicToggle');
    this.musicIcon = document.getElementById('musicIcon');
    
    if (this.musicButton && this.musicIcon) {
      this.updateButtonState();
      
      this.musicButton.addEventListener('click', () => {
        this.toggleSound();
      });
    }
  }

  toggleSound() {
    this.isEnabled = !this.isEnabled;
    this.updateButtonState();
    
    // Save state to localStorage
    localStorage.setItem('bookra_sound_enabled', this.isEnabled);
  }

  updateButtonState() {
    if (this.musicIcon) {
      if (this.isEnabled) {
        this.musicIcon.src = images.playMusic;
        this.musicIcon.alt = 'Sound On';
      } else {
        this.musicIcon.src = images.stopMusic;
        this.musicIcon.alt = 'Sound Off';
      }
    }
  }

  async loadSounds() {
    try {
      this.winSoundAudio = new Audio(sound1Mp3);
      this.winSoundAudio.preload = 'auto';
      this.winSoundAudio.volume = 0.7; // Set volume to 70%
    } catch (error) {
      console.warn('Failed to load sound:', error);
    }
  }

  async playWinSound() {
    const gameType = this.getGameType();
    
    // Only play sound for scratch games
    if (gameType !== 'scratch' || !this.isEnabled || !this.winSoundAudio) {
      return;
    }

    try {
      // Reset audio to beginning and play
      this.winSoundAudio.currentTime = 0;
      await this.winSoundAudio.play();
    } catch (error) {
      console.warn('Failed to play win sound:', error);
    }
  }

  // Check if audio can be played (browser policy)
  async checkAudioPermission() {
    try {
      if (this.winSoundAudio) {
        // Try to play a very quiet test
        const originalVolume = this.winSoundAudio.volume;
        this.winSoundAudio.volume = 0;
        const playPromise = this.winSoundAudio.play();
        
        if (playPromise) {
          await playPromise;
          this.winSoundAudio.pause();
          this.winSoundAudio.currentTime = 0;
          this.winSoundAudio.volume = originalVolume;
        }
        
        return true;
      }
    } catch (error) {
      // Autoplay blocked or not supported
      console.log('Audio autoplay blocked, sound will be disabled by default');
      return false;
    }
    return false;
  }

  // Load sound state from localStorage
  async loadState() {
    const gameType = this.getGameType();
    
    // Only load state for scratch games
    if (gameType !== 'scratch') {
      return;
    }
    
    const savedState = localStorage.getItem('bookra_sound_enabled');
    
    if (savedState !== null) {
      // User has previously set a preference
      this.isEnabled = savedState === 'true';
    } else {
      // First time user - check if audio can be played
      const canPlayAudio = await this.checkAudioPermission();
      this.isEnabled = canPlayAudio;
      
      // Save the initial state
      localStorage.setItem('bookra_sound_enabled', this.isEnabled);
    }
    
    this.updateButtonState();
  }

  // Method to reinitialize when game type changes (for dev mode)
  reinitialize() {
    const gameType = this.getGameType();
    if (gameType === 'scratch') {
      this.setupButton();
      this.loadSounds();
      this.loadState();
    } else {
      this.hideButton();
    }
  }
}

// Create singleton instance
const audioManager = new AudioManager();

export { audioManager };