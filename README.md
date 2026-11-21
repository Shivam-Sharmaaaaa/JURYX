# JuryX (AI-Assisted Advisory Jury Panel for Indian Summary Offences)

JuryX is an AI-powered advisory multi-agent jury panel designed to support magistrates and parties in Indian summary trial offences (e.g., Section 138 Negotiable Instruments Act, minor offences under Bharatiya Nyaya Sanhita (BNS) / IPC, traffic disputes, and municipal summary offences).

The system simulates a 3-round deliberation:
- **Round 1 (Independent Assessment):** 4 diverse juror personas evaluate facts & statutory elements.
- **Round 2 (Rebuttal & Cross-Examination):** Jurors critique each other's opinions, address counter-theories, and identify evidentiary gaps.
- **Round 3 (Advisory Verdict & Synthesis):** The Lead Jurist synthesizes majority/minority views and recommends compounding, restitution, or appropriate statutory disposition.

---

## 👥 5-Teammate Parallel Work Distribution

To prevent merge conflicts during the hackathon, each teammate has an isolated scope:

| Teammate | Focus Area | Primary Files Owned | Key Deliverables |
| :--- | :--- | :--- | :--- |
| **Teammate 1 (Lead & Coordinator)** | System Architecture & Integration | `backend/app.py`, `backend/fallback_demo.json` | API pipeline orchestration, error handling, health checks, fallback modes. |
| **Teammate 2 (Prompt Engineer 1)** | Round 1 & Round 2 Personas | `backend/agents.py` | Prompt tuning for **The Analyst** & **The Empath**; prompt chaining & structured output schemas. |
| **Teammate 3 (Prompt Engineer 2)** | Legal Alignment & Lead Jurist | `backend/agents.py` | Prompt tuning for **The Jurist**, **The Skeptic**, and **Lead Jurist** synthesis (Indian statutes, Lok Adalat/compounding logic). |
| **Teammate 4 (Frontend UI/UX)** | Case Selection & Input Workbench | `frontend/src/cases.js`, `frontend/src/App.jsx` | Case selector, summary facts view, custom case input modal/drawer, responsiveness. |
| **Teammate 5 (Frontend Deliberation)** | Deliberation Visualization & Verdict | `frontend/src/App.jsx`, `frontend/src/index.css` | Juror cards, Round 2 dialogue flow UI, Round 3 verdict callout, audio/text polish. |

---

## 🚀 Quickstart & Local Setup

### 1. Backend Setup (Flask + Google GenAI SDK)

```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows PowerShell:
.\venv\Scripts\Activate.ps1
# Linux/macOS:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Configure environment variables
cp .env.example .env
# Edit .env and enter your GEMINI_API_KEY

# Run server
python app.py
```
Backend runs on `http://localhost:5000`. Test via `http://localhost:5000/health`.

---

### 2. Frontend Setup (Vite + React + Tailwind CSS)

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```
Frontend runs on `http://localhost:5173`. API requests to `/api` are automatically proxied to the Flask server.
