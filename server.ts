import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Route for generating alerts
  app.post("/api/daily-summary", async (req, res) => {
    let language = 'english';
    try {
      const { data } = req.body;
      language = req.body.language || 'english';
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.status(500).json({ error: "GEMINI_API_KEY is missing" });
      }
      const ai = new GoogleGenAI({ apiKey });
      const prompt = `You are a climate expert. Here is a list of climate hazard records for various regions in Asia.\n\nRaw Data:${JSON.stringify(data, null, 2)}\n\nGenerate a short, 1-2 sentence daily summary of the most critical or high-priority hazards from this data. Write the response in ${language === "kiswahili" ? "Swahili (Kiswahili)" : "plain-language English"}. The output should be just the summary text.`;
      const response = await ai.models.generateContent({
        model: "gemini-3.1-pro-preview",
        contents: prompt,
        config: {
          temperature: 0.2
        }
      });
      const textResponse = response.text;
      if (!textResponse) {
        throw new Error("No response from AI");
      }
      res.json({ summary: textResponse });
    } catch (error) {
      if (!(error && (error.message || '').includes('429'))) { console.error("Error generating daily summary:", error); }
      let errMsg = "Failed to generate daily summary";
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
      }
    }
  });

  app.post('/api/process-data', async (req, res) => {
    let language = 'english';
    try {
      const { data } = req.body;
      language = req.body.language || 'english';
      
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.status(500).json({ error: 'GEMINI_API_KEY is missing' });
      }

      const ai = new GoogleGenAI({ apiKey });

      const prompt = `
You are an expert crisis communicator generating plain-language early warning alerts for communities in Asia.
The user will provide you with raw climate hazard indicator data.
Convert this technical data into a ${language === 'kiswahili' ? 'Swahili (Kiswahili)' : 'plain-language English'} alert that a non-technical community member can understand and act on immediately.

Raw Data:
${JSON.stringify(data, null, 2)}

Return a JSON object with this exact shape:
{
  "severity": "severe" | "moderate" | "watch",
  "headline": "short headline under 12 words",
  "message": "2-3 sentences a non-technical reader can understand, explaining the risk and timeframe",
  "actions": ["action 1", "action 2", "action 3"]
}

Guidelines:
- "severity": Use "severe" if exceeded and worsening, "moderate" if at threshold or exceeded but stable, "watch" if below threshold or improving.
- "actions": Provide practical, actionable steps for the community based on the hazard type (Drought, Flood, Food Security).
- Ensure the JSON is well-formed.
`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.1-pro-preview',
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          temperature: 0.2
        }
      });

      const textResponse = response.text;
      if (!textResponse) {
        throw new Error('No response from AI');
      }

      const alertJson = JSON.parse(textResponse);
      res.json(alertJson);
    } catch (error) {
      if (!(error && (error.message || '').includes('429'))) { console.error('Error generating alert:', error); }
      let errMsg = "Failed to generate alert";
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
      res.status(500).json({ error: errMsg });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
