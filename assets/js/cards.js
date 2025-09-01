import { ImageEraser } from './eraser-effect.js';
import { gsap } from 'gsap';

export class Cards {
  constructor() {
    this.cardBlocks = [];
    this.erasers = new Map();
    this.revealedCount = 0;
    this.clickCount = 0;
    this.cardImages = ['./assets/images/first-cart.png', './assets/images/second-cart.png', './assets/images/third-cart.png'];
    this.init();
    
    // Start sequential glow immediately - будет ждать пока карточки появятся
    this.startSequentialGlow();
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
    
    // GSAP animation with high z-index from start
    gsap.set(container, { zIndex: 1000 }); // Set high z-index immediately
    
    // Show container first with GSAP
    gsap.to(container, {
      opacity: 1,
      y: 0,
      duration: 0.6,
      ease: "power2.out",
      delay: 0.3
    });

    // Show cards with stagger using GSAP
    this.cardBlocks.forEach((card, index) => {
      gsap.to(card, {
        opacity: 1,
        scale: 1,
        duration: 0.4,
        ease: "back.out(1.7)",
        delay: 0.6 + (index * 0.2)
      });
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

  // Start sequential glow animation for cards
  startSequentialGlow() {
    setTimeout(() => {
      const cardBlocks = document.querySelectorAll('.card-block');
      
      // Рандомное мигание карточек темно-красным светом
      let lastIndex = -1;
      
      const glowNext = () => {
        // Убрать свечение и дрожание со всех карточек
        cardBlocks.forEach(card => {
          card.style.boxShadow = 'none';
          gsap.killTweensOf(card); // Остановить все GSAP анимации
          gsap.set(card, { x: 0, y: 0 }); // Вернуть в исходное положение
          if (card.shakeInterval) {
            clearInterval(card.shakeInterval);
            card.shakeInterval = null;
          }
        });
        
        // Выбрать рандомную карточку (но не ту же что была)
        let randomIndex;
        do {
          randomIndex = Math.floor(Math.random() * cardBlocks.length);
        } while (randomIndex === lastIndex && cardBlocks.length > 1);
        
        // Добавить очень темно-красное свечение к выбранной карточке
        if (cardBlocks[randomIndex]) {
          const card = cardBlocks[randomIndex];
          card.style.boxShadow = '0 0 20px rgba(80, 0, 0, 1), 0 0 30px rgba(80, 0, 0, 0.8)';
          
          // Добавить быстрое дрожание через setInterval - увеличиваем амплитуду
          card.shakeInterval = setInterval(() => {
            const randomX = (Math.random() - 0.5) * 8; // от -4 до 4
            const randomY = (Math.random() - 0.5) * 8;
            gsap.set(card, { x: randomX, y: randomY });
          }, 50); // каждые 50мс
        }
        
        lastIndex = randomIndex;
      };
      
      // Запуск мигания каждые 0.8 секунды (быстрее)
      setInterval(glowNext, 800);
      glowNext(); // первое мигание сразу
    }, 3000);
  }
}