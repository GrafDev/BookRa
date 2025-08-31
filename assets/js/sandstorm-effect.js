import { gsap } from 'gsap';

export function createSandstormEffect(duration = 1.7) {
  // Create simple gradient sandstorm block
  const sandstorm = document.createElement('div');
  sandstorm.className = 'sandstorm-gradient';
  sandstorm.style.cssText = `
    position: fixed;
    top: 0;
    left: 100%;
    width: 80%;
    height: 100%;
    background: linear-gradient(90deg, 
      transparent 0%,
      transparent 20%,
      rgba(101, 67, 33, 0.2) 30%, 
      rgba(139, 69, 19, 0.15) 50%,
      rgba(160, 82, 45, 0.1) 70%,
      transparent 90%,
      transparent 100%);
    pointer-events: none;
    z-index: 1000;
  `;
  
  document.body.appendChild(sandstorm);
  
  // Animate gradient block from right to left
  const timeline = gsap.timeline({
    onComplete: () => {
      document.body.removeChild(sandstorm);
    }
  });
  
  timeline.to(sandstorm, {
    left: '-80%',
    duration: duration,
    ease: "power2.out"
  });
  
  return timeline;
}

export function initSandstormWithAppearance(appearanceTimeline) {
  // Start sandstorm slightly before appearance animations
  const sandstormTl = createSandstormEffect(2.5);
  
  // Create master timeline
  const masterTl = gsap.timeline();
  
  // Add sandstorm first, then appearance animations
  masterTl.add(sandstormTl, 0)
          .add(appearanceTimeline, 0.3); // Start appearance slightly after sandstorm begins
  
  return masterTl;
}