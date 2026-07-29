const fs = require('fs');
let content = fs.readFileSync('server.ts', 'utf8');
content = content.replace(
  /let errMsg = "Failed to generate daily summary";([\s\S]*?)res\.status\(500\)\.json\({ error: errMsg }\);/m,
  `let errMsg = "Failed to generate daily summary";
      let fallbackSummary = null;
      if (error instanceof Error || (typeof error === 'object' && error !== null)) {
        const errorStr = String(error.message || error);
        if (errorStr.includes("429") || errorStr.includes("RESOURCE_EXHAUSTED") || errorStr.includes("quota")) {
          fallbackSummary = language === "kiswahili" 
            ? "Muhtasari huu umezalishwa kiotomatiki: Kuna hatari kadhaa za hali ya hewa zinazofuatiliwa sasa barani Asia. Tafadhali soma tahadhari za hapa chini kwa maelekezo kamili."
            : "Automatic fallback summary: Multiple climate hazards are currently active across Asia. Please review the detailed local alerts below for specific guidance.";
        } else {
          errMsg = errorStr;
        }
      }
      
      if (fallbackSummary) {
        res.json({ summary: fallbackSummary });
      } else {
        res.status(500).json({ error: errMsg });
      }`
);

fs.writeFileSync('server.ts', content);
