const fs = require('fs');
let content = fs.readFileSync('server.ts', 'utf8');

// Patch the first catch block
content = content.replace(
  /const { data, language } = req\.body;/g,
  `const { data } = req.body;
      const language = req.body.language || 'english';`
);
content = content.replace(
  /app\.post\("\/api\/daily-summary", async \(req, res\) => \{\n    try \{/g,
  `app.post("/api/daily-summary", async (req, res) => {
    let language = 'english';
    try {`
);
content = content.replace(
  /app\.post\('\/api\/process-data', async \(req, res\) => \{\n    try \{/g,
  `app.post('/api/process-data', async (req, res) => {
    let language = 'english';
    try {`
);

fs.writeFileSync('server.ts', content);
