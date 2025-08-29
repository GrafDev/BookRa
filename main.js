import './style.css'
import './styles/dev.css'
import { setupDevPanel } from './js/dev-panel.js'

const isDevelopment = import.meta.env.DEV;
let gameMode = localStorage.getItem('bookra_gameMode') || 'click';

function updateGameMode() {
  console.log('Current game mode:', gameMode);
}

document.querySelector('#app').innerHTML = `
  <div>
    <h1>BookRa</h1>
    <p>Welcome to BookRa project!</p>
  </div>
`

if (isDevelopment) {
  setupDevPanel(gameMode, updateGameMode, isDevelopment);
}