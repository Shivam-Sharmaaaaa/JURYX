// ========================================
// JURYX — PDF.JS CONFIGURATION
// PDF.js loads only when a PDF is selected.
// The rest of the website works without the CDN.
// ========================================

const PDFJS_VERSION = "6.5.438";

let pdfjsLib = null;
let pdfLibraryPromise = null;

async function loadPdfLibrary() {
  if (pdfjsLib) return pdfjsLib;

  if (!pdfLibraryPromise) {
    pdfLibraryPromise = import(
      `https://cdn.jsdelivr.net/npm/pdfjs-dist@${PDFJS_VERSION}/build/pdf.mjs`
    )
      .then(library => {
        library.GlobalWorkerOptions.workerSrc =
          `https://cdn.jsdelivr.net/npm/pdfjs-dist@${PDFJS_VERSION}/build/pdf.worker.mjs`;

        pdfjsLib = library;
        return library;
      })
      .catch(error => {
        pdfLibraryPromise = null;
        throw new Error(
          "Could not load the PDF reader. Check your internet connection and try again."
        );
      });
  }

  return pdfLibraryPromise;
}


// ========================================
// SAMPLE CASE DATA
// ========================================

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

      messages: [
        {
          juror: "Analyst",
          vote: "Guilty",
          text: "CCTV places the accused at the shop, but its timestamp is 20 minutes off from the FIR."
        },

        {
          juror: "Empath",
          vote: "Guilty",
          text: "The accused is unemployed and took food items. Mitigating factors should be noted."
        },

        {
          juror: "Jurist",
          vote: "Guilty",
          text: "The stated facts appear relevant to the ingredients of theft under Section 303 BNS. The evidence must still be verified."
        },

        {
          juror: "Skeptic",
          vote: "Not Guilty",
          text: "The chain of custody for the recovered items has a gap. That issue may create reasonable doubt."
        }
      ],

      checks: [
        {
          juror: "Analyst",
          ok: true,
          note: "Evidence supports presence. The 20-minute timestamp gap should be verified."
        },

        {
          juror: "Empath",
          ok: true,
          note: "Mitigating context may matter when considering consequences, not as proof of the offence."
        },

        {
          juror: "Jurist",
          ok: true,
          note: "The statutory ingredients should be matched against admissible evidence."
        },

        {
          juror: "Skeptic",
          ok: false,
          note: "The custody gap is unresolved and requires examination of the original record."
        }
      ],

      verdict: "Leans Guilty (3 to 1)",

      summary: "Most sample agents consider the allegation supported, but the Skeptic identifies an unresolved custody concern. A human reviewer should verify the original custody record and timestamp discrepancy before reaching any conclusion."
    },


    {
      title: "Cheque Bounce",
      short: "NI Act 138",

      fir: "Complaint 87/2026 (sample). Sunita Traders says a cheque of ₹1,50,000 given by Anil Mehta bounced for insufficient funds.",

      sections: "Negotiable Instruments Act, Section 138 (notice requirements must be checked)",

      evidence: [
        "Cheque and bank return memo",
        "Legal demand notice sent by post",
        "Postal receipt (delivery date unclear)"
      ],

      messages: [
        {
          juror: "Analyst",
          vote: "Guilty",
          text: "The sample return memo records insufficient funds and the cheque appears to be within its validity period."
        },

        {
          juror: "Empath",
          vote: "Guilty",
          text: "The amount may materially affect the complainant. Any settlement context should be recorded separately."
        },

        {
          juror: "Jurist",
          vote: "Guilty",
          text: "Section 138 requires strict statutory conditions, including timely notice and failure to pay within the prescribed period."
        },

        {
          juror: "Skeptic",
          vote: "Not Guilty",
          text: "The delivery date of the notice is unclear. The original postal record and statutory timelines need verification."
        }
      ],

      checks: [
        {
          juror: "Analyst",
          ok: true,
          note: "The cheque and return memo are relevant documents; original copies should be checked."
        },

        {
          juror: "Empath",
          ok: true,
          note: "Settlement is a separate consideration and should not be confused with proof of each ingredient."
        },

        {
          juror: "Jurist",
          ok: true,
          note: "The statutory timeline must be calculated from verified dates."
        },

        {
          juror: "Skeptic",
          ok: false,
          note: "Notice service and timing remain unresolved in this sample record."
        }
      ],

      verdict: "Leans Guilty (3 to 1)",

      summary: "The sample documents suggest a possible Section 138 matter, but the notice timeline is central. A human reviewer should verify the bank memo, notice dispatch and service records, and all statutory dates."
    },


    {
      title: "Traffic Violation",
      short: "MV Act 119/177",

      fir: "Challan 5521/2026 (sample). Vikram Singh is accused of crossing a red signal. A camera image was sent as proof.",

      sections: "Motor Vehicles Act, Sections 119 and 177 (verify current applicability)",

      evidence: [
        "Camera image with number plate visible",
        "Signal timing log",
        "Vehicle owner and driver may be different people"
      ],

      messages: [
        {
          juror: "Analyst",
          vote: "Guilty",
          text: "The plate and red signal appear visible in the sample camera image."
        },

        {
          juror: "Empath",
          vote: "Not Guilty",
          text: "The alleged violation is described as a first incident. Context may be relevant to any penalty assessment."
        },

        {
          juror: "Jurist",
          vote: "Guilty",
          text: "The cited provisions should be checked against the exact alleged conduct and applicable amendments."
        },

        {
          juror: "Skeptic",
          vote: "Not Guilty",
          text: "The challan is in the owner's name. The sample material does not independently identify who was driving."
        }
      ],

      checks: [
        {
          juror: "Analyst",
          ok: true,
          note: "The image may identify the vehicle, but driver identity is a separate question."
        },

        {
          juror: "Empath",
          ok: true,
          note: "Mitigation may affect consequences but does not establish or disprove the underlying event."
        },

        {
          juror: "Jurist",
          ok: true,
          note: "The statutory provision and penalty must be verified against current law."
        },

        {
          juror: "Skeptic",
          ok: false,
          note: "The driver's identity is not established by the described material."
        }
      ],

      verdict: "Split (2 to 2)",

      summary: "The sample image may show a vehicle crossing a signal, but the driver is not identified in the supplied summary. A human reviewer should verify the original footage, signal log and applicable liability rules."
    }

  ]
};


// ========================================
// HELPERS AND STATE
// ========================================

const $ = id => document.getElementById(id);

const sleep = ms =>
  new Promise(resolve => setTimeout(resolve, ms));


const IMAGES = {
  Analyst: "./Analyst Emblem_ Law, Books, and Scales.png",

  Empath: "./Empath Marble Emblem with Quill and Scales.png",

  Jurist: "./Marble Jurist Emblem with Gavel and Scales.png",

  Skeptic: "./Skeptic’s Marble Scales Emblem.png",

  "Head Agent": "./head-agent.jpg"
};


const reduced =
  matchMedia("(prefers-reduced-motion: reduce)").matches;


let current = DATA.cases[0];

let running = false;
let finished = false;
let decision = "";

let elapsed = "—";
let skip = false;

let roundHistory = [];


// PDF state

let uploadedPdf = null;
let pdfOriginalFacts = "";
let pdfTextWasApplied = false;
let pdfExtractedText = "";
let pdfPageCount = 0;

const MAX_PDF_SIZE = 25 * 1024 * 1024;
const MAX_EXTRACTED_CHARS = 100000;


function el(tag, cls, text) {
  const node = document.createElement(tag);

  if (cls) node.className = cls;
  if (text !== undefined) node.textContent = text;

  return node;
}


// ========================================
// PDF UPLOAD — USER INTERFACE
// ========================================

function setPdfStatus(message, type = "") {
  const status = $("pdfStatus");

  status.textContent = message;
  status.className = "pdf-status";

  if (type) {
    status.classList.add(type);
  }
}


function formatFileSize(bytes) {
  if (bytes < 1024 * 1024) {
    return (bytes / 1024).toFixed(1) + " KB";
  }

  return (bytes / (1024 * 1024)).toFixed(2) + " MB";
}


function showPdfFile(file) {
  $("pdfMeta").hidden = false;
  $("pdfFileName").textContent = file.name;
  $("pdfFileSize").textContent = formatFileSize(file.size);
  $("pdfReady").textContent = "Selected";
}


function restorePdfOriginalFacts() {
  if (pdfTextWasApplied) {
    $("customFacts").value = pdfOriginalFacts;
  }
}


function removePdf() {
  restorePdfOriginalFacts();

  uploadedPdf = null;
  pdfOriginalFacts = "";
  pdfTextWasApplied = false;
  pdfExtractedText = "";
  pdfPageCount = 0;

  $("pdfInput").value = "";
  $("pdfMeta").hidden = true;
  $("pdfReady").textContent = "Ready";

  $("pdfRemove").hidden = true;

  setPdfStatus(
    "PDF removed. You can select another file or enter case facts manually."
  );
}


async function handlePdfFile(file) {
  if (!file) return;

  const isPdf =
    file.type === "application/pdf" ||
    file.name.toLowerCase().endsWith(".pdf");


  if (!isPdf) {
    setPdfStatus("Please choose a valid PDF file.", "error");
    return;
  }


  if (file.size === 0) {
    setPdfStatus("This file is empty.", "error");
    return;
  }


  if (file.size > MAX_PDF_SIZE) {
    setPdfStatus(
      "File is too large. Please choose a PDF smaller than 25 MB.",
      "error"
    );

    return;
  }


  // Restore facts from a previously selected PDF first.

  restorePdfOriginalFacts();

  pdfOriginalFacts = $("customFacts").value;
  pdfTextWasApplied = false;
  pdfExtractedText = "";
  pdfPageCount = 0;

  uploadedPdf = file;

  showPdfFile(file);

  $("pdfRemove").hidden = false;
  $("pdfReady").textContent = "Reading…";


  try {
    setPdfStatus("Loading PDF reader…");

    const library = await loadPdfLibrary();

    setPdfStatus("Opening PDF document…");

    const fileBuffer = await file.arrayBuffer();

    const loadingTask = library.getDocument({
      data: new Uint8Array(fileBuffer)
    });

    const pdf = await loadingTask.promise;

    pdfPageCount = pdf.numPages;

    const pageTexts = [];

    let totalCharacters = 0;
    let wasTruncated = false;


    for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber++) {

      setPdfStatus(
        `Extracting text — page ${pageNumber} of ${pdf.numPages}…`
      );

      const page = await pdf.getPage(pageNumber);

      const content = await page.getTextContent();

      const pageText = content.items
        .filter(item => typeof item.str === "string")
        .map(item => item.str)
        .join(" ")
        .replace(/[ \t]+/g, " ")
        .trim();


      if (pageText) {

        const remaining =
          MAX_EXTRACTED_CHARS - totalCharacters;


        if (remaining <= 0) {
          wasTruncated = true;
          break;
        }


        let textToAdd = pageText;


        if (textToAdd.length > remaining) {
          textToAdd = textToAdd.slice(0, remaining);
          wasTruncated = true;
        }


        pageTexts.push(
          `PAGE ${pageNumber}\n${textToAdd}`
        );


        totalCharacters += textToAdd.length;


        if (wasTruncated) break;

      }

    }


    pdfExtractedText = pageTexts.join("\n\n");


    if (!pdfExtractedText.trim()) {

      $("pdfReady").textContent = "No text found";

      setPdfStatus(
        "The PDF opened, but no selectable text was found. It may be a scanned image-only PDF; OCR is not included. You can still enter the facts manually.",
        "error"
      );

      return;
    }


    // Place the extracted PDF text in the editable case facts field.

    const extractedHeader =
      `Extracted from PDF: ${file.name}\n` +
      `Pages: ${pdf.numPages}\n\n` +
      `EXTRACTED DOCUMENT TEXT\n\n`;


    $("customFacts").value =
      extractedHeader + pdfExtractedText;


    pdfTextWasApplied = true;


    // Use the file name as a case title if no title exists.

    if (!$("customTitle").value.trim()) {
      $("customTitle").value =
        file.name.replace(/\.pdf$/i, "");
    }


    $("pdfReady").textContent = "Text extracted";


    const truncationMessage = wasTruncated
      ? " The extracted text was limited to 100,000 characters."
      : "";


    setPdfStatus(
      `Successfully extracted text from ${pdf.numPages} page(s). ${totalCharacters.toLocaleString()} characters added to Case facts.${truncationMessage} Review the text below before using the case.`,
      "success"
    );


    $("customFacts").scrollIntoView({
      behavior: "smooth",
      block: "center"
    });


  } catch (error) {

    console.error("PDF extraction error:", error);

    $("pdfReady").textContent = "Could not read";

    setPdfStatus(
      error.message || "Unable to read this PDF. Try another file.",
      "error"
    );

  }
}


// ========================================
// PDF BUTTON AND DRAG-AND-DROP
// ========================================

$("pdfChoose").addEventListener("click", () => {
  $("pdfInput").click();
});


$("pdfInput").addEventListener("change", event => {
  const file = event.target.files?.[0];
  handlePdfFile(file);
});


$("pdfRemove").addEventListener("click", removePdf);


const pdfPanel = $("pdfUploadPanel");


["dragenter", "dragover"].forEach(eventName => {

  pdfPanel.addEventListener(eventName, event => {

    event.preventDefault();
    event.stopPropagation();

    pdfPanel.classList.add("drag-over");

  });

});


["dragleave", "drop"].forEach(eventName => {

  pdfPanel.addEventListener(eventName, event => {

    event.preventDefault();
    event.stopPropagation();

    pdfPanel.classList.remove("drag-over");

  });

});


pdfPanel.addEventListener("drop", event => {

  const file = event.dataTransfer?.files?.[0];

  if (file) {

    $("pdfInput").value = "";

    handlePdfFile(file);

  }

});


// ========================================
// REVIEW PROGRESS
// ========================================

function setStep(n) {

  [...$("steps").children].forEach((item, i) => {

    item.className =
      i < n ? "done" : i === n ? "cur" : "";

  });


  const labels = [
    "Case loaded",
    "Round 1: Initial review",
    "Round 2: Reconsideration",
    "Head Agent is reviewing both rounds",
    "Advisory is ready"
  ];


  $("stepText").textContent = n >= 5
    ? "Two-round advisory is ready"
    : labels[n] || "Waiting for deliberation";

}


function speaker(name) {

  $("bench").classList.toggle("live", !!name);

  document.querySelectorAll(".av").forEach(item => {

    item.classList.toggle("on", item.dataset.j === name);

  });

}


// ========================================
// VOTE DISPLAY
// ========================================

function votes(guilty, notGuilty, order) {

  if (guilty === null || notGuilty === null) {

    $("voteText").textContent =
      "Agent positions: not assessed — human review required";

    $("barFill").style.width = "0%";

    [...$("dots").children].forEach(item => item.className = "");

    return;
  }


  $("voteText").textContent =
    `Guilty: ${guilty} | Not Guilty: ${notGuilty}`;


  $("barFill").style.width =
    (guilty + notGuilty
      ? guilty / (guilty + notGuilty) * 100
      : 0) + "%";


  [...$("dots").children].forEach((item, i) => {
    item.className = order[i] || "";
  });

}


function badge(vote) {

  const className = vote === "Guilty"
    ? "v-g"
    : vote === "Not Guilty"
      ? "v-n"
      : "v-neutral";

  return el("span", "vote " + className, vote);

}


// ========================================
// AGENT SPOTLIGHT
// ========================================

async function openSpot(name, roundNumber = 1) {

  const spot = $("spot");

  const head = name === "Head Agent";

  const img = $("spotImage");


  $("spotAv").textContent = head ? "JX" : name[0];

  $("spotName").replaceChildren(
    document.createTextNode(name)
  );

  $("spotMsg").textContent = "";

  $("spotVerdict").hidden = true;


  $("spotRound").textContent = head
    ? "HEAD AGENT · FINAL SYNTHESIS"
    : `ROUND ${roundNumber} · ${roundNumber === 1 ? "INITIAL REVIEW" : "RECONSIDERATION"}`;


  img.classList.remove("loaded");

  img.hidden = false;

  img.onload = () => img.classList.add("loaded");

  img.onerror = () => {
    img.classList.remove("loaded");
    img.hidden = true;
  };

  img.alt = name + " profile";

  img.src = IMAGES[name] || "";


  spot.hidden = false;

  requestAnimationFrame(() => spot.classList.add("open"));

}


async function closeSpot() {

  const spot = $("spot");

  spot.classList.remove("open");

  await sleep(180);

  spot.hidden = true;

}


// ========================================
// AGENT TYPING ANIMATION
// ========================================

async function type(node, text) {

  node.textContent = text;

}


async function wait(ms) {

  const end = performance.now() + ms;

  while (performance.now() < end && !skip) {
    await sleep(40);
  }

}


async function speak(message, roundNumber) {

  skip = false;

  await openSpot(message.juror, roundNumber);

  $("spotMsg").textContent = message.text;

  $("spotName").append(badge(message.vote));

  await wait(520);

  await closeSpot();

  bubble(message, roundNumber);

}


// ========================================
// DELIBERATION CHAT
// ========================================

function bubble(message, roundNumber = 1) {

  const box = el("div", "bubble " + message.juror);

  box.dataset.i = message.juror[0];


  const roundLabel = el(
    "small",
    "bubble-round",
    `ROUND ${roundNumber}`
  );


  const name = el("p", "name", message.juror);

  name.append(badge(message.vote));


  box.append(
    roundLabel,
    name,
    el("p", "msg", message.text)
  );


  $("chat").append(box);

  $("chat").scrollTop = $("chat").scrollHeight;

}


// ========================================
// HEAD AGENT CHECKS
// ========================================

function addCheck(check) {

  const item = el(
    "li",
    "check " + (check.ok ? "ok" : "warn")
  );


  item.append(
    el("span", "icon", check.ok ? "✓" : "!")
  );


  const paragraph = el("p");


  paragraph.append(
    el("b", "", check.juror + " "),
    document.createTextNode(check.note)
  );


  item.append(paragraph);

  $("checks").append(item);

}


async function speakHead(data) {

  skip = false;

  await openSpot("Head Agent", 2);


  $("spotVerdict").hidden = false;

  $("spotVerdict").textContent = data.verdict;

  $("spotMsg").textContent = data.summary;


  await wait(700);

  await closeSpot();

}


// ========================================
// ROUND TWO AGENT FOLLOW-UP STATEMENTS
// ========================================

const ROUND_TWO_TEXT = {

  "Petty Theft": {

    Analyst: "Round 2: The CCTV discrepancy still needs source verification, but the clip may support presence if its original metadata is reliable.",

    Empath: "Round 2: Personal circumstances may be relevant to mitigation, but they do not by themselves establish or disprove the alleged taking.",

    Jurist: "Round 2: The alleged conduct may engage the stated theft provision; each statutory ingredient must still be proved with admissible evidence.",

    Skeptic: "Round 2: The recovered-items custody gap remains unresolved and should be checked before relying on that material."

  },


  "Cheque Bounce": {

    Analyst: "Round 2: The cheque and return memo remain relevant, but the original documents and all dates should be verified.",

    Empath: "Round 2: The complainant's financial impact and any settlement are relevant context, separate from proof of statutory requirements.",

    Jurist: "Round 2: The Section 138 requirements depend on verified notice, service and payment timelines; those dates are decisive checks.",

    Skeptic: "Round 2: The notice delivery date is still unclear, so compliance with the statutory timeline cannot be assumed from this sample record."

  },


  "Traffic Violation": {

    Analyst: "Round 2: The image may support the vehicle's presence at the signal, subject to checking the original footage and timing log.",

    Empath: "Round 2: First-incident context may matter when considering consequences, but it does not resolve who was driving.",

    Jurist: "Round 2: The cited provisions must be matched to the exact conduct and the current applicable rules before any conclusion.",

    Skeptic: "Round 2: The driver's identity remains unestablished in the supplied summary; vehicle ownership alone may not answer that question."

  }

};


function getRoundMessages(roundNumber) {

  if (roundNumber === 1) {

    return current.messages.map(message => ({ ...message }));

  }


  if (current.isCustom) {

    return current.messages.map(message => ({

      ...message,

      vote: "Not assessed",

      text: "Second review pass: " + message.text

    }));

  }


  const followUps = ROUND_TWO_TEXT[current.title] || {};


  return current.messages.map(message => ({

    ...message,

    text: followUps[message.juror] ||
      "Round 2: Recheck the original evidence and unresolved issues before relying on the initial position."

  }));

}


// ========================================
// ROUND-BY-ROUND HISTORY
// ========================================

function recordRoundHistory(
  roundNumber,
  messages,
  guilty,
  notGuilty
) {

  const custom = Boolean(current.isCustom);


  roundHistory.push({

    roundNumber,

    title: roundNumber === 1
      ? "Initial review"
      : "Reconsideration",

    messages: messages.map(message => ({ ...message })),

    guilty,

    notGuilty,

    custom,

    result: custom
      ? "No agent result — human verification required"
      : `${guilty} Guilty position(s) · ${notGuilty} Not Guilty position(s)`

  });


  renderRoundHistory();

}


function renderRoundHistory() {

  const container = $("roundHistory");

  if (!container) return;


  container.replaceChildren();


  if (!roundHistory.length) {

    container.append(
      el(
        "div",
        "empty",
        "Round-by-round results will appear here after deliberation begins."
      )
    );

    return;

  }


  roundHistory.forEach(round => {

    const card = el("article", "history-round");

    const head = el("div", "history-round-head");

    const heading = el("div");


    heading.append(

      el(
        "h4",
        "",
        `Round ${round.roundNumber} · ${round.title}`
      ),

      el(
        "p",
        "",
        round.roundNumber === 1
          ? "Initial agent positions"
          : "Agent reconsideration after Round 1"
      )

    );


    head.append(

      heading,

      el(
        "span",
        "history-count",
        round.custom ? "NOT ASSESSED" : "4 AGENTS"
      )

    );


    card.append(head);


    const agents = el("div", "history-agent-list");


    round.messages.forEach(message => {

      const item = el("div", "history-agent");

      const top = el("div", "history-agent-top");


      top.append(
        el("strong", "", message.juror),
        badge(message.vote)
      );


      item.append(
        top,
        el("p", "", message.text)
      );


      agents.append(item);

    });


    card.append(
      agents,
      el("div", "history-result", round.result)
    );


    container.append(card);

  });

}


// ========================================
// FINAL RESULT
// ========================================

function result(data) {

  $("result").className = "result-content";


  $("result").replaceChildren(

    el(
      "span",
      "label",
      "HEAD AGENT · SAMPLE ADVISORY"
    ),

    el("h4", "", data.verdict),

    el("p", "", data.summary),

    el(
      "p",
      "note",
      "Frontend demonstration using sample responses only. Not a legal opinion or judicial finding. Verify facts, law and evidence with qualified human reviewers."
    )

  );

}


// ========================================
// RESET WORKSPACE
// ========================================

function clear() {

  $("chat").replaceChildren();

  $("checks").replaceChildren();


  $("result").className = "empty";

  $("result").textContent =
    "The Head Agent advisory will appear here after deliberation.";


  $("judge").hidden = true;

  $("judgeMsg").textContent = "";

  $("notes").value = "";

  $("timer").textContent = "—";


  decision = "";

  finished = false;


  // Reset history when a new case or new run begins.

  roundHistory = [];

  renderRoundHistory();


  speaker(null);

  votes(0, 0, []);

  setStep(0);


  $("headStatus").textContent = "Ready to begin";

  $("startBtn").disabled = false;

  $("startBtn").textContent = "Start 2-round deliberation →";

}


// ========================================
// CASE SELECTION
// ========================================

function renderCase() {

  const file = $("caseFile");


  file.replaceChildren(

    el("h3", "", current.title + " · case summary"),

    el("p", "", current.fir),

    el("p", "sec", "Applicable sections: " + current.sections),

    el("b", "", "Evidence listed")

  );


  const list = el("ul");


  current.evidence.forEach(item => {

    list.append(el("li", "", item));

  });


  file.append(list);


  document.querySelectorAll(".case-btn").forEach(button => {

    button.classList.toggle(

      "on",

      Number(button.dataset.index) === DATA.cases.indexOf(current)

    );

  });


  clear();

}


function buildCases() {

  DATA.cases.forEach((data, index) => {

    const button = el("button", "case-btn");

    button.type = "button";

    button.dataset.index = index;


    button.append(

      el("b", "", data.title),

      el("span", "", data.short)

    );


    button.addEventListener("click", () => {

      if (running) return;

      current = data;

      renderCase();

    });


    $("cases").append(button);

  });

}


// ========================================
// CUSTOM CASE INTAKE
// ========================================

function customCase() {

  if (running) return;


  const title = $("customTitle").value.trim();

  const facts = $("customFacts").value.trim();


  if (!title || !facts) {

    alert("Enter a case title and case facts first.");

    return;

  }


  const evidenceInput = $("customEvidence").value.trim();


  const evidence = evidenceInput

    ? evidenceInput.split(",").map(x => x.trim()).filter(Boolean)

    : [];


  if (uploadedPdf) {

    evidence.unshift(
      `Uploaded PDF: ${uploadedPdf.name} (${pdfPageCount} pages)`
    );

  }


  if (!evidence.length) {

    evidence.push("No evidence summary supplied");

  }


  current = {

    isCustom: true,

    title,

    short: uploadedPdf ? "PDF CASE" : "CUSTOM CASE",

    fir: facts,

    sections:
      $("customSections").value.trim() ||
      "Not specified — human verification required",

    evidence,


    messages: [

      {

        juror: "Analyst",

        vote: "Not assessed",

        text: "This custom case has not been analysed by a live model. The extracted PDF text and supplied facts must be checked against the original source document."

      },

      {

        juror: "Empath",

        vote: "Not assessed",

        text: "Context and circumstances have not been independently established from source material."

      },

      {

        juror: "Jurist",

        vote: "Not assessed",

        text: "Applicable provisions and their ingredients require independent legal verification."

      },

      {

        juror: "Skeptic",

        vote: "Not assessed",

        text: "The supplied summary may omit important facts, contrary evidence or procedural issues."

      }

    ],


    checks: [

      {

        juror: "Analyst",

        ok: false,

        note: "PDF text is available for human review, but no automated evidence analysis has been performed."

      },

      {

        juror: "Empath",

        ok: false,

        note: "Contextual information has not been independently assessed."

      },

      {

        juror: "Jurist",

        ok: false,

        note: "Applicable law and statutory ingredients must be checked by a qualified person."

      },

      {

        juror: "Skeptic",

        ok: false,

        note: "The record may be incomplete. Identify missing and contradictory material."

      }

    ],


    verdict: "Human verification required",


    summary: "This custom case has been loaded into the demonstration interface only. PDF text extraction does not constitute legal analysis. No live AI inference has been run. Do not interpret the sample positions or vote tally as an assessment of the actual case."

  };


  renderCase();


  $("caseFile").scrollIntoView({

    behavior: "smooth",

    block: "center"

  });

}


// ========================================
// MAIN DELIBERATION
// ========================================

async function runRound(roundNumber, messages) {

  setStep(roundNumber);


  $("headStatus").textContent = roundNumber === 1

    ? "Round 1: agents making initial observations"

    : "Round 2: agents reconsidering the case";


  let guilty = 0;

  let notGuilty = 0;

  const order = [];


  for (const message of messages) {

    speaker(message.juror);

    await speak(message, roundNumber);


    if (!current.isCustom) {

      if (message.vote === "Guilty") {

        guilty++;

        order.push("g");

      } else if (message.vote === "Not Guilty") {

        notGuilty++;

        order.push("n");

      }


      votes(guilty, notGuilty, order);

    }


    await sleep(100);

  }


  speaker(null);


  if (current.isCustom) {

    votes(null, null, []);

  }


  recordRoundHistory(
    roundNumber,
    messages,
    guilty,
    notGuilty
  );

}


async function start() {

  if (running) return;


  running = true;

  clear();

  running = true;


  $("startBtn").disabled = true;

  $("startBtn").textContent =
    "Two-round deliberation running…";


  document.querySelectorAll(".case-btn").forEach(button => {

    button.disabled = true;

  });


  const startTime = performance.now();


  try {

    await runRound(
      1,
      getRoundMessages(1)
    );


    await sleep(180);


    await runRound(
      2,
      getRoundMessages(2)
    );


    setStep(3);


    $("headStatus").textContent =
      "Head Agent reviewing both rounds";


    for (const check of current.checks) {

      addCheck(check);

      await sleep(180);

    }


    await speakHead(current);


    result(current);


    setStep(5);


    elapsed =
      ((performance.now() - startTime) / 1000).toFixed(1) + "s";


    $("timer").textContent =
      "2 rounds · " + elapsed;


    $("headStatus").textContent =
      "Two-round sample advisory ready";


    $("judge").hidden = false;


    finished = true;


    $("finalReview").scrollIntoView({

      behavior: "smooth",

      block: "nearest"

    });


  } catch (error) {

    console.error("JURYX deliberation failed:", error);

    $("headStatus").textContent =
      "Deliberation could not be completed";

    alert(
      "The deliberation stopped unexpectedly. Please try again."
    );

  } finally {

    running = false;

    $("startBtn").disabled = false;

    $("startBtn").textContent = finished
      ? "Run both rounds again ↻"
      : "Start 2-round deliberation →";


    document.querySelectorAll(".case-btn").forEach(button => {

      button.disabled = false;

    });

  }

}


// ========================================
// TRANSCRIPT DOWNLOAD
// ========================================

function transcript() {

  const historyLines = roundHistory.flatMap(round => [

    `ROUND ${round.roundNumber} — ${round.title.toUpperCase()}`,

    ...round.messages.map(message =>
      `${message.juror} [${message.vote}]: ${message.text}`
    ),

    `ROUND RESULT: ${round.result}`,

    ""

  ]);


  return [

    "JURYX — TWO-ROUND DEMONSTRATION TRANSCRIPT",

    "Generated: " + new Date().toLocaleString(),

    "IMPORTANT: Sample frontend output, not live AI analysis or legal opinion.",

    "",

    "CASE: " + current.title,

    "FACTS: " + current.fir,

    "SECTIONS: " + current.sections,

    "EVIDENCE: " + current.evidence.join("; "),

    "",

    "ROUND-BY-ROUND HISTORY",

    ...historyLines,

    "HEAD AGENT CHECKS",

    ...current.checks.map(check =>
      `${check.juror} [${check.ok ? "REVIEWED" : "FLAG"}]: ${check.note}`
    ),

    "",

    "FINAL SAMPLE ADVISORY: " + current.verdict,

    current.summary,

    "",

    "DEMO TIME: " + elapsed,

    "HUMAN REVIEWER DECISION: " + (decision || "Not recorded"),

    "REVIEWER NOTES: " + ($("notes").value.trim() || "None")

  ].join("\n");

}


function download() {

  if (!finished) return;


  const url = URL.createObjectURL(

    new Blob([transcript()], {

      type: "text/plain;charset=utf-8"

    })

  );


  const anchor = el("a");


  anchor.href = url;


  anchor.download =

    "juryx-" +

    current.title.toLowerCase().replace(/[^a-z0-9]+/g, "-") +

    "-transcript.txt";


  document.body.append(anchor);

  anchor.click();

  anchor.remove();


  setTimeout(() => URL.revokeObjectURL(url), 1000);

}


// ========================================
// HUMAN REVIEWER ACTIONS
// ========================================

document.querySelectorAll(".judge [data-d]").forEach(button => {

  button.addEventListener("click", () => {

    decision = button.dataset.d;


    $("judgeMsg").textContent =

      "Reviewer action recorded in this browser session: " +

      decision +

      ". This does not create a legal or court record.";

  });

});


// ========================================
// EVENT LISTENERS
// ========================================

$("startBtn").addEventListener("click", start);

$("loadCustom").addEventListener("click", customCase);

$("dlBtn").addEventListener("click", download);


$("spot").addEventListener("click", () => {

  skip = true;

});


document.addEventListener("keydown", event => {

  if (event.key === "Escape" && !$("spot").hidden) {

    skip = true;

  }

});


// ========================================
// MOBILE NAVIGATION
// ========================================

const menuButton = $("menu");

const navigation = $("nav");


menuButton.addEventListener("click", () => {

  const isOpen = navigation.classList.toggle("open");


  menuButton.setAttribute(
    "aria-expanded",
    String(isOpen)
  );

});


document.querySelectorAll("#nav a").forEach(link => {

  link.addEventListener("click", () => {

    navigation.classList.remove("open");

    menuButton.setAttribute("aria-expanded", "false");

  });

});


// ========================================
// LADY JUSTICE — UPWARD SCROLL MOVEMENT
// ========================================

const statueWindow = $("statueWindow");

const justiceImage = $("justiceImage");

const scrollHint = $("scrollHint");

const workspaceSection = $("workspace");


let statueFrame = null;


function clamp(value, min, max) {

  return Math.min(Math.max(value, min), max);

}


function updateStatueMovement() {

  if (!statueWindow || !justiceImage || !workspaceSection) {

    return;

  }


  const workspaceTop =

    workspaceSection.getBoundingClientRect().top + window.scrollY;


  const revealDistance = Math.max(

    workspaceTop - window.innerHeight,

    window.innerHeight * 1.2

  );


  const progress = clamp(

    window.scrollY / revealDistance,

    0,

    1

  );


  const startingOffset = window.innerHeight * 0.30;


  const currentOffset =

    startingOffset * (1 - progress);


  statueWindow.style.transform =

    `translate3d(0, ${currentOffset}px, 0)`;


  const fadeStart =

    revealDistance + window.innerHeight * 0.35;


  const fadeDistance =

    window.innerHeight * 0.60;


  const fadeProgress = clamp(

    (window.scrollY - fadeStart) / fadeDistance,

    0,

    1

  );


  statueWindow.style.opacity =

    String(0.9 * (1 - fadeProgress));


  statueWindow.style.visibility =

    fadeProgress >= 1 ? "hidden" : "visible";


  if (scrollHint) {

    scrollHint.style.opacity =

      String(Math.max(0, 1 - progress * 2));

  }

}


function requestStatueMovement() {

  if (statueFrame !== null) return;


  statueFrame = requestAnimationFrame(() => {

    updateStatueMovement();

    statueFrame = null;

  });

}


window.addEventListener(

  "scroll",

  requestStatueMovement,

  { passive: true }

);


window.addEventListener(

  "resize",

  requestStatueMovement

);


window.addEventListener(

  "load",

  updateStatueMovement

);


updateStatueMovement();


// ========================================
// INITIALISE JURYX
// ========================================

buildCases();

renderCase();