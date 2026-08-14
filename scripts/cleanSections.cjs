const fs = require('fs');
const path = require('path');

const sectionsPath = path.join(__dirname, '../src/components/analysis/AnalysisSections.jsx');
let content = fs.readFileSync(sectionsPath, 'utf8');

const componentsToRemove = [
  'ApproachTabs',
  'ExplanationTabs',
  'FeedbackPanel',
  'LearningPanel',
  'ReanalyzePanel',
  'SuggestionsPanel',
  'MetricSection'
];

componentsToRemove.forEach(name => {
  // Regex to match "export function Name(...)" or "export const Name = ..." and everything up to "^}"
  const regex = new RegExp('export (function|const) ' + name + '[\\s\\S]*?^}', 'gm');
  content = content.replace(regex, '');
});

content = content.replace(/\n\n\n+/g, '\n\n');

fs.writeFileSync(sectionsPath, content);
console.log('Cleaned AnalysisSections.jsx');
