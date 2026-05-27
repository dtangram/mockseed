import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import { createServer as createViteServer } from "vite";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "15mb" }));

// Initialize Gemini Client server-side
const apiKey = process.env.GEMINI_API_KEY;
const ai = new GoogleGenAI({
  apiKey: apiKey,
  httpOptions: {
    headers: {
      "User-Agent": "aistudio-build",
    },
  },
});

// Helper function for sleeping
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Mock Synthesis API endpoint
app.post("/api/generate", async (req, res) => {
  try {
    const { schemaType, schemaText, recordCount, locale, customInstruction } = req.body;

    if (!schemaText || !schemaText.trim()) {
      return res.status(400).json({ error: "Schema content is required" });
    }

    const count = Math.min(Math.max(Number(recordCount) || 10, 1), 100);
    const selectedLocale = locale || "English (US)";

    // System instructions to enforce meticulous structured parsing and localization
    const systemInstruction = `You are a professional full-stack data architect and mock data synthesis engine.
Analyze the user's provided TypeScript interface or JSON schema carefully.
Perform semantic analysis of every property to understand what kind of information it represents (e.g., UUIDs, consecutive indices, full names, first names, last names, company names, job titles, localized telephone numbers, realistic physical addresses, dates, timestamps, prices, currencies, tags, categories, array of nested objects).

Select realistic patterns aligned with the chosen locale "${selectedLocale}" (e.g., if Japanese, use Japanese names, Japan phone numbers, Tokyo addresses, Yen currency format; if German, use German name styles, euro symbol, central European addresses, etc.).

Generate exactly ${count} distinct, realistic, high-fidelity mock records.
Avoid lazy repetitions (e.g., don't use "user1", "user2"; use realistic diverse names). Ensure sequential indices or keys are maintained correctly if expected. Ensure dates are logically sequenced (e.g., created_at is before updated_at, departure_date is before arrival_date).

Important: Return your response strictly as a JSON object matching this TypeScript structure:
{
  "success": boolean,
  "explanation": "concise overview of the parsed schema, highlighting any inferred rules or relations",
  "fields": Array<{ name: string; type: string; description: string }>,
  "localeInfo": {
    "detectedLocale": "the locale used",
    "localizationDetails": "brief explanation of how the locale guidelines were applied"
  },
  "data": Array<any> // exactly ${count} objects matching the schema or TS interface. Even if nested structures are requested, synthesize realistic nested items.
}`;

    const promptText = `INPUT SCHEMA TARGET (${schemaType === "json" ? "JSON Schema" : "TypeScript Interface"}):
\`\`\`
${schemaText}
\`\`\`

TARGET GENERATION PARAMETERS:
- Quantity to generate: ${count} records
- Output language/Locale formatting: ${selectedLocale}
${customInstruction ? `- Custom Generation Constraint/Instruction: ${customInstruction}` : ""}

Please parse this input, establish appropriate data type/formatting constraints, synthesize localized data, and return standard, clean JSON output without markdown wrapper backticks outside of the object structure itself. Ensure the output parses perfectly to JSON.`;

    let response;
    let attempt = 0;
    const maxRetries = 4;
    let lastError: any = null;

    while (attempt < maxRetries) {
      try {
        response = await ai.models.generateContent({
          model: "gemini-3.5-flash",
          contents: promptText,
          config: {
            systemInstruction: systemInstruction,
            responseMimeType: "application/json",
            temperature: 0.8,
          },
        });
        break; // Successfully generated content! Break out of the loop.
      } catch (error: any) {
        attempt++;
        lastError = error;
        
        const errorMsg = String(error.message || error);
        const isTransient = errorMsg.includes("503") ||
                            errorMsg.includes("UNAVAILABLE") ||
                            errorMsg.includes("429") ||
                            errorMsg.includes("RESOURCE_EXHAUSTED") ||
                            errorMsg.includes("rate limit") ||
                            errorMsg.includes("high demand") ||
                            errorMsg.includes("temporary") ||
                            (error.status && [429, 503, 504].includes(error.status)) ||
                            (error.code && [429, 503, 504].includes(error.code));

        if (isTransient && attempt < maxRetries) {
          // Exponential backoff plus jitter: 1.5s, 3s, 6s...
          const waitTime = Math.pow(2, attempt) * 1000 + Math.random() * 500;
          console.warn(`Upstream Gemini API is currently experiencing transient errors or load spikes (Attempt ${attempt}/${maxRetries}). Retrying in ${Math.round(waitTime)}ms... Error: ${errorMsg}`);
          await delay(waitTime);
        } else {
          // If not transient or max retries exceeded, throw the error
          throw error;
        }
      }
    }

    if (!response) {
      throw lastError || new Error("No response received from Gemini API after retries");
    }

    const completionText = response.text;
    if (!completionText) {
      throw new Error("No response received from Gemini API");
    }

    // Attempt to parse to protect backend stability
    try {
      const parsedData = JSON.parse(completionText);
      return res.json(parsedData);
    } catch (parseError: any) {
      console.error("Failed parsing Gemini JSON output:", completionText);
      return res.status(500).json({
        error: "Synthesized data parsing failed",
        details: parseError.message,
        raw_output: completionText,
      });
    }
  } catch (error: any) {
    console.error("Synthesis error:", error);
    return res.status(500).json({
      error: "Data synthesis failed due to an upstream server error.",
      details: error.message,
    });
  }
});

// Configure Vite middleware in development or static hosting in production
async function runServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Mock Data Synthesizer engine starts on port ${PORT}`);
  });
}

runServer();
