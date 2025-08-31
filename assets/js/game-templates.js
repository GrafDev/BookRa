// Game container templates
import { images } from './images-loader.js'

export function createCardsContainer() {
  return `<div class="cards-container">
    <div class="cards-top-section">
      <div class="card-block">
        <img src="${images.backCart}" alt="Card Background" class="card-bg">
        <img src="${images.firstCart}" alt="First Card" class="card-prize">
        <img src="${images.blanketCart}" alt="Blanket Card" class="card-blanket">
        <img src="${images.borderCart}" alt="Card Border" class="card-border">
      </div>
      <div class="card-block">
        <img src="${images.backCart}" alt="Card Background" class="card-bg">
        <img src="${images.secondCart}" alt="Second Card" class="card-prize">
        <img src="${images.blanketCart}" alt="Blanket Card" class="card-blanket">
        <img src="${images.borderCart}" alt="Card Border" class="card-border">
      </div>
    </div>
    <div class="cards-bottom-section" style="margin-top: 6%;">
      <div class="card-block">
        <img src="${images.backCart}" alt="Card Background" class="card-bg">
        <img src="${images.thirdCart}" alt="Third Card" class="card-prize">
        <img src="${images.blanketCart}" alt="Blanket Card" class="card-blanket">
        <img src="${images.borderCart}" alt="Card Border" class="card-border">
      </div>
    </div>
  </div>`;
}

export function createWheelContainer() {
  return `<div class="wheel-container">
    <div class="wheel-wrapper">
      <div class="wheel-part1"></div>
      <div class="wheel-part2"></div>
      <div class="wheel-part3"></div>
      <div class="wheel-part3-1"></div>
      <div class="wheel-text1"></div>
      <div class="wheel-text2"></div>
    </div>
    <div class="wheel-part4"></div>
    <div class="wheel-center-button">
      <div class="wheel-part5"></div>
      <div class="wheel-part6"></div>
    </div>
    <div class="arrow">
      <img src="${images.arrowPart1}" alt="Arrow Part 1" class="arrow-part1">
      <img src="${images.arrowPart2}" alt="Arrow Part 2" class="arrow-part2">
    </div>
  </div>`;
}

export function loadGameContainers() {
  const isDevelopment = import.meta.env.DEV;
  const gameType = import.meta.env.VITE_GAME_TYPE || 'scratch';
  const gameElement = document.querySelector('.game');
  
  if (!gameElement) return;
  
  if (isDevelopment) {
    // Development: load both containers
    gameElement.innerHTML = createCardsContainer() + createWheelContainer();
    
    // Show appropriate container based on current game type
    const cardsContainer = document.querySelector('.cards-container');
    const wheelContainer = document.querySelector('.wheel-container');
    
    if (cardsContainer && wheelContainer) {
      if (gameType === 'wheel') {
        cardsContainer.style.display = 'none';
        wheelContainer.style.display = 'block';
      } else {
        cardsContainer.style.display = 'block';
        wheelContainer.style.display = 'none';
      }
    }
  } else {
    // Production: load only the needed container
    if (gameType === 'wheel') {
      gameElement.innerHTML = createWheelContainer();
    } else {
      gameElement.innerHTML = createCardsContainer();
    }
  }
}