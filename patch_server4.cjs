const fs = require('fs');
let content = fs.readFileSync('server.ts', 'utf8');

content = content.replace(
  /const language = req\.body\.language \|\| 'english';/g,
  `language = req.body.language || 'english';`
);

fs.writeFileSync('server.ts', content);
