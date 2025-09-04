import { images } from './images-loader.js';

export const gameConfig = {
  gameTypes: {
    scratch: {
      name: 'scratch',
      backgroundColor: 'transparent',
      images: {
        logo1: {
          part1: images.logo1Part1,
          part2: images.logo1Part2
        },
        title: images.title,
        logo2: {
          part1: images.logo2Part1,
          part2: images.logo2Part2
        }
      }
    },
    wheel: {
      name: 'wheel',
      backgroundColor: 'transparent',
      images: {
        logo1: {
          part1: images.logo1Part1,
          part2: images.logo1Part2
        },
        title: images.title,
        logo2: {
          part1: images.logo2Part1,
          part2: images.logo2Part2
        }
      }
    }
  },

  characters: {
    man1: {
      part1: images.man1Part1
    },
    man2: images.man2,
    man3: {
      part1: images.man3Part1,
      part2: images.man3Part2
    },
    man4: {
      part1: images.man4Part1,
      part2: images.man4Part2
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
  
  // Add game type class to body
  document.body.className = document.body.className.replace(/\b(scratch|wheel)\b/g, '').trim();
  document.body.classList.add(gameType);
  
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
          wheelContainer.style.display = 'none';
        }
      }
    }
  }
}