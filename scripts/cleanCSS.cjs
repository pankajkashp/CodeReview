const fs = require('fs');
const path = require('path');

const globalCssPath = path.join(__dirname, '../src/styles/global.css');
let content = fs.readFileSync(globalCssPath, 'utf8');

// Remove Capabilities Row
content = content.replace(/\/\* Capabilities Row \*\/[\s\S]*?(?=\/\*|$)/g, '');
// Remove Editor Footer
content = content.replace(/\/\* Editor Footer \*\/[\s\S]*?(?=\/\*|$)/g, '');
// Remove .intelligence-section
content = content.replace(/\.intelligence-section[\s\S]*?\}/g, '');
// Remove .review-interface
content = content.replace(/\.review-interface[\s\S]*?\}/g, '');
// Remove .auth-modal
content = content.replace(/\.auth-modal[\s\S]*?\}/g, '');

fs.writeFileSync(globalCssPath, content);
console.log('Cleaned global.css');

const heroCssPath = path.join(__dirname, '../src/styles/hero.css');
let heroContent = fs.readFileSync(heroCssPath, 'utf8');
heroContent = heroContent.replace(/\/\* --- New Capabilities Section --- \*\/[\s\S]*/g, '');
fs.writeFileSync(heroCssPath, heroContent);
console.log('Cleaned hero.css');
