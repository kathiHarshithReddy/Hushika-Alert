const fs = require('fs');
let content = fs.readFileSync('server.ts', 'utf8');

// Patch the second catch block
content = content.replace(
  /let errMsg = "Failed to generate alert";([\s\S]*?)res\.status\(500\)\.json\({ error: errMsg }\);/m,
  `let errMsg = "Failed to generate alert";
      if (error instanceof Error || (typeof error === 'object' && error !== null)) {
        const errorStr = String(error.message || JSON.stringify(error) || error);
        if (errorStr.includes("429") || errorStr.includes("RESOURCE_EXHAUSTED") || errorStr.includes("quota") || errorStr.includes("QuotaFailure")) {
          errMsg = "AI Service is currently busy or out of quota. Please try again later.";
        } else {
          errMsg = errorStr;
        }
      } else {
        errMsg = String(error);
      }
      res.status(500).json({ error: errMsg });`
);

fs.writeFileSync('server.ts', content);
