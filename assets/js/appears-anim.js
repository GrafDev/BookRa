import { gsap } from 'gsap';

export function createSmoothFlyInAnimation(selector, delay = 0, duration = 1.5) {
  const element = document.querySelector(selector);
  
  if (!element) {
    console.warn(`Element with selector "${selector}" not found`);
    return null;
  }

  // Special case for man1 - appear at orbital start position
  if (selector === '.man1') {
    gsap.set(element, {
      opacity: 0,
      x: 150, // Further right for man1 
      scale: 0.9
    });

    return gsap.to(element, {
      opacity: 1,
      x: 50, // End at orbital start position (radius)
      y: 0,
      scale: 1,
      duration: duration,
      delay: delay,
      ease: "power2.out"
    });
  }

  // Standard appearance for other elements
  gsap.set(element, {
    opacity: 0,
    x: 100,
    scale: 0.9
  });

  return gsap.to(element, {
    opacity: 1,
    x: 0,
    scale: 1,
    duration: duration,
    delay: delay,
    ease: "power2.out"
  });
}

export function createDesertWindSequentialAppear(selectors, baseDelay = 0.2, duration = 1.2) {
  const masterTimeline = gsap.timeline();
  
  selectors.forEach((selector, index) => {
    const element = document.querySelector(selector);
    
    if (!element) {
      console.warn(`Element with selector "${selector}" not found`);
      return;
    }

    // Create desert wind appearance for each element
    const elementTimeline = createDesertWindAnimation(selector, 0, duration);
    
    // Add to master timeline with quick staggered delay
    masterTimeline.add(elementTimeline, index * baseDelay);
  });

  return masterTimeline;
}

export function createAllElementsSmoothAppear() {
  const masterTimeline = gsap.timeline();
  
  // box2 elements (right side)
  const box2Elements = ['.man4', '.man2'];
  box2Elements.forEach((selector, index) => {
    const animation = createSmoothFlyInAnimation(selector, 0, 0.8);
    masterTimeline.add(animation, index * 0.1);
  });
  
  // box3 elements (center)  
  const box3Elements = ['.logo1', '.title', '.logo2'];
  box3Elements.forEach((selector, index) => {
    const animation = createSmoothFlyInAnimation(selector, 0, 0.8);
    masterTimeline.add(animation, 0.4 + index * 0.1);
  });
  
  // box1 elements (left side)
  const box1Elements = ['.man3', '.man1'];
  box1Elements.forEach((selector, index) => {
    const animation = createSmoothFlyInAnimation(selector, 0, 0.8);
    masterTimeline.add(animation, 0.8 + index * 0.1);
  });

  return masterTimeline;
}

export function initAppearAnimations() {
  // Smooth appearance of ALL elements by blocks: box2 → box3 → box1
  const appearTimeline = createAllElementsSmoothAppear();
  
  // Return the timeline so main.js can wait for completion
  return appearTimeline;
}