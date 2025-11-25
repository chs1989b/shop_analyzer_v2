
import { GoogleGenAI, Type } from "@google/genai";
import { AuditReport } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzeUrl = async (url: string): Promise<AuditReport> => {
  // Schema definition for structured JSON output
  const responseSchema = {
    type: Type.OBJECT,
    properties: {
      url: { type: Type.STRING },
      timestamp: { type: Type.STRING },
      overallScore: { type: Type.NUMBER },
      summary: { type: Type.STRING },
      platform: { type: Type.STRING },
      performance: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          score: { type: Type.NUMBER },
          items: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                score: { type: Type.NUMBER },
                value: { type: Type.STRING },
                status: { type: Type.STRING, enum: ["good", "warning", "poor"] },
                description: { type: Type.STRING }
              }
            }
          }
        }
      },
      seo: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          score: { type: Type.NUMBER },
          items: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                score: { type: Type.NUMBER },
                value: { type: Type.STRING },
                status: { type: Type.STRING, enum: ["good", "warning", "poor"] },
                description: { type: Type.STRING }
              }
            }
          }
        }
      },
      ux: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          score: { type: Type.NUMBER },
          items: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                score: { type: Type.NUMBER },
                value: { type: Type.STRING },
                status: { type: Type.STRING, enum: ["good", "warning", "poor"] },
                description: { type: Type.STRING }
              }
            }
          }
        }
      },
      security: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          score: { type: Type.NUMBER },
          items: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                score: { type: Type.NUMBER },
                value: { type: Type.STRING },
                status: { type: Type.STRING, enum: ["good", "warning", "poor"] },
                description: { type: Type.STRING }
              }
            }
          }
        }
      },
      competitorAnalysis: {
        type: Type.OBJECT,
        properties: {
          summary: { type: Type.STRING },
          items: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING, description: "Name of a competitor or 'Industry Standard'" },
                comparison: { type: Type.STRING, description: "Specific detail on what they do better or differently" }
              }
            }
          }
        }
      },
      recommendations: {
        type: Type.ARRAY,
        items: { type: Type.STRING }
      }
    }
  };

  const prompt = `
    You are a senior web performance and UX auditor specializing in e-commerce (Shopping Malls).
    Analyze the provided URL: ${url}.

    Since you cannot browse the live web in real-time to measure exact millisecond latency, perform a "Heuristic Analysis" based on the likely technology stack and common best practices for this type of domain.
    
    Generate a realistic audit report covering:
    1. Performance (Estimate Load Time, TTFB, Core Web Vitals based on typical behavior of such sites).
    2. SEO (Meta tags presence, URL structure, Heading hierarchy).
    3. UX/UI (Header functionality, Footer links, Mobile responsiveness checks).
    4. Security (SSL, HTTPS).
    5. Competitor Analysis: Identify 2-3 likely competitors or general industry leaders (e.g., Coupang, Naver Smart Store, Amazon, or niche leaders based on the site type). Compare the analyzed site with them. Focus on what competitors might be doing better (Gap Analysis). For example, "Competitor A offers 1-click checkout, but this site has a complex form."

    Be critical but constructive.

    IMPORTANT - LANGUAGE REQUIREMENT:
    - The output content MUST be in KOREAN (한국어).
    - Translate all titles, descriptions, summaries, metric names, and recommendations into natural Korean.
    - JSON keys (e.g., 'performance', 'seo', 'ux', 'security', 'competitorAnalysis', 'items', 'score') MUST remain in English as per the schema.
    - The 'status' field values MUST strictly be one of: "good", "warning", "poor".
    - The 'value' field (e.g., "1.2s", "HTTPS") can be in English if it is a technical unit or standard identifier, otherwise use Korean.

    Return the data strictly in JSON format matching the schema.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        temperature: 0.4, // Lower temperature for more consistent/analytical results
      }
    });

    const text = response.text;
    if (!text) {
        throw new Error("No response from AI");
    }
    return JSON.parse(text) as AuditReport;

  } catch (error) {
    console.error("Analysis failed:", error);
    throw error;
  }
};
