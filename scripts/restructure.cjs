const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, '../src');

// Create directories
['pages', 'components/layout', 'components/dashboard', 'components/shared', 'lib'].forEach(dir => {
  const fullPath = path.join(srcDir, dir);
  if (!fs.existsSync(fullPath)) {
    fs.mkdirSync(fullPath, { recursive: true });
  }
});

// Define moves
const moves = [
  // Pages
  ['components/About.jsx', 'pages/About.jsx'],
  ['components/Login.jsx', 'pages/Login.jsx'],
  ['components/Logout.jsx', 'pages/Logout.jsx'],
  ['components/Profile.jsx', 'pages/Profile.jsx'],
  // Layout
  ['components/Hero.jsx', 'components/layout/Hero.jsx'],
  ['components/TopNavigation.jsx', 'components/layout/TopNavigation.jsx'],
  ['components/Preloader.jsx', 'components/layout/Preloader.jsx'],
  // Dashboard
  ['components/CodeIntegrityEngine.jsx', 'components/dashboard/CodeIntegrityEngine.jsx'],
  // Shared
  ['components/UserProfile.jsx', 'components/shared/UserProfile.jsx'],
  ['components/confirmation.jsx', 'components/shared/confirmation.jsx'],
  // Lib
  ['supabaseClient.js', 'lib/supabaseClient.js']
];

// Execute moves
moves.forEach(([oldPath, newPath]) => {
  const fullOldPath = path.join(srcDir, oldPath);
  const fullNewPath = path.join(srcDir, newPath);
  if (fs.existsSync(fullOldPath)) {
    fs.renameSync(fullOldPath, fullNewPath);
    console.log('Moved ' + oldPath + ' to ' + newPath);
  }
});

// Update imports in all JSX/JS files
function updateImportsInDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      updateImportsInDir(fullPath);
    } else if (file.endsWith('.jsx') || file.endsWith('.js') || file.endsWith('.css')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      const original = content;

      const replacements = [
        { from: /"\.\/components\/About\.jsx"/g, to: '"./pages/About.jsx"' },
        { from: /"\.\/components\/Login\.jsx"/g, to: '"./pages/Login.jsx"' },
        { from: /"\.\/components\/Logout\.jsx"/g, to: '"./pages/Logout.jsx"' },
        { from: /"\.\/components\/Profile\.jsx"/g, to: '"./pages/Profile.jsx"' },
        { from: /"\.\/components\/confirmation\.jsx"/g, to: '"./components/shared/confirmation.jsx"' },
        
        { from: /"\.\/components\/CodeIntegrityEngine\.jsx"/g, to: '"./components/dashboard/CodeIntegrityEngine.jsx"' },
        { from: /"\.\/components\/Hero\.jsx"/g, to: '"./components/layout/Hero.jsx"' },
        { from: /"\.\/components\/TopNavigation\.jsx"/g, to: '"./components/layout/TopNavigation.jsx"' },
        { from: /"\.\/components\/Preloader\.jsx"/g, to: '"./components/layout/Preloader.jsx"' },
        
        { from: /"\.\/UserProfile\.jsx"/g, to: '"../shared/UserProfile.jsx"' }, // In TopNavigation
        
        { from: /"\.\/supabaseClient\.js"/g, to: '"./lib/supabaseClient.js"' }, // In App.jsx
        { from: /"\.\.\/supabaseClient\.js"/g, to: '"../lib/supabaseClient.js"' }, // For good measure
      ];

      // Handle specific files that moved one level deeper
      if (fullPath.includes('pages/Login.jsx') || fullPath.includes('pages/Logout.jsx') || fullPath.includes('pages/Profile.jsx') || fullPath.includes('pages/About.jsx')) {
        content = content.replace(/"\.\.\/styles\//g, '"../styles/');
        content = content.replace(/"\.\.\/supabaseClient\.js"/g, '"../lib/supabaseClient.js"');
        content = content.replace(/"\.\/supabaseClient\.js"/g, '"../lib/supabaseClient.js"');
      }
      
      if (fullPath.includes('components/layout/')) {
        content = content.replace(/"\.\.\/styles\//g, '"../../styles/');
      }
      if (fullPath.includes('components/dashboard/')) {
        content = content.replace(/"\.\.\/styles\//g, '"../../styles/');
        content = content.replace(/"\.\/AnalysisLoader\.jsx"/g, '"../AnalysisLoader.jsx"');
        content = content.replace(/"\.\/Analytics"/g, '"../Analytics"');
      }
      
      if (fullPath.includes('components/shared/')) {
        content = content.replace(/"\.\.\/styles\//g, '"../../styles/');
      }
      
      // AnalysisLoader and Analytics have NOT moved, they are in components/
      
      // Update App.jsx and main.jsx
      if (file === 'main.jsx') {
        content = content.replace(/"\.\/components\/Login\.jsx"/g, '"./pages/Login.jsx"');
        content = content.replace(/"\.\/components\/Logout\.jsx"/g, '"./pages/Logout.jsx"');
        content = content.replace(/"\.\/components\/Profile\.jsx"/g, '"./pages/Profile.jsx"');
        content = content.replace(/"\.\/components\/confirmation\.jsx"/g, '"./components/shared/confirmation.jsx"');
      }

      replacements.forEach(({from, to}) => {
        content = content.replace(from, to);
      });

      if (content !== original) {
        fs.writeFileSync(fullPath, content);
        console.log('Updated imports in ' + fullPath);
      }
    }
  }
}

updateImportsInDir(srcDir);
