import { setupDevPanel } from './assets/js/dev-panel.js'
import { getGameConfig, applyGameStyles } from './assets/js/config.js'
import { initMan1Animations, initImmediateAnimations } from './assets/js/character-animations.js'
import { initAppearAnimations } from './assets/js/appears-anim.js'
import { Cards } from './assets/js/cards.js'
import { Wheel } from './assets/js/wheel.js'
import { loadGameContainers } from './assets/js/game-templates.js'
import { preloader } from './assets/js/preloader.js'
import { audioManager } from './assets/js/audio-manager.js'

// Prevent all zoom functionality
function preventZoom() {
  // Block Ctrl+Wheel
  document.addEventListener('wheel', function(e) {
    if (e.ctrlKey) {
      e.preventDefault();
    }
  }, { passive: false });

  // Block keyboard zoom shortcuts
  document.addEventListener('keydown', function(e) {
    if ((e.ctrlKey || e.metaKey) && (e.key === '+' || e.key === '-' || e.key === '=' || e.key === '0')) {
      e.preventDefault();
    }
  });

  // Block right-click context menu
  document.addEventListener('contextmenu', function(e) {
    e.preventDefault();
  });

  // Block F11 fullscreen
  document.addEventListener('keydown', function(e) {
    if (e.key === 'F11') {
      e.preventDefault();
    }
  });
}

const isDevelopment = import.meta.env.DEV;
let gameMode = localStorage.getItem('bookra_gameMode') || 'click';

function updateGameMode() {
  console.log('Current game mode:', gameMode);
}


// Main app initialization
function initializeGameType() {
  let gameType = import.meta.env.VITE_GAME_TYPE || 'scratch';
  
  // Load game containers first
  loadGameContainers();
  
  // Check dev panel state if in development
  if (isDevelopment) {
    try {
      const devState = JSON.parse(localStorage.getItem('bookra_dev_state') || '{}');
      if (devState.gameType) {
        gameType = devState.gameType;
      }
    } catch (error) {
      console.warn('Failed to load dev state:', error);
    }
  }
  
  const config = getGameConfig(gameType);
  document.documentElement.style.setProperty('--game-bg-color', config.backgroundColor);
  applyGameStyles(gameType);
  
  return gameType;
}

// Initialize app after preloader
async function initApp() {
  // Run preloader first
  await preloader.load();
  
  // Initialize game after preloader completes
  const gameType = initializeGameType();

  if (isDevelopment) {
    setupDevPanel(gameMode, updateGameMode, isDevelopment);
  }

  // Initialize game logic based on type
  if (gameType === 'scratch') {
    new Cards();
  } else if (gameType === 'wheel') {
    new Wheel();
  }

  // Initialize immediate glow animations
  initImmediateAnimations();

  // Initialize appear animations and delayed animations (man1 orbit) AFTER appearance is complete
  const appearTimeline = initAppearAnimations();
  if (appearTimeline) {
    appearTimeline.eventCallback("onComplete", () => {
      initMan1Animations();
    });
  } else {
    // Fallback if timeline creation fails
    setTimeout(initMan1Animations, 2000);
  }

  // Initialize zoom prevention
  preventZoom();
  
  // Load audio manager state
  audioManager.loadState();
}

// Start the app
initApp();