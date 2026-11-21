
"use strict";

/* =========================================
   JURYX · FRONTEND DEMO DATA
   All juror responses are simulated.
========================================= */

const DATA = {
  cases: [
    {
      title: "Petty Theft",
      short: "BNS 303(2)",
      fir: "FIR 112/2026 (sample). Ramesh Kumar is accused of taking packaged food worth ₹640 from a grocery shop at night.",
      sections: "BNS Section 303(2), theft",
      evidence: [
        "CCTV clip (timestamp is 20 minutes off from the FIR)",
        "Shopkeeper's statement",
        "Recovered items (custody record incomplete)"
      ],
      round1: [
        {
          juror: "Analyst",
          vote: "SUPPORT",
          text: "CCTV places the accused at the shop, but its timestamp is 20 minutes off from the FIR. The timeline requires verification."
        },
        {
          juror: "Empath",
          vote: "ABSTAIN",
          text: "The accused is alleged to have taken food items. Socio-economic circumstances and intent should be examined before reaching a conclusion."
        },
        {
          juror: "Jurist",
          vote: "SUPPORT",
          text: "The alleged facts may fall within the theft provision, but every statutory ingredient and the evidence supporting it must be verified."
        },
        {
          juror: "Skeptic",
          vote: "OPPOSE",
          text: "The chain of custody for the recovered items has a gap. The reliability of the CCTV timestamp also needs examination."
        }
      ],
      round2: [
        {
          juror: "Analyst",
          vote: "ABSTAIN",
          text: "After considering the other arguments, I cannot rely on the CCTV timeline until the timestamp discrepancy is resolved."
        },
        {
          juror: "Empath",
          vote: "ABSTAIN",
          text: "The humanitarian context deserves consideration, but it cannot replace proof of the alleged act. More information is required."
        },
        {
          juror: "Jurist",
          vote: "SUPPORT",
          text: "The legal ingredients remain relevant, but the court must evaluate admissible evidence and the defence version before making findings."
        },
        {
          juror: "Skeptic",
          vote: "OPPOSE",
          text: "The custody gap remains unresolved. The prosecution should establish the integrity of the recovered material and the CCTV record."
        }
      ]
    },

    {
      title: "Cheque Bounce",
      short: "NI Act 138",
      fir: "Complaint 87/2026 (sample). Sunita Traders says a cheque of ₹1,50,000 given by Anil Mehta bounced for insufficient funds.",
      sections: "Negotiable Instruments Act, Section 138",
      evidence: [
        "Cheque and bank return memo",
        "Legal demand notice sent by post",
        "Postal receipt (delivery date unclear)"
      ],
      round1: [
        {
          juror: "Analyst",
          vote: "SUPPORT",
          text: "The return memo records insufficient funds. The cheque details and relevant dates should be compared with the original documents."
        },
        {
          juror: "Empath",
          vote: "ABSTAIN",
          text: "The financial impact on the complainant matters. The possibility of settlement may be considered separately from the legal findings."
        },
        {
          juror: "Jurist",
          vote: "SUPPORT",
          text: "Section 138 requires examination of the legally enforceable debt, cheque presentation, dishonour, notice and payment timelines."
        },
        {
          juror: "Skeptic",
          vote: "OPPOSE",
          text: "The delivery date of the demand notice is unclear. The notice timeline may be a decisive issue."
        }
      ],
      round2: [
        {
          juror: "Analyst",
          vote: "ABSTAIN",
          text: "The documents appear relevant, but the unclear notice delivery date prevents a confident conclusion from the supplied record."
        },
        {
          juror: "Empath",
          vote: "ABSTAIN",
          text: "Settlement could be explored, but the court should first establish the relevant facts and give both parties a fair opportunity."
        },
        {
          juror: "Jurist",
          vote: "ABSTAIN",
          text: "The statutory requirements must be tested against the actual dates and proof of service. The current summary does not resolve that issue."
        },
        {
          juror: "Skeptic",
          vote: "OPPOSE",
          text: "The notice delivery record remains unclear. The complainant should provide reliable postal or service records."
        }
      ]
    },

    {
      title: "Traffic Violation",
      short: "MV Act 119/177",
      fir: "Challan 5521/2026 (sample). Vikram Singh is accused of crossing a red signal. A camera image was sent as proof.",
      sections: "Motor Vehicles Act Section 119 read with Section 177",
      evidence: [
        "Camera image with number plate visible",
        "Signal timing log",
        "Vehicle owner and driver may be different people"
      ],
      round1: [
        {
          juror: "Analyst",
          vote: "SUPPORT",
          text: "The plate and red signal are visible in the camera image. The signal timing record should be checked."
        },
        {
          juror: "Empath",
          vote: "ABSTAIN",
          text: "The record does not describe the driver's circumstances or whether there were relevant mitigating factors."
        },
        {
          juror: "Jurist",
          vote: "SUPPORT",
          text: "The alleged conduct may engage the relevant traffic provisions, subject to verification of the facts and applicable requirements."
        },
        {
          juror: "Skeptic",
          vote: "OPPOSE",
          text: "The challan identifies the vehicle owner, but the record does not establish who was driving at the time."
        }
      ],
      round2: [
        {
          juror: "Analyst",
          vote: "SUPPORT",
          text: "The image supports the vehicle's presence at the signal. However, the identity of the driver must be separately established."
        },
        {
          juror: "Empath",
          vote: "ABSTAIN",
          text: "The debate does not provide enough information about the driver's identity or circumstances to change my position."
        },
        {
          juror: "Jurist",
          vote: "ABSTAIN",
          text: "The relevant traffic rule may apply, but the evidence connecting the alleged conduct to the named person requires examination."
        },
        {
          juror: "Skeptic",
          vote: "OPPOSE",
          text: "Vehicle ownership alone should not be treated as proof of driver identity. The evidentiary gap remains."
        }
      ]
    }
  ]
};

/* =========================================
   HELPERS AND STATE
========================================= */

const $ = id => document.getElementById(id);
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
const reduceMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
).matches;

function el(tag, cls, text) {
  const node = document.createElement(tag);
  if (cls) node.className = cls;
  if (text !== undefined) node.textContent = text;
  return node;
}

function escapeHTML(value) {
  return String(value ?? "").replace(/[&<>"']/g, char => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  })[char]);
}

let current = DATA.cases[0];
let running = false;
let finished = false;
let decision = null;
let elapsed = "";
let skip = false;
let isCustomCase = false;

let audit = null;

const AGENTS = ["Analyst", "Empath", "Jurist", "Skeptic"];

const COLOR = {
  Analyst: "#4f8ef7",
  Empath: "#e0558f",
  Jurist: "#d4af37",
  Skeptic: "#9b6bd6",
  "Head Agent": "#e6c158"
};

function createAudit(caseData) {
  return {
    application: "JuryX",
    reportType: "Frontend deliberation audit",
    version: "1.0",
    generatedAt: new Date().toISOString(),

    execution: {
      mode: "simulated-frontend",
      startedAt: null,
      completedAt: null,
      elapsed: null
    },

    case: {
      title: caseData.title,
      type: caseData.sections,
      fir: caseData.fir,
      evidence: [...caseData.evidence]
    },

    rounds: {
      round1: [],
      round2: []
    },

    initialVotes: {},
    finalVotes: {},
    tally: null,
    consensus: null,
    reviewFlags: [],
    advisory: null,

    magistrate: {
      decision: "NOT_RECORDED",
      notes: "",
      decidedAt: null
    },

    safeguards: {
      advisoryOnly: true,
      humanMagistrateRetainsFinalAuthority: true,
      responsesAreSimulated: true
    }
  };
}

/* =========================================
   STEP TRACKER
========================================= */

function setStep(step) {
  [...$("steps").children].forEach((item, index) => {
    item.className =
      index < step ? "done" :
      index === step ? "cur" : "";
  });
}

function setRoundLabel(text) {
  $("roundLabel").textContent = text;
}

/* =========================================
   SPEAKER / AVATAR
========================================= */

function setSpeaker(name) {
  $("bench").classList.toggle("live", !!name);

  document.querySelectorAll(".av").forEach(avatar => {
    avatar.classList.toggle(
      "on",
      avatar.dataset.j === name
    );
  });
}

/* =========================================
   VOTE HELPERS
========================================= */

function voteBadge(vote) {
  const cls = vote === "SUPPORT"
    ? "v-g"
    : vote === "OPPOSE"
      ? "v-n"
      : "v-a";

  return el("span", "vote " + cls, vote);
}

function calculateTally(votes) {
  const tally = {
    SUPPORT: 0,
    OPPOSE: 0,
    ABSTAIN: 0
  };

  Object.values(votes).forEach(vote => {
    if (Object.prototype.hasOwnProperty.call(tally, vote)) {
      tally[vote]++;
    }
  });

  return tally;
}

function getConsensus(tally) {
  const max = Math.max(
    tally.SUPPORT,
    tally.OPPOSE,
    tally.ABSTAIN
  );

  const winners = Object.keys(tally).filter(
    key => tally[key] === max
  );

  if (winners.length !== 1) {
    return "HUNG_BENCH";
  }

  if (winners[0] === "ABSTAIN") {
    return "NO_CLEAR_RECOMMENDATION";
  }

  if (max < 3) {
    return "NO_CLEAR_CONSENSUS";
  }

  return winners[0] + "_MAJORITY";
}

function updateVotes(votes) {
  const tally = calculateTally(votes);

  $("voteText").textContent =
    `Support: ${tally.SUPPORT} | ` +
    `Oppose: ${tally.OPPOSE} | ` +
    `Abstain: ${tally.ABSTAIN}`;

  const total = AGENTS.length;

  $("barFill").style.width =
    (tally.SUPPORT / total * 100) + "%";

  [...$("dots").children].forEach((dot, index) => {
    const vote = Object.values(votes)[index];

    dot.className =
      vote === "SUPPORT" ? "g" :
      vote === "OPPOSE" ? "n" :
      vote === "ABSTAIN" ? "a" : "";
  });

  return tally;
}

/* =========================================
   SPOTLIGHT POPUP
========================================= */

async function openSpot(agentName) {
  const spot = $("spot");
  const card = $("spotCard");

  card.style.setProperty("--c", COLOR[agentName]);

  $("spotAv").textContent =
    agentName === "Head Agent" ? "⚖" : agentName[0];

  $("spotName").textContent = agentName;
  $("spotMsg").textContent = "";

  $("spotVerdict").hidden = true;
  $("spotVerdict").textContent = "";

  card.classList.toggle(
    "head-spot",
    agentName === "Head Agent"
  );

  spot.hidden = false;

  card.style.transition = "none";
  card.style.setProperty("--dx", "0px");
  card.style.setProperty("--dy", "0px");

  const cardRect = card.getBoundingClientRect();

  let anchor;

  if (agentName === "Head Agent") {
    anchor = document.querySelector(".head-icon");
  } else {
    anchor = document.querySelector(
      `.av[data-j="${agentName}"] b`
    );
  }

  if (anchor) {
    const rect = anchor.getBoundingClientRect();

    card.style.setProperty(
      "--dx",
      (rect.left + rect.width / 2 -
        (cardRect.left + cardRect.width / 2)) + "px"
    );

    card.style.setProperty(
      "--dy",
      (rect.top + rect.height / 2 -
        (cardRect.top + cardRect.height / 2)) + "px"
    );
  }

  void card.offsetWidth;
  card.style.transition = "";

  spot.classList.add("open");
  await sleep(reduceMotion ? 0 : 550);
}

async function closeSpot() {
  $("spot").classList.remove("open");
  await sleep(reduceMotion ? 0 : 550);
  $("spot").hidden = true;
}

async function typeText(node, text) {
  for (let i = 1; i <= text.length; i++) {
    if (skip || reduceMotion) {
      node.textContent = text;
      return;
    }

    node.textContent = text.slice(0, i);
    await sleep(12);
  }
}

async function waitSkippable(ms) {
  const end = performance.now() + ms;

  while (performance.now() < end && !skip) {
    await sleep(40);
  }
}

/* =========================================
   DEBATE MESSAGES
========================================= */

function addBubble(message, round) {
  const bubble = el(
    "div",
    "bubble " + message.juror
  );

  bubble.dataset.i = message.juror[0];

  const name = el("p", "name", message.juror);
  name.appendChild(voteBadge(message.vote));

  const roundTag = el(
    "span",
    "round-tag",
    round
  );

  const text = el("p", "msg", message.text);

  bubble.append(name, roundTag, text);

  $("chat").appendChild(bubble);
  $("chat").scrollTop = $("chat").scrollHeight;
}

async function speak(message, round) {
  skip = false;

  await openSpot(message.juror);

  const msg = $("spotMsg");
  msg.classList.add("thinking");

  await waitSkippable(reduceMotion ? 0 : 450);

  msg.classList.remove("thinking");

  await typeText(msg, message.text);

  $("spotName").appendChild(voteBadge(message.vote));

  await waitSkippable(900);
  await closeSpot();

  addBubble(message, round);
}

/* =========================================
   ROUND 1
========================================= */

async function runRoundOne() {
  setStep(1);
  setRoundLabel("ROUND 1 · INITIAL VOTES");
  $("headStatus").textContent =
    "Four agents are examining the case...";

  for (const message of current.round1) {
    setSpeaker(message.juror);

    await speak(message, "ROUND 1 · INITIAL");

    audit.rounds.round1.push({
      ...message,
      timestamp: new Date().toISOString()
    });

    audit.initialVotes[message.juror] = message.vote;

    await sleep(250);
  }

  setSpeaker(null);
}

/* =========================================
   ROUND 2
========================================= */

async function runRoundTwo() {
  setStep(2);
  setRoundLabel("ROUND 2 · REBUTTALS");
  $("headStatus").textContent =
    "Agents are reviewing opposing arguments...";

  for (const message of current.round2) {
    setSpeaker(message.juror);

    await speak(message, "ROUND 2 · REBUTTAL");

    audit.rounds.round2.push({
      ...message,
      timestamp: new Date().toISOString()
    });

    audit.finalVotes[message.juror] = message.vote;

    await sleep(250);
  }

  setSpeaker(null);
}

/* =========================================
   HEAD AGENT STATEMENT CHECKS
========================================= */

function generateReviewFlags() {
  const allText = (
    current.fir + " " + current.evidence.join(" ")
  ).toLowerCase();

  const flags = [];

  if (
    allText.includes("incomplete") ||
    allText.includes("unclear") ||
    allText.includes("gap") ||
    allText.includes("off")
  ) {
    flags.push({
      ok: false,
      juror: "Analyst",
      note: "Potential evidence or timeline inconsistency requires verification."
    });
  } else {
    flags.push({
      ok: true,
      juror: "Analyst",
      note: "No explicit timeline discrepancy identified in the supplied summary."
    });
  }

  flags.push({
    ok: true,
    juror: "Empath",
    note: "Human context should be considered separately from proof of the alleged offence."
  });

  flags.push({
    ok: true,
    juror: "Jurist",
    note: "Applicable statutory ingredients and procedural requirements require legal verification."
  });

  if (
    allText.includes("different") ||
    allText.includes("missing") ||
    allText.includes("incomplete") ||
    allText.includes("unclear")
  ) {
    flags.push({
      ok: false,
      juror: "Skeptic",
      note: "A potential evidentiary gap or disputed fact remains unresolved."
    });
  } else {
    flags.push({
      ok: true,
      juror: "Skeptic",
      note: "No explicit contradiction was identified in the supplied summary."
    });
  }

  flags.push({
    ok: false,
    juror: "System",
    note: "Original documents, admissibility, authenticity and the defence response must be independently examined."
  });

  return flags;
}

function addCheck(check) {
  const li = el(
    "li",
    "check " + (check.ok ? "ok" : "warn")
  );

  li.append(
    el("span", "icon", check.ok ? "✔" : "⚠")
  );

  const p = el("p");
  p.append(
    el("b", "", check.juror + " "),
    document.createTextNode(check.note)
  );

  li.appendChild(p);
  $("checks").appendChild(li);
}

/* =========================================
   FINAL CONSENSUS
========================================= */

function createAdvisory(tally, consensus) {
  let verdict = "No clear consensus";
  let summary = "";

  if (consensus === "HUNG_BENCH") {
    verdict = "HUNG BENCH";
    summary =
      "The final vote is tied. The bench has not reached a majority recommendation. The magistrate should independently review the complete record and the competing arguments.";
  } else if (consensus === "SUPPORT_MAJORITY") {
    verdict = "Support majority";
    summary =
      "A majority of jurors support the proposition under consideration. This is an advisory voting result only and is not a finding of guilt.";
  } else if (consensus === "OPPOSE_MAJORITY") {
    verdict = "Opposition majority";
    summary =
      "A majority of jurors oppose the proposition under consideration. This is not a finding of innocence or a judicial determination.";
  } else if (consensus === "NO_CLEAR_RECOMMENDATION") {
    verdict = "No clear recommendation";
    summary =
      "Abstentions dominate the final vote. The bench does not provide a clear recommendation. Additional material and independent judicial review are required.";
  } else {
    verdict = "No clear majority";
    summary =
      "The final votes do not establish a clear majority. The magistrate should consider the individual arguments and review the case independently.";
  }

  return {
    verdict,
    summary,
    tally,
    consensus
  };
}

function showResult(advisory) {
  const result = $("result");

  result.replaceChildren();
  result.className = "done";

  result.append(
    el("p", "label", "HEAD AGENT · FINAL ADVISORY"),
    el("h4", "", advisory.verdict),
    el("p", "", advisory.summary),
    el(
      "p",
      "note",
      "Advisory only. This frontend simulation does not make judicial findings. The magistrate makes the final decision."
    )
  );
}

async function speakHead(advisory) {
  skip = false;

  await openSpot("Head Agent");

  const verdict = $("spotVerdict");
  verdict.hidden = false;
  verdict.textContent = advisory.verdict;

  const msg = $("spotMsg");
  msg.classList.add("thinking");

  await waitSkippable(reduceMotion ? 0 : 500);

  msg.classList.remove("thinking");
  await typeText(msg, advisory.summary);

  await waitSkippable(1500);
  await closeSpot();
}

function showConsensus(advisory) {
  $("consensus").textContent = advisory.consensus;
  $("consensusText").textContent = advisory.summary;
}

/* =========================================
   RESET OUTPUT
========================================= */

function clearOutput() {
  $("chat").replaceChildren();
  $("checks").replaceChildren();
  $("result").replaceChildren();

  $("result").className = "";
  $("judge").hidden = true;

  $("judgeMsg").textContent = "";
  $("notes").value = "";

  $("timer").textContent = "";
  $("roundLabel").textContent = "Awaiting deliberation";

  $("consensus").textContent = "Awaiting deliberation";
  $("consensusText").textContent =
    "The final consensus will appear here.";

  $("voteText").textContent =
    "Support: 0 | Oppose: 0 | Abstain: 0";

  $("barFill").style.width = "0%";

  [...$("dots").children].forEach(dot => {
    dot.className = "";
  });

  decision = null;
  finished = false;
  elapsed = "";
  audit = null;

  setSpeaker(null);
  setStep(0);
}

/* =========================================
   CASE SELECTOR
========================================= */

function displayCase(caseData) {
  const file = $("caseFile");

  file.replaceChildren(
    el("h3", "", caseData.title + " · case file"),
    el("p", "", caseData.fir),
    el("p", "sec", "Sections: " + caseData.sections),
    el("ul")
  );

  caseData.evidence.forEach(item => {
    file.lastChild.appendChild(el("li", "", item));
  });
}

function selectCase(index) {
  if (running) return;

  current = DATA.cases[index];
  isCustomCase = false;

  document.querySelectorAll(".case-btn").forEach((button, i) => {
    button.classList.toggle("on", i === index);
  });

  displayCase(current);
  clearOutput();

  $("headStatus").textContent =
    "Case loaded. Press Start.";
}

function buildCases() {
  DATA.cases.forEach((caseData, index) => {
    const button = el("button", "case-btn");

    button.type = "button";
    button.append(
      el("b", "", caseData.title),
      el("span", "", caseData.short)
    );

    button.addEventListener("click", () => {
      selectCase(index);
    });

    $("cases").appendChild(button);
  });
}

/* =========================================
   CUSTOM CASE INPUT
========================================= */

$("loadCustomBtn").addEventListener("click", () => {
  if (running) return;

  const title = $("customTitle").value.trim();
  const type = $("customType").value.trim();
  const fir = $("customFir").value.trim();
  const evidenceText = $("customEvidence").value.trim();

  if (!title || !type || !fir || !evidenceText) {
    showToast("Please fill in all custom case fields.");
    return;
  }

  current = {
    title,
    short: "CUSTOM CASE",
    sections: type,
    fir,
    evidence: evidenceText
      .split(/\n|;/)
      .map(item => item.trim())
      .filter(Boolean),

    round1: [
      {
        juror: "Analyst",
        vote: "ABSTAIN",
        text: "The custom case has been received. The facts, timeline and original evidence must be verified before a reliable position can be formed."
      },
      {
        juror: "Empath",
        vote: "ABSTAIN",
        text: "The supplied summary does not establish the full human context, intent or mitigating circumstances. Both sides should be heard."
      },
      {
        juror: "Jurist",
        vote: "ABSTAIN",
        text: "The applicable legal provisions and their essential ingredients must be independently checked against the complete case record."
      },
      {
        juror: "Skeptic",
        vote: "OPPOSE",
        text: "The summary alone cannot establish the reliability or completeness of the evidence. Missing documents and the defence response must be examined."
      }
    ],

    round2: [
      {
        juror: "Analyst",
        vote: "ABSTAIN",
        text: "After considering the other positions, the supplied information is still insufficient to establish a reliable chronology and evidentiary chain."
      },
      {
        juror: "Empath",
        vote: "ABSTAIN",
        text: "Human context remains important, but the present record does not justify changing my initial position."
      },
      {
        juror: "Jurist",
        vote: "ABSTAIN",
        text: "The legal analysis requires the full facts, applicable statutory text and procedural record. No final legal conclusion can be drawn from this summary."
      },
      {
        juror: "Skeptic",
        vote: "OPPOSE",
        text: "The evidentiary limitations remain. The magistrate should review the original documents and the response of the opposing party."
      }
    ]
  };

  isCustomCase = true;

  document.querySelectorAll(".case-btn").forEach(button => {
    button.classList.remove("on");
  });

  displayCase(current);
  clearOutput();

  $("headStatus").textContent =
    "Custom case loaded. Press Start.";

  showToast("Custom case loaded.");
});

/* =========================================
   TOAST
========================================= */

function showToast(message) {
  const toast = $("toast");

  toast.textContent = message;
  toast.classList.add("show");

  clearTimeout(showToast.timer);

  showToast.timer = setTimeout(() => {
    toast.classList.remove("show");
  }, 2500);
}

/* =========================================
   MAIN DELIBERATION FLOW
========================================= */

async function startDeliberation() {
  if (running) return;

  running = true;

  $("startBtn").disabled = true;
  $("startBtn").textContent = "Deliberating...";

  document.querySelectorAll(".case-btn").forEach(button => {
    button.disabled = true;
  });

  $("loadCustomBtn").disabled = true;

  clearOutput();

  audit = createAudit(current);
  audit.execution.startedAt = new Date().toISOString();

  const startTime = performance.now();

  try {
    $("headStatus").textContent = "Case received by the bench...";

    await runRoundOne();
    await runRoundTwo();

    /* Final vote tally */
    const tally = updateVotes(audit.finalVotes);
    const consensus = getConsensus(tally);

    audit.tally = tally;
    audit.consensus = consensus;

    /* Head Agent review */
    setStep(3);
    setRoundLabel("HEAD AGENT · REVIEWING");
    $("headStatus").textContent =
      "Reviewing statements and identifying gaps...";

    const flags = generateReviewFlags();
    audit.reviewFlags = flags;

    for (const check of flags) {
      addCheck(check);
      await sleep(350);
    }

    const advisory = createAdvisory(tally, consensus);
    audit.advisory = advisory;

    showConsensus(advisory);

    /* Head Agent popup and final advisory */
    await speakHead(advisory);
    showResult(advisory);

    setStep(4);
    setRoundLabel("DELIBERATION COMPLETE");

    elapsed = (
      (performance.now() - startTime) / 1000
    ).toFixed(1) + "s";

    $("timer").textContent =
      "Demo playback time: " + elapsed;

    $("headStatus").textContent = "Advisory ready";

    $("judge").hidden = false;

    audit.execution.completedAt = new Date().toISOString();
    audit.execution.elapsed = elapsed;

    finished = true;

    showToast("Both rounds completed.");

    $("result").scrollIntoView({
      behavior: "smooth",
      block: "center"
    });

  } catch (error) {
    console.error(error);

    $("headStatus").textContent =
      "Deliberation error";

    showToast("Something went wrong. Check the browser console.");

  } finally {
    running = false;

    $("startBtn").disabled = false;
    $("startBtn").textContent = "Start Again";

    document.querySelectorAll(".case-btn").forEach(button => {
      button.disabled = false;
    });

    $("loadCustomBtn").disabled = false;
  }
}

/* =========================================
   MAGISTRATE DECISION
========================================= */

document.querySelectorAll(".jbtn[data-d]").forEach(button => {
  button.addEventListener("click", () => {
    if (!finished || !audit) {
      showToast("Complete deliberation before recording a decision.");
      return;
    }

    const selected = button.dataset.d;
    const notes = $("notes").value.trim();

    if (selected === "Modified" && !notes) {
      showToast("Please explain the modification in the notes.");
      $("notes").focus();
      return;
    }

    decision = selected;

    audit.magistrate = {
      decision: selected,
      notes,
      decidedAt: new Date().toISOString()
    };

    $("judgeMsg").textContent =
      "Magistrate decision recorded: " + selected +
      ". The advisory remains non-binding.";

    document.querySelectorAll(".jbtn[data-d]").forEach(item => {
      item.classList.toggle("selected", item === button);
    });

    showToast("Magistrate decision recorded.");
  });
});

/* =========================================
   JSON AUDIT REPORT
========================================= */

function downloadAudit() {
  if (!finished || !audit) {
    showToast("Complete deliberation before downloading the audit.");
    return;
  }

  /* Keep the report up to date */
  audit.generatedAt = new Date().toISOString();

  const report = JSON.stringify(audit, null, 2);

  const blob = new Blob([report], {
    type: "application/json"
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  const fileName = current.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

  link.href = url;
  link.download = "juryx-" + fileName + "-audit.json";

  document.body.appendChild(link);
  link.click();
  link.remove();

  URL.revokeObjectURL(url);

  showToast("JSON audit report downloaded.");
}

$("dlBtn").addEventListener("click", downloadAudit);

/* =========================================
   POPUP SKIP CONTROLS
========================================= */

$("spot").addEventListener("click", () => {
  skip = true;
});

document.addEventListener("keydown", event => {
  if (event.key === "Escape") {
    skip = true;
  }
});

/* =========================================
   INITIALIZE
========================================= */

$("startBtn").addEventListener("click", startDeliberation);

buildCases();
selectCase(0);

console.log("JuryX frontend initialized.");
console.log("Mode: Simulated frontend demonstration.");
