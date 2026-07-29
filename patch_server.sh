sed -i '/app.post('"'"'\/api\/process-data'"'"'/i \
  app.post("/api/daily-summary", async (req, res) => {\
    try {\
      const { data, language } = req.body;\
      const apiKey = process.env.GEMINI_API_KEY;\
      if (!apiKey) {\
        return res.status(500).json({ error: "GEMINI_API_KEY is missing" });\
      }\
      const ai = new GoogleGenAI({ apiKey });\
      const prompt = `You are a climate expert. Here is a list of climate hazard records for various regions in Asia.\\n\\nRaw Data:${JSON.stringify(data, null, 2)}\\n\\nGenerate a short, 1-2 sentence daily summary of the most critical or high-priority hazards from this data. Write the response in ${language === "kiswahili" ? "Swahili (Kiswahili)" : "plain-language English"}. The output should be just the summary text.`;\
      const response = await ai.models.generateContent({\
        model: "gemini-3.1-pro-preview",\
        contents: prompt,\
        config: {\
          temperature: 0.2\
        }\
      });\
      const textResponse = response.text;\
      if (!textResponse) {\
        throw new Error("No response from AI");\
      }\
      res.json({ summary: textResponse });\
    } catch (error) {\
      console.error("Error generating daily summary:", error);\
      res.status(500).json({ error: "Failed to generate daily summary: " + (error instanceof Error ? error.message : String(error)) });\
    }\
  });\
' server.ts
