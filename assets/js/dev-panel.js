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

  // Import dev CSS only in development
  import('../css/dev.css');

  // Create dev panel HTML
  const devPanelHTML = `
    <div class="dev-panel" id="devPanel" style="display: none;">
      <div class="dev-section">
        <h4>Game Type</h4>
        <div class="mode-switcher">
          <span class="mode-label">Scratch</span>
          <label class="switch">
            <input type="checkbox" id="gameTypeSwitcher">
            <span class="slider"></span>
          </label>
          <span class="mode-label">Wheel</span>
        </div>
      </div>
      <div class="dev-section">
        <h4>Game Mode</h4>
        <div class="mode-switcher">
          <span class="mode-label">Click</span>
          <label class="switch">
            <input type="checkbox" id="modeSwitcher">
            <span class="slider"></span>
          </label>
          <span class="mode-label">Auto</span>
        </div>
      </div>
      <div class="dev-section">
        <h4>Debug</h4>
        <label>
          <input type="checkbox" id="showBorders"> Показать рамки
        </label>
      </div>
      <div class="dev-section">
        <h4>Device Info</h4>
        <div id="deviceInfo" style="font-size: 12px; color: #ccc;"></div>
      </div>
    </div>
    <button class="dev-toggle" id="devToggle">DEV</button>
  `;

  // Add dev panel to body
  document.body.insertAdjacentHTML('beforeend', devPanelHTML);

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

  // Update device info
  function updateDeviceInfo() {
    const deviceInfoEl = document.getElementById('deviceInfo');
    if (!deviceInfoEl) return;

    const width = window.innerWidth;
    const height = window.innerHeight;
    const aspectRatio = width / height;
    const orientation = width > height ? 'landscape' : 'portrait';
    
    // Device type detection using existing breakpoints
    const isNarrowPortrait = window.matchMedia('(max-aspect-ratio: 1/1) and (max-width: 767px)').matches;
    const isTabletPortrait = window.matchMedia('(max-aspect-ratio: 1/1) and (min-width: 768px)').matches;
    const isLandscapeLow = window.matchMedia('(max-height: 500px) and (orientation: landscape)').matches;
    
    // Use same logic as CSS breakpoints
    let deviceType = 'desktop';
    
    // Mobile: narrow portrait or landscape with small height
    if (aspectRatio < 0.75 || (aspectRatio > 1.5 && Math.min(width, height) <= 500)) {
      deviceType = 'mobile';
    }
    // Tablet: portrait 768+ OR landscape 940-1399
    else if ((orientation === 'portrait' && width >= 768) || 
             (orientation === 'landscape' && width >= 940 && width < 1400)) {
      deviceType = 'tablet';
    }
    // Desktop: width >= 1400 OR everything else not caught above
    else if (width >= 1400) {
      deviceType = 'desktop';
    }
    // Mid-range devices that don't fit mobile/tablet - also desktop
    else {
      deviceType = 'desktop';
    }
    
    deviceInfoEl.innerHTML = `
      <div><strong>${deviceType.toUpperCase()}</strong> | ${orientation.toUpperCase()}</div>
      <div>${width}x${height} | ratio: ${aspectRatio.toFixed(2)}</div>
      <div>width <= 767: ${width <= 767}</div>
      <div>Portrait narrow: ${isNarrowPortrait}</div>
      <div>Tablet portrait: ${isTabletPortrait}</div>
      <div>Landscape low: ${isLandscapeLow}</div>
    `;
  }

  // Update device info initially and on resize
  updateDeviceInfo();
  window.addEventListener('resize', updateDeviceInfo);

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