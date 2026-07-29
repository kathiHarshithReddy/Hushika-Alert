const fs = require('fs');
let content = fs.readFileSync('server.ts', 'utf8');

content = content.replace(
  /console\.error\("Error generating daily summary:", error\);/g,
  `if (!(error && (error.message || '').includes('429'))) { console.error("Error generating daily summary:", error); }`
);

content = content.replace(
  /console\.error\('Error generating alert:', error\);/g,
  `if (!(error && (error.message || '').includes('429'))) { console.error('Error generating alert:', error); }`
);

fs.writeFileSync('server.ts', content);
