// AgriBridge API Gateway Client for Cloudflare Workers Interconnectivity

const WORKER_BASE_URL = 
  ((import.meta as any).env?.VITE_WORKER_BASE_URL) || 
  ((import.meta as any).env?.NEXT_PUBLIC_WORKER_BASE_URL) || 
  "http://localhost:8787";

export interface ChatMessageParam {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface DocumentParseResult {
  authority: string;
  expiry: string;
  scope: string;
}

export interface SupplierSearchDoc {
  id: string;
  supplierName: string;
  location: string;
  cropType: string;
  quantityAvailableTons: number;
  sustainabilityScore: string;
  waterSavingsPct: number;
  carbonReductionTons: number;
  pricePerTonUSD: number;
  logisticsPathway: string;
}

/**
 * Creates an AbortSignal that times out after the specified milliseconds.
 * This ensures fetch calls fail fast when the gateway is unreachable,
 * allowing the UI to seamlessly fall back to the local mock responses.
 */
function createTimeoutSignal(ms: number): AbortSignal {
  const controller = new AbortController();
  setTimeout(() => controller.abort(), ms);
  return controller.signal;
}

/**
 * Proxies B2B and agronomy chat queries to Groq Cloud through the Cloudflare Worker.
 */
export async function sendGatewayChatMessage(messages: ChatMessageParam[]): Promise<string> {
  try {
    const response = await fetch(`${WORKER_BASE_URL}/api/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ messages }),
      signal: createTimeoutSignal(4000),
    });

    if (!response.ok) {
      throw new Error(`HTTP error ${response.status}`);
    }

    const data = await response.json();
    return data.choices?.[0]?.message?.content || "No response content received.";
  } catch (error) {
    console.error("Gateway Chat API failure:", error);
    throw error;
  }
}

/**
 * Proxies Base64 encoded PDFs/images to Google Gemini for structured compliance parsing.
 */
export async function parseGatewayDocument(
  fileBase64: string,
  fileName: string,
  docType: 'phyto' | 'soil' | 'halal'
): Promise<DocumentParseResult> {
  try {
    const response = await fetch(`${WORKER_BASE_URL}/api/docs`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ fileBase64, fileName, docType }),
      signal: createTimeoutSignal(8000),
    });

    if (!response.ok) {
      throw new Error(`HTTP error ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Gateway Document Parser API failure:", error);
    throw error;
  }
}

/**
 * Proxies natural language queries to Cohere Rerank for semantic agribusiness supply ranking.
 */
export async function searchAgriSuppliers(
  query: string,
  documents: SupplierSearchDoc[]
): Promise<Array<SupplierSearchDoc & { relevanceScore: number }>> {
  try {
    const response = await fetch(`${WORKER_BASE_URL}/api/search`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query, documents }),
      signal: createTimeoutSignal(4000),
    });

    if (!response.ok) {
      throw new Error(`HTTP error ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Gateway Semantic Search API failure:", error);
    throw error;
  }
}
