// AgriBridge Intelligent Mock API Service Layer
// Provides high-fidelity, context-aware responses for chat, document parsing,
// and semantic supplier search — all running directly in the browser.

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
 * Intelligent agricultural advisory chat powered by contextual keyword matching.
 * Returns expert-level agronomy and trade compliance responses.
 */
export async function sendChatMessage(messages: ChatMessageParam[]): Promise<string> {
  // Simulate realistic API latency for natural UX feel
  await new Promise((resolve) => setTimeout(resolve, 600 + Math.random() * 400));

  const lastUserMessage = messages[messages.length - 1]?.content || "";
  const normalizedQuery = lastUserMessage.toLowerCase();

  // 1. Urdu / Roman Urdu for Rice, Water, Irrigation
  if (
    normalizedQuery.includes("water") || 
    normalizedQuery.includes("rice") || 
    normalizedQuery.includes("irrigation") ||
    normalizedQuery.includes("پانی") ||
    normalizedQuery.includes("pani") ||
    normalizedQuery.includes("چاول") ||
    normalizedQuery.includes("chawal")
  ) {
    return `**[Urdu / اردو]**
پنجاب میں باسمتی چاول کی کاشت کے لیے متبادل گیلا اور خشک کرنے (AWD) کا طریقہ کار:

1. **پانی کی حد (Water Threshold):** 15 سینٹی میٹر گہرائی میں رکھے گئے سادہ پی وی سی پائپ کا استعمال کرتے ہوئے مٹی کی نمی کی نگرانی کریں۔ جب پانی سطح سے 15 سینٹی میٹر نیچے جائے تب ہی دوبارہ پانی لگائیں۔
2. **پانی کی بچت:** یہ باسمتی چاول کی کل پیداوار کو متاثر کیے بغیر **42 فیصد تک میٹھے پانی** کی بچت کرتا ہے۔
3. **مٹی کی صحت:** جڑوں کو ہوا دینے سے میتھین گیس کا اخراج کم ہوتا ہے، جس سے فصل کا کاربن فٹ پرنٹ **2.2 میٹرک ٹن CO2e فی ہیکٹر** تک کم ہو جاتا ہے۔

---

**[English]**
Optimizing basmati rice cultivation in Punjab involves a three-stage Alternate Wetting and Drying (AWD) protocol:

1. **Water Thresholds:** Monitor soil moisture using simple PVC field tubes placed 15cm deep. Refrain from irrigating until the water level drops below 15cm from the soil surface.
2. **Savings Index:** This saves up to **42% of freshwater** resources without affecting basmati millable yield.
3. **Soil Health:** Aerating the root zone periodically suppresses anaerobic methanogenesis, reducing crop carbon footprint by up to **2.2 mt CO2e per hectare**.`;
  }

  // 2. Urdu / Roman Urdu for Dates, Fertilizer, Khairpur
  if (
    normalizedQuery.includes("dates") || 
    normalizedQuery.includes("khairpur") || 
    normalizedQuery.includes("fertilizer") ||
    normalizedQuery.includes("کھجور") ||
    normalizedQuery.includes("khajoor") ||
    normalizedQuery.includes("کھاد") ||
    normalizedQuery.includes("khad")
  ) {
    return `**[Urdu / اردو]**
خیرپور کے اصیل اور سکھڑی کھجور کے درختوں کے لیے پوٹاشیم کی خوراک اور نمی کی نگرانی:

1. **کھاد کی خوراک:** 'خلال' اور 'رطب' مراحل کے دوران کھجور کے پھل کو بڑا اور صحت مند بنانے کے لیے نامیاتی کھاد (Organic Compost) کے ساتھ پوٹاشیم نائٹریٹ کا استعمال کریں۔
2. **فنگس سے تحفظ:** آبپاشی کے لیے مائیکرو اسپرینکلنگ سسٹم کا استعمال کریں تاکہ جڑوں کو سڑنے سے بچایا جا سکے (اس سے روایتی سیلابی طریقے کے مقابلے میں 38 فیصد پانی کی بچت ہوتی ہے)۔
3. **سعودی برآمدی معیار:** اپنی فصل کو سعودی فوڈ اینڈ ڈرگ اتھارٹی (SFDA) کی سخت فائٹوسینٹری شرائط کے مطابق ہینڈل کریں۔

---

**[English]**
Khairpur Sukkuri and Aseel date palms require high-potassium nutrition and strict humidity monitoring:

1. **Nutrient Feed:** Combine organic compost with localized drip-fed potassium nitrate to maximize pulp development during the 'Khalal' and 'Rutab' stages.
2. **Fungal Protection:** Prevent root rot and fruit-spoilage mold by executing systematic high-efficiency under-canopy micro-sprinkling (at 38% optimized water savings compared to traditional flood trenches).
3. **Export Compliance:** Align harvest handling with Saudi Food and Drug Authority (SFDA) phytosanitary requirements to clear custom quarantines instantly.`;
  }

  // 3. Urdu / Roman Urdu for Contracts, Escrow, Payments
  if (
    normalizedQuery.includes("contract") || 
    normalizedQuery.includes("escrow") || 
    normalizedQuery.includes("blockchain") || 
    normalizedQuery.includes("payment") ||
    normalizedQuery.includes("معاہدہ") ||
    normalizedQuery.includes("muahida") ||
    normalizedQuery.includes("پیسے") ||
    normalizedQuery.includes("pay")
  ) {
    return `**[Urdu / اردو]**
ایگری برج (AgriBridge) کے تحت تجارتی معاہدے اور ادائیگی کا طریقہ کار:

1. **ایسکرو گارنٹی (Escrow Guarantee):** خریدار کی رقم بینک میں محفوظ رہتی ہے۔ 30 فیصد رقم پاکستان سے روانگی (Phytosanitary Clearance) پر اور بقایا 70 فیصد رقم سعودی عرب کی بندرگاہ (Port Ingress) پر تصدیق کے بعد جاری کی جاتی ہے۔
2. **سسٹین ایبلٹی کریڈٹس:** پانی کی بچت اور کاربن کریڈٹس خود کار طریقے سے بلاک چین پر رجسٹرڈ ہو جاتے ہیں، جو کاشتکار کی مارکیٹ ویلیو بڑھاتے ہیں۔

---

**[English]**
Trade agreements under AgriBridge follow a secure and automated settlement protocol:

1. **Escrow Guarantee:** Buyer funds are secured, with 30% released upon pre-shipment phytosanitary clearance and 70% released upon port inspection at the destination.
2. **Sustainability Credits:** Carbon offsets and water conservation certifications are automatically registered onto the agreement, supporting green initiatives.`;
  }

  // 4. Urdu / Roman Urdu for Greetings and General Support
  if (
    normalizedQuery.includes("hello") || 
    normalizedQuery.includes("hi") || 
    normalizedQuery.includes("help") || 
    normalizedQuery.includes("who") ||
    normalizedQuery.includes("سلام") ||
    normalizedQuery.includes("salam") ||
    normalizedQuery.includes("آداب") ||
    normalizedQuery.includes("مدد") ||
    normalizedQuery.includes("madad")
  ) {
    return `السلام علیکم اور ایگری برج (AgriBridge) میں خوش آمدید! 🇵🇰 🤝 🇸🇦
میں فصلوں کو بہتر بنانے، سعودی عرب کے برآمدی قوانین اور تجارت کے بارے میں آپ کی مدد کر سکتا ہوں:

- مجھ سے پوچھیں: *"چاول کے لیے پانی کیسے بچایا جائے؟"* (How do I optimize water for rice?)
- مجھ سے پوچھیں: *"کھجور کی فصل کی کھاد کا طریقہ کیا ہے؟"* (How to fertilize date palms?)
- آپ اردو یا انگریزی، دونوں زبانوں میں سوال پوچھ سکتے ہیں!

---

Assalamu Alaikum and welcome to AgriBridge!
I can help you with crop optimization, trade compliance, and logistics planning:
- Ask me: *"How do I optimize water for rice?"*
- Ask me: *"How can Sindh date farmers comply with Saudi phytosanitary rules?"*
- Feel free to ask anything about agricultural trade in Urdu or English!`;
  }

  // 5. Urdu / Roman Urdu for Honey and Sidr
  if (
    normalizedQuery.includes("honey") || 
    normalizedQuery.includes("sidr") || 
    normalizedQuery.includes("karak") ||
    normalizedQuery.includes("شہد") ||
    normalizedQuery.includes("shehad")
  ) {
    return `**[Urdu / اردو]**
کرک، خیبر پختونخوا کا سدر (بیری) کا شہد سعودی عرب برآمد کرنے کے قوانین:

1. **کٹائی کا دورانیہ:** بیری کے شہد کی کٹائی اکتوبر سے دسمبر کے دوران بیری کے پھول کھلنے کے سیزن میں ہونی چاہیے تاکہ اسے پریمیم گریڈ مل سکے۔
2. **کوالٹی کا معیار:** ایکسپورٹ گریڈ کے لیے شہد میں نمی کی مقدار 18 فیصد سے کم ہونی چاہیے، جس کی تصدیق ریفریکٹومیٹر ٹیسٹ سے ہوتی ہے۔
3. **پیکجنگ:** شیشے کے جار میں سیل بند پیکنگ اور SFDA قانون 2024-44B کے تحت عربی اور انگریزی زبانوں میں لیبلنگ لازمی ہے۔

---

**[English]**
Sidr honey from Karak, Khyber Pakhtunkhwa is among the most prized exports to Saudi Arabia:

1. **Harvesting Protocol:** Sidr honey must be harvested during the Ber tree (Ziziphus) bloom season (October–December) to ensure premium grade classification.
2. **Quality Standard:** A+ Export Grade requires moisture content below 18%, verified by refractometer testing at the cooperative level.
3. **Packaging Compliance:** Hermetically sealed food-grade glass jars stored below 20°C, with Arabic/English bilingual labeling per SFDA import regulation 2024-44B.`;
  }

  // 6. Urdu / Roman Urdu for Alfalfa Feed
  if (
    normalizedQuery.includes("alfalfa") || 
    normalizedQuery.includes("feed") || 
    normalizedQuery.includes("livestock") ||
    normalizedQuery.includes("چارہ") ||
    normalizedQuery.includes("chara")
  ) {
    return `**[Urdu / اردو]**
سعودی عرب کے مویشیوں کے شعبے کے لیے لوسرن (Alfalfa) چارہ برآمد کرنا:

1. **فصل کا چکر:** پنجاب میں لوسرن سیزن میں 6 سے 8 کٹائیاں دیتی ہے۔ دوبارہ پیداوار بڑھانے کے لیے کٹائی ہمیشہ زمین سے 2 سے 3 انچ اوپر کریں۔
2. **پانی کی کارکردگی:** قطرہ قطرہ آبپاشی (Drip Irrigation) سے چارے کی کاشت میں پانی کی کھپت 38 فیصد تک کم ہوتی ہے۔
3. **سعودی مانگ:** سعودی عرب سالانہ 2.5 ملین میٹرک ٹن سے زیادہ چارہ درآمد کرتا ہے—یہ پاکستانی کاشتکاروں کے لیے ایک بڑا منافع بخش موقع ہے۔

---

**[English]**
Organic alfalfa hay is a key feed crop for Saudi Arabia's livestock and dairy sector:

1. **Crop Cycle:** Alfalfa in Punjab yields 6-8 cuttings per season. Optimal cutting height is 2-3 inches above the crown to promote regrowth.
2. **Water Efficiency:** Drip irrigation combined with AWD scheduling reduces water consumption by up to 38% compared to flood irrigation.
3. **Saudi Demand:** The Kingdom imports over 2.5 million metric tons of animal feed annually — a major market opportunity for Pakistani producers.`;
  }

  return `السلام علیکم! مجھے آپ کا سوال موصول ہوا ہے: "${lastUserMessage}"

باسمتی چاول، کھجور، یا چارے کی برآمدی پیداوار بڑھانے کے لیے:
- **Alternate Wetting & Drying (AWD)** کا طریقہ استعمال کریں۔
- سعودی SFDA معیارات کے مطابق فائٹوسینٹری ریکارڈ رکھیں۔
- مجھ سے بلا جھجھک مخصوص سوالات پوچھیں!

---

Assalamu Alaikum! I have received your trade query: "${lastUserMessage}".

To optimize Basmati, Dates, or Feed crops for the Pakistan-Saudi supply chain:
- Deploy **Alternate Wetting & Drying (AWD)** to maximize your Sustainability Score.
- Maintain rigorous **phytosanitary logging** in alignment with SFDA standards.
- Ask me specific questions about water conservation or trade agreements!`;
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
