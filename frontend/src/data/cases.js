/**
 * Preset Indian Summary Court Cases for JuryX
 * Covers IPC / BNS, Negotiable Instruments Act 1881, and Motor Vehicles Act 1988
 */

export const PRESET_CASES = [
  {
    id: "petty-theft",
    tag: "IPC 379 / BNS 303(2)",
    title: "State (Govt of NCT Delhi) vs. Ramesh Kumar",
    category: "Petty Theft / Essential Goods",
    court: "Court of Metropolitan Magistrate, Tis Hazari, Delhi",
    firNo: "FIR No. 402/2024, PS Karol Bagh",
    accused: "Ramesh Kumar (Age 24, daily wage laborer)",
    complainant: "Subhash Grocers Pvt. Ltd.",
    sections: ["Section 379 IPC (Theft)", "Section 303(2) BNS 2023", "Sec 260 CrPC / Sec 283 BNSS (Summary Procedure)"],
    description: "The accused Ramesh Kumar was apprehended outside 'Subhash Superstore' in Karol Bagh at 19:40 hrs carrying two tins of infant milk formula (Brand: LactoCare, net value ₹780) concealed under his woollen jacket without making payment at the billing counter.",
    evidence: "1. High-definition CCTV footage from Isle 3 timestamped 19:35 hrs showing accused picking two tins, inspecting surroundings, and tucking them under his jacket.\n2. Store manager testimony and physical stock ledger audit indicating immediate shortage of 2 units.\n3. Recovery memo (Panchnama) signed by two independent market vendors noting tins recovered intact from accused's person.\n4. No previous criminal history or pending FIRs in CCTNS national database.",
    defence: "1. The accused admits taking the tins without payment but pleads absolute necessity: his 8-month-old infant was severely malnourished with dehydration, producing OPD emergency receipt from RML Hospital dated the same afternoon.\n2. Accused had been denied wages by his contractor for 18 days and had ₹12 in his pocket.\n3. Defense invokes Section 81 IPC / Section 14 BNS (Doctrine of Necessity / Act done without criminal intention to prevent other harm) and prays for benefit under Section 3 & 4 of the Probation of Offenders Act 1958 without custodial sentencing.",
    caseText: `CASE: State vs. Ramesh Kumar (FIR No. 402/2024, PS Karol Bagh)
SECTIONS: Section 379 IPC / Section 303(2) BNS 2023; Summary Trial under Sec 260 CrPC.
FACTS: On 14-Oct-2024, the accused was apprehended at the exit of Subhash Superstore with 2 tins of infant milk formula (value: ₹780) concealed under his jacket without paying.
PROSECUTION EVIDENCE:
- Clear CCTV video showing concealment.
- Recovery Panchnama with goods recovered intact outside exit.
- Security guard and store manager eyewitness statements.
- Clean CCTNS record (first-time offender).
DEFENCE & MITIGATION:
- Admission of act, but contends absence of dishonest intent (mens rea) driven by extreme parental distress.
- Produced RML Hospital pediatrics OPD slip showing severe infant dehydration & hypoglycemia.
- Plea for compounding or admonition under Section 3 of the Probation of Offenders Act, 1958.`
  },
  {
    id: "cheque-bounce",
    tag: "NI Act Sec 138 / 139",
    title: "M/s Agarwal Fabric Traders vs. Sunita Verma",
    category: "Commercial Dishonour / Summary Trial",
    court: "Court of Judicial Magistrate First Class (Special NI Act), Surat",
    firNo: "Criminal Complaint No. CC/8921/2024",
    accused: "Sunita Verma (Proprietor, Verma Handlooms)",
    complainant: "M/s Agarwal Fabric Traders through partner Manoj Agarwal",
    sections: ["Section 138 Negotiable Instruments Act 1881", "Section 139 NI Act (Presumption in favour of holder)", "Section 118 NI Act"],
    description: "Complaint filed under Section 138 of the Negotiable Instruments Act regarding Cheque No. 448201 for ₹1,85,000 drawn on State Bank of India, returned dishonoured with the reason 'Funds Insufficient' vide Bank Memo dated 14-Aug-2024. Statutory legal demand notice was dispatched via Registered Post with AD on 21-Aug-2024, and no payment was received within the statutory 15-day window.",
    evidence: "1. Original Cheque No. 448201 dated 10-Aug-2024 for ₹1,85,000 bearing accused's admitted signature.\n2. Bank Return Memo dated 14-Aug-2024 with endorsement 'Funds Insufficient'.\n3. Copy of statutory demand notice dated 21-Aug-2024.\n4. Postal Department Registered Post receipt and online tracking report confirming delivery on 24-Aug-2024.\n5. Invoice No. INV-5421 dated 02-May-2024 for delivery of 40 bales of dyed cotton yarn.",
    defence: "1. The accused does not deny the signature, but disputes the existence of a 'legally enforceable debt' on the date of presentation.\n2. The cheque was handed over as an undated 'security cheque' at the inception of the contract.\n3. The fabric supplied under INV-5421 had severe moisture decay and colour bleeding; accused issued a formal rejection notice via email on 12-May-2024 requesting return/replacement, which complainant ignored.\n4. Accused issued Stop-Payment instructions to her bank on 05-Aug-2024 (prior to complainant presenting the cheque).\n5. Rebuttal of Section 139 presumption on preponderance of probabilities relying on Indus Airways Pvt Ltd vs Magnum Aviation (2014) and Basalingappa vs Mudibasappa (2019).",
    caseText: `CASE: M/s Agarwal Fabric Traders vs. Sunita Verma (CC/8921/2024)
SECTIONS: Sections 138, 139 & 118 of the Negotiable Instruments Act, 1881.
FACTS: Cheque No. 448201 for ₹1,85,000 dishonoured for 'Funds Insufficient'. Statutory notice issued within 30 days and delivered via India Post; no payment tendered within 15 days.
COMPLAINANT EVIDENCE:
- Original dishonoured cheque bearing admitted signature of accused.
- Bank return memo dated 14-Aug-2024.
- India Post tracking delivery confirmation dated 24-Aug-2024.
- Ledger statement and commercial invoice INV-5421.
DEFENCE PLEA & EVIDENCE:
- Rebuttal of statutory presumption under Section 139 NI Act.
- Defence contends cheque was blank security cheque issued before delivery of goods.
- Defective consignment email dated 12-May-2024 rejecting goods for colour bleeding.
- Bank stop-payment communication dated 05-Aug-2024 predating cheque presentation.
- Argues absence of legally enforceable debt under Indus Airways and Basalingappa precedents.`
  },
  {
    id: "traffic-violation",
    tag: "Motor Vehicles Act Sec 184 / 177",
    title: "State (Delhi Traffic Police) vs. Vikram Singh",
    category: "Summary Traffic Offence",
    court: "Special Metropolitan Magistrate (Traffic), Patiala House Courts",
    firNo: "Traffic Challan No. DL-TR-2024-884102",
    accused: "Vikram Singh (Commercial Cab Driver)",
    complainant: "Sub-Inspector Kuldeep, Delhi Traffic Police",
    sections: ["Section 184 Motor Vehicles Act 1988 (Dangerous Driving)", "Section 177 MV Act", "Section 14 BNS 2023 / Section 81 IPC (Necessity)"],
    description: "The commercial motor vehicle DL-1ZA-4921 driven by accused Vikram Singh was recorded jumping a red traffic signal at Ring Road - AIIMS roundabout intersection at 18:22 hrs and proceeding at 58 km/h in a 40 km/h zone, allegedly endangering pedestrian flow.",
    evidence: "1. Automated Red Light Violation Detection (RLVD) sensor photograph showing rear axle of vehicle crossing stop line 2.8 seconds after signal turned red.\n2. Speed radar calibration record dated 01-Sep-2024.\n3. Traffic Constable on duty at point duty kiosk testifying to sudden acceleration across intersection without halting.",
    defence: "1. Accused cab driver was ferrying a passenger who suffered acute anaphylactic shock from peanut allergy in the rear seat with airway constriction.\n2. Passenger was unconscious; accused was actively following emergency telephonic instructions from 108 emergency dispatch to reach AIIMS Trauma Centre (400 meters ahead) without delay.\n3. Accused was driving with hazard emergency blinkers turned ON and sounded continuous horn to alert oncoming traffic before clearing junction at controlled speed.\n4. Produced AIIMS emergency admission slip timestamped 18:28 hrs (6 minutes post-incident) showing patient admitted to Resuscitation Bay-1 in critical status.",
    caseText: `CASE: State (Traffic Police) vs. Vikram Singh (Challan No. DL-TR-2024-884102)
SECTIONS: Section 184 (Dangerous Driving) & Section 177, Motor Vehicles Act, 1988.
FACTS: Cab DL-1ZA-4921 jumped red signal at AIIMS intersection at 58 km/h. Automated RLVD camera generated ₹5,000 challan.
PROSECUTION EVIDENCE:
- Automated RLVD photographic proof of stop-line crossing 2.8s into red phase.
- Radar gun speed reading 58 km/h in 40 km/h urban sector.
- Traffic officer observation log.
DEFENCE PLEA:
- General exception of Necessity under Section 81 IPC / Section 14 BNS 2023.
- Passenger had sudden anaphylactic shock; emergency life-saving transport to AIIMS Emergency.
- Hazard blinkers active, horn sounded, vehicle slowed down before crossing.
- AIIMS Emergency department casualty record produced confirming patient admitted at 18:28 hrs in critical condition.`
  }
];

export const JUROR_DEFINITIONS = [
  {
    id: "analyst",
    name: "The Analyst",
    role: "Factual & Chronological Consistency",
    description: "Scrutinizes timelines, physical artifacts, chain of custody, and forensic consistency.",
    accent: "blue",
    color: "#2563EB",
    badgeBg: "bg-blue-50 text-blue-700 border-blue-200",
    avatarBg: "bg-blue-100 text-blue-700",
  },
  {
    id: "empath",
    name: "The Empath",
    role: "Humanitarian & Socio-Economic Context",
    description: "Evaluates subjective intent (mens rea), economic duress, mitigating life circumstances, and rehabilitative potential.",
    accent: "rose",
    color: "#E11D48",
    badgeBg: "bg-rose-50 text-rose-700 border-rose-200",
    avatarBg: "bg-rose-100 text-rose-700",
  },
  {
    id: "jurist",
    name: "The Jurist",
    role: "Indian Statutory Framework & Precedent",
    description: "Applies statutory requirements under IPC/BNS, CrPC/BNSS, NI Act, and binding Supreme Court & High Court precedents.",
    accent: "emerald",
    color: "#059669",
    badgeBg: "bg-emerald-50 text-emerald-700 border-emerald-200",
    avatarBg: "bg-emerald-100 text-emerald-700",
  },
  {
    id: "skeptic",
    name: "The Skeptic",
    role: "Evidentiary Vulnerabilities & Contradictions",
    description: "Challenges standard police narratives, prosecutorial gaps, missing corroboration, and procedural lapses.",
    accent: "amber",
    color: "#D97706",
    badgeBg: "bg-amber-50 text-amber-700 border-amber-200",
    avatarBg: "bg-amber-100 text-amber-700",
  }
];
