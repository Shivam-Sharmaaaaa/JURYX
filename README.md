# JuryX

JuryX is an AI-assisted advisory jury panel for Indian summary offences under Section 260 CrPC / Section 283 BNSS. It provides non-binding advisory recommendations to assist judicial evaluation. Final judicial authority remains with the presiding magistrate.

## Overview

JuryX simulates a four-member advisory jury panel. Each juror evaluates the case through a distinct analytical lens:

- The Analyst: Scrutinizes timelines, physical artifacts, chain of custody, and forensic consistency (Role: Factual & Chronological Consistency).
- The Empath: Evaluates subjective intent (*mens rea*), socio-economic context, humanitarian factors, and mitigating circumstances (Role: Humanitarian & Socio-Economic Context).
- The Jurist: Evaluates statutory provisions (IPC/BNS, CrPC/BNSS, NI Act, MV Act) and relevant judicial precedents (Role: Indian Statutory Framework & Precedent).
- The Skeptic: Challenges evidentiary vulnerabilities, chain-of-custody defects, and contradictions in testimony (Role: Evidentiary Vulnerabilities & Contradictions).

Deliberation operates across two structured rounds:
1. Round 1 (Initial Evaluation): Each juror examines case facts independently and renders an initial vote, confidence rating, and reasoning.
2. Round 2 (Cross-Examination and Rebuttal): Jurors review each other's Round 1 arguments, challenge assumptions, and state updated or reaffirming positions.

## Workflow

1. Select a preset Indian summary case or enter custom case facts:
   - "State (Govt of NCT Delhi) vs. Ramesh Kumar" (Tag: `IPC 379 / BNS 303(2)`)
   - "M/s Agarwal Fabric Traders vs. Sunita Verma" (Tag: `NI Act Sec 138 / 139`)
   - "State (Delhi Traffic Police) vs. Vikram Singh" (Tag: `Motor Vehicles Act Sec 184 / 177`)
2. Initiate deliberation.
3. Observe live sequential arguments and counter-arguments across Round 1 and Round 2.
4. Review panel vote analytics, consensus outcome, confidence scores, evidence gaps, and disagreements.
5. Read the final advisory summary and statutory rationale.
6. Record the presiding magistrate review decision using the action buttons: "Approve Recommendation", "Modify Recommendation", or "Reject Recommendation", with optional judicial notes.
7. Download complete deliberation records and magistrate decisions as an audit JSON export.

## Features

- Preset and Custom Case Entry: Load pre-configured Indian summary cases or input custom case summaries and evidence dockets.
- Multi-Juror Two-Round Debate: Displays initial findings followed by adversarial rebuttals.
- Offline Demo Mode: Allows offline execution using local legal simulation datasets when backend services are unavailable.
- Consensus and HUNG_BENCH Handling: Identifies majority consensus (`GUILTY`, `NOT_GUILTY`) or flags split votes (`HUNG_BENCH`) with detailed dissent tracking.
- Magistrate Review Interface: Captures the judge's formal review action directly in the browser session. Review state is kept in the browser only.
- Audit Log Export: Generates downloadable JSON records containing case facts, votes, arguments, citations, and magistrate decisions.

## Tech Stack

Installed package versions from `package-lock.json`:

- `react`: `18.3.1`
- `react-dom`: `18.3.1`
- `lucide-react`: `0.460.0`
- `recharts`: `2.15.4`
- `vite`: `5.4.21`
- `@vitejs/plugin-react`: `4.7.0`
- `tailwindcss`: `3.4.19`
- `postcss`: `8.5.33`
- `autoprefixer`: `10.7.0`

## Project Structure

Frontend tree (`frontend/`):

```
frontend/
├── index.html
├── package.json
├── package-lock.json
├── postcss.config.js
├── tailwind.config.js
├── vite.config.js
├── .env.example
└── src/
    ├── main.jsx
    ├── App.jsx
    ├── index.css
    ├── components/
    │   ├── AuditLog.jsx
    │   ├── CaseInput.jsx
    │   ├── DebateFeed.jsx
    │   ├── FinalRecommendation.jsx
    │   ├── JurorCard.jsx
    │   ├── JurorGrid.jsx
    │   ├── LoadingState.jsx
    │   ├── MagistrateReview.jsx
    │   ├── Navbar.jsx
    │   └── VoteAnalytics.jsx
    ├── data/
    │   └── cases.js
    └── services/
        └── api.js
```

## Prerequisites

- Node.js 18.x or later
- npm 9.x or later
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

4. Start the development server:
```bash
npm run dev -- --port 3000
```
Note: Vite prints the actual local URL upon startup. If port 3000 is already in use by another process, Vite automatically increments to port 3001.

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

4. Configure environment variables in `.env`:
```
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_MODEL=gemini-3.8-flash
```

5. Start the backend server on port 5000:
```bash
python app.py
```

## API Contract

Endpoint: `POST /api/deliberate`

Request Body:
```json
{
  "case_text": "FIR #402/2024: Accused apprehended with stolen baby formula...",
  "use_fallback": false
}
```

Response Body:
```json
{
  "consensus": "NOT_GUILTY",
  "tally": {
    "guilty": 1,
    "not_guilty": 3
  },
  "rounds": [
    {
      "round": 1,
      "statements": [
        {
          "juror_id": "analyst",
          "juror_name": "The Analyst",
          "role": "Factual & Chronological Consistency",
          "round": 1,
          "vote": "GUILTY",
          "confidence": 88,
          "argument": "Unbroken chain of custody confirms item removal.",
          "cited_law": "Section 379 IPC / Section 303(2) BNS"
        }
      ]
    }
  ],
  "advisory_notice": "Advisory recommendation under Section 260 CrPC.",
  "evidence_gaps": [
    "CCTV timestamp missing entry corridor"
  ],
  "juror_disagreement": "Disagreement centered on necessity defense.",
  "deliberation_time_ms": 3420,
  "timestamp": "2026-11-22T00:00:00.000Z"
}
```

## Connection Notes

- Vite does not proxy `/api` requests by default.
- The frontend directly targets `http://localhost:5000` via `VITE_API_BASE_URL` defined in `src/services/api.js`.
- If the backend is unreachable or returns an error, the frontend can use Offline Demo Mode to run deliberations with local simulated data.

## Environment and Security

- Client-side environment variables prefixed with `VITE_` are exposed in browser bundles.
- API keys, such as `GEMINI_API_KEY`, must only be stored in backend `.env` configurations and never placed in client code.
- Case data handled in demo sessions remains in local browser memory and is not persisted to an external database.

## Limitations

- Advisory Only: Designed solely for summary offenses. It cannot deliver binding judgments or replace judicial officer discretion.
- Two-Round Frontend Display: Deliberation visualizer renders two deliberation rounds.
- Local State Persistence: Magistrate review decisions and custom docket inputs are maintained in browser session state only.
- Synthetic Datasets: Pre-configured cases provide demonstration scenarios and do not constitute formal legal counsel.

## Team

- Frontend Engineering: TODO: name
- AI Agents and Backend: TODO: name
- Legal Systems Advisory: TODO: name

## License

TODO: license

## To confirm

- Deliberation Rounds Discrepancy: `backend/app.py` comments describe three rounds including a "Lead Jurist synthesis & advisory verdict" with a fifth persona in `backend/agents.py`, whereas the frontend displays two rounds.
- Gemini Model Availability: `backend/.env.example` specifies `GEMINI_MODEL=gemini-3.8-flash`; check this model name is available in Google's current Gemini model list.
- Python Version Requirement: `backend/requirements.txt` contains no version pins; verify minimum Python version required by dependencies.
- Statutory References: Verify Section 260 CrPC, Section 283 BNSS, Section 138/139 NI Act, and Section 184/177 MV Act applicability with the legal team.
- Team Member Names: Replace `TODO: name` with assigned contributors.
- Project License: Replace `TODO: license` with project license terms.
