import { GoogleGenAI } from "@google/genai";
import { DataRow, DatasetStats } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function analyzeData(stats: DatasetStats, sampleData: DataRow[], query: string) {
  const prompt = `
    You are an expert Data Scientist and Lead Statistician at a top research firm. 
    Analyze the following dataset context and provide deep, technical, yet accessible insights.
    
    DATASET CONTEXT:
    - Row Count: ${stats.rowCount}
    - Dimension: ${stats.columns.length} features
    - Schema: ${JSON.stringify(stats.types)}
    - Distribution Summary: ${JSON.stringify(stats.summary)}
    - Raw Sample (Snapshot): ${JSON.stringify(sampleData.slice(0, 5))}
    
    USER INVESTIGATION:
    "${query}"
    
    GUIDELINES:
    1. Identify correlations between numeric fields if applicable.
    2. Suggest potential causal relationships or underlying trends.
    3. Use statistical terminology (e.g., standard deviation, outliers, distribution skew) where appropriate.
    4. Structure response with headers and bullet points.
    5. Be concise but authoritative.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.1-pro-preview",
      contents: prompt,
    });
    return response.text || "I'm sorry, my neural processors couldn't synthesize an answer for this specific query.";
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    return "An error occurred during neural analysis. Please verify your dataset structure.";
  }
}

export async function suggestVisualizations(stats: DatasetStats) {
  const prompt = `
    As a Senior Data Visualization Engineer, suggest exactly 3 high-impact visualizations for this dataset.
    Prioritize charts that show relationships, distributions, or trends.
    
    DATASET PROFILE:
    - Features: ${stats.columns.join(", ")}
    - Data Types: ${JSON.stringify(stats.types)}
    - Descriptive Stats: ${JSON.stringify(stats.summary)}
    
    OUTPUT FORMAT:
    Return ONLY a valid JSON array of objects following this schema:
    [{ "type": "bar" | "line" | "scatter" | "area", "xAxis": "string", "yAxis": "string", "title": "string" }]
    
    RULE: xAxis and yAxis MUST match the exact column names provided.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json"
      }
    });
    return JSON.parse(response.text || "[]");
  } catch (error) {
    console.error("Suggestion Error:", error);
    return [];
  }
}
