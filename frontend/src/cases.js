/**
 * cases.js - Placeholder Indian summary court cases for JuryX
 * Focuses on summary/petty offences typically heard by Judicial Magistrates
 */

export const SAMPLE_CASES = [
  {
    id: "CASE-IN-2024-001",
    title: "Cheque Dishonour under Section 138 NI Act",
    statute: "Negotiable Instruments Act, 1881 (Sec. 138/147)",
    court: "Court of Metropolitan Magistrate (Special NI Act), Delhi",
    complainant: "M/s Sharma Wholesale Electricals",
    accused: "Rajesh Verma (Proprietor, Verma Electronics)",
    disputed_amount: "₹45,000",
    facts: "A cheque of ₹45,000 bounced due to 'Insufficient Funds'. Complainant served statutory 15-day notice via Speed Post. Accused claims cheque was handed as security deposit prior to seasonal supply which had defective goods, but lacks formal written rejection note.",
    questions_for_jury: [
      "Is the statutory presumption of debt under Section 139 rebutted?",
      "Is compounding or Lok Adalat referral appropriate rather than custodial sentencing?",
      "What reasonable installment or compensation schedule should be advised?"
    ]
  },
  {
    id: "CASE-IN-2024-002",
    title: "Rash & Negligent Driving Causing Minor Hurt",
    statute: "Bharatiya Nyaya Sanhita (BNS) Sec. 281 & 125(a) / IPC Sec. 279 & 337",
    court: "Judicial Magistrate First Class, Bengaluru",
    complainant: "State / Sub-Inspector Traffic Division",
    accused: "Arun K. (Cab Driver)",
    disputed_amount: "₹15,000 (Medical Restitution Claim)",
    facts: "Accused's vehicle clipped a two-wheeler at a roundabout during evening peak hours. Victim sustained minor abrasions and bicycle damage. Accused contends visibility was impaired by broken municipal streetlights and erratic lane switching by the cyclist.",
    questions_for_jury: [
      "Does the act meet the threshold of criminal rashness versus mere negligence?",
      "Should this summary matter be disposed of with a fine and victim compensation?"
    ]
  },
  {
    id: "CASE-IN-2024-003",
    title: "Public Nuisance & Commercial Encroachment",
    statute: "BNS Sec. 290 / IPC Sec. 290 & Municipal Corporation Act",
    court: "Special Municipal Magistrate, Mumbai",
    complainant: "Resident Welfare Association (RWA), Bandra West",
    accused: "Gourmet Bites Cloud Kitchen",
    disputed_amount: "N/A (Injunctive & Fine)",
    facts: "RWA alleges the cloud kitchen operates industrial exhaust blowers after 11 PM and blocks residential sidewalk with delivery bikes. Cloud kitchen asserts valid commercial trade license and willingness to install acoustic baffles.",
    questions_for_jury: [
      "Does late-night acoustic output qualify as actionable public nuisance in mixed-use zone?",
      "Can a mediated consent order resolve sidewalk blockage without business closure?"
    ]
  },
  {
    id: "CASE-IN-2025-1190",
    title: "Alleyway Brawl & Disputed Assault with Bucket Handle",
    statute: "Bharatiya Nyaya Sanhita (BNS) Sec. 115(2) / BNSS Sec. 35(3) & 283",
    court: "Judicial Magistrate First Class, Rohini Courts (Outer District), Delhi",
    complainant: "Dharmveer (Injured, Sultanpuri)",
    accused: "Pappu Chauhan (Carpenter, Sultanpuri)",
    disputed_amount: "₹10,000 (Medical & Restitution Claim)",
    facts: "Complainant alleges accused struck him on left shoulder and forehead with a steel bucket handle over a motorcycle blocking Gali No. 5. Accused contends complainant aggressively kicked bike over and fell against a Delhi Jal Board water tanker angle-iron frame during mutual scuffle. MLC records 1.5cm forehead laceration (simple blunt trauma) but ZERO shoulder injury. Independent neighbour Sunita Devi heard metallic thud against water stand and saw no weapon. Delayed witness Ramesh had obstructed view at dusk. IO failed to seize 14-second terrace mobile video under Section 63 BSA or recover any weapon.",
    questions_for_jury: [
      "Does the complete absence of shoulder injury on MLC No. 4471 create reasonable doubt regarding the use of a weapon?",
      "Is the accused's accidental collision defence with the DJB water tanker frame substantiated by independent witness Sunita Devi?",
      "Given investigative lapses under Section 63 BSA and the neighbourly nature of the dispute, is compounding under Section 290 BNSS or acquittal on benefit of doubt appropriate?"
    ]
  }
];
