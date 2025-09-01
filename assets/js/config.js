export const gameConfig = {
  gameTypes: {
    scratch: {
      name: 'scratch',
      backgroundColor: 'rgba(34, 197, 94, 0.3)', // green-500 with opacity
      images: {
        logo1: {
          part1: './assets/images/logo1-part1.png',
          part2: './assets/images/logo1-part2.png'
        },
        title: './assets/images/title.png',
        logo2: {
          part1: './assets/images/logo2-part1.webp',
          part2: './assets/images/logo2-part2.png'
        }
      }
    },
    wheel: {
      name: 'wheel',
      backgroundColor: 'rgba(147, 51, 234, 0.3)', // purple-600 with opacity
      images: {
        logo1: {
          part1: './assets/images/logo1-part1.png',
          part2: './assets/images/logo1-part2.png'
        },
        title: './assets/images/title.png',
        logo2: {
          part1: './assets/images/logo2-part1.webp',
          part2: './assets/images/logo2-part2.png'
        }
      }
    }
  },

  characters: {
    man1: {
      part1: './assets/images/man1-part1.webp'
    },
    man2: './assets/images/man2.webp',
    man3: {
      part1: './assets/images/man3-part1.webp',
      part2: './assets/images/man3-part2.webp'
    },
    man4: {
      part1: './assets/images/man4-part1.webp',
      part2: './assets/images/man4-part2.webp'
    }
  },

  layout: {
    gameAspectRatio: '1 / 1',
    logoHeight: '25%',
    titleHeight: '25%',
    characterSizes: {
      man34: '70%', // man3 and man4 image size
      man12: '100%' // man1 and man2 image size
    }
  }
};

export function getGameConfig(gameType = 'scratch') {
  return gameConfig.gameTypes[gameType] || gameConfig.gameTypes.scratch;
}

export function applyGameStyles(gameType = 'scratch') {
  const config = getGameConfig(gameType);
  const gameElement = document.querySelector('.game');
  
  if (gameElement) {
    gameElement.setAttribute('data-game-type', gameType);
    gameElement.style.backgroundColor = config.backgroundColor;
    
    // In development mode, show/hide containers for dev panel switching
    const isDevelopment = import.meta.env.DEV;
    if (isDevelopment) {
      const cardsContainer = document.querySelector('.cards-container');
      const wheelContainer = document.querySelector('.wheel-container');
      
      if (cardsContainer && wheelContainer) {
        if (gameType === 'wheel') {
          cardsContainer.style.display = 'none';
          wheelContainer.style.display = 'block';
        } else {
          cardsContainer.style.display = 'flex';
          cardsContainer.style.flexDirection = 'column';
          cardsContainer.style.gap = '6%';
          wheelContainer.style.display = 'none';
        }
      }
    }
  }
}