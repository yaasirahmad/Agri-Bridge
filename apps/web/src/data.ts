import { CropSubmission, SupplierRow, SystemLog } from './types';

export const INITIAL_CROP_LOGS: CropSubmission[] = [
  {
    id: 'crop-101',
    cropName: 'Punjab Basmati Rice (Premium Long Grain)',
    farmerName: 'Muhammad Arshad',
    location: 'Sargodha, Punjab',
    quantityTons: 120,
    waterSavingsPct: 42,
    sustainabilityScore: 'A+',
    submissionDate: '2026-05-24 14:10',
    status: 'Approved',
  },
  {
    id: 'crop-102',
    cropName: 'Aseel Dates (Premium Sweet)',
    farmerName: 'Zainab Khairpur',
    location: 'Khairpur, Sindh',
    quantityTons: 85,
    waterSavingsPct: 35,
    sustainabilityScore: 'A',
    submissionDate: '2026-05-24 15:30',
    status: 'Pending',
  },
  {
    id: 'crop-103',
    cropName: 'Organic Alfalfa Al-Ahsa Feed',
    farmerName: 'Faisalabad Agro',
    location: 'Faisalabad, Punjab',
    quantityTons: 335,
    waterSavingsPct: 38,
    sustainabilityScore: 'A+',
    submissionDate: '2026-05-23 09:45',
    status: 'In-Transit',
  }
];

export const SUPPLIER_DATA: SupplierRow[] = [
  {
    id: 'sup-001',
    supplierName: 'Al-Sajjad Basmati Group',
    location: 'Gujranwala, Punjab',
    cropType: 'Punjab Basmati Rice',
    quantityAvailableTons: 250,
    sustainabilityScore: 'A+',
    waterSavingsPct: 45,
    carbonReductionTons: 12.4,
    pricePerTonUSD: 850,
    logisticsPathway: 'Karachi Port (PK) ➔ Jidda Islamic Port (SA) Sea Freight',
  },
  {
    id: 'sup-002',
    supplierName: 'Khairpur Oasis Palms',
    location: 'Khairpur, Sindh',
    cropType: 'Organic Sindh Dates (Aseel & Sukkuri)',
    quantityAvailableTons: 180,
    sustainabilityScore: 'A',
    waterSavingsPct: 38,
    carbonReductionTons: 8.2,
    pricePerTonUSD: 1200,
    logisticsPathway: 'Karachi Port (PK) ➔ Jidda Islamic Port (SA) Sea Freight',
  },
  {
    id: 'sup-003',
    supplierName: 'Indus Valley Agro-Federation',
    location: 'Multan, Punjab',
    cropType: 'Non-GMO Corn Seed',
    quantityAvailableTons: 400,
    sustainabilityScore: 'B+',
    waterSavingsPct: 30,
    carbonReductionTons: 15.1,
    pricePerTonUSD: 410,
    logisticsPathway: 'Karachi Port (PK) ➔ Dammam Port (SA) Sea Freight',
  },
  {
    id: 'sup-004',
    supplierName: 'Karak Mountain Bee Keepers',
    location: 'Karak, Khyber Pakhtunkhwa',
    cropType: 'Sidr Honey (A+ Export Grade)',
    quantityAvailableTons: 25,
    sustainabilityScore: 'A++',
    waterSavingsPct: 52,
    carbonReductionTons: 4.6,
    pricePerTonUSD: 9500,
    logisticsPathway: 'Peshawar Air Cargo (PK) ➔ Riyadh King Khalid Int (SA)',
  }
];

export const INITIAL_SYSTEM_LOGS: SystemLog[] = [
  {
    id: 'log-100',
    timestamp: '16:48:42',
    apiName: 'System Edge',
    method: 'GET',
    endpoint: '/edge-routing/lat-test',
    latencyMs: 12,
    status: '200 OK',
    payload: '{"status":"active", "edgeNode":"Karachi-Jidda-Pipeline"}',
  },
  {
    id: 'log-101',
    timestamp: '16:49:15',
    apiName: 'Cohere.ai API',
    method: 'POST',
    endpoint: '/v1/rerank/semantic-weights',
    latencyMs: 145,
    status: '200 OK',
    payload: '{"query": "organic dates from khairpur", "top_n": 4, "candidates": 8}',
  },
  {
    id: 'log-102',
    timestamp: '16:50:02',
    apiName: 'Gemini API',
    method: 'POST',
    endpoint: '/v1beta/models/gemini-2.5-flash:generateContent',
    latencyMs: 310,
    status: '200 OK',
    payload: '{"task": "parse_farm_certificate", "origin": "Pakistan Federal Department of Agriculture"}',
  },
  {
    id: 'log-103',
    timestamp: '16:50:48',
    apiName: 'Groq API',
    method: 'POST',
    endpoint: '/v1/chat/completions',
    latencyMs: 180,
    status: '200 OK',
    payload: '{"model": "llama-3-70b-versatile", "prompt_tokens": 1284, "completion_tokens": 425}',
  }
];

export const CHAT_KNOWLEDGE_BASE: { keywords: string[]; answer: string }[] = [
  {
    keywords: ['water', 'irrigation', 'optimize', 'rice'],
    answer: `Optimizing basmati rice cultivation in Punjab involves a three-stage Alternate Wetting and Drying (AWD) protocol:
1. **Water Thresholds:** Monitor soil moisture using simple PVC field tubes placed 15cm deep. Refrain from irrigating until the water level drops below 15cm from the soil surface.
2. **Savings Index:** This saves up to **42% of freshwater** resources without affecting basmati millable yield.
3. **Soil Health:** Aerating the root zone periodically suppresses anaerobic methanogenesis, reducing crop carbon footprint by up to **2.2 mt CO2e per hectare**.`
  },
  {
    keywords: ['dates', 'khairpur', 'fertilizer', 'disease'],
    answer: `Khairpur Sukkuri and Aseel date palms require high-potassium nutrition and strict humidity monitoring:
1. **Nutrient Feed:** Combine organic compost with localized drip-fed potassium nitrate to maximize pulp development during the 'Khalal' and 'Rutab' stages.
2. **Fungal Protection:** Prevent root rot and fruit-spoilage mold by executing systematic high-efficiency under-canopy micro-sprinkling (at 38% optimized water savings compared to traditional flood trenches).
3. **Export Compliance:** Align harvest handling with Saudi Food and Drug Authority (SFDA) phytosanitary requirements to clear custom quarantines instantly.`
  },
  {
    keywords: ['contract', 'blockchain', 'saudi', 'invest'],
    answer: `Trade agreements on AgriBridge use a secure escrow payment system:
1. **Escrow Guarantee:** Buyer funds are held securely, with 30% released upon pre-shipment phytosanitary clearance and 70% released upon port inspection at the destination.
2. **Sustainability Credits:** Carbon offsets and water conservation certifications are automatically registered onto the agreement, supporting Saudi Vision 2030 green initiatives.`
  },
  {
    keywords: ['hello', 'hi', 'agribridge', 'help', 'who'],
    answer: `Assalamu Alaikum and welcome to AgriBridge! 
I can help you with crop optimization, trade compliance, and logistics planning:
- Ask me: *"How do I optimize water for rice?"*
- Ask me: *"How can Sindh date farmers comply with Saudi phytosanitary rules?"*
- Feel free to ask anything about agricultural trade!`
  }
];

export const DEFAULT_CHAT_REPLY = `Thank you for your question! 

Here are some general recommendations for the Pakistan-Saudi supply chain:
- Use **Alternate Wetting & Drying (AWD)** techniques to improve your sustainability rating.
- Maintain up-to-date **phytosanitary certificates** in alignment with SFDA standards.
- Feel free to ask me specific questions about soil, water, or trade compliance!`;
