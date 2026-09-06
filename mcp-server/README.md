# 🚑 Rural Emergency Assistance Platform — MCP Server

A production-ready **Model Context Protocol (MCP)** Server for the **AI-Powered Rural Emergency Assistance Platform**.

This MCP server exposes the application's emergency triage engine, deterministic safety rules, first-aid knowledge base, OpenStreetMap healthcare facility finder, and official emergency contacts to MCP-compatible AI clients such as **Claude Desktop**, **Cursor**, or custom LLM orchestrators.

---

## 🏗️ Architecture

```text
┌──────────────────────────────────────────────────────────┐
│          MCP Client (Claude Desktop / Cursor)            │
└────────────────────────────┬─────────────────────────────┘
                             │ stdio (JSON-RPC)
┌────────────────────────────▼─────────────────────────────┐
│                    MCP Server Layer                      │
│                  (mcp-server/server.js)                  │
│  ┌───────────────────┬──────────────────┬─────────────┐  │
│  │     MCP Tools     │  MCP Resources   │ MCP Prompts │  │
│  │   (8 endpoints)   │  (4 resources)   │ (4 prompts) │  │
│  └─────────┬─────────┴────────┬─────────┴──────┬──────┘  │
│            │                  │                │         │
│  ┌─────────▼──────────────────▼────────────────▼──────┐  │
│  │              Universal Backend Bridge              │  │
│  │       (lib/backendBridge.js & lib/logger.js)       │  │
│  └────────────────────────────┬───────────────────────┘  │
└───────────────────────────────┼──────────────────────────┘
                                │
┌───────────────────────────────▼──────────────────────────┐
│             Application Services & Core Data             │
│  ┌──────────────────┬───────────────────┬─────────────┐  │
│  │  Safety Engine   │  Knowledge Base   │ AI Service  │  │
│  │ (Deterministic)  │ (14 Categories)   │  (Gemini)   │  │
│  ├──────────────────┼───────────────────┼─────────────┤  │
│  │ Facility Finder  │ Emergency Videos  │  Helplines  │  │
│  │  (OSM Overpass)  │    (Curated)      │ & Demo Data │  │
│  └──────────────────┴───────────────────┴─────────────┘  │
└──────────────────────────────────────────────────────────┘
```

### Key Architectural Principles
1. **Deterministic Safety Override**: Every emergency analysis runs through `backend/services/safetyEngine.js`. Critical symptoms (`CRITICAL_KEYWORDS`) and mental health indicators strictly escalate severity to `critical` and trigger `112` emergency call prompts. AI responses never override deterministic safety rules.
2. **Stdio Integrity**: All server logging is routed exclusively to `process.stderr` using a dedicated safe logger (`lib/logger.js`). `stdout` remains pristine for JSON-RPC message framing.
3. **Dual Execution Bridge**: Works out-of-the-box standalone via direct backend module integration or communicates with a live Express backend when `BACKEND_URL` is provided.

---

## 📦 Installation

```bash
# Navigate to the mcp-server directory
cd mcp-server

# Install dependencies
npm install
```

---

## ⚙️ Environment Variables

Create a `.env` file in `mcp-server/` (or configure in `backend/.env`):

```powershell
Copy-Item .env.example .env
```

Then replace `your_gemini_api_key_here` with the key from Google AI Studio. The MCP server also reads a repository-root `.env`; values in `mcp-server/.env` take precedence. Never commit an actual API key.

| Variable | Required | Default | Description |
|---|---|---|---|
| `GEMINI_API_KEY` | Optional | `null` | Google Gemini API key for natural language symptom categorization. If unset, deterministic keyword matching is used. |
| `BACKEND_URL` | Optional | `http://localhost:5000/api` | URL of running Express server. |
| `LOG_LEVEL` | Optional | `info` | Logging verbosity (`debug`, `info`, `warn`, `error`). Logs output to `stderr`. |

---

## 🚀 Running the MCP Server

```bash
# Start MCP server over stdio
npm start

# Run comprehensive automated test suite
npm test
```

From the root project directory:
```bash
npm run mcp:start
npm run mcp:test
```

---

## 💻 Client Configuration

### 1. Claude Desktop Setup

Add the server to your Claude Desktop configuration file:
- **macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
- **Windows**: `%APPDATA%\Claude\claude_desktop_config.json`

```json
{
  "mcpServers": {
    "rural-emergency": {
      "command": "node",
      "args": [
        "c:/Users/anmol/OneDrive/Desktop/project1/mcp-server/server.js"
      ],
      "env": {
        "GEMINI_API_KEY": "your_gemini_api_key_here"
      }
    }
  }
}
```

*(Replace the path with your system's absolute path to `mcp-server/server.js`)*

---

### 2. Cursor Setup

1. Open **Cursor Settings** (`Ctrl+,` or `Cmd+,`).
2. Go to **Features** → **MCP Servers**.
3. Click **Add New MCP Server**:
   - **Name**: `rural-emergency`
   - **Type**: `command`
   - **Command**: `node c:/Users/anmol/OneDrive/Desktop/project1/mcp-server/server.js`

Or in `.cursor/mcp.json`:
```json
{
  "mcpServers": {
    "rural-emergency": {
      "command": "node",
      "args": [
        "c:/Users/anmol/OneDrive/Desktop/project1/mcp-server/server.js"
      ]
    }
  }
}
```

---

## 🛠️ MCP Tools

### 1. `analyze_emergency`
Analyzes emergency symptoms using Gemini AI and deterministic safety rules to determine severity, category, immediate actions, warnings, and emergency dispatch advice.

**Input Schema:**
```json
{
  "symptoms": "severe chest pain and left arm numbness",
  "description": "55yo male collapsed while working in farm field",
  "age": "55",
  "location_context": "Village farm, 15km from primary health center"
}
```

**Output Example:**
```json
{
  "success": true,
  "assessment": {
    "category": {
      "id": "chest_pain",
      "name": "Chest Pain",
      "nameHi": "सीने में दर्द",
      "icon": "❤️‍🩹"
    },
    "severity": {
      "level": "critical",
      "label": "Critical",
      "labelHi": "गंभीर",
      "message": "Immediate professional emergency help required.",
      "callEmergency": true
    },
    "immediateActionRequired": true,
    "callEmergencyPrompt": true,
    "emergencyNumber": "112"
  },
  "firstAid": {
    "steps": [
      { "step": 1, "instruction": "Call emergency services (112) immediately.", "icon": "📞" }
    ],
    "warnings": ["Do NOT give the person anything to eat or drink."],
    "doNots": ["Do NOT delay calling emergency services."]
  },
  "safety": {
    "disclaimer": "This information is for emergency first-aid support only...",
    "seekProfessionalHelp": true
  }
}
```

---

### 2. `get_emergency_categories`
Returns all 14 curated emergency categories supported by the platform with bilingual (English/Hindi) names and severity classifications.

---

### 3. `get_first_aid_guide`
Retrieves step-by-step first-aid protocols, warnings, do-nots, and instructional demonstration videos.

**Input:**
```json
{ "category_id": "snake_bite" }
```

---

### 4. `find_nearby_facilities`
Finds nearby hospitals, Community Health Centres (CHC), clinics, and doctors with distance (km), estimated travel times, and emergency indicators.

**Input:**
```json
{
  "latitude": 25.5846,
  "longitude": 85.1491,
  "radius_meters": 15000,
  "facility_type": "hospital"
}
```

---

### 5. `get_emergency_services`
Returns verified emergency contact numbers for India:
- `112` — National All-in-one Emergency
- `102` / `108` — Ambulance & Critical Care Transport
- `100` — Police
- `101` — Fire Services
- `181` — Women Helpline
- `1098` — Childline
- `1800-11-6117` — National Poison Information Centre
- National Mental Health Helplines (`KIRAN`, `Tele-MANAS`, `Vandrevala Foundation`)

---

### 6. `get_system_status`
Reports live system health, AI service mode (Gemini vs fallback), deterministic safety rules status, knowledge base metrics, and uptime.

---

### 7. `get_demo_scenario`
Provides 5 pre-configured demo cases (Chest pain, Severe bleeding, Unconsciousness, Choking, Minor burn) for safe system testing.

---

### 8. `emergency_chat`
Interactive multi-turn conversational first-aid assistant supporting English, Hindi (हिन्दी), and Hinglish with automatic safety escalation.

---

## 📚 MCP Resources

Read-only resources accessible via URI:
- `emergency://categories` — JSON catalog of all 14 categories.
- `emergency://services` — Official national emergency numbers & hotlines.
- `emergency://system-status` — System health, configuration, and engine status.
- `emergency://demo-scenarios` — Curated demo cases for platform testing.

---

## 📝 MCP Prompts

Ready-to-use prompt templates for AI clients:
- `emergency-assessment` — Assess an active patient situation with symptoms and context.
- `first-aid-guidance` — Retrieve structured first-aid guidance with strict safety rules.
- `rural-emergency-response` — Specialized protocol for remote/low-resource emergency response.
- `nearby-healthcare-assistance` — Locate nearest facilities and compute travel times given GPS coordinates.

---

## 🧪 Testing

Run the automated test suite:

```bash
cd mcp-server
npm test
```

Output:
```text
✔ MCP Tool: analyze_emergency — Critical Chest Pain Scenario
✔ MCP Tool: analyze_emergency — Deterministic Safety Escalation for Life-Threatening Keywords
✔ MCP Tool: analyze_emergency — Mental Health Crisis Detection & Resource Provisioning
✔ MCP Tool: analyze_emergency — Minor Injury Handling (Less Urgent)
✔ MCP Tool: get_emergency_categories — Full 14 Curated Categories
✔ MCP Tool: get_first_aid_guide — Valid Category (snake_bite)
✔ MCP Tool: get_first_aid_guide — Invalid Category Handling
✔ MCP Tool: find_nearby_facilities — Real or Fallback Facility Retrieval
✔ MCP Tool: find_nearby_facilities — Facility Type Filtering
✔ MCP Tool: get_emergency_services — All Essential Emergency Numbers
✔ MCP Tool: get_system_status — Verification of Health & Engines
✔ MCP Tool: get_demo_scenario — 5 Pre-configured Scenarios
✔ MCP Tool: emergency_chat — Dialogue & Helpline Guidance
```

---

## 🛡️ Safety & Medical Disclaimers

1. **First-Aid Informational Support Only**: This platform is designed to provide immediate bystander first-aid assistance and facilitate rapid access to professional healthcare.
2. **Never Replaces Emergency Care**: In any life-threatening situation (cardiac arrest, unconsciousness, severe hemorrhage, respiratory failure, anaphylaxis, severe burns, snake bite), the system explicitly directs users to dial **112** immediately.
3. **No Prescription or Complex Diagnosis**: The platform enforces deterministic rules that prevent prescribing medications, suggesting dosages, or asserting definitive diagnoses.
