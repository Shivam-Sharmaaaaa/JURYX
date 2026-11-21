/**
 * JuryX API Service
 * Connects to the Flask backend or provides rich fallback simulation
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

/**
 * Normalizes backend responses to ensure UI components receive a rock-solid contract
 */
export function normalizeBackendResponse(raw) {
  if (!raw) return null;

  // Extract or calculate tally
  let tally = raw.tally || { guilty: 0, not_guilty: 0 };
  
  // Extract rounds
  let rounds = Array.isArray(raw.rounds) ? raw.rounds : [];
  
  // If backend provided flat statements array instead of rounds array
  if (rounds.length === 0 && Array.isArray(raw.statements)) {
    const r1 = raw.statements.filter(s => (s.round === 1 || !s.round));
    const r2 = raw.statements.filter(s => s.round === 2);
    rounds = [
      { round: 1, statements: r1 },
      { round: 2, statements: r2 }
    ];
  }

  // Derive final votes if tally is missing
  if (tally.guilty === 0 && tally.not_guilty === 0 && rounds.length > 0) {
    const finalRound = rounds[rounds.length - 1];
    if (finalRound && Array.isArray(finalRound.statements)) {
      finalRound.statements.forEach(stmt => {
        const v = (stmt.vote || '').toUpperCase();
        if (v === 'GUILTY') tally.guilty += 1;
        else if (v === 'NOT_GUILTY' || v === 'NOT GUILTY') tally.not_guilty += 1;
      });
    }
  }

  // Compute or verify consensus
  let consensus = raw.consensus || '';
  if (!consensus) {
    if (tally.guilty > tally.not_guilty) consensus = 'GUILTY';
    else if (tally.not_guilty > tally.guilty) consensus = 'NOT_GUILTY';
    else if (tally.guilty === tally.not_guilty && (tally.guilty > 0)) consensus = 'HUNG_BENCH';
    else consensus = 'INCONCLUSIVE';
  } else {
    // Standardize naming
    consensus = consensus.toUpperCase().replace(/\s+/g, '_');
  }

  return {
    consensus,
    tally: {
      guilty: Number(tally.guilty || 0),
      not_guilty: Number(tally.not_guilty || 0)
    },
    rounds: rounds.map((r, idx) => ({
      round: r.round || (idx + 1),
      statements: (r.statements || []).map(stmt => ({
        juror_id: stmt.juror_id || stmt.id || 'juror',
        juror_name: stmt.juror_name || stmt.name || 'AI Juror',
        role: stmt.role || 'Judicial Analysis',
        round: stmt.round || (idx + 1),
        vote: (stmt.vote || '').toUpperCase().includes('NOT') ? 'NOT_GUILTY' : 'GUILTY',
        confidence: Math.round(Number(stmt.confidence || 75)),
        argument: stmt.argument || stmt.text || stmt.reasoning || '',
        cited_law: stmt.cited_law || stmt.statute || stmt.law || 'Indian Summary Court Law',
      }))
    })),
    advisory_notice: raw.advisory_notice || "Human magistrate retains final authority. AI decision-support advisory only.",
    evidence_gaps: raw.evidence_gaps || [
      "Lack of direct independent corroboration beyond single point of capture",
      "Chain of custody documentation lacks secondary verification timestamp"
    ],
    juror_disagreement: raw.juror_disagreement || (
      consensus === 'HUNG_BENCH' 
        ? "Split bench between strict statutory liability and substantive humanitarian defense"
        : (tally.not_guilty > 0 
            ? "Dissenting view emphasizing mitigating circumstances and absence of malicious intent"
            : "Unanimous alignment on elements of the alleged offence")
    ),
    deliberation_time_ms: raw.deliberation_time_ms || 2150,
    timestamp: raw.timestamp || new Date().toISOString()
  };
}

/**
 * Comprehensive realistic fallback deliberations for offline demo mode
 */
export function getFallbackDeliberation(caseText = "") {
  const textLower = caseText.toLowerCase();

  // 1. Cheque Bounce / NI Act 138 Case
  if (textLower.includes("cheque") || textLower.includes("138") || textLower.includes("agarwal") || textLower.includes("dishonour")) {
    return normalizeBackendResponse({
      consensus: "NOT_GUILTY",
      tally: { guilty: 1, not_guilty: 3 },
      deliberation_time_ms: 1940,
      juror_disagreement: "The Jurist maintained strict statutory presumption under Sec 139 NI Act, whereas The Skeptic, The Empath, and The Analyst concluded the presumption was rebutted on preponderance of probabilities by the timely pre-presentation notice of defective goods.",
      evidence_gaps: [
        "Complainant failed to produce commercial proof of replacement or delivery dispute resolution.",
        "Bank memo indicates stop-payment issued prior to presentation, supporting contract repudiation.",
        "No signed reconciliation of accounts submitted by complainant."
      ],
      rounds: [
        {
          round: 1,
          statements: [
            {
              juror_id: "analyst",
              juror_name: "The Analyst",
              role: "Factual & Chronological Consistency",
              round: 1,
              vote: "GUILTY",
              confidence: 78,
              argument: "The physical chronology satisfies the prima facie ingredients: Cheque #448201 was presented within validity, returned for insufficient funds on 14-Aug, statutory notice delivered on 24-Aug, and complaint instituted within limitation under Section 142 NI Act. Signature is admitted.",
              cited_law: "Section 138 & 142, Negotiable Instruments Act 1881"
            },
            {
              juror_id: "empath",
              juror_name: "The Empath",
              role: "Humanitarian & Socio-Economic Context",
              round: 1,
              vote: "NOT_GUILTY",
              confidence: 82,
              argument: "The accused Sunita Verma runs a small handloom unit. Supplying defective yarn with color bleeding threatened her entire commercial livelihood. She promptly notified the supplier via email on 12-May and stopped payment in good faith, not to evade a just liability.",
              cited_law: "Principles of Natural Justice & Commercial Good Faith"
            },
            {
              juror_id: "jurist",
              juror_name: "The Jurist",
              role: "Indian Statutory Framework & Precedent",
              round: 1,
              vote: "GUILTY",
              confidence: 86,
              argument: "Under Section 139 NI Act, the court is bound to presume that the cheque was received for the discharge of a debt. The burden of proof to rebut this presumption lies squarely on the accused, and stop-payment does not preclude criminal liability per Modi Cements Ltd v Kuchil Kumar Nandi (1998).",
              cited_law: "Section 139 NI Act & Modi Cements Ltd v Kuchil Kumar (1998) 3 SCC 249"
            },
            {
              juror_id: "skeptic",
              juror_name: "The Skeptic",
              role: "Evidentiary Vulnerabilities & Contradictions",
              round: 1,
              vote: "NOT_GUILTY",
              confidence: 84,
              argument: "Major evidentiary hole: Complainant suppresses the contemporaneous email dated 12-May-2024 rejecting goods for decay. A cheque given as advance security cannot be presented once the underlying consideration fails, as held in Indus Airways (2014). The presumption stands shaken at inception.",
              cited_law: "Indus Airways Pvt Ltd v Magnum Aviation Pvt Ltd (2014) 12 SCC 539"
            }
          ]
        },
        {
          round: 2,
          statements: [
            {
              juror_id: "analyst",
              juror_name: "The Analyst",
              role: "Factual & Chronological Consistency",
              round: 2,
              vote: "NOT_GUILTY",
              confidence: 76,
              argument: "Rebuttal: Upon reviewing The Skeptic's citation of Indus Airways and the verified timeline, the stop-payment was communicated on 05-Aug, preceding presentation by five days. The contemporaneous email trail proves the debt was not crystalized on presentation date. I adjust my vote.",
              cited_law: "Section 138 Explanation (Legally Enforceable Debt requirement)"
            },
            {
              juror_id: "empath",
              juror_name: "The Empath",
              role: "Humanitarian & Socio-Economic Context",
              round: 2,
              vote: "NOT_GUILTY",
              confidence: 88,
              argument: "Rebuttal to Jurist: Criminalizing civil contract disputes involving bona fide damaged consignments distorts the legislative intent of Section 138, which targets fraudulent defaulters, not aggrieved buyers seeking remediation.",
              cited_law: "Dalmia Cement (Bharat) Ltd v Galaxy Traders (2001) 6 SCC 463"
            },
            {
              juror_id: "jurist",
              juror_name: "The Jurist",
              role: "Indian Statutory Framework & Precedent",
              round: 2,
              vote: "GUILTY",
              confidence: 71,
              argument: "Sur-rebuttal: While acknowledging Basalingappa (2019) allows rebuttal on standard of preponderance of probabilities, summary proceedings cannot fully adjudicate yarn quality without forensic textile analysis. Strictly on statutory compliance, the offence is made out, though civil remedy is indicated.",
              cited_law: "Basalingappa v Mudibasappa (2019) 5 SCC 418"
            },
            {
              juror_id: "skeptic",
              juror_name: "The Skeptic",
              role: "Evidentiary Vulnerabilities & Contradictions",
              round: 2,
              vote: "NOT_GUILTY",
              confidence: 91,
              argument: "Conclusion: Complainant has not tendered an affidavit refuting receipt of the defect notice. The statutory presumption under Sec 139 is definitively rebutted by the defence documentary evidence. Summary court should dismiss or direct civil arbitration.",
              cited_law: "Section 139 NI Act & Section 114 Indian Evidence Act 1872 / BSA 2023"
            }
          ]
        }
      ]
    });
  }

  // 2. Traffic Emergency Case
  if (textLower.includes("traffic") || textLower.includes("vikram") || textLower.includes("challan") || textLower.includes("aiims") || textLower.includes("184")) {
    return normalizeBackendResponse({
      consensus: "NOT_GUILTY",
      tally: { guilty: 1, not_guilty: 3 },
      deliberation_time_ms: 2050,
      juror_disagreement: "The Analyst noted strict mathematical violation of red-light sensor data, while The Jurist, The Empath, and The Skeptic found the defense of medical necessity under Section 81 IPC / Section 14 BNS completely substantiated by hospital casualty records.",
      evidence_gaps: [
        "Prosecution did not refute emergency casualty admission record dated 18:28 hrs.",
        "Traffic camera log did not record audio/horn evidence or continuous hazard blinker status.",
        "No independent witness from scene produced."
      ],
      rounds: [
        {
          round: 1,
          statements: [
            {
              juror_id: "analyst",
              juror_name: "The Analyst",
              role: "Factual & Chronological Consistency",
              round: 1,
              vote: "GUILTY",
              confidence: 84,
              argument: "Automated RLVD telemetry confirms the vehicle crossed the stop line 2.8 seconds into the red signal at 58 km/h in a 40 km/h zone. Objective physical criteria of Section 184 Motor Vehicles Act are established beyond ambiguity.",
              cited_law: "Section 184 & 177, Motor Vehicles Act 1988"
            },
            {
              juror_id: "empath",
              juror_name: "The Empath",
              role: "Humanitarian & Socio-Economic Context",
              round: 1,
              vote: "NOT_GUILTY",
              confidence: 92,
              argument: "The accused driver acted heroically under extreme moral compulsion. A passenger was suffocating from anaphylactic shock. Punishing a citizen for rushing a dying human to trauma care contradicts the very spirit of law and Good Samaritan directives.",
              cited_law: "Article 21 Constitution of India (Right to Life) & MoRTH Good Samaritan Guidelines"
            },
            {
              juror_id: "jurist",
              juror_name: "The Jurist",
              role: "Indian Statutory Framework & Precedent",
              round: 1,
              vote: "NOT_GUILTY",
              confidence: 85,
              argument: "Section 81 IPC (Section 14 BNS 2023) provides a statutory general exception: 'An act done without criminal intention, in good faith to prevent other greater harm.' The harm avoided (loss of life) overwhelmingly outweighs a transient traffic signal breach.",
              cited_law: "Section 81 Indian Penal Code / Section 14 Bharatiya Nyaya Sanhita 2023"
            },
            {
              juror_id: "skeptic",
              juror_name: "The Skeptic",
              role: "Evidentiary Vulnerabilities & Contradictions",
              round: 1,
              vote: "GUILTY",
              confidence: 65,
              argument: "I must scrutinize the causal authenticity: Cab drivers frequently allege medical emergencies post-facto. While the hospital slip exists, was the crossing done with due care, or did it recklessly endanger pedestrians at the intersection?",
              cited_law: "Section 184(b) MV Act (Manner dangerous to public)"
            }
          ]
        },
        {
          round: 2,
          statements: [
            {
              juror_id: "analyst",
              juror_name: "The Analyst",
              role: "Factual & Chronological Consistency",
              round: 2,
              vote: "GUILTY",
              confidence: 68,
              argument: "Rebuttal: Even under duress, strict compliance with urban safety is required. However, the time difference of only 6 minutes between violation (18:22) and emergency admission (18:28) corroborates the defence timeline with absolute mathematical fidelity.",
              cited_law: "Section 184 MV Act & Section 106 Indian Evidence Act"
            },
            {
              juror_id: "empath",
              juror_name: "The Empath",
              role: "Humanitarian & Socio-Economic Context",
              round: 2,
              vote: "NOT_GUILTY",
              confidence: 96,
              argument: "Rebuttal to Skeptic: The attending emergency medical officer's certificate specifically mentions patient was brought in cyanotic and intubated within minutes. The driver's promptness saved a life. An acquittal with commendation is the only ethical outcome.",
              cited_law: "Saveetha Emergency Care Doctrine & Sec 14 BNS"
            },
            {
              juror_id: "jurist",
              juror_name: "The Jurist",
              role: "Indian Statutory Framework & Precedent",
              round: 2,
              vote: "NOT_GUILTY",
              confidence: 90,
              argument: "Rebuttal to Analyst: Section 81 IPC completely negates culpability. Supreme Court in Bishambhar v State held that imminent danger to human life legally supersedes municipal traffic bylaws when executed without malice.",
              cited_law: "Bishambhar v State of UP & Section 14 BNS 2023"
            },
            {
              juror_id: "skeptic",
              juror_name: "The Skeptic",
              role: "Evidentiary Vulnerabilities & Contradictions",
              round: 2,
              vote: "NOT_GUILTY",
              confidence: 82,
              argument: "Rebuttal: The corroborating hospital log and 108 emergency call record close all suspicious gaps. Prosecution has not shown any pedestrian was harmed or that speed was uncontrolled. The exception under Sec 14 BNS stands fully proved.",
              cited_law: "Section 105 Indian Evidence Act 1872 / Section 108 BSA 2023"
            }
          ]
        }
      ]
    });
  }

  // 3. Petty Theft / IPC 379 Case (Default or Petty Theft)
  return normalizeBackendResponse({
    consensus: "GUILTY",
    tally: { guilty: 3, not_guilty: 1 },
    deliberation_time_ms: 2180,
    juror_disagreement: "The Empath dissented on lack of mens rea due to child starvation emergency, while Analyst, Jurist, and Skeptic agreed the actus reus and formal elements of theft are legally established, recommending non-custodial probation under the Probation of Offenders Act.",
    evidence_gaps: [
      "No inventory valuation certificate signed by certified accountant for shopkeeper stock.",
      "Investigation did not examine the wage contractor who allegedly withheld accused's wages.",
      "Absence of independent civilian panch witnesses during initial stop by private mall security."
    ],
    rounds: [
      {
        round: 1,
        statements: [
          {
            juror_id: "analyst",
            juror_name: "The Analyst",
            role: "Factual & Chronological Consistency",
            round: 1,
            vote: "GUILTY",
            confidence: 91,
            argument: "CCTV footage unambiguously displays the accused taking two tins of milk formula and concealing them beneath his jacket before bypassing checkout counters. The physical act of dishonest moving under Section 378 IPC is fully verified.",
            cited_law: "Section 378 & 379 Indian Penal Code / Section 303(2) BNS 2023"
          },
          {
            juror_id: "empath",
            juror_name: "The Empath",
            role: "Humanitarian & Socio-Economic Context",
            round: 1,
            vote: "NOT_GUILTY",
            confidence: 86,
            argument: "The accused took infant milk solely to prevent the imminent starvation of his 8-month-old infant after 18 days of unpaid labor. True criminal 'mens rea' (dishonest intention to enrich oneself) is completely absent. A welfare state cannot brand desperate parental survival as criminal theft.",
            cited_law: "Article 21 & Section 81 IPC (Doctrine of Necessity)"
          },
          {
            juror_id: "jurist",
            juror_name: "The Jurist",
            role: "Indian Statutory Framework & Precedent",
            round: 1,
            vote: "GUILTY",
            confidence: 84,
            argument: "Under Indian jurisprudence (State of Maharashtra v Mayer Hans George), poverty or domestic duress does not legally eliminate the statutory offence of theft under Section 378 IPC. However, Section 3 of the Probation of Offenders Act, 1958 allows the magistrate to release upon admonition.",
            cited_law: "Section 379 IPC & Section 3, Probation of Offenders Act 1958"
          },
          {
            juror_id: "skeptic",
            juror_name: "The Skeptic",
            role: "Evidentiary Vulnerabilities & Contradictions",
            round: 1,
            vote: "GUILTY",
            confidence: 78,
            argument: "While store security handled apprehension privately, the panchnama and recovered sealed goods leave no doubt of identity or possession. But prosecution fails to substantiate any prior criminal tendency; first-time offender status is corroborated.",
            cited_law: "Section 27 Indian Evidence Act & Sec 260 CrPC Summary Trial"
          }
        ]
      },
      {
        round: 2,
        statements: [
          {
            juror_id: "analyst",
            juror_name: "The Analyst",
            role: "Factual & Chronological Consistency",
            round: 2,
            vote: "GUILTY",
            confidence: 93,
            argument: "Rebuttal to Empath: We must distinguish between legal verdict and penal consequence. The physical act of taking property without consent from possession meets all 5 ingredients of theft. Conviction with immediate release under Section 3 Probation Act balances law and compassion.",
            cited_law: "Section 379 IPC & K.M. Nanavati v State of Maharashtra (1962)"
          },
          {
            juror_id: "empath",
            juror_name: "The Empath",
            role: "Humanitarian & Socio-Economic Context",
            round: 2,
            vote: "NOT_GUILTY",
            confidence: 89,
            argument: "Rebuttal: A formal conviction creates a lifetime criminal stigma for an impoverished laborer, preventing future employment. The court should invoke Section 320 CrPC for compounding with storekeeper or exercise Section 95 IPC (Harm so slight that no person of ordinary sense would complain).",
            cited_law: "Section 95 IPC (Act causing slight harm) & Sec 320 CrPC"
          },
          {
            juror_id: "jurist",
            juror_name: "The Jurist",
            role: "Indian Statutory Framework & Precedent",
            round: 2,
            vote: "GUILTY",
            confidence: 88,
            argument: "Rebuttal to Empath: Section 95 IPC cannot apply to commercial retail theft where property value exceeds triviality. Maintaining rule of law requires recording finding of guilt, but magistrate has complete discretion under Section 360 CrPC / Sec 361 CrPC to grant probation without sentence.",
            cited_law: "Section 360 CrPC / Section 401 BNSS & Section 3 Probation of Offenders Act"
          },
          {
            juror_id: "skeptic",
            juror_name: "The Skeptic",
            role: "Evidentiary Vulnerabilities & Contradictions",
            round: 2,
            vote: "GUILTY",
            confidence: 82,
            argument: "Final Synthesis: The evidentiary record supports guilt on the physical charge, but prosecutorial overreach is apparent in denying compounding for ₹780 milk powder. Advisory recommends Magistrate approve compounding or discharge under Section 3 Probation of Offenders Act.",
            cited_law: "Section 3 Probation of Offenders Act 1958 & Section 265B CrPC (Plea Bargaining)"
          }
        ]
      }
    ]
  });
}

/**
 * Main API function to call backend or fallback
 */
export async function deliberateCase({ case_text, use_fallback = false }) {
  // If user requested fallback / offline demo mode explicitly
  if (use_fallback) {
    // Simulate brief realistic deliberation latency
    await new Promise(resolve => setTimeout(resolve, 800));
    const response = getFallbackDeliberation(case_text);
    return {
      ...response,
      is_fallback: true,
      demo_mode: true
    };
  }

  // Attempt real backend call
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 12000); // 12s timeout

    const response = await fetch(`${API_BASE_URL}/api/deliberate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        case_text,
        use_fallback: false
      }),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errText = await response.text().catch(() => '');
      throw new Error(`Server returned HTTP ${response.status}: ${errText || response.statusText}`);
    }

    const data = await response.json();
    const normalized = normalizeBackendResponse(data);
    return {
      ...normalized,
      is_fallback: false,
      demo_mode: false
    };
  } catch (error) {
    console.warn(`JuryX Backend connection to ${API_BASE_URL} failed:`, error.message);
    // Rethrow so App / state can decide to show error or allow one-click fallback
    throw error;
  }
}
