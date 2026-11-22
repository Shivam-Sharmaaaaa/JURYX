
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
    },
    {
      title: "Alleyway Assault & Brawl",
      short: "BNS 115(2)",
      fir: "FIR 1190/2025 PS Mangolpuri. Dharmveer alleges Pappu struck him on left shoulder and forehead with a steel bucket handle over a parked motorcycle. Pappu contends Dharmveer kicked bike over and fell against Delhi Jal Board water tanker frame during mutual scuffle.",
      sections: "Bharatiya Nyaya Sanhita Section 115(2); BNSS Section 283 (Summary Trial) & Section 35(3)",
      evidence: [
        "MLC No. 4471: 1.5cm forehead laceration; ZERO shoulder injury/contusion",
        "Sunita Devi (Neighbour): Heard metallic thud on tanker stand; saw bare-handed grapple with no weapon",
        "Ramesh (Friend): Statement delayed 6 days; obstructed line-of-sight behind TSR at dusk",
        "14-second mobile video by neighbor Aman unseized under Section 63 BSA"
      ],
      messages: [
        {
          juror: "Analyst",
          vote: "Not Guilty",
          text: "Forehead cut is verified on MLC No. 4471, but the complete absence of shoulder trauma contradicts an armed attack with a bucket handle. Section 63 BSA video was not seized."
        },
        {
          juror: "Empath",
          vote: "Not Guilty",
          text: "Both parties are alley neighbours in Sultanpuri. The dispute arose over momentary parking. Compounding under Section 290 BNSS or Lok Adalat referral preserves harmony."
        },
        {
          juror: "Jurist",
          vote: "Not Guilty",
          text: "Offence under Section 115(2) BNS is summarily triable u/s 283 BNSS and compoundable. Accidental impact during mutual fray negates intentional hurt."
        },
        {
          juror: "Skeptic",
          vote: "Not Guilty",
          text: "Independent witness Sunita Devi confirms a metallic thud on the tanker frame with no weapon. Friend Ramesh delayed his statement by 6 days in dim dusk."
        }
      ],
      checks: [
        {
          juror: "Analyst",
          ok: false,
          note: "MLC discrepancy (missing shoulder injury) and unseized BSA S.63 digital video create forensic doubts."
        },
        {
          juror: "Empath",
          ok: true,
          note: "Compounding under Section 290 BNSS is restorative and recommended for co-residents."
        },
        {
          juror: "Jurist",
          ok: true,
          note: "Procedural notice under Section 35(3) BNSS followed; matter eligible for Lok Adalat referral under LASA Sec 20."
        },
        {
          juror: "Skeptic",
          ok: false,
          note: "Witness bias and delayed deposition of Ramesh render the prosecution narrative doubtful."
        }
      ],
      verdict: "Compoundable / Acquittal on Reasonable Doubt (4 to 0)",
      summary: "Panel emphasizes severe forensic inconsistency in MLC No. 4471 and independent corroboration of the tanker stand impact. Recommends compounding under Section 290 BNSS or acquittal on benefit of doubt."
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
  Analyst: "./analyst.jpg",
  Empath: "./empath.jpg",
  Jurist: "./jurist.jpg",
  Skeptic: "./skeptic.jpg",
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

  $("stepText").textContent =
    n >= 4
      ? "Advisory is ready"
      : [
          "Waiting for deliberation",
          "Agents are reviewing the case",
          "Head Agent is checking statements"
        ][n] || "Waiting for deliberation";
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
  return el(
    "span",
    "vote " + (vote === "Guilty" ? "v-g" : "v-n"),
    vote
  );
}


// ========================================
// AGENT SPOTLIGHT
// ========================================

async function openSpot(name) {
  const spot = $("spot");
  const card = $("spotCard");
  const head = name === "Head Agent";

  const anchor = head
    ? document.querySelector(".side-brand b")
    : document.querySelector(`.av[data-j="${name}"] b`);

  $("spotAv").textContent = head ? "JX" : name[0];
  $("spotName").textContent = name;
  $("spotMsg").textContent = "";
  $("spotVerdict").hidden = true;

  const img = $("spotImage");

  img.classList.remove("loaded");
  img.src = IMAGES[name] || "";
  img.alt = name + " portrait";

  img.onload = () => img.classList.add("loaded");
  img.onerror = () => img.classList.remove("loaded");

  spot.hidden = false;

  card.style.transition = "none";
  card.style.setProperty("--dx", "0px");
  card.style.setProperty("--dy", "0px");

  const cardRect = card.getBoundingClientRect();

  const anchorRect = anchor
    ? anchor.getBoundingClientRect()
    : {
        left: innerWidth / 2,
        top: innerHeight / 2,
        width: 0,
        height: 0
      };

  card.style.setProperty(
    "--dx",
    (
      anchorRect.left +
      anchorRect.width / 2 -
      cardRect.left -
      cardRect.width / 2
    ) + "px"
  );

  card.style.setProperty(
    "--dy",
    (
      anchorRect.top +
      anchorRect.height / 2 -
      cardRect.top -
      cardRect.height / 2
    ) + "px"
  );

  void card.offsetWidth;

  card.style.transition = "";
  spot.classList.add("open");

  await sleep(reduced ? 0 : 450);
}

async function closeSpot() {
  $("spot").classList.remove("open");

  await sleep(reduced ? 0 : 450);

  $("spot").hidden = true;
}


// ========================================
// AGENT TYPING ANIMATION
// ========================================

async function type(node, text) {
  if (skip || reduced) {
    node.textContent = text;
    return;
  }

  for (let i = 1; i <= text.length; i++) {
    if (skip) {
      node.textContent = text;
      return;
    }

    node.textContent = text.slice(0, i);
    await sleep(9);
  }
}

async function wait(ms) {
  const end = performance.now() + ms;

  while (performance.now() < end && !skip) {
    await sleep(40);
  }
}

async function speak(message) {
  skip = false;

  await openSpot(message.juror);

  $("spotMsg").classList.add("thinking");
  await wait(400);
  $("spotMsg").classList.remove("thinking");

  await type($("spotMsg"), message.text);

  $("spotName").append(badge(message.vote));

  await wait(850);
  await closeSpot();

  bubble(message);
}


// ========================================
// DELIBERATION CHAT
// ========================================

function bubble(message) {
  const box = el("div", "bubble " + message.juror);

  box.dataset.i = message.juror[0];

  const name = el("p", "name", message.juror);
  name.append(badge(message.vote));

  box.append(
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

  await openSpot("Head Agent");

  $("spotVerdict").hidden = false;
  $("spotVerdict").textContent = data.verdict;

  $("spotMsg").classList.add("thinking");
  await wait(350);
  $("spotMsg").classList.remove("thinking");

  await type($("spotMsg"), data.summary);

  await wait(900);
  await closeSpot();
}


// ========================================
// FINAL RESULT
// ========================================

function result(data) {
  $("result").className = "result-content";

  $("result").replaceChildren(
    el("span", "label", "HEAD AGENT · SAMPLE ADVISORY"),
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

  speaker(null);
  votes(0, 0, []);
  setStep(0);

  $("headStatus").textContent = "Ready to begin";
  $("startBtn").disabled = false;
  $("startBtn").textContent = "Start deliberation →";
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
        vote: "Not Guilty",
        text: "This custom case has not been analysed by a live model. The extracted PDF text and supplied facts must be checked against the original source document."
      },
      {
        juror: "Empath",
        vote: "Not Guilty",
        text: "Context and circumstances have not been independently established from source material."
      },
      {
        juror: "Jurist",
        vote: "Not Guilty",
        text: "Applicable provisions and their ingredients require independent legal verification."
      },
      {
        juror: "Skeptic",
        vote: "Not Guilty",
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

async function start() {
  if (running) return;

  running = true;
  clear();
  running = true;

  $("startBtn").disabled = true;
  $("startBtn").textContent = "Deliberation running…";

  document.querySelectorAll(".case-btn").forEach(button => {
    button.disabled = true;
  });

  const startTime = performance.now();

  setStep(1);
  $("headStatus").textContent = "JuryX Engine: Consulting Juror Agents…";

  // Attempt live deliberation via backend API if available
  try {
    const apiPayload = {
      facts: current.fir || current.facts || ($("customFacts") ? $("customFacts").value : ""),
      title: current.title,
      case_type: current.short
    };
    const res = await fetch("/api/deliberate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(apiPayload)
    });
    if (res.ok) {
      const liveData = await res.json();
      if (liveData && liveData.round1 && liveData.round3) {
        const r1 = liveData.round1;
        const r2 = liveData.round2 || {};
        const r3 = liveData.round3 || {};
        const syn = liveData.round_3_synthesis || {};

        const jurorMap = {
          analyst: "Analyst",
          empath: "Empath",
          jurist: "Jurist",
          skeptic: "Skeptic"
        };

        const liveMessages = [];
        const liveChecks = [];

        for (const [key, name] of Object.entries(jurorMap)) {
          const j1 = r1[key] || {};
          const j2 = r2[key] || {};
          const rawStance = String(j2.revised_stance || j1.stance || "needs_more_evidence").toLowerCase();
          const vote = (rawStance === "guilty" || rawStance === "liable") ? "Guilty" : "Not Guilty";
          const text = j1.rationale || "Evidence analyzed in designated legal domain.";

          liveMessages.push({
            juror: name,
            vote: vote,
            text: text
          });

          let rebNote = "Rebuttal reviewed.";
          if (Array.isArray(j2.rebuttals) && j2.rebuttals.length > 0) {
            const first = j2.rebuttals[0];
            if (typeof first === "object" && first !== null) {
              rebNote = first.challenge || first.argument || j2.revised_rationale || rebNote;
            } else {
              rebNote = String(first);
            }
          } else if (j2.revised_rationale) {
            rebNote = j2.revised_rationale;
          }

          liveChecks.push({
            juror: name,
            ok: vote === "Guilty",
            note: rebNote
          });
        }

        current.messages = liveMessages;
        current.checks = liveChecks;
        current.verdict = syn.advisory_verdict || String(r3.verdict || current.verdict).replace(/_/g, " ").toUpperCase();
        const rem = syn.recommended_remedy || r3.remedy || "";
        current.summary = `${syn.rationale || r3.advisory_note || current.summary} ${rem ? 'Recommended Action: ' + rem : ''}`.trim();
        if ($("liveIndicator")) {
          $("liveIndicator").textContent = "JuryX Legal Engine: Active (" + (liveData.source === "live" ? "Live Gemini Model" : "Verified Fallback") + ")";
        }
      }
    }
  } catch (err) {
    console.warn("Live deliberation API unavailable; continuing with local demonstration data.", err);
  }

  $("headStatus").textContent = "Agents presenting initial findings";

  let guilty = 0;
  let notGuilty = 0;
  const order = [];

  for (const message of current.messages) {
    speaker(message.juror);

    await speak(message);

    if (message.vote === "Guilty") {
      guilty++;
      order.push("g");
    } else {
      notGuilty++;
      order.push("n");
    }

    votes(guilty, notGuilty, order);
    await sleep(200);
  }

  speaker(null);

  setStep(2);
  $("headStatus").textContent = "Head Agent reviewing statements";

  for (const check of current.checks) {
    addCheck(check);
    await sleep(260);
  }

  await speakHead(current);
  result(current);

  setStep(4);

  elapsed =
    ((performance.now() - startTime) / 1000).toFixed(1) + "s";

  $("timer").textContent = "Demo playback: " + elapsed;
  $("headStatus").textContent = "Sample advisory ready";
  $("judge").hidden = false;

  finished = true;
  running = false;

  $("startBtn").disabled = false;
  $("startBtn").textContent = "Run again ↻";

  document.querySelectorAll(".case-btn").forEach(button => {
    button.disabled = false;
  });

  $("finalReview").scrollIntoView({
    behavior: "smooth",
    block: "nearest"
  });
}


// ========================================
// TRANSCRIPT DOWNLOAD
// ========================================

function transcript() {
  return [
    "JURYX — SAMPLE DEMONSTRATION TRANSCRIPT",
    "Generated: " + new Date().toLocaleString(),
    "IMPORTANT: Sample frontend output, not live AI analysis or legal opinion.",
    "",
    "CASE: " + current.title,
    "FACTS: " + current.fir,
    "SECTIONS: " + current.sections,
    "EVIDENCE: " + current.evidence.join("; "),
    "",
    "AGENT STATEMENTS",

    ...current.messages.map(message =>
      `${message.juror} [${message.vote}]: ${message.text}`
    ),

    "",
    "HEAD AGENT CHECKS",

    ...current.checks.map(check =>
      `${check.juror} [${check.ok ? "REVIEWED" : "FLAG"}]: ${check.note}`
    ),

    "",
    "SAMPLE ADVISORY: " + current.verdict,
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
