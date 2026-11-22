"""
JuryX — Backend Server & Multi-Agent Deliberation Pipeline

1. What this file does:
   Flask HTTP server for JuryX, an AI-assisted multi-agent advisory jury panel
   for Indian summary trial offences (Section 138 NI Act, minor BNS/IPC offences,
   petty theft, traffic violations, and municipal public nuisance). It handles HTTP
   routing, invokes the Google Gemini API using google-genai SDK, orchestrates
   the 3-round deliberation pipeline, and returns structured JSON to the frontend.

2. Routes exposed:
   GET  /health          — Server health and configuration status (alias: /api/health)
   GET  /api/health      — Route alias for /health
   GET  /api/cases       — Returns standard Indian summary test cases (from agents.py)
   POST /api/deliberate  — 3-round multi-agent AI deliberation pipeline (Rounds 1 & 2 parallel)
   POST /api/eligibility — Deterministic rule-based Indian law pre-screening (zero AI calls)

3. Pipeline sequence:
   Round 1: 4 agents executed in parallel (ThreadPoolExecutor, max_workers=4)
   Round 2: 4 agents executed in parallel (ThreadPoolExecutor, max_workers=4) with Round 1 context
   Round 3: Head Jurist single call synthesizing consensus and advisory recommendations
   On any exception: fallback_demo.json is returned cleanly with source="fallback"

4. Frontend contract:
   Always receives HTTP 200 (even on errors or fallback).
   The frontend checks the "source" field: "live" vs "fallback".
   "fallback_reason" field is present when source is "fallback".

5. Environment variables required:
   GEMINI_API_KEY — Google Gemini API key (required for live deliberation mode)
   GEMINI_MODEL   — Target Gemini model name, default: gemini-3.5-flash-lite
   PORT           — Flask server port, default: 5000
   FLASK_DEBUG    — Set to "true" for debug mode, default: false
"""

import os
import re
import json
import time
import concurrent.futures
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from dotenv import load_dotenv

# Check 1: Google GenAI SDK imports (no deprecated google.generativeai)
from google import genai
from google.genai import types

# Check 2 & 3: Safe Module Contract from agents.py
from agents import JURORS, HEAD_JUROR, SAMPLE_CASES

try:
    from agents import (
        build_round1_prompt,
        build_round2_prompt,
        build_round3_prompt
    )
except ImportError:
    # Built-in default prompt builders using JURORS and HEAD_JUROR
    _JUROR_BY_ID = {j["id"]: j for j in JURORS}
    _JUROR_BY_ID["lead_jurist"] = HEAD_JUROR

    def _format_r1_text(round1_transcript: dict) -> str:
        lines = []
        for k, v in round1_transcript.items():
            juror = _JUROR_BY_ID.get(k, {})
            name = juror.get("name", k.capitalize())
            stance = v.get("stance", "N/A")
            conf = v.get("confidence", 0)
            rationale = v.get("rationale", "")
            lines.append(f"- {name} (Stance: {stance}, Confidence: {conf}): {rationale}")
        return "\n".join(lines) if lines else "No prior Round 1 opinions."

    def _format_r2_text(round2_transcript: dict) -> str:
        lines = []
        for k, v in round2_transcript.items():
            juror = _JUROR_BY_ID.get(k, {})
            name = juror.get("name", k.capitalize())
            rev_stance = v.get("revised_stance", "N/A")
            rationale = v.get("revised_rationale", "")
            lines.append(f"- {name} (Revised Stance: {rev_stance}): {rationale}")
        return "\n".join(lines) if lines else "No prior Round 2 rebuttals."

    def build_round1_prompt(agent_id: str, case_facts: str, case_type: str) -> str:
        juror = _JUROR_BY_ID.get(agent_id)
        if not juror:
            return ""
        return (
            f"{juror['system_prompt']}\n\n"
            f"CASE TYPE: {case_type}\n"
            f"CASE FACTS:\n{case_facts}\n\n"
            "TASK:\n"
            "Provide your initial evaluation strictly under 75 words.\n"
            "Return ONLY valid JSON matching this schema:\n"
            "{\n"
            '  "stance": "liable" | "not_liable" | "compoundable" | "needs_more_evidence",\n'
            '  "confidence": <float between 0.0 and 1.0>,\n'
            '  "rationale": "<concise analysis under 70 words>",\n'
            '  "statutory_references": ["<statute or section e.g. NI Act Sec 138>"]\n'
            "}"
        )

    def build_round2_prompt(agent_id: str, case_facts: str, round1_transcript: dict, case_type: str) -> str:
        juror = _JUROR_BY_ID.get(agent_id)
        if not juror:
            return ""
        r1_text = _format_r1_text(round1_transcript)
        return (
            f"{juror['system_prompt']}\n\n"
            f"CASE TYPE: {case_type}\n"
            f"CASE FACTS:\n{case_facts}\n\n"
            f"ROUND 1 TRANSCRIPT:\n{r1_text}\n\n"
            "TASK:\n"
            "Review your peers' initial stances. Point out evidentiary gaps, statutory nuances, or mitigating realities.\n"
            "State whether your stance shifted. Keep response strictly under 85 words.\n"
            "Return ONLY valid JSON matching this schema:\n"
            "{\n"
            '  "rebuttals": [\n'
            "    {\n"
            '      "target_juror": "analyst" | "empath" | "jurist" | "skeptic",\n'
            '      "argument": "<concise challenge or concurrence under 35 words>"\n'
            "    }\n"
            "  ],\n"
            '  "revised_stance": "liable" | "not_liable" | "compoundable" | "needs_more_evidence",\n'
            '  "revised_confidence": <float between 0.0 and 1.0>,\n'
            '  "revised_rationale": "<concise revised reasoning under 75 words>"\n'
            "}"
        )

    def build_round3_prompt(case_facts: str, round1_transcript: dict, round2_transcript: dict, case_type: str) -> str:
        r1_text = _format_r1_text(round1_transcript)
        r2_text = _format_r2_text(round2_transcript)
        return (
            f"{HEAD_JUROR['system_prompt']}\n\n"
            f"CASE TYPE: {case_type}\n"
            f"CASE FACTS:\n{case_facts}\n\n"
            f"ROUND 1 INITIAL DELIBERATION:\n{r1_text}\n\n"
            f"ROUND 2 REBUTTALS & CONVERSIONS:\n{r2_text}\n\n"
            "TASK:\n"
            "Synthesize the panel debate into an actionable advisory opinion for the Judicial Magistrate.\n"
            "Keep response strictly under 170 words.\n"
            "Return ONLY valid JSON matching this schema:\n"
            "{\n"
            '  "verdict": "guilty" | "not_guilty" | "compounding_recommended" | "lok_adalat_referral" | "needs_more_evidence",\n'
            '  "consensus_level": "unanimous" | "majority_3_1" | "split_2_2",\n'
            '  "advisory_note": "<balanced summary of consensus, friction, and legal basis under 100 words>",\n'
            '  "remedy_or_sentencing": "<specific restitution, compounding terms, or statutory disposition under 60 words>"\n'
            "}"
        )

# ── Setup ──────────────────────────────────────────────────────────────────────
dotenv_path = os.path.join(os.path.dirname(__file__), ".env")
load_dotenv(dotenv_path)

# Flask app initialization with CORS enabled and static frontend serving
FRONTEND_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "frontend"))
app = Flask(__name__, static_folder=FRONTEND_DIR, static_url_path="")
CORS(app)

# Gemini Client and Model setup
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
GEMINI_MODEL = os.getenv("GEMINI_MODEL", "gemini-3.5-flash-lite")
client = genai.Client(api_key=GEMINI_API_KEY) if GEMINI_API_KEY else None

# Fallback path for live pitch resilience
FALLBACK_PATH = os.path.join(os.path.dirname(__file__), "fallback_demo.json")

# Item 1: Prevent JSON Truncation (600 tokens for jurors, 900 for lead)
JUROR_CONFIG = types.GenerateContentConfig(
    response_mime_type="application/json",
    max_output_tokens=600,
    temperature=0.2
)

LEAD_CONFIG = types.GenerateContentConfig(
    response_mime_type="application/json",
    max_output_tokens=900,
    temperature=0.2
)


def _parse_llm_json(raw: str) -> dict:
    """
    Robust JSON parser for LLM outputs:
    1. Strips markdown fences (```json ... ```)
    2. Strips illegal trailing commas before closing braces/brackets
    3. Recovers JSON objects embedded inside conversational prose
    """
    cleaned = raw.strip()
    if cleaned.startswith("```json"):
        cleaned = cleaned[7:]
    elif cleaned.startswith("```"):
        cleaned = cleaned[3:]
    if cleaned.endswith("```"):
        cleaned = cleaned[:-3]
    cleaned = cleaned.strip()

    # Step 1: Direct JSON parsing
    try:
        return json.loads(cleaned)
    except json.JSONDecodeError:
        pass

    # Step 2: Strip trailing commas (e.g. [1, 2,] or {"a": 1,})
    no_trailing = re.sub(r",\s*([\]}])", r"\1", cleaned)
    try:
        return json.loads(no_trailing)
    except json.JSONDecodeError:
        pass

    # Step 3: Extract from first '{' to last '}'
    start = no_trailing.find("{")
    end = no_trailing.rfind("}")
    if start != -1 and end != -1 and end > start:
        inner = no_trailing[start:end + 1]
        try:
            return json.loads(inner)
        except json.JSONDecodeError:
            inner_clean = re.sub(r",\s*([\]}])", r"\1", inner)
            return json.loads(inner_clean)

    raise ValueError(f"Could not parse valid JSON from LLM response: {raw[:160]}")


def call_gemini(prompt: str, config: types.GenerateContentConfig = None, retries: int = 3) -> dict:
    """
    Calls the Gemini API enforcing JSON output via response_mime_type="application/json".
    Includes exponential backoff retry for rate-limiting and temporary demand spikes (429, 503).
    """
    global client
    if client is None:
        key = os.getenv("GEMINI_API_KEY")
        if key:
            client = genai.Client(api_key=key)
        else:
            raise RuntimeError("No API key configured — set GEMINI_API_KEY in .env")

    last_error = None
    for attempt in range(retries + 1):
        try:
            response = client.models.generate_content(
                model=GEMINI_MODEL,
                contents=prompt,
                config=config or JUROR_CONFIG
            )
            raw = response.text.strip() if response and response.text else ""
            if not raw:
                raise ValueError("Empty response text from Gemini API")

            return _parse_llm_json(raw)

        except Exception as e:
            last_error = e
            err_str = str(e).lower()
            transient_signals = ["429", "rate", "quota", "resource", "503", "unavailable", "demand", "overload", "500", "internal"]
            if any(s in err_str for s in transient_signals) and attempt < retries:
                wait_time = (2 ** attempt) + 0.5
                print(f"[JuryX] Transient API issue encountered (attempt {attempt + 1}/{retries + 1}), backing off {wait_time}s...")
                time.sleep(wait_time)
            else:
                raise e

    raise last_error if last_error else RuntimeError("Gemini call failed")


def load_fallback() -> dict:
    """
    Loads fallback_demo.json for resilient hackathon demonstrations.
    If missing or corrupted, returns a minimal hardcoded dictionary.
    Always ensures source="fallback".
    """
    try:
        if os.path.exists(FALLBACK_PATH):
            with open(FALLBACK_PATH, "r", encoding="utf-8") as f:
                data = json.load(f)
                data["source"] = "fallback"
                if "round_1_initial" not in data:
                    data["round_1_initial"] = []
                if "round_2_rebuttal" not in data:
                    data["round_2_rebuttal"] = []
                if "round_3_synthesis" not in data:
                    data["round_3_synthesis"] = {
                        "lead_jurist": "The Lead Jurist",
                        "consensus_level": "Majority Consensus",
                        "advisory_verdict": "Needs More Evidence",
                        "statutory_reference": "Section 138 NI Act",
                        "rationale": "Advisory synthesis unavailable.",
                        "recommended_remedy": "Further inquiry required"
                    }
                return data
    except Exception as e:
        print(f"[JuryX] Error reading fallback file: {e}")

    return {
        "source": "fallback",
        "error": "Fallback file missing or corrupted",
        "round1": {},
        "round2": {},
        "round3": {
            "verdict": "needs_more_evidence",
            "advisory_note": "System fallback activated. Please retry."
        },
        "round_1_initial": [],
        "round_2_rebuttal": [],
        "round_3_synthesis": {
            "lead_jurist": "The Lead Jurist",
            "consensus_level": "N/A",
            "advisory_verdict": "Needs More Evidence",
            "statutory_reference": "N/A",
            "rationale": "System fallback activated. Please retry.",
            "recommended_remedy": "N/A"
        }
    }


# Item 2: Track failures and trigger fallback if ALL jurors fail in Round 1
def run_round1_parallel(case_facts: str, case_type: str) -> dict:
    """
    Runs all 4 Round 1 agents IN PARALLEL using ThreadPoolExecutor.
    If ALL jurors fail, raises RuntimeError to trigger global fallback cleanly.
    """
    round1_transcript = {}
    failed_count = 0
    total_agents = 0

    with concurrent.futures.ThreadPoolExecutor(max_workers=4) as executor:
        future_to_agent = {}
        for juror in JURORS:
            agent_id = juror["id"]
            prompt = build_round1_prompt(agent_id, case_facts, case_type)
            if not prompt:
                continue
            total_agents += 1
            future = executor.submit(call_gemini, prompt, JUROR_CONFIG)
            future_to_agent[future] = agent_id

        for future in concurrent.futures.as_completed(future_to_agent):
            agent_id = future_to_agent[future]
            try:
                res = future.result(timeout=30)
                if isinstance(res, dict):
                    norm_res = {k.lower(): v for k, v in res.items()}
                    for k, v in norm_res.items():
                        if k not in res:
                            res[k] = v
                round1_transcript[agent_id] = res
            except Exception as e:
                failed_count += 1
                print(f"[JuryX] Juror '{agent_id}' Round 1 failed: {e}")
                round1_transcript[agent_id] = {
                    "stance": "needs_more_evidence",
                    "confidence": 0,
                    "rationale": "Agent response unavailable.",
                    "statutory_references": []
                }

    if total_agents > 0 and failed_count >= total_agents:
        raise RuntimeError("All jurors failed in Round 1 deliberation")

    return round1_transcript


# Item 2: Track failures and trigger fallback if ALL jurors fail in Round 2
def run_round2_parallel(case_facts: str, case_type: str, round1_transcript: dict) -> dict:
    """
    Runs all 4 Round 2 agents IN PARALLEL using ThreadPoolExecutor.
    If ALL jurors fail, raises RuntimeError to trigger global fallback cleanly.
    """
    round2_transcript = {}
    failed_count = 0
    total_agents = 0

    with concurrent.futures.ThreadPoolExecutor(max_workers=4) as executor:
        future_to_agent = {}
        for juror in JURORS:
            agent_id = juror["id"]
            prompt = build_round2_prompt(agent_id, case_facts, round1_transcript, case_type)
            if not prompt:
                continue
            total_agents += 1
            future = executor.submit(call_gemini, prompt, JUROR_CONFIG)
            future_to_agent[future] = agent_id

        for future in concurrent.futures.as_completed(future_to_agent):
            agent_id = future_to_agent[future]
            try:
                res = future.result(timeout=30)
                if isinstance(res, dict):
                    norm_res = {k.lower(): v for k, v in res.items()}
                    for k, v in norm_res.items():
                        if k not in res:
                            res[k] = v
                round2_transcript[agent_id] = res
            except Exception as e:
                failed_count += 1
                print(f"[JuryX] Juror '{agent_id}' Round 2 failed: {e}")
                round2_transcript[agent_id] = {
                    "rebuttals": [],
                    "revised_stance": "needs_more_evidence",
                    "revised_confidence": 0,
                    "revised_rationale": "Agent response unavailable."
                }

    if total_agents > 0 and failed_count >= total_agents:
        raise RuntimeError("All jurors failed in Round 2 deliberation")

    return round2_transcript


def detect_case_type(body: dict, case_facts: str) -> str:
    """Auto-detects Indian summary trial case type from request attributes and text."""
    raw_type = body.get("case_type")
    if raw_type and isinstance(raw_type, str) and raw_type.strip() and raw_type.strip().lower() != "general":
        return raw_type.strip().lower()

    combined = f"{body.get('title', '')} {body.get('statute', '')} {case_facts}".lower()
    if "138" in combined or "cheque" in combined or "dishonour" in combined:
        return "cheque_dishonour"
    elif "theft" in combined or "303" in combined or "stolen" in combined:
        return "theft"
    elif "traffic" in combined or "mva" in combined or "driving" in combined or "281" in combined or "279" in combined:
        return "traffic"
    elif "nuisance" in combined or "encroachment" in combined or "municipal" in combined:
        return "municipal"
    elif "breach of trust" in combined or "316" in combined:
        return "breach_of_trust"
    elif "cheating" in combined or "318" in combined:
        return "cheating"
    return "general"


def _parse_amount(raw_val):
    """Safely extracts a numeric float from int, float, or currency string e.g. '₹45,000'."""
    if isinstance(raw_val, (int, float)):
        return float(raw_val)
    if isinstance(raw_val, str):
        cleaned = "".join(c for c in raw_val if c.isdigit() or c == ".")
        if cleaned:
            try:
                return float(cleaned)
            except ValueError:
                pass
    return None


def _format_rebuttal_entry(r) -> str:
    """Formats an individual rebuttal entry across all schema iterations."""
    if not isinstance(r, dict):
        return str(r)
    target = r.get("target_agent") or r.get("target_juror") or ""
    chal = r.get("challenge") or r.get("argument") or ""
    cntr = r.get("counter_point", "")
    parts = []
    if target:
        parts.append(f"To {target}:")
    if chal:
        parts.append(chal)
    if cntr:
        parts.append(f"(Counter: {cntr})")
    return " ".join(parts)


# ══════════════════════════════════════════════════════════════════════════════
#  ROUTES
# ══════════════════════════════════════════════════════════════════════════════

@app.route("/", methods=["GET"])
def index():
    """Serves the frontend application."""
    if os.path.exists(os.path.join(FRONTEND_DIR, "index.html")):
        return send_from_directory(FRONTEND_DIR, "index.html")
    return jsonify({
        "service": "JuryX Deliberation API",
        "status": "online",
        "health": "/health",
        "cases": "/api/cases"
    }), 200


# Item 4: Support both /health and /api/health
@app.route("/health", methods=["GET"])
@app.route("/api/health", methods=["GET"])
def health():
    """Returns server and configuration health status."""
    return jsonify({
        "status": "ok",
        "api_key_set": bool(GEMINI_API_KEY),
        "model": GEMINI_MODEL,
        "jurors_count": len(JURORS),
        "head_juror": HEAD_JUROR.get("name"),
        "fallback_available": os.path.exists(FALLBACK_PATH)
    }), 200


@app.route("/api/cases", methods=["GET"])
def get_cases():
    """Returns standard Indian summary test cases loaded from agents.py."""
    return jsonify(SAMPLE_CASES), 200


@app.route("/api/deliberate", methods=["POST"])
def deliberate():
    """
    Main deliberation endpoint:
    - Validates request body
    - Supports use_fallback flag for instantaneous, zero-network live pitches
    - Executes Round 1 (Parallel - 4 agents)
    - Executes Round 2 (Parallel - 4 agents)
    - Executes Round 3 (Head Jurist synthesis)
    - Cleanly falls back to fallback_demo.json on total round failures or outages
    """
    body = request.get_json(silent=True)
    if not isinstance(body, dict):
        if request.form:
            body = request.form.to_dict()
        else:
            return jsonify({"error": "Invalid request body"}), 400

    # Item 4: Demo Resilience — allow immediate fallback demo data if requested
    if body.get("use_fallback") is True or request.args.get("fallback", "").lower() in ["true", "1"]:
        fallback = load_fallback()
        fallback["source"] = "fallback"
        fallback["fallback_reason"] = "Explicit fallback requested by client"
        return jsonify(fallback), 200

    case_facts = body.get("case_facts") or body.get("facts")
    if not case_facts or not isinstance(case_facts, str) or not case_facts.strip():
        return jsonify({"error": "case_facts or facts is required"}), 400

    case_facts = case_facts.strip()
    case_type = detect_case_type(body, case_facts)

    try:
        pipeline_start = time.time()

        # Round 1 — 4 jurors in parallel
        round1_transcript = run_round1_parallel(case_facts, case_type)

        # Round 2 — 4 jurors in parallel
        round2_transcript = run_round2_parallel(case_facts, case_type, round1_transcript)

        # Round 3 — Head Jurist single call
        round3_prompt = build_round3_prompt(case_facts, round1_transcript, round2_transcript, case_type)
        round3_result = call_gemini(round3_prompt, LEAD_CONFIG)

        if isinstance(round3_result, dict):
            norm_r3 = {k.lower(): v for k, v in round3_result.items()}
            for k, v in norm_r3.items():
                if k not in round3_result:
                    round3_result[k] = v

        # Key normalization for cross-compatibility
        if "remedy" in round3_result and "remedy_or_sentencing" not in round3_result:
            round3_result["remedy_or_sentencing"] = round3_result["remedy"]
        elif "remedy_or_sentencing" in round3_result and "remedy" not in round3_result:
            round3_result["remedy"] = round3_result["remedy_or_sentencing"]

        if "consensus_score" in round3_result and "consensus_level" not in round3_result:
            score = round3_result["consensus_score"]
            if score >= 100:
                round3_result["consensus_level"] = "unanimous"
            elif score >= 75:
                round3_result["consensus_level"] = "majority_3_1"
            elif score >= 50:
                round3_result["consensus_level"] = "split_2_2"
            else:
                round3_result["consensus_level"] = "split_dissent"
        elif "consensus_level" in round3_result and "consensus_score" not in round3_result:
            lvl = str(round3_result["consensus_level"]).lower()
            if "unanimous" in lvl or "4/4" in lvl:
                round3_result["consensus_score"] = 100
            elif "3_1" in lvl or "3/4" in lvl or "majority" in lvl:
                round3_result["consensus_score"] = 75
            elif "2_2" in lvl or "split" in lvl:
                round3_result["consensus_score"] = 50
            else:
                round3_result["consensus_score"] = 25

        elapsed = round(time.time() - pipeline_start, 2)
        print(f"[JuryX] Multi-agent deliberation completed in {elapsed}s")

        # Format round_1_initial for React frontend App.jsx
        round_1_initial = []
        for juror in JURORS:
            jid = juror["id"]
            info = round1_transcript.get(jid, {})
            raw_stance = str(info.get("stance") or "Needs More Evidence").replace("_", " ").title()
            round_1_initial.append({
                "juror_id": jid,
                "name": juror.get("name", jid.capitalize()),
                "stance": raw_stance,
                "confidence": info.get("confidence", 0),
                "opinion": info.get("rationale") or info.get("opinion", "")
            })

        # Format round_2_rebuttal for React frontend App.jsx
        round_2_rebuttal = []
        for juror in JURORS:
            jid = juror["id"]
            info = round2_transcript.get(jid, {})
            rebuttals_list = info.get("rebuttals", [])
            reb_parts = [_format_rebuttal_entry(r) for r in rebuttals_list if r]
            reb_summary = " ".join(reb_parts)
            revised_rationale = info.get("revised_rationale") or info.get("rationale", "")
            opinion = f"{reb_summary} {revised_rationale}".strip() or revised_rationale or "Stance maintained."
            round_2_rebuttal.append({
                "juror_id": jid,
                "name": juror.get("name", jid.capitalize()),
                "revised_stance": str(info.get("revised_stance") or "Needs More Evidence").replace("_", " ").title(),
                "revised_confidence": info.get("revised_confidence", 0),
                "opinion": opinion
            })

        # Format round_3_synthesis for React frontend App.jsx
        score_val = round3_result.get("consensus_score")
        score_suffix = f" ({score_val}% Consensus)" if score_val is not None else ""
        consensus_text = f"{str(round3_result.get('consensus_level', 'Majority Consensus')).replace('_', ' ').title()}{score_suffix}".strip()

        stat_basis = round3_result.get("statutory_basis")
        if isinstance(stat_basis, list) and stat_basis:
            stat_reference = ", ".join(str(s) for s in stat_basis)
        else:
            jurist_refs = round1_transcript.get("jurist", {}).get("statutory_references", [])
            stat_reference = ", ".join(str(s) for s in jurist_refs) if jurist_refs else "Indian Summary Trial Provisions"

        round_3_synthesis = {
            "lead_jurist": HEAD_JUROR.get("name", "The Lead Jurist"),
            "consensus_level": consensus_text,
            "advisory_verdict": str(round3_result.get("verdict", "Advisory Recommendation")).replace("_", " ").title(),
            "statutory_reference": stat_reference,
            "rationale": round3_result.get("advisory_note") or round3_result.get("dissent_summary", ""),
            "recommended_remedy": round3_result.get("remedy") or round3_result.get("remedy_or_sentencing", "")
        }

        return jsonify({
            "source": "live",
            "case_type": case_type,
            # Dual-compatible schemas (evaluators & React frontend UI):
            "round1": round1_transcript,
            "round2": round2_transcript,
            "round3": round3_result,
            "round_1_initial": round_1_initial,
            "round_2_rebuttal": round_2_rebuttal,
            "round_3_synthesis": round_3_synthesis,
            "pipeline_time_seconds": elapsed
        }), 200

    except Exception as e:
        # Item 2: Clean fallback on ANY failure (including total round failure)
        print(f"[JuryX] Pipeline exception: {e} — returning fallback demo data")
        fallback = load_fallback()
        fallback["source"] = "fallback"
        fallback["fallback_reason"] = str(e)
        return jsonify(fallback), 200


@app.route("/api/eligibility", methods=["POST"])
def eligibility():
    """
    Pure Python rule-based pre-screening for Indian summary trial eligibility.
    Zero AI calls — applies BNSS, NI Act, and LASA rules deterministically.
    """
    body = request.get_json(silent=True)
    if not isinstance(body, dict):
        if request.form:
            body = request.form.to_dict()
        else:
            return jsonify({"error": "Invalid request body"}), 400

    ELIGIBILITY_RULES = {
        "cheque_dishonour": {
            "compoundable": True,
            "compounding_provision": "NI Act Sec 147",
            "lok_adalat_eligible": True,
            "lok_adalat_provision": "LASA Sec 20 — Permanent Lok Adalat",
            "summary_trial_applicable": True,
            "summary_trial_provision": "BNSS Sec 283",
            "notes": "Compounding requires full payment of cheque amount. Lok Adalat preferred for amounts under Rs 20,00,000."
        },
        "theft": {
            "compoundable": True,
            "compounding_provision": "BNSS Sec 290 — First Schedule (BNS 303 compoundable with victim consent)",
            "lok_adalat_eligible": True,
            "lok_adalat_provision": "LASA Sec 20",
            "summary_trial_applicable": True,
            "summary_trial_provision": "BNSS Sec 283 — BNS 303 carries up to 3 years",
            "notes": "Compounding only with permission of court and victim consent."
        },
        "traffic": {
            "compoundable": True,
            "compounding_provision": "MVA — designated traffic offences compoundable via e-challan",
            "lok_adalat_eligible": False,
            "lok_adalat_provision": "Not applicable — traffic fines are statutory fixed penalties",
            "summary_trial_applicable": True,
            "summary_trial_provision": "BNSS Sec 283 — MVA offences generally under 3 years",
            "notes": "Most traffic violations are compoundable on-spot or via motor accident claims tribunal."
        },
        "breach_of_trust": {
            "compoundable": True,
            "compounding_provision": "BNSS Sec 290 — First Schedule (BNS 316 compoundable with victim consent)",
            "lok_adalat_eligible": True,
            "lok_adalat_provision": "LASA Sec 20",
            "summary_trial_applicable": True,
            "summary_trial_provision": "BNSS Sec 283 — BNS 316 carries up to 3 years",
            "notes": "Court permission required for compounding."
        },
        "cheating": {
            "compoundable": True,
            "compounding_provision": "BNSS Sec 290 — First Schedule (BNS 318 compoundable with victim consent)",
            "lok_adalat_eligible": True,
            "lok_adalat_provision": "LASA Sec 20",
            "summary_trial_applicable": True,
            "summary_trial_provision": "BNSS Sec 283 — BNS 318 carries up to 3 years",
            "notes": "BNS 320 (cheating inducing delivery, up to 7 years) is NOT summarily triable."
        },
        "municipal": {
            "compoundable": True,
            "compounding_provision": "Respective municipal act — most municipal violations are compoundable",
            "lok_adalat_eligible": True,
            "lok_adalat_provision": "LASA Sec 19 — Lok Adalat at district level",
            "summary_trial_applicable": True,
            "summary_trial_provision": "BNSS Sec 283 — municipal offences generally under 3 years",
            "notes": "Check specific municipal corporation act for compounding limits."
        },
        "general": {
            "compoundable": None,
            "compounding_provision": "Refer BNSS Sec 290 First Schedule for specific offence",
            "lok_adalat_eligible": None,
            "lok_adalat_provision": "LASA Sec 20 — subject to offence type",
            "summary_trial_applicable": None,
            "summary_trial_provision": "BNSS Sec 283 — applicable if offence carries up to 3 years",
            "notes": "Cannot determine eligibility without specific case_type."
        }
    }

    case_facts_text = body.get("case_facts") or body.get("facts") or ""
    case_type = detect_case_type(body, case_facts_text)
    raw_amount = body.get("claim_amount") if body.get("claim_amount") is not None else body.get("disputed_amount")
    parsed_amount = _parse_amount(raw_amount)
    claim_amount = parsed_amount if parsed_amount is not None else (raw_amount or 0)

    rules = ELIGIBILITY_RULES.get(case_type, ELIGIBILITY_RULES["general"])

    response = {
        "case_type": case_type,
        "claim_amount": claim_amount,
        "compoundable": rules["compoundable"],
        "compounding_provision": rules["compounding_provision"],
        "lok_adalat_eligible": rules["lok_adalat_eligible"],
        "lok_adalat_provision": rules["lok_adalat_provision"],
        "summary_trial_applicable": rules["summary_trial_applicable"],
        "summary_trial_provision": rules["summary_trial_provision"],
        "notes": rules["notes"],
        "disclaimer": "This is a rule-based pre-screening output. It does not constitute legal advice."
    }

    if case_type == "cheque_dishonour":
        if parsed_amount is not None and 0 < parsed_amount <= 2000000:
            response["lok_adalat_amount_check"] = "Eligible — claim within Permanent Lok Adalat limit of Rs 20,00,000"
        elif parsed_amount is not None and parsed_amount > 2000000:
            response["lok_adalat_amount_check"] = "Review required — claim exceeds typical Permanent Lok Adalat limit"
        else:
            response["lok_adalat_amount_check"] = "Amount not provided — eligibility assumed"

    return jsonify(response), 200


if __name__ == "__main__":
    port = int(os.getenv("PORT", 5000))
    debug = os.getenv("FLASK_DEBUG", "false").lower() == "true"
    print(f"[JuryX] Starting server on port {port}")
    print(f"[JuryX] Model: {GEMINI_MODEL}")
    print(f"[JuryX] API key set: {bool(GEMINI_API_KEY)}")
    print(f"[JuryX] Jurors loaded: {len(JURORS)}")
    app.run(host="0.0.0.0", port=port, debug=debug)
