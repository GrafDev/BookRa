import { ImageEraser } from './eraser-effect.js';

export class Cards {
  constructor() {
    this.cardBlocks = [];
    this.erasers = new Map();
    this.revealedCount = 0;
    this.clickCount = 0;
    this.cardImages = ['./assets/images/first-cart.png', './assets/images/second-cart.png', './assets/images/third-cart.png'];
    this.init();
  }

  init() {
    this.cardBlocks = document.querySelectorAll('.card-block');
    this.setupEventListeners();
    this.animateAppearance();
  }

  setupEventListeners() {
    this.cardBlocks.forEach((cardBlock, index) => {
      const handleEvent = (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.handleCardClick(cardBlock, index);
      };
      
      cardBlock.addEventListener('click', handleEvent);
      cardBlock.addEventListener('touchend', handleEvent);
      
      cardBlock.style.cursor = 'pointer';
      cardBlock.style.touchAction = 'manipulation';
    });
  }

  handleCardClick(cardBlock, index) {
    if (cardBlock.classList.contains('revealed') || this.erasers.has(cardBlock)) return;

    const prize = cardBlock.querySelector('.card-prize');
    const blanket = cardBlock.querySelector('.card-blanket');

    if (!prize || !blanket) {
      console.warn('Card images not found');
      return;
    }

    // Change the underlying image and show with fade
    const imageIndex = this.clickCount % this.cardImages.length;
    prize.src = this.cardImages[imageIndex];
    
    // Show prize with fade effect
    setTimeout(() => {
      prize.style.opacity = '1';
    }, 100);
    
    this.clickCount++;

    // Create and start eraser
    const eraser = new ImageEraser(blanket, {
      eraserSize: 15
    });
    
    this.erasers.set(cardBlock, eraser);
    
    // Auto erase 70% with animation
    eraser.autoErase(70, 1000).then(percentage => {
      this.onCardRevealed(cardBlock, percentage);
    });
    
    // Add visual feedback
    cardBlock.classList.add('card-processing');
  }

  onCardRevealed(cardBlock, percentage) {
    // Remove processing state
    cardBlock.classList.remove('card-processing');
    
    // Add revealed state
    cardBlock.classList.add('revealed');
    this.revealedCount++;
    
    // Disable further clicks
    cardBlock.style.cursor = 'default';
    cardBlock.style.pointerEvents = 'none';

    // Check if all cards revealed
    if (this.revealedCount === 3) {
      setTimeout(() => this.onAllCardsRevealed(), 2000);
    }

    // Dispatch custom event
    const event = new CustomEvent('cardRevealed', {
      detail: { cardBlock, percentage, revealedCount: this.revealedCount }
    });
    document.dispatchEvent(event);
  }

  animateAppearance() {
    const container = document.querySelector('.cards-container');
    
    // Show container first
    setTimeout(() => {
      container.classList.add('visible');
    }, 300);

    // Show cards with stagger
    this.cardBlocks.forEach((card, index) => {
      setTimeout(() => {
        card.classList.add('visible');
      }, 600 + (index * 200));
    });
  }

  onAllCardsRevealed() {
    console.log('All cards revealed!');
    // Dispatch event for game completion
    const event = new CustomEvent('gameComplete', {
      detail: { type: 'cards' }
    });
    document.dispatchEvent(event);
  }

  reset() {
    this.revealedCount = 0;
    
    this.cardBlocks.forEach(cardBlock => {
      const prize = cardBlock.querySelector('.card-prize');
      const blanket = cardBlock.querySelector('.card-blanket');
      
      cardBlock.classList.remove('revealed', 'visible');
      prize.classList.remove('revealed');
      blanket.style.opacity = '1';
      blanket.style.transition = '';
    });

    const container = document.querySelector('.cards-container');
    container.classList.remove('visible');
    
    // Restart animation
    setTimeout(() => this.animateAppearance(), 100);
  }
}