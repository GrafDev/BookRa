export class Cards {
  constructor() {
    this.cardBlocks = [];
    this.revealedCount = 0;
    this.prizes = ['card-prize1.png', 'card-prize2.png', 'card-prize3.png'];
    this.init();
  }

  init() {
    this.cardBlocks = document.querySelectorAll('.card-block');
    this.setupEventListeners();
    this.animateAppearance();
  }

  setupEventListeners() {
    this.cardBlocks.forEach((cardBlock, index) => {
      cardBlock.addEventListener('click', () => this.handleCardClick(cardBlock, index));
    });
  }

  handleCardClick(cardBlock, index) {
    if (cardBlock.classList.contains('revealed')) return;

    const prize = cardBlock.querySelector('.card-prize');
    const blanket = cardBlock.querySelector('.card-blanket');

    // Show prize with fade effect
    prize.classList.add('revealed');
    
    // Start erasing blanket
    this.eraseBlanket(blanket);
    
    // Mark as revealed
    cardBlock.classList.add('revealed');
    this.revealedCount++;

    // Check if all cards revealed
    if (this.revealedCount === 3) {
      setTimeout(() => this.onAllCardsRevealed(), 1500);
    }

    // Dispatch custom event
    const event = new CustomEvent('cardRevealed', {
      detail: { cardBlock, index, revealedCount: this.revealedCount }
    });
    document.dispatchEvent(event);
  }

  eraseBlanket(blanket) {
    // Simple fade out effect for now
    setTimeout(() => {
      blanket.style.transition = 'opacity 1s ease';
      blanket.style.opacity = '0';
    }, 500);
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