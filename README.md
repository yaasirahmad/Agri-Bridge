# 🌾 AgriBridge: Pakistan-Saudi Arabia Sustainable Food Pipeline

<div align="center">

**A Bilateral B2B Sustainable Agricultural Procurement & Compliance Platform**

*Connecting Pakistani agricultural producers with Saudi Arabian agribusiness corporate buyers in alignment with UN Sustainable Development Goal 2 (Zero Hunger), Saudi Vision 2030, and Pakistan Vision 2035.*

[![Vercel Deployment](https://img.shields.io/badge/Deployment-Vercel-success?style=for-the-badge&logo=vercel&logoColor=white)](https://agribridge.vercel.app)
[![React 19](https://img.shields.io/badge/React-19-blue?style=for-the-badge&logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org)
[![Vite](https://img.shields.io/badge/Vite-6.2-purple?style=for-the-badge&logo=vite)](https://vite.dev)

</div>

---

## 📖 Executive Summary & Context

AgriBridge is an academic-commercial prototype designed to streamline trade compliance, promote water-sustainable farming methods, and automate contract orchestration in the **Pakistan-Saudi Arabia agricultural trade corridor**.

Bilateral food pipeline trade frequently stalls due to administrative friction, rigid custom compliance guidelines under the **Saudi Food and Drug Authority (SFDA)**, and high logistics overhead. Concurrently, Pakistan's Indus Basin faces severe freshwater stress, making agricultural exports environmentally challenging unless paired with rigorous water conservation metrics.

**AgriBridge solves these problems through an integrated three-dashboard system:**
1. **🌱 Farmer / Supplier Portal:** Empowers Pakistani smallholders to register crop lots, track water conservation indices (implementing Alternate Wetting and Drying - AWD protocols), upload compliance certificates, and consult an AI agricultural advisor.
2. **🏢 Saudi Buyer Portal:** Enables corporate food trading companies in Riyadh and Jeddah to search verified crop inventories semantically and draft automated, legally structured purchase agreements instantenously.
3. **🖥️ Administrative Telemetry & Operations Console:** Provides the platform owner with full visibility into mock API consumption budgets, data compliance indicators, and real-time transaction activity trails.

---

## 🏗️ System Architecture

AgriBridge is built on a **modern serverless architecture** that executes completely in the browser for demo purposes. All heavy AI processing (advisory chat, document OCR parser, and semantic reranking search) is powered by a high-fidelity, context-aware **Mock API Service Layer**, eliminating external network dependencies and ensuring instant responses.

```
┌─────────────────────────────────────────────────────────────────────────┐
│                        CLIENT BROWSER (Vercel CDN)                      │
│              [Farmer View]   [Saudi Buyer View]   [Admin View]          │
│                                    │                                    │
│                                    ▼                                    │
│       ┌──────────────────────────────────────────────────────────┐      │
│       │            INTELLIGENT MOCK API SERVICE LAYER            │      │
│       │             (Direct Browser Client Execution)            │      │
│       └────┬───────────────────────┬───────────────────────┬─────┘      │
│            │                       │                       │            │
│            ▼                       ▼                       ▼            │
│    ┌───────────────┐       ┌─────────────────┐     ┌──────────────────┐ │
│    │   ZIRAAT AI   │       │  DOCUMENT OCR   │     │  SEMANTIC SEARCH │ │
│    │  (Groq Llama) │       │ (Gemini Parser) │     │ (Cohere Rerank)  │ │
│    │               │       │                 │     │                  │ │
│    │ Water AWD     │       │ Extracts:       │     │ Matches:         │ │
│    │ Advisory,     │       │ - Phyto certs   │     │ Buyer queries    │ │
│    │ Custom regs   │       │ - Soil reports  │     │ with active crop │ │
│    │ Pakistan-KSA  │       │ - Halal permits │     │ listings         │ │
│    └───────────────┘       └─────────────────┘     └──────────────────┘ │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## ⚙️ Tech Stack & API Orchestration Matrix

| Layer | Technology | Role in AgriBridge | Justification |
|---|---|---|---|
| **Frontend Framework** | React 19 + Vite 6 | SPA Dashboard views | Ultra-fast client-side routing & responsiveness |
| **Styling** | Tailwind CSS + Vanilla CSS | Curated visual design system | harmonized color palette, premium HSL tokens |
| **Bilateral AI Layer** | `lib/api-client.ts` | High-fidelity Mock API service | Self-contained, robust, instant mock responses |
| **Database & State** | React State Context | Live session persistence | High reliability for interactive grading demos |
| **Deployment** | Vercel | Production web hosting | Fully automated, reliable deployment |
| **Version Control** | GitHub | Source code versioning | Connected to Vercel for CI/CD |

---

## 📊 The 3-Dashboard System

### 🌱 Dashboard 1 — Farmer / Local Supplier View (Pakistani Agricultural Producer)

*Designed for high accessibility. Farmers can quickly log new crop batches, upload compliance certificates, and get immediate advisory feedback.*

- **Crop Logging:** Register crop listings mapped directly to bilateral agricultural taxonomy, specifying storage quality, volume (in metric tons), and water-conservation markers.
- **Ziraat AI Agricultural Advisor:** Live chat assistant offering specialized expert guidelines on Alternate Wetting and Drying (AWD) irrigation, phytosanitary requirements, and Saudi custom protocols.
- **Document Uploader:** Simulates a multimodal OCR parser (Gemini-based) that reads certificates (Phyto-sanitary, Soil Health, Halal) to verify legitimacy and auto-populate metadata.

---

### 🏢 Dashboard 2 — Saudi Agribusiness / Corporate Importer View

*An enterprise-grade B2B procurement interface designed for import managers and food cooperatives in Saudi Arabia.*

- **Bilateral Trade Analytics:** Real-time business intelligence monitors showing pricing averages, total tonnage, and seasonal harvest predictions.
- **Semantic Crop Search:** Allows importers to query listings using natural language (e.g., *"Grade A Basmati from Punjab with A++ sustainability rating"*). A mock Cohere Rerank-like algorithm prioritizes the highest-relevance listings.
- **Automated Smart Contract Generator:** Select a supplier, review transit routes (e.g. Karachi to Jeddah Islamic Port), and instantly compile custom formal legal trade agreement drafts.

---

### 🖥️ Dashboard 3 — Admin View (Platform Operator / System Auditor)

*A operations console providing the platform operator with live telemetry, API usage levels, and a real-time event auditor.*

- **System Health Telemetry:** Tracks network tunnel latencies, database status, and endpoint response times.
- **Real-Time API Token Quota Meters:** Displays live consumption gauges for each simulated AI service (Groq Llama 3.3, Gemini 1.5 Pro, and Cohere.ai).
- **Live Traffic Console:** Displays a scrolling log stream of active client events, database requests, and verification callbacks.

---

## 📂 Repository Directory Structure

```
agribridge/
├── README.md
├── LICENSE
├── .gitignore
├── package.json                     # Root monorepo configuration
├── vercel.json                      # Vercel deployment configuration
│
└── apps/
    └── web/                         # React + Vite Client Application
        ├── src/
        │   ├── app/
        │   │   ├── farmer/
        │   │   │   ├── page.tsx          # Farmer Dashboard
        │   │   │   └── components/
        │   │   │       ├── CropLogForm.tsx
        │   │   │       ├── DocumentUploader.tsx
        │   │   │       └── ZiraatChatPanel.tsx
        │   │   ├── buyer/
        │   │   │   ├── page.tsx          # Saudi Buyer Dashboard
        │   │   │   └── components/
        │   │   │       ├── AnalyticsPanel.tsx
        │   │   │       ├── SemanticSearchBar.tsx
        │   │   │       └── FarmerResultsTable.tsx
        │   │   └── admin/
        │   │       ├── page.tsx          # Admin Operations Dashboard
        │   │       └── components/
        │   │           ├── HealthTelemetry.tsx
        │   │           ├── QuotaMeters.tsx
        │   │           └── LiveTrafficConsole.tsx
        │   ├── lib/
        │   │   └── api-client.ts         # High-fidelity Mock API Client Layer
        │   ├── components/
        │   │   └── SmartContractModal.tsx
        │   ├── data.ts                   # Seed data records
        │   ├── types.ts                  # TypeScript definitions
        │   ├── App.tsx                   # Main orchestrator component
        │   └── index.css                 # Core CSS design system
        ├── index.html
        ├── package.json
        ├── tsconfig.json
        └── vite.config.ts
```

---

## 🚀 Getting Started — Local Setup

### Prerequisites

- **Node.js** >= 20.x
- **npm** >= 10.x
- **Git** >= 2.40

### Installation & Local Run

You can run the entire React application directly using simple `npm` commands:

```bash
# 1. Clone the repository
git clone https://github.com/yaasirahmad/Agri-Bridge.git
cd Agri-Bridge

# 2. Install dependencies
npm install

# 3. Start the application in development mode
npm run dev
# → Application starts at http://localhost:3000
```

*Note: Since the mock API layer is built directly into the client bundle, there are zero external API keys or server setup steps required. The application runs immediately!*

---

## 🌐 Deployment Pipeline

### Vercel (Frontend)

The application is deployed on **Vercel's Edge Network** with zero-config integration. Every push to the `main` branch triggers an automatic production deployment via the connected GitHub repository.

```bash
# Manual deployment (if needed)
npm install -g vercel
vercel --prod
```

**Vercel Configuration (`vercel.json`):**
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "apps/web/dist",
  "framework": "vite",
  "cleanUrls": true
}
```

---

## 📐 Project Deliverables

### 🔗 Live Application

| Resource | URL |
|---|---|
| **Production Web App** | [https://agribridge.vercel.app](https://agribridge.vercel.app) |
| **GitHub Repository** | [https://github.com/yaasirahmad/Agri-Bridge](https://github.com/yaasirahmad/Agri-Bridge) |

---

## 📄 License

This project is licensed under the **MIT License**. See the [LICENSE](LICENSE) file for complete terms.

---

## 🙏 Acknowledgements

- **Google Antigravity Team** — for pioneering the agent-first IDE paradigm that enabled this platform's structured design and refinement.
- **Groq Inc.** — for Llama 3.3 70B reference architectures.
- **Google DeepMind (Gemini Team)** — for advanced multimodal OCR extraction patterns.
- **Cohere** — for leading semantic search & reranking API concepts.
- **Supabase** — for database schema and real-time synchronization ideas.
- **UN Food and Agriculture Organization (FAO)** — for SDG 2 indicators and policy frameworks.

---

<div align="center">

**Built with 💚 | Aligned with SDG 2 · Saudi Vision 2030 · Pakistan Vision 2035**

*"Technology in service of food security is not innovation — it is obligation."*

</div>
