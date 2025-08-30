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

  // Set initial state
  gsap.set(element, { 
    transformOrigin: "center center",
    opacity: 1,
    scale: 1,
    x: 0,
    y: 0
  });

  const masterTimeline = gsap.timeline({ repeat: -1 });
  
  // Orbit motion animation (smooth circular movement without rotation)
  const orbitTl = gsap.timeline({ repeat: -1 });
  
  // Create ultra smooth circular motion with many points for fluid movement
  // Start from the initial position
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

export function initMan1Animations() {
  // Apply orbit with random fade animation to man1 (bigger amplitude)
  createOrbitWithRandomFade('.man1', 50, 10);
  
  // Apply red glow animation to man1-part1 (stronger red glow)
  createRedGlowAnimation('.man1 img[alt="man1-part1"]', 35, 1.2, 'sine.inOut');
  
  // Apply brightness animation to man3-part2 (faster)
  createBrightnessAnimation('.man3 img[alt="man3-part2"]', 1.7, 1.2, 'power3.out');
  
  // Apply brightness animation to man4-part2 (slower)
  createBrightnessAnimation('.man4 img[alt="man4-part2"]', 1.5, 2, 'power3.out');
  
  // Apply brightness animation to logo1-part2
  createBrightnessAnimation('.logo1 img[alt="logo1-part2"]', 1.4, 2.4, 'power3.out');
  
  // Apply brightness animation to logo2-part2
  createBrightnessAnimation('.logo2 img[alt="logo2-part2"]', 1.6, 1.4, 'power3.out');
  
  // Apply golden glow animation to man3-part1 (stronger glow)
  createGoldenGlowAnimation('.man3 img[alt="man3-part1"]', 25, 1.2, 'sine.inOut');
  
  // Apply golden glow animation to man4-part1 (stronger glow)
  createGoldenGlowAnimation('.man4 img[alt="man4-part1"]', 25, 2, 'sine.inOut');
  
  // Apply scale animation to man3 (in sync with glow)
  createScaleAnimation('.man3', 1.05, 1.2, 'sine.inOut');
  
  // Apply scale animation to man4 (in sync with glow)
  createScaleAnimation('.man4', 1.05, 2, 'sine.inOut');
}