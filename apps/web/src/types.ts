export interface CropSubmission {
  id: string;
  cropName: string;
  farmerName: string;
  location: string;
  quantityTons: number;
  waterSavingsPct: number;
  sustainabilityScore: string;
  submissionDate: string;
  status: 'Pending' | 'Approved' | 'In-Transit';
}

export interface SupplierRow {
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

export interface SystemLog {
  id: string;
  timestamp: string;
  apiName: 'Groq API' | 'Gemini API' | 'Cohere.ai API' | 'System Edge';
  method: string;
  endpoint: string;
  latencyMs: number;
  status: '200 OK' | '201 Created' | '101 Switching Protocol';
  payload: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
}
