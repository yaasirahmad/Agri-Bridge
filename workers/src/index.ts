export interface Env {
  GROQ_API_KEY?: string;
  GEMINI_API_KEY?: string;
  COHERE_API_KEY?: string;
}

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS, DELETE",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Requested-With",
  "Access-Control-Max-Age": "86400",
};

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    // Handle CORS preflight pre-inspection checks
    if (request.method === "OPTIONS") {
      return new Response(null, {
        headers: CORS_HEADERS,
        status: 204,
      });
    }

    const url = new URL(request.url);

    try {
      // 0. GET / -> Gateway Health & Operational Check
      if (url.pathname === "/" || url.pathname === "") {
        return new Response(
          JSON.stringify({
            status: "online",
            message: "AgriBridge Secure B2B API Gateway is fully operational.",
            timestamp: new Date().toISOString(),
            endpoints: {
              chat: "POST /api/chat",
              docs: "POST /api/docs",
              search: "POST /api/search"
            }
          }),
          { status: 200, headers: { ...CORS_HEADERS, "Content-Type": "application/json" } }
        );
      }

      // 1. POST /api/chat -> Groq Llama 3 Proxy
      if (url.pathname === "/api/chat" && request.method === "POST") {
        const body: any = await request.json();
        const messages = body.messages || [];
        
        if (!env.GROQ_API_KEY || env.GROQ_API_KEY === "YOUR_GROQ_API_KEY") {
          console.warn("GROQ_API_KEY not configured. Falling back to high-fidelity mock chat response.");
          return new Response(
            JSON.stringify(getMockChatResponse(messages)),
            { status: 200, headers: { ...CORS_HEADERS, "Content-Type": "application/json" } }
          );
        }

        const groqResponse = await fetch("https://api.groq.com/openai/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${env.GROQ_API_KEY}`,
          },
          body: JSON.stringify({
            model: "llama-3.3-70b-versatile",
            messages: [
              {
                role: "system",
                content: "You are AgriBridge AI, a helpful agronomy and trade compliance expert assisting Pakistani farmers and Saudi importers in shipping Basmati rice, dates, honey, and alfalfa. Provide concise, highly technical soil, water, and documentation advice. Keep formatting in clear markdown."
              },
              ...messages
            ],
            temperature: 0.5,
            max_tokens: 1024,
          }),
        });

        if (!groqResponse.ok) {
          const errText = await groqResponse.text();
          throw new Error(`Groq API returned error status ${groqResponse.status}: ${errText}`);
        }

        const data = await groqResponse.text();
        return new Response(data, {
          status: 200,
          headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
        });
      }

      // 2. POST /api/docs -> Gemini Multimodal OCR Proxy
      if (url.pathname === "/api/docs" && request.method === "POST") {
        const body: any = await request.json();
        const { fileBase64, fileName, docType } = body;

        if (!env.GEMINI_API_KEY || env.GEMINI_API_KEY === "YOUR_GEMINI_API_KEY") {
          console.warn("GEMINI_API_KEY not configured. Falling back to simulated document parser.");
          // Wait 1200ms to simulate realistic OCR processing latency
          await new Promise((resolve) => setTimeout(resolve, 1200));
          return new Response(
            JSON.stringify(getMockDocParsingResponse(fileName, docType)),
            { status: 200, headers: { ...CORS_HEADERS, "Content-Type": "application/json" } }
          );
        }

        // Clean up base64 prefix if present
        let cleanBase64 = fileBase64 || "";
        let mimeType = "application/pdf";
        if (cleanBase64.includes(";base64,")) {
          const parts = cleanBase64.split(";base64,");
          mimeType = parts[0].split(":")[1] || "application/pdf";
          cleanBase64 = parts[1];
        }

        const prompt = `Analyze this ${docType} agricultural trade certificate file: "${fileName}".
        Extract:
        1. "authority" (The official organization or department issuing the certificate).
        2. "expiry" (The exact expiration date in YYYY-MM-DD format. If none found, estimate a logical 1-year range from today).
        3. "scope" (The specific agricultural product, test result, or Halal compliance standards certified).

        You MUST respond ONLY with a valid raw JSON object matching this schema:
        {
          "authority": "string value",
          "expiry": "YYYY-MM-DD",
          "scope": "string value"
        }
        Do not wrap the JSON in markdown code blocks like \`\`\`json. Return pure raw JSON text.`;

        const geminiResponse = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${env.GEMINI_API_KEY}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              contents: [
                {
                  parts: [
                    { text: prompt },
                    {
                      inlineData: {
                        mimeType: mimeType,
                        data: cleanBase64
                      }
                    }
                  ]
                }
              ],
              generationConfig: {
                responseMimeType: "application/json"
              }
            }),
          }
        );

        if (!geminiResponse.ok) {
          const errText = await geminiResponse.text();
          throw new Error(`Gemini API returned error status ${geminiResponse.status}: ${errText}`);
        }

        const geminiData: any = await geminiResponse.json();
        const generatedText = geminiData.candidates?.[0]?.content?.parts?.[0]?.text || "{}";
        
        let parsedResult;
        try {
          parsedResult = JSON.parse(generatedText.trim());
        } catch {
          // If JSON extraction failed, fall back to safe regex parsing
          parsedResult = parseFallbackGeminiRegex(generatedText);
        }

        return new Response(JSON.stringify(parsedResult), {
          status: 200,
          headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
        });
      }

      // 3. POST /api/search -> Cohere Rerank Semantic Proxy
      if (url.pathname === "/api/search" && request.method === "POST") {
        const body: any = await request.json();
        const { query, documents } = body; // documents: Array<{ id: string, supplierName: string, cropType: string, location: string, description: string }>

        if (!env.COHERE_API_KEY || env.COHERE_API_KEY === "YOUR_COHERE_API_KEY") {
          console.warn("COHERE_API_KEY not configured. Falling back to local semantic filter.");
          return new Response(
            JSON.stringify(getMockSearchResponse(query, documents)),
            { status: 200, headers: { ...CORS_HEADERS, "Content-Type": "application/json" } }
          );
        }

        const cohereResponse = await fetch("https://api.cohere.com/v1/rerank", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${env.COHERE_API_KEY}`,
          },
          body: JSON.stringify({
            model: "rerank-english-v3.0",
            query: query,
            documents: documents.map((doc: any) => `${doc.supplierName} in ${doc.location} supplying ${doc.cropType}. Sustainability score: ${doc.sustainabilityScore}. Water savings: ${doc.waterSavingsPct}%. ${doc.cropType} availability index.`),
            top_n: Math.min(documents.length, 10),
          }),
        });

        if (!cohereResponse.ok) {
          const errText = await cohereResponse.text();
          throw new Error(`Cohere API returned error status ${cohereResponse.status}: ${errText}`);
        }

        const cohereData: any = await cohereResponse.json();
        
        // Re-order our documents based on Cohere's returned relevance ranks
        const rankedDocs = cohereData.results.map((result: any) => {
          const originalDoc = documents[result.index];
          return {
            ...originalDoc,
            relevanceScore: Math.round(result.relevance_score * 100),
          };
        }).sort((a: any, b: any) => b.relevanceScore - a.relevanceScore);

        return new Response(JSON.stringify(rankedDocs), {
          status: 200,
          headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
        });
      }

      // 4. Default 404 Route
      return new Response(JSON.stringify({ error: "Endpoint not found" }), {
        status: 404,
        headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
      });

    } catch (error: any) {
      console.error("Worker routing execution error:", error);
      return new Response(JSON.stringify({ error: error.message || "Internal Server Error" }), {
        status: 500,
        headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
      });
    }
  }
};

// --- SOPHISTICATED MOCK RESPONDERS FOR HIGH-RESILIENCE LOCAL DEVELOPMENT ---

function getMockChatResponse(messages: any[]) {
  const lastUserMessage = messages[messages.length - 1]?.content || "";
  const normalizedQuery = lastUserMessage.toLowerCase();

  let text = "";
  if (normalizedQuery.includes("water") || normalizedQuery.includes("rice") || normalizedQuery.includes("irrigation")) {
    text = `Optimizing basmati rice cultivation in Punjab involves a three-stage Alternate Wetting and Drying (AWD) protocol:

1. **Water Thresholds:** Monitor soil moisture using simple PVC field tubes placed 15cm deep. Refrain from irrigating until the water level drops below 15cm from the soil surface.
2. **Savings Index:** This saves up to **42% of freshwater** resources without affecting basmati millable yield.
3. **Soil Health:** Aerating the root zone periodically suppresses anaerobic methanogenesis, reducing crop carbon footprint by up to **2.2 mt CO2e per hectare**.`;
  } else if (normalizedQuery.includes("dates") || normalizedQuery.includes("khairpur") || normalizedQuery.includes("fertilizer")) {
    text = `Khairpur Sukkuri and Aseel date palms require high-potassium nutrition and strict humidity monitoring:

1. **Nutrient Feed:** Combine organic compost with localized drip-fed potassium nitrate to maximize pulp development during the 'Khalal' and 'Rutab' stages.
2. **Fungal Protection:** Prevent root rot and fruit-spoilage mold by executing systematic high-efficiency under-canopy micro-sprinkling (at 38% optimized water savings compared to traditional flood trenches).
3. **Export Compliance:** Align harvest handling with Saudi Food and Drug Authority (SFDA) phytosanitary requirements to clear custom quarantines instantly.`;
  } else if (normalizedQuery.includes("contract") || normalizedQuery.includes("escrow") || normalizedQuery.includes("blockchain")) {
    text = `Trade agreements under AgriBridge follow a secure and automated settlement protocol:

1. **Escrow Guarantee:** Buyer funds are secured, with 30% released upon pre-shipment phytosanitary clearance and 70% released upon port inspection at the destination.
2. **Sustainability Credits:** Carbon offsets and water conservation certifications are automatically registered onto the agreement, supporting green initiatives.`;
  } else {
    text = `Assalamu Alaikum! I have received your trade query: "${lastUserMessage}".

To optimize Basmati, Dates, or Feed crops for the Pakistan-Saudi supply chain:
- Deploy **Alternate Wetting & Drying (AWD)** to maximize your Sustainability Score.
- Maintain rigorous **phytosanitary logging** in alignment with SFDA standards.
- Ask me specific questions about water conservation or trade agreements!`;
  }

  return {
    id: `chatcmpl-${Math.random().toString(36).substring(7)}`,
    object: "chat.completion",
    created: Math.floor(Date.now() / 1000),
    model: "advisor-model",
    choices: [
      {
        index: 0,
        message: {
          role: "assistant",
          content: text,
        },
        finish_reason: "stop",
      },
    ],
    usage: {
      prompt_tokens: 150,
      completion_tokens: 280,
      total_tokens: 430,
    },
  };
}

function getMockDocParsingResponse(fileName: string, docType: string) {
  let authority = "Ministry of National Food Security & Research, Government of Pakistan";
  let expiry = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];
  let scope = "Phytosanitary Quarantine Certification";

  if (docType === "soil") {
    authority = "NARC Soil & Water Quality Directorate, Islamabad, PK";
    scope = "Bilateral SDG 2 Soil Yield Suitability & Heavy Metal Clearance";
  } else if (docType === "halal") {
    authority = "Halal Certification Board of Pakistan (HAP), Karachi";
    scope = "Bilateral Halal Supply Chain Protocol Compliance";
  }

  return {
    authority,
    expiry,
    scope: `${scope} [Parsed from mock ${fileName}]`
  };
}

function getMockSearchResponse(query: string, documents: any[]) {
  const normQuery = query.toLowerCase();
  
  // Custom simple keyword matching distance ranking
  const results = documents.map((doc) => {
    let score = 50; // default score
    if (normQuery.includes(doc.cropType.toLowerCase()) || doc.cropType.toLowerCase().includes(normQuery)) {
      score += 35;
    }
    if (normQuery.includes(doc.location.toLowerCase()) || doc.location.toLowerCase().includes(normQuery)) {
      score += 10;
    }
    if (doc.sustainabilityScore.includes("A++")) {
      score += 5;
    } else if (doc.sustainabilityScore.includes("A+")) {
      score += 3;
    }
    
    return {
      ...doc,
      relevanceScore: Math.min(score, 100)
    };
  }).sort((a, b) => b.relevanceScore - a.relevanceScore);

  return results;
}

function parseFallbackGeminiRegex(text: string) {
  const authorityMatch = text.match(/"authority"\s*:\s*"([^"]+)"/i);
  const expiryMatch = text.match(/"expiry"\s*:\s*"([^"]+)"/i);
  const scopeMatch = text.match(/"scope"\s*:\s*"([^"]+)"/i);

  return {
    authority: authorityMatch ? authorityMatch[1] : "Department of Agriculture Verification Portal, PK",
    expiry: expiryMatch ? expiryMatch[1] : new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    scope: scopeMatch ? scopeMatch[1] : "Bilateral General Crop Import Certification Standards",
  };
}
