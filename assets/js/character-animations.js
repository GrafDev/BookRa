import { gsap } from 'gsap';

export function createBrightnessAnimation(selector, brightness = 1.3, duration = 2, ease = 'power2.inOut') {
  const element = document.querySelector(selector);
  
  if (!element) {
    console.warn(`Element with selector "${selector}" not found`);
    return null;
  }

  // Set initial brightness to normal
  gsap.set(element, { filter: 'brightness(1)' });

  return gsap.fromTo(element, 
    { filter: 'brightness(1)' },
    { 
      filter: `brightness(${brightness})`,
      duration: duration,
      yoyo: true,
      repeat: -1,
      ease: ease
    }
  );
}

export function createSmoothBrightnessAnimation(selector, brightness = 1.4, duration = 3, pause = 1) {
  const element = document.querySelector(selector);
  
  if (!element) {
    console.warn(`Element with selector "${selector}" not found`);
    return null;
  }

  // Set initial state
  gsap.set(element, { filter: 'brightness(1)' });

  const tl = gsap.timeline({ repeat: -1 });
  
  // Brightness up
  tl.to(element, {
    filter: `brightness(${brightness})`,
    duration: duration,
    ease: 'power2.inOut'
  })
  // Hold the brightness
  .to(element, {
    filter: `brightness(${brightness})`,
    duration: pause,
    ease: 'none'
  })
  // Brightness down
  .to(element, {
    filter: 'brightness(1)',
    duration: duration,
    ease: 'power2.inOut'
  })
  // Pause before next cycle
  .to(element, {
    filter: 'brightness(1)',
    duration: pause,
    ease: 'none'
  });

  return tl;
}

export function createGoldenGlowAnimation(selector, glowSize = 20, duration = 2, ease = 'power2.inOut') {
  const element = document.querySelector(selector);
  
  if (!element) {
    console.warn(`Element with selector "${selector}" not found`);
    return null;
  }

  // Set initial glow to minimal
  gsap.set(element, { filter: 'drop-shadow(0 0 5px gold)' });

  return gsap.fromTo(element, 
    { filter: 'drop-shadow(0 0 5px gold)' },
    { 
      filter: `drop-shadow(0 0 ${glowSize}px gold)`,
      duration: duration,
      yoyo: true,
      repeat: -1,
      ease: ease
    }
  );
}

export function createRedGlowAnimation(selector, glowSize = 20, duration = 2, ease = 'power2.inOut') {
  const element = document.querySelector(selector);
  
  if (!element) {
    console.warn(`Element with selector "${selector}" not found`);
    return null;
  }

  // Set initial glow to minimal
  gsap.set(element, { filter: 'drop-shadow(0 0 5px red)' });

  return gsap.fromTo(element, 
    { filter: 'drop-shadow(0 0 5px red)' },
    { 
      filter: `drop-shadow(0 0 ${glowSize}px red)`,
      duration: duration,
      yoyo: true,
      repeat: -1,
      ease: ease
    }
  );
}

export function createSimpleSwayAnimation(selector, angle = 2, duration = 1.5, ease = 'sine.inOut') {
  const element = document.querySelector(selector);
  
  if (!element) {
    console.warn(`Element with selector "${selector}" not found`);
    return null;
  }

  // Set initial state with shadow and position
  gsap.set(element, { 
    rotation: 0,
    transformOrigin: "left bottom",
    filter: "drop-shadow(2px 4px 6px rgba(0,0,0,0.3))",
    y: "2%"
  });

  return gsap.fromTo(element, 
    { rotation: -angle },
    { 
      rotation: angle,
      duration: duration,
      yoyo: true,
      repeat: -1,
      ease: ease
    }
  );
}

export function createYAxisSwayAnimation(selector, angle = 1.5, duration = 1.5, ease = 'sine.inOut') {
  const element = document.querySelector(selector);
  
  if (!element) {
    console.warn(`Element with selector "${selector}" not found`);
    return null;
  }

  console.log(`Starting Y-axis sway animation for ${selector} with angle ${angle}°`);

  // Set initial state for Y-axis rotation (left-right sway)
  gsap.set(element, { 
    rotationY: 0,
    transformOrigin: "center center",
    filter: "drop-shadow(2px 4px 6px rgba(0,0,0,0.3))"
  });

  return gsap.fromTo(element, 
    { rotationY: -angle },
    { 
      rotationY: angle,
      duration: duration,
      repeat: -1,
      yoyo: true,
      ease: ease
    }
  );
}

export function createScaleAnimation(selector, scale = 1.05, duration = 2, ease = 'power2.inOut') {
  const element = document.querySelector(selector);
  
  if (!element) {
    console.warn(`Element with selector "${selector}" not found`);
    return null;
  }

  // Set initial scale to normal
  gsap.set(element, { scale: 1 });

  return gsap.fromTo(element, 
    { scale: 1 },
    { 
      scale: scale,
      duration: duration,
      yoyo: true,
      repeat: -1,
      ease: ease
    }
  );
}

export function createOrbitWithRandomFade(selector, radius = 30, orbitDuration = 8) {
  const element = document.querySelector(selector);
  
  if (!element) {
    console.warn(`Element with selector "${selector}" not found`);
    return null;
  }

  // Set initial state - don't reset position, keep where appearance animation left it
  gsap.set(element, { 
    transformOrigin: "center center"
    // opacity, scale, x, y are already set by appearance animation
  });

  const masterTimeline = gsap.timeline({ repeat: -1 });
  
  // Orbit motion animation (smooth circular movement without rotation)
  const orbitTl = gsap.timeline({ repeat: -1 });
  
  // Create ultra smooth circular motion with many points for fluid movement  
  // Start from orbital start position (right side of circle)
  orbitTl.set(element, { x: radius, y: 0 });
  
  for (let i = 5; i <= 360; i += 5) {
    const radian = (i * Math.PI) / 180;
    const x = Math.cos(radian) * radius;
    const y = Math.sin(radian) * radius;
    
    orbitTl.to(element, {
      x: x,
      y: y,
      duration: orbitDuration / 72,
      ease: "none"
    });
  }
  
  // Add orbit to master timeline
  masterTimeline.add(orbitTl, 0);
  
  // Random fade and scale effects
  function addRandomEffect() {
    const delay = gsap.utils.random(8, 15); // Random delay between 8-15 seconds (less frequent)
    
    gsap.delayedCall(delay, () => {
      const fadeTl = gsap.timeline();
      
      // Fade out with scale down (5% smaller)
      fadeTl.to(element, {
        opacity: 0.3,
        scale: 0.95,
        duration: 1.5,
        ease: "sine.inOut"
      })
      // Hold for 0.5 seconds
      .to(element, {
        opacity: 0.3,
        scale: 0.95,
        duration: 0.5,
        ease: "none"
      })
      // Fade back in with scale up (slower and smoother)
      .to(element, {
        opacity: 1,
        scale: 1,
        duration: 1.5,
        ease: "sine.inOut"
      });
      
      // Schedule next random effect
      addRandomEffect();
    });
  }
  
  // Start the first random effect
  addRandomEffect();
  
  return masterTimeline;
}

export function initImmediateAnimations() {
  // Animations that start immediately with appearance
  
  // Apply red glow animation to man1-part1 (stronger red glow, faster)
  createRedGlowAnimation('.man1 img[alt="man1-part1"]', 35, 0.7, 'sine.inOut');
  
  // Apply brightness animation to man3-part2 (faster)
  createBrightnessAnimation('.man3 img[alt="man3-part2"]', 1.7, 0.7, 'power3.out');
  
  // Apply brightness animation to man4-part2 (faster)
  createBrightnessAnimation('.man4 img[alt="man4-part2"]', 1.5, 1.1, 'power3.out');
  
  // Apply brightness animation to logo1-part2 (faster)
  createBrightnessAnimation('.logo1 img[alt="logo1-part2"]', 1.4, 1.4, 'power3.out');
  
  // Apply brightness animation to logo2-part2 (faster)
  createBrightnessAnimation('.logo2 img[alt="logo2-part2"]', 1.6, 0.8, 'power3.out');
  
  // Apply golden glow animation to man3-part1 (stronger glow, faster)
  createGoldenGlowAnimation('.man3 img[alt="man3-part1"]', 25, 0.7, 'sine.inOut');
  
  // Apply golden glow animation to man4-part1 (stronger glow, faster)
  createGoldenGlowAnimation('.man4 img[alt="man4-part1"]', 25, 1.1, 'sine.inOut');
  
  // Apply scale animation to man3 (in sync with glow, faster)
  createScaleAnimation('.man3', 1.05, 0.7, 'sine.inOut');
  
  // Apply scale animation to man4 (in sync with glow, faster)
  createScaleAnimation('.man4', 1.05, 1.1, 'sine.inOut');
  
  // Apply simple sway animation to man2 (-2° to +2° around left bottom, lowered 2%)
  createSimpleSwayAnimation('.man2', 2, 1.0, 'sine.inOut');
  
  // Apply Y-axis sway animation to man3 (-10° to +10° left-right)
  createYAxisSwayAnimation('.man3', 10, 0.8, 'sine.inOut');
  
  // Apply Y-axis sway animation to man4 (-10° to +10° left-right)  
  createYAxisSwayAnimation('.man4', 10, 1.2, 'sine.inOut');
}


let man1OrbitAnimation = null;

function checkAndToggleMan1Animation() {
  const isMobilePortrait = window.innerWidth <= 767 && window.innerHeight > window.innerWidth;
  
  if (!isMobilePortrait && !man1OrbitAnimation) {
    // Start animation if not in mobile portrait and not already running
    man1OrbitAnimation = createOrbitWithRandomFade('.man1', 50, 5);
  } else if (isMobilePortrait && man1OrbitAnimation) {
    // Stop animation if in mobile portrait and running
    man1OrbitAnimation.kill();
    man1OrbitAnimation = null;
    // Reset man1 position
    const man1 = document.querySelector('.man1');
    if (man1) {
      gsap.set(man1, { x: 0, y: 0, opacity: 1, scale: 1 });
    }
  }
}

export function initMan1Animations() {
  // Animations that start after appearance is complete
  
  // Initial check
  checkAndToggleMan1Animation();
  
  // Listen for orientation changes
  window.addEventListener('orientationchange', () => {
    setTimeout(checkAndToggleMan1Animation, 100);
  });
  
  // Listen for resize events
  window.addEventListener('resize', checkAndToggleMan1Animation);
}