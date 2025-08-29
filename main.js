import { setupDevPanel } from './assets/js/dev-panel.js'
import { getGameConfig, applyGameStyles } from './assets/js/config.js'

const isDevelopment = import.meta.env.DEV;
let gameMode = localStorage.getItem('bookra_gameMode') || 'click';

function updateGameMode() {
  console.log('Current game mode:', gameMode);
}


// Main app initialization
function initializeGameType() {
  let gameType = import.meta.env.VITE_GAME_TYPE || 'scratch';
  
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

const gameType = initializeGameType();

if (isDevelopment) {
  setupDevPanel(gameMode, updateGameMode, isDevelopment);
}