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
      'ha', 'hai', 'he', 'g', 'ji', 'assalam', 'walekum', 'walaikum', 'khaas',
      'mein', 'main', 'hoon', 'hun', 'batao', 'batayein', 'karo', 'karein',
      'acha', 'aap', 'tum', 'yeh', 'woh', 'kis', 'konsa', 'zaroorat',
      'behtar', 'behtareen', 'fasal', 'zameen', 'mausam', 'keera', 'bimari',
      'bechna', 'bhejna', 'aloo', 'pyaaz', 'aam', 'gandum', 'makki', 'makai'
    ];
    
    const tokens = normalizedQuery.split(/\s+/);
    const romanMatchCount = tokens.filter(t => romanUrduKeywords.includes(t)).length;
    
    if (romanMatchCount > 0 || normalizedQuery.includes("kia hal") || normalizedQuery.includes("kese ho") || normalizedQuery.includes("kaise ho")) {
      lang = 'roman_urdu';
    }
  }

  const containsAny = (keywords: string[]) => keywords.some(k => normalizedQuery.includes(k));

  // 2. CONCEPT DEFINITIONS DICTIONARY
  interface CropDefinition {
    keywords: string[];
    nameEn: string;
    nameRoman: string;
    nameUrdu: string;
    detailsEn: string;
    detailsRoman: string;
    detailsUrdu: string;
  }

  interface ConceptDefinition {
    keywords: string[];
    nameEn: string;
    nameRoman: string;
    nameUrdu: string;
    detailsEn: string;
    detailsRoman: string;
    detailsUrdu: string;
  }

  const crops: CropDefinition[] = [
    {
      keywords: ['rice', 'basmati', 'chawal'],
      nameEn: "Basmati rice",
      nameRoman: "Basmati chawal",
      nameUrdu: "باسمتی چاول",
      detailsEn: "optimize water usage through the Alternate Wetting and Drying (AWD) technique using a 15cm PVC tube, saving 42% water and lowering carbon emissions by 2.2 mt CO2e per hectare",
      detailsRoman: "AWD (Alternate Wetting and Drying) pipe technique use karein taake 42% paani aur CO2 ki bachat ho",
      detailsUrdu: "متبادل گیلا اور خشک کرنے کے طریقے (AWD) اور 15 سینٹی میٹر پی وی سی پائپ کے ذریعے پانی کی 42 فیصد بچت حاصل کریں"
    },
    {
      keywords: ['date', 'dates', 'palm', 'khajoor', 'khajur', 'khairpur'],
      nameEn: "Khairpur dates",
      nameRoman: "Khairpur ki khajoor",
      nameUrdu: "خیرپور کی کھجور",
      detailsEn: "apply potassium nitrate during Khalal stages, deploy micro-sprinklers to save 38% water, and verify sugar concentration limits for Saudi SFDA compliance",
      detailsRoman: "Khalal stages me Potassium Nitrate aur micro-sprinkling use karein taake 38% paani ki bachat ho",
      detailsUrdu: "پوٹاشیم نائٹریٹ کا استعمال کریں اور مائیکرو اسپرینکلرز کے ذریعے پانی کی 38 فیصد بچت اور فنگس سے تحفظ یقینی بنائیں"
    },
    {
      keywords: ['honey', 'sidr', 'karak', 'shehad', 'shehd'],
      nameEn: "Karak Sidr honey",
      nameRoman: "Karak ka Sidr shehad",
      nameUrdu: "کرک کا سدر شہد",
      detailsEn: "ensure moisture level remains strictly below 18%, pack in premium glass containers, and utilize Arabic-English bilingual labeling for Saudi customs approval",
      detailsRoman: "moisture level 18% se kam rakhein, glass jars me pack karein aur bilingual Arabic/English labels lagayein",
      detailsUrdu: "نمی کی مقدار 18 فیصد سے کم رکھیں، شیشے کے جار میں پیک کریں اور سعودی ایس ایف ڈی اے کے مطابق عربی انگریزی لیبل لگائیں"
    },
    {
      keywords: ['alfalfa', 'feed', 'hay', 'lucerne', 'chara', 'chare'],
      nameEn: "Alfalfa feed hay",
      nameRoman: "Alfalfa janwar chara",
      nameUrdu: "لوسرن (Alfalfa) چارہ",
      detailsEn: "employ sub-surface drip irrigation for Alfalfa, maintain a cutting height of 2-3 inches to foster quick regrowth, and compress into tight bales for cost-effective export shipping",
      detailsRoman: "drip irrigation use karein, cutting zameen se 2-3 inch upar karein aur tight bales me packing karein",
      detailsUrdu: "قطرہ قطرہ آبپاشی استعمال کریں، کٹائی زمین سے 2-3 انچ اوپر رکھیں تاکہ دوبارہ نشوونما بہتر ہو اور مضبوط گٹھڑیوں میں برآمد کریں"
    },
    {
      keywords: ['wheat', 'gandum', 'gehun', 'flour'],
      nameEn: "milling wheat",
      nameRoman: "milling wheat (gandum)",
      nameUrdu: "گندم کی فصل",
      detailsEn: "sow crops in mid-November for optimal gluten yield, utilize phosphorus-rich fertilizers, and maintain strict post-harvest storage moisture below 12% to prevent mold",
      detailsRoman: "November me buwai karein, phosphorus khad use karein aur storage moisture 12% se kam rakhein",
      detailsUrdu: "نومبر کے وسط میں بوائی کریں، فاسفورس سے بھرپور کھاد استعمال کریں اور ذخیرہ اندوزی کے دوران نمی کی سطح 12 فیصد سے کم رکھیں"
    },
    {
      keywords: ['mango', 'aam', 'sindhri', 'chaunsa'],
      nameEn: "Sindhri and Chaunsa mangoes",
      nameRoman: "Sindhri aur Chaunsa aam",
      nameUrdu: "سندھری اور چونسا آم",
      detailsEn: "comply with hot water quarantine treatment (48°C for 60 minutes) to eliminate pests, preserve using temperature-controlled cold chains, and align with SFDA phytosanitary packaging standards",
      detailsRoman: "hot water quarantine treatment (48C par 60 minutes) lazmi karein aur cold chain barqarar rakhein",
      detailsUrdu: "پیسٹ کنٹرول کے لیے ہاٹ واٹر ٹریٹمنٹ (48 ڈگری پر 60 منٹ) کریں اور کولڈ چین کے ذریعے تازگی برقرار رکھیں"
    },
    {
      keywords: ['corn', 'maize', 'makai', 'makki'],
      nameEn: "Non-GMO corn seed",
      nameRoman: "Non-GMO makai (corn)",
      nameUrdu: "نان جی ایم او مکئی",
      detailsEn: "source high-yield certified non-GMO seeds, track soil moisture closely using digital sensors, and verify grain starch quality for animal feed and food processing buyers in KSA",
      detailsRoman: "certified non-GMO beej use karein aur moisture digital sensors se track karein",
      detailsUrdu: "اعلیٰ معیار کے نان جی ایم او بیج استعمال کریں اور ڈیجیٹل سینسرز کے ذریعے نمی کی نگرانی کریں"
    },
    {
      keywords: ['citrus', 'orange', 'kinow', 'kino', 'sargodha'],
      nameEn: "Sargodha Kinnow mandarins",
      nameRoman: "Sargodha ka Kinnow (citrus)",
      nameUrdu: "سرگودھا کے کنو",
      detailsEn: "ensure standard degreening and sorting, pack in SFDA-approved ventilated cartons, and maintain a refrigeration cold chain of 4-6°C during shipping transit",
      detailsRoman: "proper sorting karein, air-ventilated cartons me pack karein aur 4-6C cold chain maintain karein",
      detailsUrdu: "مناسب گریڈنگ اور سائزنگ کریں، ہوادار کارٹنوں میں پیک کریں اور بحری سفر کے دوران درجہ حرارت 4 سے 6 ڈگری برقرار رکھیں"
    },
    {
      keywords: ['sugarcane', 'ganna', 'ganney', 'sugar'],
      nameEn: "sugarcane crops",
      nameRoman: "ganna (sugarcane)",
      nameUrdu: "گنے کی فصل",
      detailsEn: "apply organic fertilizer compounds to boost sucrose content, save water using furrow or drip irrigation, and obtain NARC heavy metal clearance certification for trade",
      detailsRoman: "organic khad use karein, drip ya furrow irrigation apnayein aur NARC certificate hasil karein",
      detailsUrdu: "نامیاتی کھاد کا استعمال کریں، قطرہ قطرہ آبپاشی اپنائیں اور این اے آر سی سے ہیوی میٹل کلیئرنس سرٹیفکیٹ حاصل کریں"
    },
    {
      keywords: ['cotton', 'kapaas', 'kapas', 'fiber'],
      nameEn: "long-staple cotton",
      nameRoman: "kapaas (cotton)",
      nameUrdu: "کپاس کی فصل",
      detailsEn: "implement integrated pest management (IPM) to protect cotton fibers, maintain moisture levels during ginning, and list under green sustainable lint standards",
      detailsRoman: "IPM pest control method use karein aur ginning ke dauran moisture check karein",
      detailsUrdu: "کیڑوں کے تدارک کے لیے آئی پی ایم (IPM) طریقہ کار اپنائیں اور جننگ کے دوران نمی کا خاص خیال رکھیں"
    },
    {
      keywords: ['potato', 'potatoes', 'aloo', 'alu'],
      nameEn: "Grade-A potatoes",
      nameRoman: "aloo (potatoes)",
      nameUrdu: "آلو کی فصل",
      detailsEn: "harvest potatoes free from deep soil bruises, treat for bacterial wilt resistance, pack in mesh bags to allow ventilation, and secure SFDA quarantine clearance",
      detailsRoman: "bacterial wilt se bachao check karein aur ventilated mesh bags me pack karein",
      detailsUrdu: "بیکٹیریل مرجھاؤ سے پاک صحت مند آلو حاصل کریں، ہوادار جالی دار تھیلوں میں پیک کریں اور قرنطینہ سرٹیفکیٹ حاصل کریں"
    },
    {
      keywords: ['onion', 'onions', 'pyaaz', 'pyaz'],
      nameEn: "fresh red onions",
      nameRoman: "pyaaz (onions)",
      nameUrdu: "سرخ پیاز",
      detailsEn: "cure onions under ventilated shade to dry outer skins, pack in breathable net sacks, and ensure compliance with chemical residue limits prior to shipping from Karachi",
      detailsRoman: "hawa-dar saaye me sukhayein (curing), net sacks me pack karein aur pesticides test check karein",
      detailsUrdu: "ہوادار سائے میں خشک کریں (کیورنگ)، جالی دار تھیلوں میں پیک کریں اور کیڑے مار ادویات کے بقایا جات کا ٹیسٹ کروائیں"
    }
  ];

  const concepts: ConceptDefinition[] = [
    {
      keywords: ['export', 'sell', 'bechna', 'join', 'register', 'list', 'signup'],
      nameEn: "agricultural exporting process",
      nameRoman: "crop export bechna",
      nameUrdu: "برآمدی عمل",
      detailsEn: "AgriBridge acts as a direct bilateral trade channel. You can go to the 'Sell Crops' tab, list your verified agricultural lot, upload your phytosanitary certificates, and connect instantly with Saudi buyers",
      detailsRoman: "AgriBridge direct trade channel hai. Aap 'Sell Crops' tab me fasal register karein, certificates upload karein, aur Saudi buyers ko list show karein",
      detailsUrdu: "ایگری برج براہ راست تجارتی چینل ہے۔ آپ 'Sell Crops' ٹیب میں جا کر اپنی فصل کی تفصیلات درج کریں اور سرٹیفکیٹس اپ لوڈ کر کے سعودی خریداروں کو دکھا سکتے ہیں"
    },
    {
      keywords: ['buy', 'import', 'procure', 'find', 'buyer', 'saudi', 'salic'],
      nameEn: "agribusiness procurement system",
      nameRoman: "Saudi procurement system",
      nameUrdu: "خریداری کا نظام",
      detailsEn: "Saudi corporate agribusiness importers can search Pakistani suppliers semantically based on crop specifications, analyze ESG carbon/water saving metrics, and deploy secure digital agreements",
      detailsRoman: "Saudi buyers semantic search se best crop check kar sakte hain, ESG scores dekh sakte hain aur smart trade agreements sign kar sakte hain",
      detailsUrdu: "سعودی عرب کے خریدار جدید ترین سرچ کے ذریعے فصل کی خصوصیات، ماحولیاتی پائیداری کے اسکور، اور سفری راستوں کا معائنہ کر کے آرڈر دے سکتے ہیں"
    },
    {
      keywords: ['water', 'irrigation', 'awd', 'drip', 'pani', 'abpashi', 'sinchai'],
      nameEn: "sustainable water irrigation",
      nameRoman: "paani ki bachat (irrigation)",
      nameUrdu: "پانی کی بچت اور آبپاشی",
      detailsEn: "deploying water conservation methods such as Alternate Wetting and Drying (AWD) for rice and drip systems for dates/alfalfa reduces freshwater draw by 38% to 42%, drastically boosting yield sustainability scores",
      detailsRoman: "chawal ke liye AWD aur dates/alfalfa ke liye drip system use karne se 38%-42% paani bacha kar A++ sustainability score hasil karein",
      detailsUrdu: "چاول کے لیے متبادل خشک و تر (AWD) آبپاشی اور دیگر فصلوں کے لیے ڈرپ سسٹم اپنائیں جس سے 42 فیصد تک پانی بچتا ہے اور پائیداری کا درجہ A++ ہو جاتا ہے"
    },
    {
      keywords: ['soil', 'land', 'narc', 'test', 'health', 'mitti', 'zameen', 'zarkhaizi'],
      nameEn: "NARC Soil Health certification",
      nameRoman: "mitti ki sehat (soil health)",
      nameUrdu: "مٹی کی صحت اور زرخیزی",
      detailsEn: "NARC (National Agricultural Research Centre) certification validates nitrogen, phosphorus, and organic soil health levels, guaranteeing heavy metal clearance and compliance for GCC customs",
      detailsRoman: "NARC soil test certificate mitti ki zarkhaizi aur nitrogen levels verify karta hai taake saaf crop export ho",
      detailsUrdu: "این اے آر سی (NARC) سرٹیفکیٹ مٹی کی زرخیزی اور نائٹروجن کی سطح کی تصدیق کرتا ہے تاکہ بھاری دھاتوں سے پاک فصل کی برآمد یقینی ہو"
    },
    {
      keywords: ['pest', 'disease', 'keera', 'keere', 'bimari', 'spray', 'pesticide', 'quarantine'],
      nameEn: "SFDA pest and chemical compliance",
      nameRoman: "keere aur bimari control (pest)",
      nameUrdu: "کیڑوں اور بیماریوں کا کنٹرول",
      detailsEn: "deploy organic solutions like neem oil spray to bypass chemical residue penalties. Saudi SFDA maintains strict Maximum Residue Limits (MRLs) for chemical pesticides",
      detailsRoman: "neem oil spray natural solution hai. Chemical pesticides bilkul kam rakhein taake Saudi SFDA check pass ho sake",
      detailsUrdu: "کیڑوں کے تدارک کے لیے نیم کے تیل کا قدرتی سپرے استعمال کریں۔ سعودی عرب کے قوانین کے مطابق کیڑے مار ادویات کے اثرات مقررہ حد سے کم ہونے چاہئیں"
    },
    {
      keywords: ['sfda', 'compliance', 'halal', 'certificate', 'rules', 'standard', 'labels', 'labeling'],
      nameEn: "Saudi SFDA compliance standards",
      nameRoman: "Saudi SFDA rules and labeling",
      nameUrdu: "سعودی عرب کے ایس ایف ڈی اے قوانین",
      detailsEn: "exporting to the Kingdom requires three major certificates uploaded on AgriBridge: a Phyto-sanitary Certificate, a Halal Certificate, and a NARC Soil Health report, with Arabic-English bilingual product packaging labels",
      detailsRoman: "Saudi export ke liye 3 main certificates chahiyein: Phyto-sanitary, Halal aur Soil report, aur packing labels English/Arabic dono me hone chahiyein",
      detailsUrdu: "سعودی برآمد کے لیے تین اہم دستاویزات لازمی ہیں: فائٹوسینٹری سرٹیفکیٹ، حلال سرٹیفکیٹ، اور مٹی کی رپورٹ۔ پیکنگ پر عربی انگریزی دونوں زبانوں میں لیبل ہونا چاہیے"
    },
    {
      keywords: ['payment', 'escrow', 'contract', 'blockchain', 'money', 'raqam', 'pese', 'price', 'pricing', 'rate', 'muahida', 'cooperative'],
      nameEn: "secure digital escrow contract payments",
      nameRoman: "digital escrow payments system",
      nameUrdu: "محفوظ ایسکرو ادائیگی کا معاہدہ",
      detailsEn: "all financial transactions utilize a secure digital escrow agreement: 30% is released upon Karachi Port phytosanitary customs clearance, and the remaining 70% is automatically released after Saudi customs inspection and verification",
      detailsRoman: "escrow system se payments secure hain: 30% Pakistan port clearance par aur baqi 70% Saudi port par successful inspection ke baad direct account me transfer hoti hain",
      detailsUrdu: "ادائیگیاں بلاک چین پر مبنی ایسکرو سسٹم کے ذریعے ہوتی ہیں: 30 فیصد رقم پاکستان کسٹمز کلیئرنس پر اور بقیہ 70 فیصد رقم سعودی عرب بندرگاہ پر کامیاب معائنے کے بعد خودکار طور پر جاری ہوتی ہے"
    },
    {
      keywords: ['shipping', 'logistics', 'port', 'route', 'cargo', 'freight', 'karachi', 'jeddah', 'riyadh', 'dammam'],
      nameEn: "integrated shipping and logistics routes",
      nameRoman: "logistics and shipping routes",
      nameUrdu: "شپنگ اور لاجسٹکس کے راستے",
      detailsEn: "trade routes utilize either sea freight from Karachi Port to Jeddah Islamic Port (11-12 days transit) or air cargo from Peshawar/Karachi to Riyadh King Khalid Airport (8.5 hours flight time) for high-value organic lots",
      detailsRoman: "shipping ke 2 raaste hain: Karachi Port se Jeddah Islamic Port (11-12 din maritime route) ya air cargo Peshawar/Karachi se Riyadh (8.5 hours flight)",
      detailsUrdu: "شپنگ کراچی بندرگاہ سے جدہ بندرگاہ تک (11 سے 12 دن کا بحری راستہ) یا ائیر کارگو کے ذریعے پشاور یا کراچی سے ریاض (8.5 گھنٹے کی پرواز) کی جاتی ہے"
    },
    {
      keywords: ['sustainability', 'sdg', 'carbon', 'score', 'rating', 'vision 2030', 'environment'],
      nameEn: "SDG 2 sustainability carbon credit scoring",
      nameRoman: "sustainability ESG score carbon credits",
      nameUrdu: "پائیداری اور کاربن کریڈٹ کی درجہ بندی",
      detailsEn: "AgriBridge rates agricultural lots from A++ (45%+ water conserved and significant carbon mitigation) down to B+. Higher scores align directly with Saudi Vision 2030 and grant access to premium pricing agreements",
      detailsRoman: "AgriBridge crops ko A++ se B+ tak rating deta hai jo water savings aur carbon reduction par mabni hai. Saudi Vision 2030 A+ suppliers ko priority deta hai",
      detailsUrdu: "ہم فصلوں کو ماحولیاتی بچت کی بنیاد پر A++ سے B+ تک درجہ بندی دیتے ہیں۔ اعلیٰ درجہ بندی سے سعودی ویژن 2030 کے تحت قیمتوں اور آرڈرز میں خصوصی ترجیح حاصل ہوتی ہے"
    }
  ];

  // 3. Match user query against lists
  const matchedCrops: CropDefinition[] = [];
  const matchedConcepts: ConceptDefinition[] = [];
  let matchedLocation = "";

  for (const crop of crops) {
    if (crop.keywords.some(kw => normalizedQuery.includes(kw))) {
      matchedCrops.push(crop);
    }
  }

  for (const concept of concepts) {
    if (concept.keywords.some(kw => normalizedQuery.includes(kw))) {
      matchedConcepts.push(concept);
    }
  }

  // Location Check
  const pkLocations = ['pakistan', 'punjab', 'sindh', 'multan', 'khairpur', 'karachi', 'lahore', 'sargodha', 'peshawar'];
  const saudiLocations = ['saudi', 'riyadh', 'jeddah', 'dammam', 'ksa'];
  
  if (pkLocations.some(l => normalizedQuery.includes(l))) {
    matchedLocation = "Pakistan";
  } else if (saudiLocations.some(l => normalizedQuery.includes(l))) {
    matchedLocation = "Saudi Arabia";
  }

  // 4. Synthesis of Response
  if (matchedCrops.length > 0 || matchedConcepts.length > 0) {
    let responseText = "";

    if (lang === 'urdu_script') {
      let intro = "ایگری برج (AgriBridge) پر آپ کے سوال کے مطابق معلومات درج ذیل ہیں:\n\n";
      let cropSection = "";
      let conceptSection = "";
      
      if (matchedCrops.length > 0) {
        cropSection = "🌾 **" + matchedCrops.map(c => c.nameUrdu).join(" اور ") + " کے بارے میں:**\n";
        cropSection += matchedCrops.map(c => c.detailsUrdu).join("۔ ") + "۔\n\n";
      }

      if (matchedConcepts.length > 0) {
        conceptSection = "⚙️ **" + matchedConcepts.map(c => c.nameUrdu).join(" اور ") + " کی تفصیلات:**\n";
        conceptSection += matchedConcepts.map(c => c.detailsUrdu).join("۔ ") + "۔\n\n";
      }

      let outro = "آپ مزید تفصیلی رہنمائی کے لیے ہماری مٹی کے ٹیسٹ کی رپورٹ اپ لوڈ کر سکتے ہیں یا اپنے سودوں کو محفوظ بنانے کے لیے 'Sell Crops' پورٹل کا دورہ کر سکتے ہیں۔";
      responseText = intro + cropSection + conceptSection + outro;
    }
    else if (lang === 'roman_urdu') {
      let intro = "AgriBridge par aap ke sawal ke mutabiq details hazir hain:\n\n";
      let cropSection = "";
      let conceptSection = "";

      if (matchedCrops.length > 0) {
        cropSection = "🌾 **" + matchedCrops.map(c => c.nameRoman).join(" aur ") + " ke bare me:**\n";
        cropSection += matchedCrops.map(c => c.detailsRoman).join(". ") + ".\n\n";
      }

      if (matchedConcepts.length > 0) {
        conceptSection = "⚙️ **" + matchedConcepts.map(c => c.nameRoman).join(" aur ") + " ke mutabiq:**\n";
        conceptSection += matchedConcepts.map(c => c.detailsRoman).join(". ") + ".\n\n";
      }

      let outro = "Faslon ki export aur NARC certificates ki verify karwane ke liye 'Sell Crops' portal par registration shuru karein.";
      responseText = intro + cropSection + conceptSection + outro;
    }
    else {
      // English Dynamic Response
      let intro = "Regarding your question about ";
      const subjects: string[] = [];
      if (matchedCrops.length > 0) {
        subjects.push(matchedCrops.map(c => c.nameEn).join(" & "));
      }
      if (matchedConcepts.length > 0) {
        subjects.push(matchedConcepts.map(c => c.nameEn).join(" & "));
      }
      if (matchedLocation) {
        subjects.push(matchedLocation);
      }
      intro += subjects.join(" as well as ") + " on AgriBridge:\n\n";

      let cropSection = "";
      let conceptSection = "";

      if (matchedCrops.length > 0) {
        cropSection = "🌾 **" + matchedCrops.map(c => c.nameEn).join(" and ") + " Agricultural Advice:**\n";
        cropSection += "For " + matchedCrops.map(c => c.nameEn).join(" and ") + " lots, producers should " + matchedCrops.map(c => c.detailsEn).join("; furthermore, they should ") + ".\n\n";
      }

      if (matchedConcepts.length > 0) {
        conceptSection = "⚙️ **" + matchedConcepts.map(c => c.nameEn).join(" & ") + " Operational Guidelines:**\n";
        conceptSection += "Concerning your query, " + matchedConcepts.map(c => c.detailsEn).join("; additionally, ") + ".\n\n";
      }

      let outro = "To begin trading this commodity or upload soil/phytosanitary certificates for official verification, navigate to the 'Sell Crops' tab or search for matching listings in the 'Find Suppliers' portal.";
      responseText = intro + cropSection + conceptSection + outro;
    }

    return responseText;
  }

  // SOCIAL AND CONVERSATIONAL CONTEXTS (If no direct crop/concept matches)
  const socialUrdu = ['کیسے', 'طبیعت', 'کیا حال', 'ٹھیک', 'شکریہ', 'خدا حافظ', 'اللہ حافظ'];
  const socialRoman = ['kia hal', 'kya haal', 'kese ho', 'kaise ho', 'thik ho', 'theek ho', 'shukriya', 'shukria', 'allah hafiz', 'khuda hafiz', 'acha'];
  const socialEnglish = ['how are you', 'how is you', 'how r u', 'thank you', 'thanks', 'good job', 'perfect', 'awesome', 'bye', 'goodbye'];

  if (lang === 'urdu_script') {
    if (containsAny(socialUrdu)) {
      return `الحمدللہ! میں بالکل ٹھیک اور آپ کی مدد کے لیے تیار ہوں۔ ایگری برج (AgriBridge) پر میں آپ کی فصلوں، برآمدی سرٹیفکیٹس، آبپاشی (AWD)، قیمتوں، اور شپنگ لاجسٹکس کے حوالے سے رہنمائی کر سکتا ہوں۔ آپ کس چیز کے بارے میں جاننا چاہیں گے؟`;
    }
    return `ایگری برج پر آپ کا پیغام موصول ہوا۔ میں ایک ذہین زرعی تجارتی معاون ہوں۔ آپ مجھ سے کسی بھی فصل (جیسے باسمتی چاول، خیرپور کھجور، سدر شہد، گندم، آم) کے برآمدی قوانین، مٹی کی تصدیق، پانی کی بچت (AWD)، بلاک چین معاہدوں، یا شپنگ روٹس کے بارے میں بلا جھجک پوچھ سکتے ہیں۔`;
  }
  
  if (lang === 'roman_urdu') {
    if (containsAny(socialRoman)) {
      return `Alhamdulillah! Main bilkul theek hoon aur aap ki rehnumai ke liye haazir hoon. Main AgriBridge par aap ki crops export, AWD irrigation, pricing, shipping, aur escrow payments ke bare me madad kar sakta hoon. Aap kis fasal ke baare me janana chahte hain?`;
    }
    return `AgriBridge par aap ka sawal mila. Main ek smart agricultural assistant hoon. Aap mujh se chawal (rice), khajoor (dates), shehad (honey), chara (alfalfa), gandum (wheat), ya aam (mango) ki export, NARC soil test, SFDA certificates, ya escrow payments ke bare me sawal pooch sakte hain.`;
  }

  if (containsAny(socialEnglish)) {
    return `Thank you! I am doing great and ready to assist you. I can guide you through every stage of the AgriBridge bilateral trade pipeline, including crop specifications (rice, dates, honey, mangoes, alfalfa, wheat, sugarcane, onions, potatoes), water-saving AWD irrigation, NARC/SFDA certificates, shipping transit, and secure escrow contracts. What trade or agronomy query can I resolve for you today?`;
  }

  // Smart Context-Aware fallback that builds a response directly from their query words!
  const queryNouns = lastUserMessage.split(/\s+/).filter(word => word.length > 4 && !['about', 'would', 'could', 'should', 'there', 'their', 'where', 'which', 'these', 'those'].includes(word.toLowerCase()));
  const topicHint = queryNouns.length > 0 ? `"${queryNouns.slice(0, 3).join(", ")}"` : "your interest";
  
  return `Thank you for asking about ${topicHint}! 

I am Ziraat AI, your expert agronomy and trade compliance advisor for AgriBridge (Pakistan-Saudi Arabia Sustainable Food Pipeline). While I don't have a specific pre-set answer for that exact phrasing, I can provide comprehensive guidance on how it applies to our platform:

• If it relates to a crop: AgriBridge supports sustainable Basmati Rice, Khairpur Dates, Sidr Honey, Alfalfa Hay, Multan Corn, Sargodha Kinnow, Sindhri Mangoes, Sugarcane, Cotton, Potatoes, and Onions.
• If it relates to export/compliance: All trade lots require a Phyto-sanitary Certificate, Halal Certificate, NARC Soil Health verification, and bilingual Arabic-English packaging labels meeting Saudi SFDA regulations.
• If it relates to transactions: We guarantee both parties via a secure SNB Escrow trade agreement (30% released at Karachi Port pre-shipment, 70% upon Jeddah/Dammam port validation).

Please let me know if you would like me to elaborate on crop-specific AWD water saving, compliance requirements, or secure payment details!`;
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
