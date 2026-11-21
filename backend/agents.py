"""
agents.py - Prompt Library & Legal Knowledge Base for JuryX

This module serves as the prompt engine and legal grounding foundation for JuryX,
an AI-assisted multi-agent advisory jury panel for Indian summary trial offences.
It defines agent personas, a verified legal reference bank (compressed statutory
provisions), verified precedents, and builds calibrated prompt strings across three
structured deliberation rounds.

Zero external dependencies — Python stdlib only. Python 3.10+ compatible.
No API calls, no Flask, no HTTP handling.

1. WHAT THIS FILE DOES:
   - Provides immutable juror personas: The Analyst, The Empath, The Jurist,
     The Skeptic, and The Lead Jurist.
   - Houses a verified legal reference bank under modern Indian criminal statutes:
     Bharatiya Nyaya Sanhita, 2023 (BNS), Bharatiya Nagarik Suraksha Sanhita, 2023
     (BNSS), Bharatiya Sakshya Adhiniyam, 2023 (BSA), Negotiable Instruments Act,
     1881 (NI Act), Constitution of India, Legal Services Authorities Act, 1987 (LASA),
     and Motor Vehicles Act, 1988 (MVA).
   - Generates scoped statutory context and formats inter-round transcripts.
   - Constructs deterministic, structured JSON-enforcing prompts for Rounds 1, 2, and 3.

2. WHAT IT EXPORTS:
   - AGENTS (dict)
   - LEGAL_REFERENCE_BANK (dict)
   - CASE_TYPE_ACTS (dict)
   - PRECEDENTS (list)
   - get_scoped_law(agent_key, case_type) -> str
   - get_precedents_text() -> str
   - format_round1_transcript(transcript) -> str
   - format_round2_transcript(transcript) -> str
   - build_round1_prompt(agent_key, case_facts, case_type) -> str
   - build_round2_prompt(agent_key, case_facts, round1_transcript, case_type) -> str
   - build_round3_prompt(case_facts, round1_transcript, round2_transcript, case_type) -> str

3. HOW app.py MUST USE THESE FUNCTIONS:
   Round 1: Loop over ["analyst", "empath", "jurist", "skeptic"]
     -> call build_round1_prompt(agent_key, case_facts, case_type)
     -> check return is not empty string before calling Gemini
     -> parse Gemini response as JSON -> store in round1_transcript dict
   Round 2: Same loop over ["analyst", "empath", "jurist", "skeptic"]
     -> call build_round2_prompt(agent_key, case_facts, round1_transcript, case_type)
     -> check return is not empty string before calling Gemini
     -> parse Gemini response as JSON -> store in round2_transcript dict
   Round 3: Single call
     -> call build_round3_prompt(case_facts, round1_transcript, round2_transcript, case_type)
     -> parse Gemini response as JSON -> this is the final verdict

4. SUPPORTED case_type VALUES:
   cheque_dishonour, theft, traffic, breach_of_trust, cheating, municipal, general

5. GUARD BEHAVIOUR:
   build_round1_prompt and build_round2_prompt return empty string "" for lead_jurist.
   app.py must check: if not prompt: skip Gemini call for this agent.
"""

# =====================================================================
# PART 1 — LEGAL_REFERENCE_BANK
# =====================================================================

LEGAL_REFERENCE_BANK = {
    "NI Act": {
        "138": "Cheque dishonour — insufficient funds or exceeds arrangement",
        "139": "Presumption cheque issued for enforceable debt",
        "140": "Ignorance of funds not a defence",
        "141": "Company offences — vicarious liability of directors",
        "142": "Complaint must be filed within 30 days",
        "143": "Court may try case summarily",
        "143A": "Interim compensation up to 20% during trial",
        "144": "Mode of service of summons",
        "147": "Compounding of offences permitted",
    },
    "BNS": {
        "303": "Theft — up to 3 years or fine",
        "304": "Theft in dwelling — up to 7 years",
        "305": "Theft by servant — up to 7 years",
        "316": "Criminal breach of trust — up to 3 years",
        "317": "Breach of trust by carrier or warehousekeeper",
        "318": "Cheating — up to 3 years or fine",
        "319": "Cheating by personation",
        "320": "Cheating inducing delivery of property — up to 7 years",
        "324": "Mischief — up to 6 months or fine",
        "329": "Criminal trespass — up to 3 months or fine",
        "351": "Assault or criminal force — up to 3 months or fine",
        "356": "Defamation",
    },
    "BNSS": {
        "2(1)(x)": "Definition of summary trial",
        "283": "Offences up to 3 years triable summarily",
        "284": "Procedure for summary trials",
        "285": "Record in summary trials",
        "286": "Judgement in summary cases",
        "290": "Compounding of offences — First Schedule",
        "357": "Order to pay compensation to victims",
        "358": "Compensation on acquittal",
        "431": "Fine in instalments or in lieu of imprisonment",
    },
    "Constitution of India": {
        "Art 14": "Equality before law — equal protection",
        "Art 20": "No double jeopardy — no self-incrimination",
        "Art 21": "Right to fair trial and legal aid",
        "Art 22": "Protection against arbitrary arrest",
        "Art 39A": "Equal justice and free legal aid — Lok Adalat basis",
        "Art 300A": "No deprivation of property without legal authority",
    },
    "LASA": {
        "19": "Organisation of Lok Adalats",
        "20": "Cognizance of cases by Lok Adalat",
        "21": "Lok Adalat award — final, binding, not appealable",
        "22": "No court fees — refunded if settled",
    },
    "MVA": {
        "183": "Excess speed — fine Rs 1000 / Rs 2000 repeat",
        "184": "Dangerous driving — 6 months or Rs 1000",
        "185": "Drunken driving — 6 months or Rs 10000",
        "194": "Overloading — Rs 20000 plus Rs 2000 per extra tonne",
        "196": "No insurance — 3 months or Rs 2000",
    },
    "BSA": {
        "4": "Presumptions of fact",
        "8": "Motive, preparation, conduct as relevant facts",
        "17": "Admission — definition and evidentiary value",
        "25": "Confession to police — not provable against accused",
        "63": "Admissibility of electronic records (bank statements, SMS, WhatsApp)",
    },
}

# =====================================================================
# PART 2 — PRECEDENTS
# =====================================================================

PRECEDENTS = [
    "Dashrath Rupsingh Rathod v. State of Maharashtra (2014) — territorial jurisdiction for Sec 138 NI Act",
    "Meters and Instruments Pvt. Ltd. v. Kanchan Mehta (2018) — summary trial and compounding Sec 138",
    "Expeditious Trial of Cases Under Section 138 NI Act, In Re (2021 SC) — fast disposal guidelines",
    "M/s Dalmia Cement v. Galaxy Traders (2001) — essential ingredients Sec 138",
    "State of Haryana v. Bhajan Lal (1992) — guidelines for quashing FIR and abuse of process",
]

# =====================================================================
# PART 3 — CASE_TYPE_ACTS
# =====================================================================

CASE_TYPE_ACTS = {
    "cheque_dishonour": ["NI Act", "LASA", "BSA"],
    "theft":            ["BNS", "BNSS", "BSA", "Constitution of India"],
    "traffic":          ["MVA", "BNSS", "Constitution of India"],
    "breach_of_trust":  ["BNS", "BNSS", "BSA"],
    "cheating":         ["BNS", "BNSS", "BSA"],
    "municipal":        ["BNSS", "Constitution of India", "LASA"],
    "general":          list(LEGAL_REFERENCE_BANK.keys()),
}

# =====================================================================
# PART 4 — THE 5 AGENTS
# =====================================================================

AGENTS = {
    "analyst": {
        "name": "The Analyst",
        "role": "Forensic Evidence Juror",
        "focus": "documentary evidence, transaction ledgers, timestamps, chain of custody, standards of proof",
        "tone": "methodical, evidence-driven, neutral, structured",
        "primary_acts": ["NI Act", "BSA"],
        "domain_boundary": "Stay within evidence and documentation only. Do not comment on constitutional rights or socioeconomic factors.",
    },
    "empath": {
        "name": "The Empath",
        "role": "Restorative Justice Juror",
        "focus": "socioeconomic context, intent, coercion, disproportionate penalty impact, rehabilitation over punishment, victim restitution",
        "tone": "compassionate, context-aware, humanistic",
        "primary_acts": ["BNSS", "LASA", "Constitution of India"],
        "domain_boundary": "Stay within human impact and restorative options. Do not perform statutory analysis or cite case law.",
    },
    "jurist": {
        "name": "The Jurist",
        "role": "Statutory Law Juror",
        "focus": "exact statutory ingredients, procedural compliance, High Court and Supreme Court precedents, correct section citations only",
        "tone": "authoritative, citation-heavy, legally precise",
        "primary_acts": ["NI Act", "BNS", "BNSS", "Constitution of India", "LASA"],
        "domain_boundary": "Only cite sections from the injected legal reference list. Do not speculate on sections not in the list.",
    },
    "skeptic": {
        "name": "The Skeptic",
        "role": "Critical Scrutiny Juror",
        "focus": "credibility of evidence, procedural gaps, cognitive biases in other jurors, counter-theories, suppressed exculpatory facts",
        "tone": "probing, adversarial, devil's advocate",
        "primary_acts": ["BNSS", "BSA", "Constitution of India"],
        "domain_boundary": "Focus on what is missing or challengeable. Do not deliver a verdict — only raise doubts.",
    },
    "lead_jurist": {
        "name": "The Lead Jurist",
        "role": "Presiding Synthesis Bench",
        "focus": "weighs consensus vs dissent, constitutional rights compliance, statutory remedy selection, Lok Adalat referral eligibility, final advisory verdict",
        "tone": "judicial, balanced, authoritative, final",
        "primary_acts": list(LEGAL_REFERENCE_BANK.keys()),
        "domain_boundary": "Do not take sides with any single juror. Acknowledge dissent before delivering verdict.",
    },
}

# =====================================================================
# PART 5 — HELPER FUNCTIONS
# =====================================================================

def get_scoped_law(agent_key: str, case_type: str) -> str:
    """
    Constructs a scoped statutory reference block based on agent domain and case type.
    Falls back to agent's primary_acts if intersection with case_type acts is empty.
    For lead_jurist, injects all acts from LEGAL_REFERENCE_BANK.
    """
    if agent_key == "lead_jurist":
        acts = list(LEGAL_REFERENCE_BANK.keys())
    else:
        agent_primary = AGENTS.get(agent_key, {}).get("primary_acts", list(LEGAL_REFERENCE_BANK.keys()))
        case_acts = CASE_TYPE_ACTS.get(case_type, CASE_TYPE_ACTS["general"])
        case_acts_set = set(case_acts)

        # Intersection preserving order of primary_acts
        acts = [act for act in agent_primary if act in case_acts_set]

        # Empty intersection fallback
        if not acts:
            acts = list(agent_primary)

    lines = [
        "=== VERIFIED LEGAL REFERENCES ===",
        "Cite ONLY sections listed below. Do not invent or assume sections.",
        "If no applicable section exists, return an empty array [] for statutory_references.",
        'If a relevant section is not listed here, write "statutory basis unclear".',
    ]

    for act in acts:
        if act in LEGAL_REFERENCE_BANK:
            lines.append("")
            lines.append(f"[{act}]")
            for sec, desc in LEGAL_REFERENCE_BANK[act].items():
                lines.append(f"{sec}: {desc}")

    return "\n".join(lines)


def get_precedents_text() -> str:
    """
    Returns PRECEDENTS formatted as a markdown bullet list with judicial warning header.
    Injected only for 'jurist' in Rounds 1 & 2, and 'lead_jurist' in Round 3.
    """
    lines = [
        "=== VERIFIED PRECEDENTS ===",
        "Only cite a precedent if it directly and specifically applies to the facts of this case.",
        "Do not cite precedents speculatively or as padding.",
        "",
    ]
    for precedent in PRECEDENTS:
        lines.append(f"- {precedent}")
    return "\n".join(lines)


def format_round1_transcript(transcript: dict) -> str:
    """
    Formats parsed Round 1 JSON opinions from all primary jurors into a standard string block.
    Inserts a response unavailable placeholder for missing juror keys.
    """
    blocks = []
    round1_agents = ["analyst", "empath", "jurist", "skeptic"]
    for key in round1_agents:
        display_name = AGENTS[key]["name"]
        header = display_name.upper()
        if key not in transcript or not transcript[key]:
            blocks.append(f"[{header}] — Response unavailable")
            continue

        data = transcript[key]
        stance = data.get("stance", "")
        conf = data.get("confidence", "")
        if conf != "" and conf is not None:
            conf_str = f"{conf}%" if not str(conf).endswith("%") else str(conf)
        else:
            conf_str = ""
        rationale = data.get("rationale", "")
        refs = data.get("statutory_references", [])
        if refs:
            refs_str = ", ".join(refs)
        else:
            refs_str = "None"

        block = (
            f"[{header}]\n"
            f"Stance: {stance}\n"
            f"Confidence: {conf_str}\n"
            f"Rationale: {rationale}\n"
            f"Statutory References: {refs_str}"
        )
        blocks.append(block)

    return "\n\n".join(blocks)


def format_round2_transcript(transcript: dict) -> str:
    """
    Formats parsed Round 2 JSON rebuttals and revised stances into a standard string block.
    Inserts a response unavailable placeholder for missing juror keys.
    """
    blocks = []
    round2_agents = ["analyst", "empath", "jurist", "skeptic"]
    for key in round2_agents:
        display_name = AGENTS[key]["name"]
        header = display_name.upper()
        if key not in transcript or not transcript[key]:
            blocks.append(f"[{header}] — Response unavailable")
            continue

        data = transcript[key]
        revised_stance = data.get("revised_stance", "")
        conf = data.get("revised_confidence", "")
        if conf != "" and conf is not None:
            conf_str = f"{conf}%" if not str(conf).endswith("%") else str(conf)
        else:
            conf_str = ""
        revised_rationale = data.get("revised_rationale", "")
        rebuttals = data.get("rebuttals", [])

        lines = [
            f"[{header}]",
            f"Revised Stance: {revised_stance}",
            f"Revised Confidence: {conf_str}",
            f"Revised Rationale: {revised_rationale}",
        ]

        if rebuttals:
            lines.append("Rebuttals:")
            for r in rebuttals:
                target = r.get("target_agent", "")
                challenge = r.get("challenge", "")
                counter = r.get("counter_point", "")
                lines.append(f"  -> To {target}: {challenge} | Counter: {counter}")
        else:
            lines.append("Rebuttals: No rebuttals submitted.")

        blocks.append("\n".join(lines))

    return "\n\n".join(blocks)

# =====================================================================
# PART 6 — THE 3 PROMPT-BUILDER FUNCTIONS
# =====================================================================

def build_round1_prompt(agent_key: str, case_facts: str, case_type: str = "general") -> str:
    """
    Builds the Round 1 prompt for an individual juror persona.
    Guards against execution by lead_jurist.
    """
    if agent_key == "lead_jurist":
        print("Warning: build_round1_prompt called with lead_jurist — skipping.")
        return ""

    agent = AGENTS.get(agent_key, {})
    name = agent.get("name", "")
    role = agent.get("role", "")
    focus = agent.get("focus", "")
    tone = agent.get("tone", "")
    domain_boundary = agent.get("domain_boundary", "")

    persona_block = (
        f"You are {name}, {role} on the JuryX advisory jury panel.\n"
        f"Your focus: {focus}.\n"
        f"Your tone must be: {tone}.\n"
        f"Domain boundary: {domain_boundary}.\n"
        "Respond ONLY in English regardless of the language of the case facts."
    )

    law_block = get_scoped_law(agent_key, case_type)
    if agent_key == "jurist":
        law_block = f"{law_block}\n\n{get_precedents_text()}"

    task_block = (
        "Analyze the following case facts independently.\n"
        "Do not speculate about what other jurors might think.\n"
        "Focus strictly on your designated domain.\n"
        "Your confidence score must follow this calibration scale:\n"
        "  90-100: Overwhelming evidence, no reasonable doubt\n"
        "  70-89:  Strong case but contestable\n"
        "  50-69:  Balanced — meaningful evidence on both sides\n"
        "  Below 50: Insufficient evidence to form a view\n"
        "Keep your rationale under 120 words."
    )

    case_facts_block = (
        "=== CASE FACTS ===\n"
        f"{case_facts}"
    )

    output_instruction = (
        "Respond ONLY in valid JSON. No prose, no explanation outside the JSON object.\n"
        "If the case facts are too unclear or incomplete to assess, still return valid JSON\n"
        "with stance set to 'needs_more_evidence' and explain why in rationale.\n"
        "If no statutory section applies, return an empty array for statutory_references.\n\n"
        "Required format:\n"
        "{\n"
        '  "stance": "guilty" | "not_guilty" | "needs_more_evidence",\n'
        '  "confidence": <integer 0-100>,\n'
        '  "rationale": "<reasoning — strictly under 120 words>",\n'
        '  "statutory_references": ["<Act Name Sec: compressed description>"]\n'
        "}\n\n"
        "statutory_references format rule:\n"
        'Each entry must follow this exact pattern: "Act Name Sec: compressed description"\n'
        "Use the act name exactly as it appears in the legal reference block, then the section number, then a colon, then the compressed description.\n"
        "Correct examples:\n"
        '  "NI Act 138: Cheque dishonour — insufficient funds or exceeds arrangement"\n'
        '  "BSA 63: Admissibility of electronic records (bank statements, SMS, WhatsApp)"\n'
        '  "BNSS 283: Offences up to 3 years triable summarily"\n'
        "Wrong examples (do not use):\n"
        '  "Section 138 of the NI Act" — wrong format\n'
        '  "138 NI Act" — wrong format\n'
        '  "NI Act, Section 138" — wrong format'
    )

    return f"{persona_block}\n\n{law_block}\n\n{task_block}\n\n{case_facts_block}\n\n{output_instruction}"


def build_round2_prompt(
    agent_key: str,
    case_facts: str,
    round1_transcript: dict,
    case_type: str = "general"
) -> str:
    """
    Builds the Round 2 cross-examination and rebuttal prompt for an individual juror.
    Guards against execution by lead_jurist.
    """
    if agent_key == "lead_jurist":
        print("Warning: build_round2_prompt called with lead_jurist — skipping.")
        return ""

    agent = AGENTS.get(agent_key, {})
    name = agent.get("name", "")
    role = agent.get("role", "")
    focus = agent.get("focus", "")
    tone = agent.get("tone", "")
    domain_boundary = agent.get("domain_boundary", "")

    persona_block = (
        f"You are {name}, {role} on the JuryX advisory jury panel.\n"
        f"Your focus: {focus}.\n"
        f"Your tone must be: {tone}.\n"
        f"Domain boundary: {domain_boundary}.\n"
        "Respond ONLY in English regardless of the language of the case facts."
    )

    law_block = get_scoped_law(agent_key, case_type)
    if agent_key == "jurist":
        law_block = f"{law_block}\n\n{get_precedents_text()}"

    context_block = (
        "Round 1 is complete. All four jurors have submitted their initial assessments.\n"
        "You must now critically cross-examine the other jurors' reasoning."
    )

    round1_block = (
        "=== ROUND 1 — ALL JUROR OPINIONS ===\n"
        f"{format_round1_transcript(round1_transcript)}"
    )

    task_block = (
        "Challenge at least 2 other jurors by their display name (e.g. The Jurist, The Empath).\n"
        "Identify specific flaws: incorrect statutory interpretation, overlooked evidence,\n"
        "cognitive bias, or procedural errors.\n"
        "You may revise your own stance — but if your revised_stance differs from your\n"
        "Round 1 stance, your revised_rationale MUST explicitly state which juror's\n"
        "argument caused the change and why. Do not change stance without explanation.\n"
        "Keep revised_rationale under 120 words."
    )

    output_instruction = (
        "Respond ONLY in valid JSON. No prose outside the JSON object.\n"
        "If case facts remain unclear, set revised_stance to 'needs_more_evidence'.\n"
        "The rebuttals array must contain 2 or more entries.\n"
        "If you can only identify 1 genuine challenge, add a second entry targeting\n"
        "The Lead Jurist's expected synthesis position as a preemptive challenge.\n\n"
        "Required format:\n"
        "{\n"
        '  "rebuttals": [\n'
        "    {\n"
        '      "target_agent": "<display name e.g. The Jurist>",\n'
        '      "challenge": "<specific flaw in their reasoning>",\n'
        '      "counter_point": "<your alternative interpretation>"\n'
        "    }\n"
        "  ],\n"
        '  "revised_stance": "guilty" | "not_guilty" | "needs_more_evidence",\n'
        '  "revised_confidence": <integer 0-100>,\n'
        '  "revised_rationale": "<updated reasoning — strictly under 120 words>"\n'
        "}"
    )

    return f"{persona_block}\n\n{law_block}\n\n{context_block}\n\n{round1_block}\n\n{task_block}\n\n{output_instruction}"


def build_round3_prompt(
    case_facts: str,
    round1_transcript: dict,
    round2_transcript: dict,
    case_type: str = "general"
) -> str:
    """
    Builds the Round 3 synthesis and final advisory verdict prompt for The Lead Jurist.
    Synthesizes facts, legal reference bank, precedents, Round 1 opinions, and Round 2 rebuttals.
    """
    persona_block = (
        "You are The Lead Jurist, Presiding Synthesis Bench of the JuryX advisory panel.\n"
        "You have been silent during Rounds 1 and 2.\n"
        "You have now reviewed all arguments. Your role is to synthesize and deliver\n"
        "the final advisory verdict to the judicial magistrate.\n"
        "You must acknowledge dissent before ruling.\n"
        "Do not side with any single juror — weigh all views.\n"
        "Your tone must be: judicial, balanced, authoritative, final.\n"
        "Respond ONLY in English."
    )

    law_block = get_scoped_law("lead_jurist", case_type)
    precedents_block = get_precedents_text()
    constitutional_block = (
        "=== CONSTITUTIONAL COMPLIANCE REQUIRED ===\n"
        "Your verdict must respect:\n"
        "Art 14: Equality before law — equal protection\n"
        "Art 20: No double jeopardy — no self-incrimination\n"
        "Art 21: Right to fair trial and legal aid\n"
        "Art 39A: Equal justice and free legal aid — Lok Adalat basis"
    )
    full_legal_block = f"{law_block}\n\n{precedents_block}\n\n{constitutional_block}"

    context_block = (
        "You are presiding over the final deliberation. Rounds 1 and 2 are complete.\n"
        "Synthesize all arguments and deliver the final advisory verdict."
    )

    case_facts_block = (
        "=== CASE FACTS ===\n"
        f"{case_facts}"
    )

    round1_block = (
        "=== ROUND 1 — INITIAL JUROR OPINIONS ===\n"
        f"{format_round1_transcript(round1_transcript)}"
    )

    round2_block = (
        "=== ROUND 2 — REBUTTALS AND REVISED STANCES ===\n"
        f"{format_round2_transcript(round2_transcript)}"
    )

    task_block = (
        "Weigh consensus against dissent.\n"
        "Determine if compounding under NI Act Sec 147 or Lok Adalat referral\n"
        "under LASA Sec 20 is appropriate before recommending conviction.\n\n"
        "consensus_score must be computed as:\n"
        "  (number of jurors whose revised_stance matches your final verdict / 4) * 100\n"
        "  Round to nearest integer. Possible values: 0, 25, 50, 75, 100.\n\n"
        "remedy must follow this exact format: '<type>: <specific detail>'\n"
        "  Examples:\n"
        "    'Restitution: Rs 2,40,000 payable in 3 instalments over 90 days'\n"
        "    'Lok Adalat Referral: under LASA Sec 20, Permanent Lok Adalat'\n"
        "    'Compounding: under NI Act Sec 147, full cheque amount plus interest'\n"
        "  If verdict is 'needs_more_evidence', set remedy to exactly:\n"
        "    'Insufficient evidence — further inquiry required'\n\n"
        "dissent_summary rules:\n"
        "  If any juror's revised_stance differs from your verdict, name them and summarise why.\n"
        "  If all 4 jurors share the same revised_stance, set dissent_summary to exactly:\n"
        "    'Unanimous — no dissent recorded'\n"
        "  Keep dissent_summary under 60 words.\n\n"
        "constitutional_compliance rules:\n"
        "  Write one sentence confirming Art 14, 20, and 21 are respected by your verdict.\n"
        "  If verdict is 'needs_more_evidence', set constitutional_compliance to exactly:\n"
        "    'No verdict issued — constitutional review deferred'\n\n"
        "advisory_note must be practical next steps for the magistrate, under 80 words."
    )

    output_instruction = (
        "Respond ONLY in valid JSON. No prose outside the JSON object.\n"
        "If case facts are unclear, set verdict to 'needs_more_evidence'.\n\n"
        "Required format:\n"
        "{\n"
        '  "verdict": "guilty" | "not_guilty" | "compounding_recommended" | "lok_adalat_referral" | "needs_more_evidence",\n'
        '  "remedy": "<type: specific detail>",\n'
        '  "consensus_score": <integer — 0, 25, 50, 75, or 100>,\n'
        '  "dissent_summary": "<under 60 words or \'Unanimous — no dissent recorded\'>",\n'
        '  "statutory_basis": ["<Act Name Sec: compressed description — same format as Round 1 statutory_references>"],\n'
        '  "constitutional_compliance": "<one sentence or \'No verdict issued — constitutional review deferred\'>",\n'
        '  "advisory_note": "<magistrate next steps under 80 words>"\n'
        "}"
    )

    return (
        f"{persona_block}\n\n"
        f"{full_legal_block}\n\n"
        f"{context_block}\n\n"
        f"{case_facts_block}\n\n"
        f"{round1_block}\n\n"
        f"{round2_block}\n\n"
        f"{task_block}\n\n"
        f"{output_instruction}"
    )


__all__ = [
    "AGENTS",
    "LEGAL_REFERENCE_BANK",
    "CASE_TYPE_ACTS",
    "PRECEDENTS",
    "get_scoped_law",
    "get_precedents_text",
    "format_round1_transcript",
    "format_round2_transcript",
    "build_round1_prompt",
    "build_round2_prompt",
    "build_round3_prompt",
]
