# JuryX — Professional AI Judicial Decision Support Dashboard

An AI-assisted judicial decision-support platform tailored for **Indian Summary Courts** (under Section 260 CrPC / Section 283 BNSS). 

JuryX convenes four specialized AI judicial evaluators to deliberate cases across two sequential rounds before delivering a structured advisory recommendation. A human magistrate always retains sovereign final authority under Article 235 of the Constitution of India.

---

## 🏛️ The Four AI Jurors

| Evaluator | Persona & Icon | Primary Analytical Mandate |
| :--- | :--- | :--- |
| **The Analyst** | 🔍 Search | Examines facts, chronological consistency, physical evidence, and forensic integrity. |
| **The Empath** | 🤝 HeartHandshake | Evaluates subjective intent (*mens rea*), socio-economic duress, and rehabilitative suitability. |
| **The Jurist** | ⚖️ Scale | Applies Indian statutory law (IPC/BNS, CrPC/BNSS, NI Act, MV Act) and binding appellate precedents. |
| **The Skeptic** | 🛡️ ShieldAlert | Identifies evidentiary deficiencies, gaps in chain of custody, and uncorroborated allegations. |

---

## 🎨 Design System & Legal-Tech SaaS Aesthetic

- **Theme**:
  - Main Background: `#FAF9F6` (Parchment white)
  - Cards: `#FFFFFF`
  - Primary Emerald: `#10B981` / Dark Green: `#064E3B`
  - Text: Main `#1F2937`, Secondary `#6B7280`
  - Borders: `#E5E7EB`
  - Verdict Indicators: Guilty (`#DC2626` muted red), Not Guilty (`#10B981` emerald green)
- **Typography**: Inter (Body), Newsreader (Judicial headings), JetBrains Mono (Statutory citations & metrics)
- **Geometry**: Subtle rounded cards (12–16px), soft shadows, clean borders.

---

## 🚀 Key Modules & Capabilities

1. **Top Navigation**:
   - JuryX seal logo with minimal scales-of-justice.
   - Statutory badges: `SUMMARY OFFENCES ONLY` & `ADVISORY ONLY — NOT BINDING`.
   - Views: **Dashboard**, **Cases Repository**, and **Audit Logs**.
   - **Offline Demo Mode Toggle**: Seamlessly switches between live Flask API and built-in offline legal precedent simulations.

2. **Case Docket Submission**:
   - 3 Pre-configured summary cases:
     1. **Petty Theft** (IPC 379 / BNS 303(2) — Theft of baby formula under severe distress).
     2. **NI Act 138 — Cheque Bounce** (Dishonour with rebuttal of presumption under Sec 139).
     3. **Traffic Violation** (Section 184 MV Act — Emergency defense of necessity under Sec 81 IPC).
   - Custom case entry with title, summary FIR/facts, and evidence/defense details.
   - Clear Docket and Start Deliberation actions.

3. **Four AI Juror Evaluation Cards**:
   - Displays real-time status (`Waiting`, `Analysing`, `Completed`), current vote, confidence metric bar, and cited statutory provisions.

4. **Courtroom Deliberation Feed (Core Section)**:
   - Modern conversation timeline with individual juror statement cards.
   - **Round 1**: Initial independent legal and factual analysis.
   - **Round 2**: Cross-deliberation and peer rebuttals.
   - Progressive statement reveal with smooth animations simulating a live courtroom exchange.
   - Quick-forward button to skip animation and review full transcript instantly.

5. **Vote Analytics & Deliberation Shift**:
   - Numerical tally (Guilty, Not Guilty, Total Jurors).
   - Horizontal animated vote distribution bar.
   - **Initial vs. Final Vote Comparison**: Tracks which jurors shifted or maintained their votes post-cross-examination.
   - Resolves tied votes as `HUNG_BENCH`.

6. **Final Advisory Recommendation**:
   - Prominent verdict banner with explicit statutory warning (`AI-GENERATED ADVISORY RECOMMENDATION — NOT A COURT JUDGMENT`).
   - Juror disagreement / dissent synthesis.
   - Key arguments from prosecution and defence.
   - Critical evidentiary deficiencies flagged for judicial inquiry.

7. **Magistrate Bench Review**:
   - Human-in-the-loop judicial determination:
     - **Approve Advisory**
     - **Modify with Directions** (Modal to record probation, community service, or compounding conditions)
     - **Reject Recommendation**
   - Records magistrate order sheet entry in frontend state.

8. **Cryptographic Judicial Audit Trail**:
   - Generates complete JSON audit report adhering to legal-tech audit standards.
   - Downloads via browser **Blob API** as `juryx_audit_report.json`.

---

## 🔌 Backend Integration

- **Endpoint**: `POST http://localhost:5000/api/deliberate`
- **Request Body**:
  ```json
  {
    "case_text": "Case details...",
    "use_fallback": false
  }
  ```
- **Environment Variable**: `VITE_API_BASE_URL=http://localhost:5000`

---

## 🛠️ Development & Execution

```bash
# Navigate to project folder
cd /Users/shubhamsaini/.gemini/antigravity/scratch/juryx

# Start local Vite development server
npm run dev

# Build production bundle
npm run build
```
