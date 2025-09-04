// Import all images as base64 from generated files

// Cards images
import backCart from '../base64/back-cart.js'
import firstCart from '../base64/first-cart.js'
import secondCart from '../base64/second-cart.js'
import thirdCart from '../base64/third-cart.js'
import blanketCart from '../base64/blanket-cart.js'
import borderCart from '../base64/border-cart.js'
import scratch from '../base64/scratch.js'

// Wheel images
import arrowPart1 from '../base64/arrow-part1.js'
import arrowPart2 from '../base64/arrow-part2.js'
import wheelPart1 from '../base64/wheel-part1.js'
import wheelPart2 from '../base64/wheel-part2.js'
import wheelPart3 from '../base64/wheel-part3.js'
import wheelPart31 from '../base64/wheel-part3-1.js'
import wheelPart4 from '../base64/wheel-part4.js'
import wheelPart5 from '../base64/wheel-part5.js'
import wheelPart6 from '../base64/wheel-part6.js'
import wheelText1 from '../base64/wheel-text1.js'
import wheelText2 from '../base64/wheel-text2.js'

// Background images
import bgDesktop from '../base64/bg-desktop.js'
import bgMobile from '../base64/bg-mobile.js'

// Logo images
import logo1Part1 from '../base64/logo1-part1.js'
import logo1Part2 from '../base64/logo1-part2.js'
import logo2Part1 from '../base64/logo2-part1.js'
import logo2Part2 from '../base64/logo2-part2.js'

// Title images
import title from '../base64/title.js'
import titleMobile from '../base64/title-mobile.js'

// Character images
import man1Part1 from '../base64/man1-part1.js'
import man2 from '../base64/man2.js'
import man3Part1 from '../base64/man3-part1.js'
import man3Part2 from '../base64/man3-part2.js'
import man4Part1 from '../base64/man4-part1.js'
import man4Part2 from '../base64/man4-part2.js'

// Modal images
import bgModalCenter from '../base64/bg-modal-center.js'
import bgModalLeft from '../base64/bg-modal-left.js'
import bgModalRight from '../base64/bg-modal-right.js'
import buttonModal from '../base64/button-modal.js'
import scratchModalText from '../base64/scratch-modal-text.js'
import wheelModalText from '../base64/wheel-modal-text.js'

// Music control images
import stopMusic from '../base64/stop-music.js'
import playMusic from '../base64/play-music.js'

// Critical images for game start
export const criticalImages = {
  // Cards
  backCart,
  firstCart,
  secondCart,
  thirdCart,
  blanketCart,
  borderCart,
  scratch,
  
  // Wheel
  arrowPart1,
  arrowPart2,
  wheelPart1,
  wheelPart2,
  wheelPart3,
  wheelPart31,
  wheelPart4,
  wheelPart5,
  wheelPart6,
  wheelText1,
  wheelText2,
  
  // Background
  bgDesktop,
  bgMobile,
  
  // Logo
  logo1Part1,
  logo1Part2,
  logo2Part1,
  logo2Part2,
  
  // Title
  title,
  titleMobile,
  
  // Characters
  man1Part1,
  man2,
  man3Part1,
  man3Part2,
  man4Part1,
  man4Part2,
  
  // Music control (only for scratch)
  stopMusic,
  playMusic
}

// Modal images - can be loaded later
export const modalImages = {
  bgModalCenter,
  bgModalLeft,
  bgModalRight,
  buttonModal,
  scratchModalText,
  wheelModalText
}

// Combined for backward compatibility
export const images = {
  ...criticalImages,
  ...modalImages
}