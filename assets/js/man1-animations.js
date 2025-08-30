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

export function initMan1Animations() {
  // Apply brightness animation to man1-part2 with custom parameters
  createBrightnessAnimation('.man1 img[alt="man1-part2"]', 1.5, 2.2, 'power3.out');
  
  // Apply brightness animation to man3-part2 (faster)
  createBrightnessAnimation('.man3 img[alt="man3-part2"]', 1.7, 1.2, 'power3.out');
  
  // Apply brightness animation to man4-part2 (slower)
  createBrightnessAnimation('.man4 img[alt="man4-part2"]', 1.5, 2, 'power3.out');
  
  // Apply brightness animation to logo1-part2
  createBrightnessAnimation('.logo1 img[alt="logo1-part2"]', 1.4, 2.4, 'power3.out');
  
  // Apply brightness animation to logo2-part2
  createBrightnessAnimation('.logo2 img[alt="logo2-part2"]', 1.6, 1.4, 'power3.out');
  
  // Apply golden glow animation to man3-part1 (stronger glow)
  createGoldenGlowAnimation('.man3 img[alt="man3-part1"]', 25, 1.2, 'power3.inOut');
  
  // Apply golden glow animation to man4-part1 (weaker glow)
  createGoldenGlowAnimation('.man4 img[alt="man4-part1"]', 15, 2, 'power2.inOut');
}