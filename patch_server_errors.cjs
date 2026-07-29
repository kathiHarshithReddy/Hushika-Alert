const fs = require('fs');
let content = fs.readFileSync('server.ts', 'utf8');
content = content.replace(
  /res\.status\(500\)\.json\({ error: "Failed to generate daily summary: " \+ \(error instanceof Error \? error\.message : String\(error\)\) }\);/g,
  `
      let errMsg = "Failed to generate daily summary";
      if (error instanceof Error) {
        if (error.message.includes("429") || error.message.includes("RESOURCE_EXHAUSTED") || error.message.includes("quota")) {
          errMsg = "AI Service is currently busy or out of quota. Please try again later.";
        } else {
          errMsg = error.message;
        }
      }
      res.status(500).json({ error: errMsg });
  `.trim()
);
content = content.replace(
  /res\.status\(500\)\.json\({ error: 'Failed to generate alert: ' \+ \(error instanceof Error \? error\.message : String\(error\)\) }\);/g,
  `
      let errMsg = "Failed to generate alert";
      if (error instanceof Error) {
        if (error.message.includes("429") || error.message.includes("RESOURCE_EXHAUSTED") || error.message.includes("quota")) {
          errMsg = "AI Service is currently busy or out of quota. Please try again later.";
        } else {
          errMsg = error.message;
        }
      }
      res.status(500).json({ error: errMsg });
  `.trim()
);
fs.writeFileSync('server.ts', content);
