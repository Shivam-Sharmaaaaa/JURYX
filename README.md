# JuryX

JuryX is an AI-assisted advisory jury panel for Indian summary offences under Section 260 CrPC / Section 283 BNSS, including Section 138 Negotiable Instruments Act, minor offences under IPC / Bharatiya Nyaya Sanhita (BNS), traffic disputes, and municipal summary matters. It provides non-binding advisory recommendations to assist judicial evaluation. Final judicial authority remains with the presiding magistrate.

## Overview

JuryX convenes an advisory panel of specialized AI jurors to deliberate summary offences across structured rounds:

- The Analyst: Scrutinizes physical evidence, documents, timelines, financial trails, and burden of proof (Role: Factual & Evidentiary Forensics).
- The Empath: Evaluates socio-economic realities, subjective intent, mitigating factors, and restorative compounding (Role: Social Context, Equity & Restorative Justice).
- The Jurist: Examines applicable statutory provisions, legal essential ingredients, and High Court / Supreme Court precedents (Role: Statutory Law, Precedent & Procedure).
- The Skeptic: Challenges evidence vulnerabilities, witness credibility, and alternative reasonable hypotheses (Role: Bias Detection, Cross-Examination & Counter-Theories).
- Lead Jurist: Deliberation lead who synthesizes panel findings, identifies points of consensus and dissent, and formulates the advisory disposition (Role: Deliberation Lead & Advisory Synthesis).

Deliberation operates across three structured rounds:
1. Round 1 (Initial Stances): The four primary jurors (Analyst, Empath, Jurist, Skeptic) evaluate facts and statutory elements independently.
2. Round 2 (Rebuttal & Cross-Examination): Jurors review peer arguments, address counter-theories, and flag evidentiary gaps.
3. Round 3 (Advisory Verdict & Synthesis): The Lead Jurist synthesizes all views and provides an advisory verdict with statutory references and recommended remedies.

## Workflow

Live AI deliberation is not yet connected; responses currently come from backend/fallback_demo.json.

1. Select a pre-configured Indian summary case from `frontend/src/cases.js`:
   - "Cheque Dishonour under Section 138 NI Act" (`CASE-IN-2024-001`)
   - "Rash & Negligent Driving Causing Minor Hurt" (`CASE-IN-2024-002`)
   - "Public Nuisance & Commercial Encroachment" (`CASE-IN-2024-003`)
2. Review case facts, court details, statutory sections, and advisory focus questions.
3. Start deliberation via "Start 3-Round Deliberation" or use "Load Instant Demo (Fallback)" for immediate offline evaluation.
4. Toggle across Round 1, Round 2, and Round 3 tabs to inspect each juror's stance, rebuttals, and the final advisory synthesis.

## Features

Live AI deliberation is not yet connected; responses currently come from backend/fallback_demo.json.

- Preset Summary Case Selection: Pre-configured summary cases covering commercial dishonour, traffic negligence, and municipal public nuisance.
- Three-Round Deliberation Architecture: Structured progression from independent stances to cross-rebuttal and Lead Jurist advisory synthesis.
- Offline Demo Fallback: Built-in fallback endpoint simulation via `?fallback=true` and `backend/fallback_demo.json` for resilience when the LLM service is offline or unconfigured.
- Interactive Round Explorer: Tabbed navigation in `frontend/src/App.jsx` allowing sequential inspection of Round 1, Round 2, and Round 3 statements.

## Project Structure

```
JURYX/
├── README.md
├── .gitignore
├── backend/
│   ├── .env.example
│   ├── app.py
│   ├── agents.py
│   ├── fallback_demo.json
│   └── requirements.txt
└── frontend/
    ├── index.html
    ├── package.json
    ├── vite.config.js
    ├── script.js
    ├── style.css
    └── src/
        ├── App.jsx
        ├── cases.js
        ├── index.css
        └── main.jsx
```

## Prerequisites

- Node.js 18 or later
- npm 9 or later
- Python 3.10 or later (to confirm)

## Setup and Running (Frontend)

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
```bash
cp .env.example .env
```
Note: Set `VITE_API_BASE_URL` in `.env` if targeting an external backend URL directly.

4. Start development server:
```bash
npm run dev
```
Note: Vite is fixed to port 5173 in frontend/vite.config.js. If that port is busy, Vite usually moves to 5174.

5. Build for production:
```bash
npm run build
```

## Backend Setup

The backend service runs a Flask application.

1. Navigate to the backend directory:
```bash
cd backend
```

2. Create and activate a virtual environment:
```bash
python3 -m venv venv
source venv/bin/activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Configure environment variables:
```bash
cp .env.example .env
```
Set `GEMINI_API_KEY` and `GEMINI_MODEL` in `backend/.env`.

5. Start the backend server on port 5000:
```bash
python app.py
```

## API Contract

Live AI deliberation is not yet connected; responses currently come from backend/fallback_demo.json.

Endpoint: `POST /api/deliberate` (optional query parameter: `?fallback=true`)

Request Body (passes selected case object):
```json
{
  "id": "CASE-IN-2024-001",
  "title": "Cheque Dishonour under Section 138 NI Act",
  "statute": "Negotiable Instruments Act, 1881 (Sec. 138/147)",
  "court": "Court of Metropolitan Magistrate (Special NI Act), Delhi",
  "complainant": "M/s Sharma Wholesale Electricals",
  "accused": "Rajesh Verma (Proprietor, Verma Electronics)",
  "disputed_amount": "₹45,000",
  "facts": "A cheque of ₹45,000 bounced due to 'Insufficient Funds'...",
  "questions_for_jury": [
    "Is the statutory presumption of debt under Section 139 rebutted?",
    "Is compounding or Lok Adalat referral appropriate rather than custodial sentencing?"
  ]
}
```

Response Body (JSON structure consumed by `frontend/src/App.jsx`):
```json
{
  "case_id": "CASE-IN-2024-001",
  "title": "Cheque Dishonour under Section 138 Negotiable Instruments Act",
  "summary": "M/s Sharma Traders v. Rajesh Verma for dishonoured cheque of INR 45,000...",
  "status": "completed",
  "round_1_initial": [
    {
      "juror_id": "analyst",
      "name": "The Analyst",
      "stance": "Liable",
      "confidence": 0.85,
      "opinion": "Bank memo confirms dishonour for 'Insufficient Funds'..."
    }
  ],
  "round_2_rebuttal": [
    {
      "juror_id": "analyst",
      "name": "The Analyst",
      "opinion": "In response to Skeptic: Ledger statements match invoice #4092..."
    }
  ],
  "round_3_synthesis": {
    "lead_jurist": "Lead Jurist",
    "advisory_verdict": "Compoundable Liability - Recommend Lok Adalat / Mediated Settlement",
    "consensus_level": "High (4/4 agreed on settlement preference)",
    "statutory_reference": "Section 138 & 147, Negotiable Instruments Act, 1881",
    "rationale": "All jurors concur that the factual ingredients of Section 138 are satisfied...",
    "recommended_remedy": "Direct respondent to pay principal INR 45,000 + 9% nominal interest across 3 monthly installments."
  }
}
```

## Connection Notes

- Vite proxies `/api` requests to `http://localhost:5000` as defined in `frontend/vite.config.js`.
- If calling the backend directly across origins via `VITE_API_BASE_URL`, the Flask backend must allow CORS from the frontend origin via `flask-cors`.
- When offline or when the Gemini API is unconfigured, the app falls back to `backend/fallback_demo.json` via the "Load Instant Demo (Fallback)" action or when `fallback=true` is supplied.

## Environment and Security

- Client-side environment variables prefixed with `VITE_` are public and embedded in client bundles.
- Secret API keys (such as `GEMINI_API_KEY`) must only be stored in `backend/.env` and never in frontend code.
- `.env` files are excluded from version control via `.gitignore`.

## Limitations

- Advisory Only: Designed solely for summary offenses. It cannot deliver binding judgments or replace judicial officer discretion.
- Local State Persistence: Selected case and active round states are maintained in browser session state only.
- Demonstration Scenarios: Sample cases provide illustration benchmarks and do not constitute formal legal counsel.

## Team

- System Architecture & Integration: TODO: name (Primary files: `backend/app.py`, `backend/fallback_demo.json`)
- Prompt Engineering (Rounds 1 & 2): TODO: name (Primary file: `backend/agents.py`)
- Prompt Engineering (Legal Alignment & Lead Jurist): TODO: name (Primary file: `backend/agents.py`)
- Frontend UI/UX (Case Selection): TODO: name (Primary files: `frontend/src/cases.js`, `frontend/src/App.jsx`)
- Frontend Deliberation Visualization: TODO: name (Primary files: `frontend/src/App.jsx`, `frontend/src/index.css`)

## License

TODO: license

## To confirm

- End-to-End Live LLM Generation: `backend/app.py` currently returns `fallback_demo.json` for live calls while agent prompt chaining in `backend/agents.py` is finalized. Confirm live multi-round LLM execution with the backend team.
- Gemini Model Availability: `backend/.env.example` specifies `GEMINI_MODEL=gemini-3.8-flash`; check this model name is available in Google's current Gemini model list.
- Python Version Requirement: `backend/requirements.txt` contains no version pins; verify minimum Python version required by dependencies.
- Statutory References: Verify Section 138/147 NI Act, Section 281 & 125(a) BNS / Section 279 & 337 IPC, Section 290 BNS / Section 290 IPC, Section 184 and 177 MV Act, and Section 260 CrPC / Section 283 BNSS with the legal team.
- Frontend Entry Point Coexistence: The frontend contains both a React scaffold (`frontend/src/App.jsx`) and a standalone static landing page (`frontend/index.html` + `frontend/script.js` + `frontend/style.css`). Confirm intended primary entry point.
- Team Member Names: Replace `TODO: name` with assigned contributors.
- Project License: Replace `TODO: license` with project license terms.
