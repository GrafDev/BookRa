import { setupDevPanel } from './assets/js/dev-panel.js'

const isDevelopment = import.meta.env.DEV;
let gameMode = localStorage.getItem('bookra_gameMode') || 'click';

function updateGameMode() {
  console.log('Current game mode:', gameMode);
}

// Main app initialization

if (isDevelopment) {
  setupDevPanel(gameMode, updateGameMode, isDevelopment);
}