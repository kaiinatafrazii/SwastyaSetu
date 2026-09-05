# 🚑 SwasthyaSetu (स्वास्थ्‍यसेतु)
### *AI-Powered Rural Emergency Assistance & First-Aid Triage Platform*

[![React](https://img.shields.io/badge/Frontend-React%2018%20%7C%20Vite-61DAFB?logo=react&logoColor=black)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Backend-Node.js%20%7C%20Express-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![Google Gemini](https://img.shields.io/badge/AI-Google%20Gemini%202.0-4285F4?logo=google&logoColor=white)](https://aistudio.google.com/)
[![Leaflet](https://img.shields.io/badge/Maps-Leaflet%20%2B%20OSM-199900?logo=leaflet&logoColor=white)](https://leafletjs.com/)
[![PWA](https://img.shields.io/badge/PWA-100%25%20Offline%20Ready-5A0FC8?logo=pwa&logoColor=white)](https://web.dev/progressive-web-apps/)
[![i18n](https://img.shields.io/badge/Language-English%20%7C%20हिन्दी-FF6B6B)](#-multilingual-rural-accessibility)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

> **SwasthyaSetu** is a mission-critical, AI-assisted first-aid triage and rural health navigation web platform designed specifically for remote, low-bandwidth, and underserved communities. When professional medical help or ambulances are hours away, SwasthyaSetu acts as an immediate lifeline—providing instant, step-by-step, verified first-aid guidance and connecting users to the nearest medical facilities.

---

## 📌 Table of Contents

- [🌟 Key Features](#-key-features)
- [🛡️ Safety-First Architecture & AI Guardrails](#️-safety-first-architecture--ai-guardrails)
- [🏗️ System Architecture](#️-system-architecture)
- [💻 Tech Stack](#-tech-stack)
- [🚀 Quick Start & Installation](#-quick-start--installation)
- [⚙️ Environment Configuration](#️-environment-configuration)
- [📡 API Documentation](#-api-documentation)
- [🌐 Multilingual & Rural Accessibility](#-multilingual--rural-accessibility)
- [📶 Offline & Low-Bandwidth Resilience](#-offline--low-bandwidth-resilience)
- [🧪 Interactive Demo Mode](#-interactive-demo-mode)
- [⚖️ Medical & Legal Disclaimer](#️-medical--legal-disclaimer)
- [🤝 Contributing & License](#-contributing--license)

---

## 🌟 Key Features

### 1. 🚨 High-Stress Emergency Flow
- **One-Tap Emergency Actions**: Prominent, high-contrast touch targets for high-stress scenarios: **Start Emergency Triage**, **Call 112 / 108 / 102**, and **Find Nearest Hospital**.
- **Visual Severity Badges**: Instant color-coded severity levels (**Critical 🔴**, **Severe 🟠**, **Moderate 🟡**, **Minor 🟢**).

### 2. 🎙️ Multimodal Symptom Triage (Voice + Text + 1-Click Select)
- **Voice Recognition**: Real-time spoken symptom input in English and Hindi via the Web Speech API.
- **Natural Language Parsing**: AI-powered parsing with robust deterministic keyword fallbacks.
- **1-Click Emergency Categories**: Instant visual selection across 14 life-critical emergency categories (Cardiac arrest, Choking, Snake bites, Heavy bleeding, Burns, Heat stroke, Fractures, Poisoning, etc.).

### 3. 🤖 AI Triage + Deterministic Safety Engine
- Powered by **Google Gemini 2.0 API** for empathetic, contextual triage.
- **Deterministic Rule Overrides**: Hard-coded safety overrides for life-threatening keywords to eliminate AI hallucinations.
- **Strict Guardrails**: Zero drug prescriptions, zero definitive diagnosis claims, and mandatory escalation to 112/108 for critical cases.

### 4. 📋 Step-by-Step Verified First-Aid Guidance
- Numbered, bite-sized, distraction-free emergency instructions with progress tracking.
- Prominent **"Critical Warnings"** and **"Do NOT Do This"** safety rules for every condition.
- Embedded, verified instructional videos from globally recognized health authorities (**WHO**, **Red Cross**, **St John Ambulance**, **NHS**).

### 5. 🏥 Geo-Aware Nearest Healthcare Facility Finder
- Leverages **OpenStreetMap (OSM)** and **Overpass API** for real-time facility discovery.
- Filters and categorizes **District Hospitals**, **Community Health Centres (CHCs)**, and **Primary Health Centres (PHCs)**.
- Provides distance calculation, estimated travel times, GPS turn-by-turn routing, and direct-dial emergency capabilities.

### 6. 📶 100% Offline-First (PWA)
- Full client-side caching of first-aid protocols, emergency contacts, and category guides.
- Automatic online/offline status detection and seamless UI state transitions.

### 7. 💬 Embedded Emergency AI Assistant Widget
- Interactive floating chatbot widget for continuous conversational first-aid support.
- Quick suggestion chips, contextual responses, and direct emergency triggers.

### 8. 📊 Anonymous Triage Analytics
- Privacy-first operational dashboard displaying triage trends, emergency frequencies, and system health with zero Personally Identifiable Information (PII) collected.

---

## 🛡️ Safety-First Architecture & AI Guardrails

SwasthyaSetu adheres strictly to medical software safety standards:

```
                      [ User Symptom Input (Voice / Text) ]
                                        │
                                        ▼
                  ┌───────────────────────────────────────────┐
                  │   Deterministic Safety Rules Engine       │
                  │   (Regex & High-Risk Keyword Evaluator)   │
                  └─────────────────────┬─────────────────────┘
                                        │
                    Is Life-Threatening Keyword Detected?
                                   /          \
                           [YES]  /            \  [NO]
                                 v              v
      ┌────────────────────────────────┐   ┌───────────────────────────────┐
      │  🔴 HARD EMERGENCY OVERRIDE    │   │  🤖 Gemini 2.0 AI Evaluation  │
      │  - Severity: CRITICAL          │   │  - Structured JSON Output     │
      │  - Immediate 112/108 Trigger   │   │  - Contextual Safety Checks   │
      │  - Zero AI Hallucination Risk  │   └───────────────┬───────────────┘
      └────────────────┬───────────────┘                   │
                       │                                   │
                       └───────────────────┬───────────────┘
                                           ▼
                       [ Sanitization & Guardrails Layer ]
                       - Strip all prescription/drug names
                       - Verify emergency triage guidelines
                                           │
                                           ▼
                       [ Render Step-by-Step First Aid ]
```

- **Zero Prescription Rule**: SwasthyaSetu does not prescribe pharmaceuticals, antibiotics, or specific drug dosages.
- **First-Aid Scope Only**: Guidance is strictly limited to stabilization protocols while medical transport is arranged.
- **Zero PII Storage**: Symptom descriptions and user locations are never stored on persistent databases.

---

## 🏗️ System Architecture

```
swasthya-setu/
├── frontend/                     # React 18 + Vite PWA Client
│   ├── public/                   # PWA Manifest, Icons, Favicons
│   ├── src/
│   │   ├── components/           # Reusable UI components
│   │   │   ├── Header.jsx        # Navigation, Lang Switcher & Offline Badge
│   │   │   ├── EmergencyButton.jsx # Accessible one-touch emergency triggers
│   │   │   ├── VoiceInput.jsx    # Web Speech API input engine
│   │   │   ├── ChatbotWidget.jsx # Floating AI Assistant
│   │   │   ├── StepCard.jsx      # Interactive step-by-step guidance
│   │   │   ├── VideoCard.jsx     # Verified first-aid video players
│   │   │   ├── FacilityCard.jsx  # Health centre distance & routing card
│   │   │   ├── SeverityBadge.jsx # Color-coded triage indicator
│   │   │   └── ...
│   │   ├── pages/                # 8 Application Views
│   │   │   ├── HomePage.jsx             # Primary emergency dashboard
│   │   │   ├── EmergencyInputPage.jsx   # Symptom input & voice triage
│   │   │   ├── AssessmentPage.jsx       # Triage assessment results
│   │   │   ├── FirstAidGuidePage.jsx    # Interactive step-by-step guide
│   │   │   ├── HealthcareFinderPage.jsx # OpenStreetMap PHC/CHC finder
│   │   │   ├── EmergencyServicesPage.jsx# National emergency hotlines
│   │   │   ├── FirstAidLibraryPage.jsx  # Complete offline library
│   │   │   └── DashboardPage.jsx        # Anonymous health telemetry
│   │   ├── contexts/             # LanguageContext (EN / HI)
│   │   ├── data/                 # Offline first-aid knowledge base & i18n
│   │   ├── services/             # API, Speech, Geolocation services
│   │   ├── styles/               # Clean, accessible, high-contrast CSS
│   │   └── App.jsx
│   └── vite.config.js
│
├── backend/                      # Node.js + Express API
│   ├── controllers/              # Emergency, Facility & Dashboard handlers
│   ├── routes/                   # RESTful API Endpoints
│   ├── services/                 # Gemini AI Engine & Safety Rule Matrix
│   ├── data/                     # Curated first-aid protocols & verified media
│   ├── models/                   # Anonymous telemetry models
│   ├── middleware/               # Rate limiters, Security headers (Helmet)
│   └── server.js                 # Express server bootstrap
│
├── package.json                  # Monorepo management scripts
└── README.md                     # Documentation
```

---

## 💻 Tech Stack

| Layer | Technology | Description |
|---|---|---|
| **Frontend Core** | React 18, Vite | High-performance SPA with sub-second reload |
| **Routing & UI** | React Router v6, Lucide Icons | Responsive, mobile-first design |
| **Maps & Geo** | Leaflet, React-Leaflet, OpenStreetMap | GPS geolocation, distance metrics, PHC/CHC queries |
| **Speech** | Web Speech API | Client-side voice-to-text in English & Hindi |
| **Offline Engine** | Vite PWA Plugin, LocalStorage | Cache-first offline knowledge base |
| **Backend Core** | Node.js, Express.js | Lightweight, fast REST API |
| **AI Engine** | Google Gemini 2.0 Flash API | Natural language symptom classification & triage |
| **Overpass API** | OpenStreetMap Overpass QL | Real-time query engine for rural clinics and hospitals |
| **Security** | Helmet, CORS, Express Rate Limit | Hardened API surface |

---

## 🚀 Quick Start & Installation

### Prerequisites
- **Node.js**: `v18.0.0` or higher
- **npm**: `v9.0.0` or higher
- *(Optional)* **Gemini API Key**: Get one from [Google AI Studio](https://aistudio.google.com/apikey). *(If omitted, SwasthyaSetu seamlessly operates using its built-in deterministic keyword engine)*.

### 1. Clone & Install Dependencies
Clone the repository and install all root, backend, and frontend packages with a single command:

```bash
# Clone repository
git clone https://github.com/your-username/SwastyaSetu.git
cd SwastyaSetu

# Install all dependencies across workspaces
npm run install:all
```

### 2. Configure Environment Variables
Create a `.env` file in the `backend/` directory (or project root) based on `.env.example`:

```bash
cp .env.example .env
```

Set your configuration:
```env
PORT=5000
NODE_ENV=development
GEMINI_API_KEY=your_gemini_api_key_here
FRONTEND_URL=http://localhost:5173
EMERGENCY_NUMBER=112
```

### 3. Start Development Environment
Launch both the backend API and frontend Vite server concurrently:

```bash
npm run dev
```

- **Frontend Application**: `http://localhost:5173`
- **Backend API**: `http://localhost:5000`

---

## 📡 API Documentation

| HTTP Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/emergency/analyze` | Evaluates symptom text with Gemini AI + Safety Engine |
| `GET` | `/api/emergency/categories` | Retrieves list of all 14 supported emergency categories |
| `GET` | `/api/emergency/category/:id` | Returns complete first-aid steps, warnings & videos for a category |
| `GET` | `/api/facilities/nearby?lat={lat}&lng={lng}` | Searches nearby hospitals, CHCs, and PHCs via Overpass API |
| `GET` | `/api/dashboard/stats` | Returns anonymous emergency triage analytics & system health |
| `GET` | `/api/health` | Service health status check |

#### Example: Symptom Triage Request
```http
POST /api/emergency/analyze
Content-Type: application/json

{
  "symptoms": "A farmer was bitten on the ankle by a snake in the field, puncture marks visible",
  "language": "en"
}
```

#### Example Response
```json
{
  "category": "snake_bite",
  "severity": "critical",
  "confidence": 0.98,
  "summary": "Suspected venomous snake bite requiring immediate immobilization and emergency transport.",
  "immediate_actions": [
    "Keep patient calm and completely still",
    "Immobilize the bitten limb below heart level",
    "Call 112 / 108 immediately for anti-snake venom (ASV)"
  ],
  "do_not": [
    "Do NOT cut the wound",
    "Do NOT suck out venom",
    "Do NOT apply a tight tourniquet"
  ]
}
```

---

## 🌐 Multilingual & Rural Accessibility

- **Native Bilingual Support**: Instant toggle between **English** and **हिन्दी (Hindi)**.
- **Font Optimization**: Uses Google Fonts `Noto Sans` & `Noto Sans Devanagari` with aligned typographical metrics for uniform visual weight across scripts.
- **High-Contrast Touch UI**: Meets WCAG 2.1 AA accessibility standards with oversized touch buttons (min 48px height) for high-stress usability on low-cost mobile screens.
- **Voice-Enabled**: Empowers non-literate and semi-literate users to describe emergencies in their natural spoken tongue.

---

## 📶 Offline & Low-Bandwidth Resilience

Rural network infrastructure can be intermittent. SwasthyaSetu solves this through:
- **Client-Side Knowledge Mirroring**: Complete first-aid guidance, CPR counts, and emergency steps stored client-side.
- **Zero API Dependency for Basic First Aid**: When offline, the app switches to local pattern matching, ensuring 0% downtime for critical guidance.
- **Offline Indicator**: Immediate real-time network status bar informing the user that offline protocols are active.

---

## 🧪 Interactive Demo Mode

SwasthyaSetu comes with built-in interactive scenario presets to safely test and demonstrate triage flows:
1. **Severe Chest Pain (Cardiac Suspicion)** — Tests Critical escalation and aspirin cautions.
2. **Heavy Bleeding (Arterial Laceration)** — Tests pressure dressing and tourniquet warnings.
3. **Unresponsive Adult (CPR Needed)** — Demonstrates chest compression counter and airway clearance.
4. **Airway Obstruction (Choking)** — Tests Heimlich maneuver and back blows guidance.
5. **Chemical / Thermal Burn** — Demonstrates cool water running protocols and blister cautions.

---

## ⚖️ Medical & Legal Disclaimer

> [!IMPORTANT]
> **SwasthyaSetu is an educational first-aid triage assistant and emergency coordination tool. It is NOT a substitute for professional medical advice, clinical diagnosis, or medical treatment.**
>
> In any life-threatening situation, **always immediately contact local emergency services (112 / 108 in India)** or rush the patient to the nearest Primary Health Centre (PHC) or Hospital.

---

## 🤝 Contributing & License

Contributions, feedback, and localization help are warmly welcomed!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

Distributed under the **MIT License**.

---

<p align="center">
  <b>SwasthyaSetu (स्वास्थ्‍यसेतु)</b> — <i>Bridging the Critical Rural Emergency Care Gap.</i>
</p>
