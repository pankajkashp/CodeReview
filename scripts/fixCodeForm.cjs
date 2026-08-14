const fs = require('fs');
const path = require('path');

const cssPath = path.join(__dirname, '../src/styles/analytics.css');
let cssContent = fs.readFileSync(cssPath, 'utf8');

// Replace .diff-pane-body with .code-shell in the injected styles
cssContent = cssContent.replace(/\.diff-pane-body/g, '.code-shell');

fs.writeFileSync(cssPath, cssContent);
console.log("Fixed code shell class in analytics.css");
