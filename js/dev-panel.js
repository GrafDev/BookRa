let devMode = false;
const DEV_STATE_KEY = 'bookra_dev_state';

function loadDevState() {
  try {
    const saved = localStorage.getItem(DEV_STATE_KEY);
    return saved ? JSON.parse(saved) : {};
  } catch (error) {
    console.warn('Failed to load dev state:', error);
    return {};
  }
}

function saveDevState(state) {
  try {
    const currentState = loadDevState();
    const newState = { ...currentState, ...state };
    localStorage.setItem(DEV_STATE_KEY, JSON.stringify(newState));
  } catch (error) {
    console.warn('Failed to save dev state:', error);
  }
}

export function setupDevPanel(gameMode, updateGameMode, isDevelopment) {
  if (!isDevelopment) return;

  const devToggle = document.getElementById('devToggle');
  const devPanel = document.getElementById('devPanel');
  const showBordersCheckbox = document.getElementById('showBorders');
  const modeSwitcher = document.getElementById('modeSwitcher');
  const gameTypeSwitcher = document.getElementById('gameTypeSwitcher');

  const savedState = loadDevState();
  devMode = savedState.devPanelOpen || false;
  
  const currentGameType = import.meta.env.VITE_GAME_TYPE || 'scratch';
  const savedGameMode = savedState.gameMode || gameMode;
  const savedGameType = savedState.gameType || currentGameType;
  
  modeSwitcher.checked = savedGameMode === 'auto';
  if (gameTypeSwitcher) {
    gameTypeSwitcher.checked = savedGameType === 'wheel';
  }
  devToggle.textContent = `DEV (${savedGameType.toUpperCase()}-${savedGameMode.toUpperCase()})`;
  
  if (devMode) {
    devPanel.style.display = 'block';
  }
  
  if (savedState.showBorders) {
    showBordersCheckbox.checked = true;
    document.body.classList.add('dev-borders');
  }

  devToggle.addEventListener('click', () => {
    devMode = !devMode;
    devPanel.style.display = devMode ? 'block' : 'none';
    saveDevState({ devPanelOpen: devMode });
    updateGameMode();
  });

  showBordersCheckbox.addEventListener('change', (e) => {
    const showBorders = e.target.checked;
    saveDevState({ showBorders });
    
    if (showBorders) {
      document.body.classList.add('dev-borders');
    } else {
      document.body.classList.remove('dev-borders');
    }
  });

  modeSwitcher.addEventListener('change', (e) => {
    gameMode = e.target.checked ? 'auto' : 'click';
    localStorage.setItem('bookra_gameMode', gameMode);
    saveDevState({ gameMode });
    updateGameMode();
    location.reload();
  });

  if (gameTypeSwitcher) {
    gameTypeSwitcher.addEventListener('change', (e) => {
      const newGameType = e.target.checked ? 'wheel' : 'scratch';
      saveDevState({ gameType: newGameType });
      location.reload();
    });
  }

  return { devMode, gameMode };
}

export function updateDevToggleText(gameMode, isDevelopment) {
  if (!isDevelopment) return;
  
  const devToggle = document.getElementById('devToggle');
  if (devToggle) {
    devToggle.textContent = devMode ? `HIDE DEV (${gameMode.toUpperCase()})` : `DEV (${gameMode.toUpperCase()})`;
  }
}