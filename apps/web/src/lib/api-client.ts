// AgriBridge Intelligent Mock API Service Layer
// Provides high-fidelity, context-aware responses for chat, document parsing,
// and semantic supplier search — all running directly in the browser.

import { GoogleGenAI } from '@google/genai';

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
 * Call the live Gemini API using the @google/genai SDK when a key is present.
 */
async function callLiveGemini(messages: ChatMessageParam[], apiKey: string): Promise<string> {
  try {
    const ai = new GoogleGenAI({ apiKey });
    
    // Format message history for standard Gemini model inputs
    const contents = messages.map((msg) => ({
      role: msg.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: msg.content }],
    }));

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: contents,
      config: {
        systemInstruction: `You are Ziraat AI, an agronomic, water-management (AWD), and trade compliance advisor for AgriBridge (Pakistan-Saudi Arabia Sustainable Food Pipeline).
You assist Pakistani smallholders and Saudi corporate buyers.
CRITICAL DIRECTIONS:
1. Detect the user's language: Urdu script, Roman Urdu (Urdu written in Latin/English alphabets), or English.
2. Reply ONLY in the same language. If the query is in Roman Urdu (e.g. "kia hal ha", "pani kaise bachayein"), reply in natural, conversational Roman Urdu. If in Urdu script, reply in Urdu script. If English, reply in English.
3. Keep your answers extremely direct, concise, and focused. Do NOT write long paragraphs or give irrelevant details. Limit response to 1-3 sentences unless they specifically ask for deep details.
4. If they send a simple greeting like "hello", "kia hal ha", "salam", respond with a warm, polite, and brief greeting in their exact language.`
      }
    });

    return response.text || "I apologize, I could not generate a response. Please try again.";
  } catch (error) {
    console.error("Error calling live Gemini API:", error);
    throw error;
  }
}

/**
 * Intelligent agricultural advisory chat powered by contextual keyword matching.
 * Returns expert-level agronomy and trade compliance responses.
 */
export async function sendChatMessage(messages: ChatMessageParam[]): Promise<string> {
  // Simulate realistic API latency for natural UX feel
  await new Promise((resolve) => setTimeout(resolve, 600 + Math.random() * 400));

  const lastUserMessage = messages[messages.length - 1]?.content || "";
  const normalizedQuery = lastUserMessage.toLowerCase().trim();

  // Try live Gemini API if an API key is available and configured
  const apiKey = 
    (typeof import.meta !== 'undefined' && import.meta.env?.VITE_GEMINI_API_KEY) || 
    (typeof import.meta !== 'undefined' && import.meta.env?.GEMINI_API_KEY) ||
    (typeof process !== 'undefined' && process.env?.GEMINI_API_KEY) ||
    "";

  if (apiKey && apiKey !== "MY_GEMINI_API_KEY" && apiKey.trim() !== "") {
    try {
      const liveReply = await callLiveGemini(messages, apiKey);
      return liveReply;
    } catch (e) {
      console.warn("Falling back to local intelligent engine due to Gemini API error:", e);
    }
  }

  // --- SMART LOCAL MOCK ENGINE ---
  
  // 1. Language Detection
  let lang: 'urdu_script' | 'roman_urdu' | 'english' = 'english';
  
  const hasUrduScript = /[\u0600-\u06FF]/.test(lastUserMessage);
  if (hasUrduScript) {
    lang = 'urdu_script';
  } else {
    // Check for common Roman Urdu words/signatures
    const romanUrduKeywords = [
      'kia', 'hal', 'kya', 'kese', 'ho', 'theek', 'thik', 'chawal', 'pani', 
      'khajoor', 'khad', 'shehad', 'chara', 'muahida', 'pese', 'salam', 
      'aamdeed', 'shukriya', 'shukria', 'kahan', 'kab', 'kaise', 'bilkul', 
      'ha', 'hai', 'he', 'g', 'ji', 'assalam', 'walekum', 'walaikum', 'khaas'
    ];
    
    const tokens = normalizedQuery.split(/\s+/);
    const romanMatchCount = tokens.filter(t => romanUrduKeywords.includes(t)).length;
    
    if (romanMatchCount > 0 || normalizedQuery.includes("kia hal") || normalizedQuery.includes("kese ho") || normalizedQuery.includes("kaise ho")) {
      lang = 'roman_urdu';
    }
  }

  const containsAny = (keywords: string[]) => keywords.some(k => normalizedQuery.includes(k));

  // 2. Topic Detection & Response Generation

  // --- TOPIC: GREETING & SOCIAL ---
  const greetingEnglish = ['hello', 'hi', 'hey', 'how are you', 'how is you', 'how r u', 'greetings', 'who are you', 'what is your name'];
  const greetingRomanUrdu = ['salam', 'assalam', 'kia hal', 'kya haal', 'kese ho', 'kaise ho', 'kise ho', 'thik ho', 'theek ho'];
  const greetingUrduScript = ['سلام', 'السلام علیکم', 'کیا حال', 'کیسے ہو', 'کیسے ہیں', 'کون ہو', 'نام کیا ہے'];

  if (lang === 'urdu_script' && containsAny(greetingUrduScript)) {
    return `وعلیکم السلام! الحمدللہ، میں بالکل ٹھیک ہوں۔ آپ کیسے ہیں؟ ایگری برج (AgriBridge) پر آج میں آپ کی کیا مدد کر سکتا ہوں؟`;
  }
  if (lang === 'roman_urdu' && containsAny(greetingRomanUrdu)) {
    return `Alhamdulillah! Main bilkul theek hoon. Aap kaise hain? Aaj main AgriBridge par aap ki kya madad kar sakta hoon?`;
  }
  if (lang === 'english' && containsAny(greetingEnglish)) {
    return `Assalamu Alaikum! I am doing great, thank you for asking. How can I assist you with crop optimization, water management, or trade compliance on AgriBridge today?`;
  }

  // --- TOPIC: WATER / RICE / IRRIGATION ---
  const waterEnglish = ['water', 'rice', 'irrigation', 'basmati', 'flood'];
  const waterRomanUrdu = ['pani', 'chawal', 'basmati', 'abpashi', 'awd'];
  const waterUrduScript = ['پانی', 'چاول', 'آبپاشی', 'باسمتی'];

  if (lang === 'urdu_script' && (containsAny(waterUrduScript) || containsAny(waterEnglish))) {
    return `باسمتی چاول کے لیے متبادل گیلا اور خشک کرنے (AWD) کا طریقہ کار استعمال کریں۔ سادہ 15cm پی وی سی پائپ سے نمی چیک کریں۔ جب پانی سطح سے 15 سینٹی میٹر نیچے جائے تب ہی پانی لگائیں۔ اس سے 42 فیصد تک پانی کی بچت ہوتی ہے۔`;
  }
  if (lang === 'roman_urdu' && (containsAny(waterRomanUrdu) || containsAny(waterEnglish))) {
    return `Basmati chawal ke liye Alternate Wetting and Drying (AWD) ka tarika behtareen hai. 15cm PVC pipe se mitti ki nami check karein. Jab paani 15cm niche jaye tabhi paani lagayein. Is se 42% paani ki bachat hoti hai.`;
  }
  if (lang === 'english' && containsAny(waterEnglish)) {
    return `To optimize Basmati rice, deploy the Alternate Wetting and Drying (AWD) protocol. Monitor soil moisture with a 15cm PVC field tube, and only irrigate when the water level drops below 15cm. This saves up to 42% of freshwater.`;
  }

  // --- TOPIC: DATES / FERTILIZER / KHAIRPUR ---
  const datesEnglish = ['dates', 'palm', 'fertilizer', 'khairpur', 'potassium'];
  const datesRomanUrdu = ['khajoor', 'khad', 'khairpur', 'potassium', 'fertilizer'];
  const datesUrduScript = ['کھجور', 'کھاد', 'خیرپور', 'پوٹاشیم'];

  if (lang === 'urdu_script' && (containsAny(datesUrduScript) || containsAny(datesEnglish))) {
    return `خیرپور کی اصیل اور سکھڑی کھجور کے لیے پوٹاشیم نائٹریٹ اور نامیاتی کھاد کا استعمال کریں۔ قطرہ قطرہ مائیکرو اسپرینکلنگ سسٹم اپنائیں تاکہ فنگس اور جڑوں کے سڑنے سے بچاؤ ہو اور 38 فیصد پانی بچے۔`;
  }
  if (lang === 'roman_urdu' && (containsAny(datesRomanUrdu) || containsAny(datesEnglish))) {
    return `Khairpur ki Aseel aur Sukkuri khajoor ke liye Potassium Nitrate aur organic compost mix karein. Micro-sprinkling irrigation se 38% paani bachayein taake fungs aur roots sarne se bach saken.`;
  }
  if (lang === 'english' && containsAny(datesEnglish)) {
    return `For Khairpur Sukkuri and Aseel date palms, apply potassium nitrate with organic compost. Adopt under-canopy micro-sprinkling to save 38% water and protect roots from fungal rot.`;
  }

  // --- TOPIC: CONTRACTS / PAYMENTS / ESCROW ---
  const contractEnglish = ['contract', 'payment', 'escrow', 'blockchain', 'safeguard', 'security'];
  const contractRomanUrdu = ['muahida', 'pese', 'pay', 'escrow', 'blockchain', 'contract', 'adayegi'];
  const contractUrduScript = ['معاہدہ', 'ادائیگی', 'پیسے', 'بلاک چین', 'ایسکرو'];

  if (lang === 'urdu_script' && (containsAny(contractUrduScript) || containsAny(contractEnglish))) {
    return `ایگری برج پر تجارتی ادائیگی انتہائی محفوظ ہے۔ 30 فیصد رقم پاکستان سے روانگی (فائٹوسینٹری تصدیق) پر اور بقایا 70 فیصد رقم سعودی عرب کی بندرگاہ پر پہنچنے اور تصدیق کے بعد جاری ہوتی ہے۔`;
  }
  if (lang === 'roman_urdu' && (containsAny(contractRomanUrdu) || containsAny(contractEnglish))) {
    return `AgriBridge par payments bilkul secure hain. 30% payment Pakistan se phytosanitary clearance par aur baqi 70% Saudi port par inspection ke baad release hoti hai.`;
  }
  if (lang === 'english' && containsAny(contractEnglish)) {
    return `AgriBridge trades use a secure escrow system: 30% is released upon pre-shipment phytosanitary clearance in Pakistan, and the remaining 70% is released after successful customs/port inspection in Saudi Arabia.`;
  }

  // --- TOPIC: HONEY / SIDR / KARAK ---
  const honeyEnglish = ['honey', 'sidr', 'karak'];
  const honeyRomanUrdu = ['shehad', 'sidr', 'karak', 'honey'];
  const honeyUrduScript = ['شہد', 'سدر', 'کرک'];

  if (lang === 'urdu_script' && (containsAny(honeyUrduScript) || containsAny(honeyEnglish))) {
    return `کرک کا سدر (بیری) شہد برآمد کرنے کے لیے: نمی 18 فیصد سے کم ہو، شیشے کے جار میں پیکنگ ہو اور سعودی SFDA قوانین کے مطابق عربی اور انگریزی زبانوں میں لیبلنگ لازمی ہے۔`;
  }
  if (lang === 'roman_urdu' && (containsAny(honeyRomanUrdu) || containsAny(honeyEnglish))) {
    return `Karak ka premium Sidr (Ber) shehad export karne ke liye: Moisture 18% se kam rakhein, glass jars me pack karein, aur Saudi SFDA ke mutabiq Arabic/English bilingual label lagayein.`;
  }
  if (lang === 'english' && containsAny(honeyEnglish)) {
    return `To export premium Karak Sidr (Ber) honey to Saudi Arabia, ensure moisture is below 18%, pack in glass jars, and apply bilingual Arabic/English labels in compliance with SFDA rules.`;
  }

  // --- TOPIC: ALFALFA / FEED / LIVESTOCK ---
  const alfalfaEnglish = ['alfalfa', 'feed', 'livestock', 'hay'];
  const alfalfaRomanUrdu = ['chara', 'feed', 'alfalfa', 'chare'];
  const alfalfaUrduScript = ['چارہ', 'لوسرن', 'چارے'];

  if (lang === 'urdu_script' && (containsAny(alfalfaUrduScript) || containsAny(alfalfaEnglish))) {
    return `لوسرن (Alfalfa) چارے کی بہتر پیداوار کے لیے قطرہ قطرہ آبپاشی استعمال کریں (38 فیصد پانی کی بچت)۔ ہر کٹائی زمین سے 2 سے 3 انچ اوپر کریں تا کہ فصل کی دوبارہ نشوونما بہترین ہو۔`;
  }
  if (lang === 'roman_urdu' && (containsAny(alfalfaRomanUrdu) || containsAny(alfalfaEnglish))) {
    return `Alfalfa (Lucerne) chara ke liye drip irrigation adopt karein. Cutting hamesha zameen se 2-3 inch upar se karein taake next yield (regrowth) bohot achi ho.`;
  }
  if (lang === 'english' && containsAny(alfalfaEnglish)) {
    return `For alfalfa (lucerne) feed hay, use drip irrigation to save 38% water. Keep the cut height 2-3 inches above the soil crown to maximize regrowth.`;
  }

  // --- DEFAULT FALLBACKS BY LANGUAGE ---
  if (lang === 'urdu_script') {
    return `ایگری برج (AgriBridge) فصلوں کی پیداوار، پانی کی بچت (AWD) اور سعودی عرب برآمدی قوانین کے متعلق آپ کی مدد کے لیے حاضر ہے۔ براہ کرم اپنا مخصوص سوال پوچھیں۔`;
  }
  if (lang === 'roman_urdu') {
    return `AgriBridge crop yield, paani ki bachat (AWD), aur Saudi export compliance ke baare me aap ki madad kar sakta hai. Baraye meherbani apna sawal tafseel se batayein.`;
  }
  
  return `Welcome to AgriBridge! I can help you with crop optimization, Alternate Wetting and Drying (AWD) irrigation, and Saudi SFDA trade compliance. How can I assist you today?`;
}

/**
 * Intelligent document parser that simulates Gemini multimodal OCR extraction.
 * Returns structured certificate data based on document type.
 */
export async function parseDocument(
  fileBase64: string,
  fileName: string,
  docType: 'phyto' | 'soil' | 'halal'
): Promise<DocumentParseResult> {
  // Simulate realistic OCR processing latency
  await new Promise((resolve) => setTimeout(resolve, 1200 + Math.random() * 800));

  const expiryDate = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];

  if (docType === 'soil') {
    return {
      authority: 'NARC Soil & Water Quality Directorate, Islamabad, PK',
      expiry: expiryDate,
      scope: `Bilateral SDG 2 Soil Yield Suitability & Heavy Metal Clearance [Parsed from ${fileName}]`,
    };
  }

  if (docType === 'halal') {
    return {
      authority: 'Halal Certification Board of Pakistan (HAP), Karachi',
      expiry: expiryDate,
      scope: `Bilateral Halal Supply Chain Protocol Compliance [Parsed from ${fileName}]`,
    };
  }

  return {
    authority: 'Ministry of National Food Security & Research, Government of Pakistan',
    expiry: expiryDate,
    scope: `Phytosanitary Quarantine Certification [Parsed from ${fileName}]`,
  };
}

/**
 * Semantic supplier search and ranking engine.
 * Uses keyword relevance scoring to simulate Cohere Rerank behavior.
 */
export async function searchSuppliers(
  query: string,
  documents: SupplierSearchDoc[]
): Promise<Array<SupplierSearchDoc & { relevanceScore: number }>> {
  // Simulate realistic search latency
  await new Promise((resolve) => setTimeout(resolve, 300 + Math.random() * 300));

  const normQuery = query.toLowerCase();

  const results = documents.map((doc) => {
    let score = 50;

    // Crop type matching (strongest signal)
    if (normQuery.includes(doc.cropType.toLowerCase()) || doc.cropType.toLowerCase().includes(normQuery)) {
      score += 35;
    }

    // Location matching
    if (normQuery.includes(doc.location.toLowerCase()) || doc.location.toLowerCase().includes(normQuery)) {
      score += 10;
    }

    // Supplier name matching
    if (doc.supplierName.toLowerCase().includes(normQuery)) {
      score += 15;
    }

    // Sustainability bonus
    if (doc.sustainabilityScore.includes("A++")) {
      score += 5;
    } else if (doc.sustainabilityScore.includes("A+")) {
      score += 3;
    }

    return {
      ...doc,
      relevanceScore: Math.min(score, 100),
    };
  }).sort((a, b) => b.relevanceScore - a.relevanceScore);

  return results;
}
