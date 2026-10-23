const {
  Document, Packer, Paragraph, TextRun, HeadingLevel,
  AlignmentType, Table, TableRow, TableCell, WidthType,
  ShadingType, PageBreak, BorderStyle, ImageRun
} = require("docx");
const fs = require("fs");
const path = require("path");

const TW = 8800; // total table width DXA
const MARGIN = { top: 1300, bottom: 1300, left: 1300, right: 1300 };

// ── helpers ──────────────────────────────────────────────────────────
function pb() { return new Paragraph({ children: [new PageBreak()] }); }

function h1(text) {
  return new Paragraph({
    text,
    heading: HeadingLevel.HEADING_1,
    spacing: { before: 360, after: 160 },
  });
}
function h2(text) {
  return new Paragraph({
    text,
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 240, after: 120 },
  });
}
function h3(text) {
  return new Paragraph({
    text,
    heading: HeadingLevel.HEADING_3,
    spacing: { before: 180, after: 80 },
  });
}

function para(text, opts = {}) {
  return new Paragraph({
    children: [new TextRun({ text, size: 24, ...opts })],
    alignment: AlignmentType.JUSTIFIED,
    spacing: { before: 80, after: 80 },
  });
}

function bul(text, level = 0) {
  return new Paragraph({
    children: [new TextRun({ text: `\u2022  ${text}`, size: 22 })],
    spacing: { before: 50, after: 50 },
    indent: { left: 480 + level * 360 },
  });
}

function hdr(cells, fills) {
  return new TableRow({
    tableHeader: true,
    children: cells.map((c, i) =>
      new TableCell({
        children: [new Paragraph({
          children: [new TextRun({ text: c, bold: true, size: 20, color: "FFFFFF" })],
          alignment: AlignmentType.CENTER,
          spacing: { before: 60, after: 60 },
        })],
        shading: { type: ShadingType.CLEAR, fill: fills ? fills[i] : "1a3c5e" },
        margins: { top: 60, bottom: 60, left: 80, right: 80 },
      })
    ),
  });
}

function row(cells, alt = false, colorArr = null) {
  return new TableRow({
    children: cells.map((c, i) =>
      new TableCell({
        children: [new Paragraph({
          children: [new TextRun({ text: c, size: 19, color: colorArr ? colorArr[i] : "111111" })],
          alignment: AlignmentType.CENTER,
          spacing: { before: 55, after: 55 },
        })],
        shading: { type: ShadingType.CLEAR, fill: alt ? "eef4ff" : "ffffff" },
        margins: { top: 55, bottom: 55, left: 70, right: 70 },
      })
    ),
  });
}

function tbl(headers, rows_data, colW) {
  return new Table({
    width: { size: TW, type: WidthType.DXA },
    columnWidths: colW || headers.map(() => Math.floor(TW / headers.length)),
    rows: [hdr(headers), ...rows_data.map((r, i) => row(r, i % 2 === 1))],
  });
}

function statusRow(cells) {
  const colors = {
    "✅ Complete": "1a6e3c",
    "🔄 In Progress": "92400e",
    "📋 Planned": "1a3c5e",
    "✅ Done": "1a6e3c",
    "🔄 Ongoing": "92400e",
    "✅ Submitted": "1a6e3c",
  };
  return new TableRow({
    children: cells.map((c, i) => {
      const isStatus = typeof c === "string" && (c.startsWith("✅") || c.startsWith("🔄") || c.startsWith("📋"));
      const fill = isStatus
        ? c.startsWith("✅") ? "e6f4ea" : c.startsWith("🔄") ? "fef3c7" : "e8f0fe"
        : i % 2 === 0 ? "f8faff" : "ffffff";
      return new TableCell({
        children: [new Paragraph({
          children: [new TextRun({ text: String(c), size: 19, bold: isStatus, color: isStatus ? (colors[c] || "333333") : "111111" })],
          alignment: AlignmentType.CENTER,
          spacing: { before: 55, after: 55 },
        })],
        shading: { type: ShadingType.CLEAR, fill },
        margins: { top: 55, bottom: 55, left: 70, right: 70 },
      });
    }),
  });
}

function statusTbl(headers, rows_data, colW) {
  return new Table({
    width: { size: TW, type: WidthType.DXA },
    columnWidths: colW || headers.map(() => Math.floor(TW / headers.length)),
    rows: [hdr(headers), ...rows_data.map(r => statusRow(r))],
  });
}

function divider() {
  return new Paragraph({
    border: { bottom: { color: "1a3c5e", size: 6, style: BorderStyle.SINGLE } },
    spacing: { before: 200, after: 200 },
  });
}

function tryAddImage(imgPath, caption, width = 520, height = 260) {
  if (fs.existsSync(imgPath)) {
    const imgData = fs.readFileSync(imgPath);
    return [
      new Paragraph({
        children: [
          new ImageRun({
            data: imgData,
            transformation: { width, height },
            type: "png",
          }),
        ],
        alignment: AlignmentType.CENTER,
        spacing: { before: 180, after: 60 },
      }),
      new Paragraph({
        children: [new TextRun({ text: caption, italics: true, size: 20, color: "555555" })],
        alignment: AlignmentType.CENTER,
        spacing: { before: 0, after: 200 },
      }),
    ];
  }
  return [
    new Paragraph({
      children: [new TextRun({ text: `[Figure: ${caption}]`, italics: true, size: 20, color: "777777" })],
      alignment: AlignmentType.CENTER,
      spacing: { before: 100, after: 100 },
    }),
  ];
}

// Media paths
const artifactDir = "C:/Users/Shaik.AbdulRazak/.gemini/antigravity-ide/brain/d26bbe8d-72c6-4f0a-90ac-178d70bfcdcf/.user_uploaded";
const img1 = path.join(artifactDir, "media_1789092966127.png");
const img2 = path.join(artifactDir, "media_1789093031869.png");
const img3 = path.join(artifactDir, "media_1789093071540.png");
const img4 = path.join(artifactDir, "media_1789093556180.png");
const img5 = path.join(artifactDir, "media_1789093613293.png");
const img6 = path.join(artifactDir, "media_1789093726427.png");
const img7 = path.join(artifactDir, "media_1789094677226.png");

// ═══════════════════════════════════════════════════════════
// BUILD DOCUMENT
// ═══════════════════════════════════════════════════════════
const doc = new Document({
  styles: {
    default: {
      document: { run: { font: "Calibri", size: 24 } },
      heading1: { run: { font: "Calibri", bold: true, size: 32, color: "1a3c5e" }, paragraph: { spacing: { before: 360, after: 160 } } },
      heading2: { run: { font: "Calibri", bold: true, size: 26, color: "1a3c5e" }, paragraph: { spacing: { before: 240, after: 120 } } },
      heading3: { run: { font: "Calibri", bold: true, size: 24, color: "6d28d9" }, paragraph: { spacing: { before: 180, after: 80 } } },
    },
  },
  sections: [{
    properties: { page: { margin: MARGIN } },
    children: [

      // ══════════════════════════════════
      // COVER PAGE
      // ══════════════════════════════════
      new Paragraph({ spacing: { before: 400 } }),
      new Paragraph({
        children: [new TextRun({ text: "MINI PROJECT — REVIEW 1 REPORT", bold: true, size: 36, color: "1a3c5e" })],
        alignment: AlignmentType.CENTER, spacing: { before: 0, after: 200 },
      }),
      new Paragraph({
        children: [new TextRun({ text: "Q-MedLab", bold: true, size: 80, color: "6d28d9" })],
        alignment: AlignmentType.CENTER, spacing: { before: 0, after: 120 },
      }),
      new Paragraph({
        children: [new TextRun({ text: "Quantum-Powered Virtual Medical Laboratory", bold: true, size: 32, color: "1a3c5e" })],
        alignment: AlignmentType.CENTER, spacing: { before: 0, after: 80 },
      }),
      new Paragraph({
        children: [new TextRun({ text: "for Healthcare Simulation & Drug Discovery Education", bold: true, size: 28, color: "1a3c5e" })],
        alignment: AlignmentType.CENTER, spacing: { before: 0, after: 300 },
      }),
      new Paragraph({
        children: [new TextRun({ text: "Domain: Quantum Computing  •  Artificial Intelligence  •  Healthcare Technology", size: 23, color: "444444" })],
        alignment: AlignmentType.CENTER, spacing: { before: 0, after: 80 },
      }),
      new Paragraph({
        children: [new TextRun({ text: "Algorithms: VQE  •  QSVM  •  Grover's Search  •  QCNN  •  XAI  •  QKD  •  QGAN", size: 22, color: "6d28d9", italics: true })],
        alignment: AlignmentType.CENTER, spacing: { before: 0, after: 300 },
      }),

      // Team Table
      new Table({
        width: { size: TW, type: WidthType.DXA },
        columnWidths: [2200, 3400, 3200],
        rows: [
          hdr(["Member Name", "Role in Project", "Specialization & Module"]),
          ...[
            ["Srija",             "Quantum Medical Imaging Lead",       "QCNN + Amplitude Encoding + Medical Imaging"],
            ["Sindhuja",          "Cybersecurity & AMR Lead",           "QSVM + QKD + Antibiotic Resistance Module"],
            ["Saniya",            "Virtual Lab UI/UX Lead",             "React.js + Frontend + Educational Platform"],
            ["Nirmal",            "Cloud & Drug Discovery Lead",        "VQE + Cloud Architecture + Drug Docking"],
            ["Shaik Abdul Razak", "Quantum Diagnosis & AI Lead",        "Grover's Search + AI Layer + Disease Diagnosis"],
          ].map((r, i) => row(r, i % 2 === 1)),
        ],
      }),
      new Paragraph({ spacing: { before: 240 } }),
      new Paragraph({
        children: [new TextRun({ text: "Department of Computer Science & Engineering  |  Academic Year 2026 – 2027", bold: true, size: 24 })],
        alignment: AlignmentType.CENTER, spacing: { before: 0, after: 0 },
      }),
      new Paragraph({
        children: [new TextRun({ text: "Review 1 Submission  |  Phase 1 & Phase 2 Completed  |  Phase 3 Implementation Active", size: 22, color: "555555", italics: true })],
        alignment: AlignmentType.CENTER, spacing: { before: 60, after: 0 },
      }),

      pb(),

      // ══════════════════════════════════
      // TABLE OF CONTENTS
      // ══════════════════════════════════
      h1("TABLE OF CONTENTS"),
      tbl(
        ["Section Number & Title", "Phase / Stage"],
        [
          ["1. Project Abstract", "Phase 1"],
          ["2. Problem Statement & Three-Way Gap", "Phase 1"],
          ["3. Project Objectives & Scope", "Phase 1"],
          ["4. Literature Review (5 Quantum Papers + 5 Virtual Lab Papers)", "Phase 1–2"],
          ["5. Existing Systems & Competitive Analysis (8 IEEE Papers)", "Phase 1–2"],
          ["6. Proposed System — Q-MedLab", "Phase 2"],
          ["7. Five-Layer System Architecture", "Phase 2"],
          ["8. Four Core Quantum Modules (Diagnosis, Docking, AMR, Imaging)", "Phase 2"],
          ["9. Curated Medical Datasets (84 Symptoms, 30 Drugs, 40+ AMR)", "Phase 1–2"],
          ["10. Multi-Role Dashboard & Governance Matrix", "Phase 2–3"],
          ["11. Technology Stack Specifications", "Phase 2"],
          ["12. Process Workflow & Fallback Logic", "Phase 2"],
          ["13. Nine Advanced Novel Features", "Phase 2–4"],
          ["14. Implementation Progress & Current Status (Review 1)", "Phase 3"],
          ["15. Member-Wise Task Allocation", "Phase 1–5"],
          ["16. Project Gantt Chart & Activity Timeline", "Phase 1–5"],
          ["17. Expected Results & Success Criteria", "Phase 4"],
          ["18. Why Q-MedLab is Better — Evidence-Based Proof", "Phase 1–5"],
          ["19. Conclusion & Future Scope", "Phase 5"],
          ["20. References (24 Citations)", "Phase 1–5"],
        ],
        [6400, 2400]
      ),

      pb(),

      // ══════════════════════════════════
      // 1. PROJECT ABSTRACT
      // ══════════════════════════════════
      h1("1. PROJECT ABSTRACT"),
      para("Q-MedLab (Quantum-Powered Virtual Medical Laboratory) is a cloud-accessible, browser-based virtual laboratory that brings real quantum computing to medical education and early-stage drug discovery research — at zero licensing cost. The platform is designed to let students, researchers, and clinicians run real quantum algorithms through a no-code interface to explore disease diagnosis, drug-protein binding, antibiotic resistance prediction, and medical imaging problems that are computationally expensive for classical systems alone."),
      para("No existing platform combines genuine quantum computation, a healthcare-specific curriculum, and free access for students simultaneously. Q-MedLab addresses this critical three-way gap by integrating four core quantum modules: (1) Quantum Disease Diagnosis Simulator using Grover's Search across 84 symptoms and 40+ disease predictions; (2) Drug-Protein Docking Lab using Variational Quantum Eigensolver (VQE) across 30 drug-protein pairs; (3) Antibiotic Resistance Predictor using Quantum SVM across 40+ bacteria-antibiotic combinations; and (4) Quantum Medical Imaging Lab using Quantum CNN. Nine novel advanced features further differentiate Q-MedLab from every existing platform."),
      para("McKinsey & Company estimates quantum computing will generate $200–500 billion in life sciences value by 2035. Q-MedLab is designed to prepare the next generation of healthcare researchers to participate in that transformation — starting today, for free."),

      ...tryAddImage(img7, "Figure 1: Q-MedLab Role-Based Authentication & Portal Interface (Researcher, Student, Clinician, Admin)", 520, 270),

      divider(),

      // ══════════════════════════════════
      // 2. PROBLEM STATEMENT
      // ══════════════════════════════════
      h1("2. PROBLEM STATEMENT"),
      h2("2.1 The Three-Way Gap"),
      para("Three categories of existing platforms were reviewed. Each solves part of the problem, but none solves all three dimensions simultaneously:"),
      new Paragraph({ spacing: { before: 120 } }),
      tbl(
        ["Dimension", "IBM Quantum", "Labster", "Schrodinger", "Q-MedLab"],
        [
          ["Healthcare-specific content", "No", "Partial (classical)", "Yes (classical)", "YES (quantum)"],
          ["Quantum computation", "Yes (code required)", "No", "No", "YES (no-code)"],
          ["Free for students", "Code expertise needed", "$10k+/yr", "$25k+/yr", "YES ($0 cost)"],
        ],
        [2600, 1550, 1550, 1550, 1550]
      ),
      new Paragraph({ spacing: { before: 160 } }),
      h2("2.2 Specific Gaps Identified from Literature"),
      bul("Schrodinger Suite: costs $25,000–$100,000 per user per year — inaccessible to students"),
      bul("IBM Quantum / Azure Quantum: requires Qiskit/Cirq programming — not designed for medical education"),
      bul("Labster: strong no-code interface but zero quantum computing content across all 450+ simulations"),
      bul("169 eligible studies on quantum computing in healthcare — only 16 (9.5%) tested on real quantum hardware"),
      bul("First clinical QSVM study for antibiotic resistance published only in 2025 — no educational tool yet exists"),
      bul("Q-MedLab not mentioned in any of 5 reviewed papers — confirming no equivalent platform exists"),

      ...tryAddImage(img1, "Figure 2: Q-MedLab vs Existing Platforms — Feature Scoring Comparison Bar Chart", 520, 260),

      divider(),

      // ══════════════════════════════════
      // 3. OBJECTIVES
      // ══════════════════════════════════
      h1("3. PROJECT OBJECTIVES"),
      bul("Design a browser-based virtual laboratory enabling medical students to run real quantum algorithms without writing code"),
      bul("Implement four quantum modules: Disease Diagnosis (Grover's), Drug Docking (VQE), AMR Prediction (QSVM), Medical Imaging (QCNN)"),
      bul("Build an AI translation layer converting raw quantum outputs into plain clinical language"),
      bul("Deploy 9 novel advanced features not available in any existing platform"),
      bul("Support 4 user roles: Student, Researcher, Clinician, Admin — each with dedicated dashboards"),
      bul("Integrate real symptom-disease, drug-protein, and bacteria-antibiotic datasets curated from medical literature"),
      bul("Target 4 peer-reviewed publications: IEEE Access, npj Digital Medicine, IEEE EMBC, JMIR Medical Education"),
      bul("Achieve QSVM antibiotic resistance accuracy of 91% vs classical SVM baseline of 74%"),

      divider(),

      // ══════════════════════════════════
      // 4. LITERATURE REVIEW
      // ══════════════════════════════════
      h1("4. LITERATURE REVIEW SUMMARY"),
      h2("4.1 Five Key Research Papers (2023–2025)"),
      tbl(
        ["Paper", "Algorithm", "Key Result", "Gap Identified", "Rating"],
        [
          ["Kale et al. 2024", "QML + Grover", "Genomics: 88.7s → 19.3s", "No educational tool", "4.0/5"],
          ["Sita Rani et al. 2023", "HHL + VQE", "Critical bottlenecks identified", "No implementation", "3.8/5"],
          ["Manish Kumar 2025", "VQE + QCNN", "Drug error: 3.030 kcal/mol", "Simulation only", "4.0/5"],
          ["Narendran 2025", "VQC + QKD", "Real-time DNA visualization", "No XAI tool", "3.8/5"],
          ["Md Shabbeer 2025", "QNN + QSVM", "QML > classical on complex data", "No platform built", "4.2/5"],
        ],
        [2500, 1500, 2000, 1700, 1100]
      ),
      new Paragraph({ spacing: { before: 120 } }),
      h2("4.2 Virtual Lab Literature Gaps"),
      tbl(
        ["Paper", "Virtual Lab", "Quantum?", "AI?", "Drug Discovery?", "Q-MedLab Rating"],
        [
          ["Lungu et al. 2025", "Medspace VR", "No", "No", "No", "9.3/10"],
          ["Han et al. 2023", "Unity3D Biomedical Lab", "No", "No", "No", "9.0/10"],
          ["Darejeh et al. 2024", "VR PCR Lab (UE5)", "No", "No", "No", "9.0/10"],
          ["Yao et al. 2022", "Medical Simulation Center", "No", "No", "No", "8.5/10"],
          ["Oldenburg 1995", "LabVIEW Instrument Lab", "No", "No", "No", "6.5/10"],
        ],
        [2200, 2000, 700, 700, 1100, 1100]
      ),
      new Paragraph({ spacing: { before: 120 } }),
      para("Key finding: All 5 virtual lab papers and all 5 quantum healthcare papers confirm that no existing platform simultaneously provides quantum computation + healthcare focus + free student access. Q-MedLab is the first to address all three."),

      pb(),

      // ══════════════════════════════════
      // 5. PROPOSED SYSTEM
      // ══════════════════════════════════
      h1("5. PROPOSED SYSTEM — Q-MedLab"),
      h2("5.1 Five-Layer Architecture"),
      tbl(
        ["Layer", "Description", "Technology"],
        [
          ["Layer 1 — Student Interface", "Browser-based no-code UI with 3D molecular visualization and drag-drop circuit builder", "React.js + Three.js + WebGL + D3.js"],
          ["Layer 2 — AI Interpretation", "LLM query parser converts plain English to quantum circuit params; translates results to clinical language", "Claude API / GPT-4o + FastAPI"],
          ["Layer 3 — Module Layer", "4 core quantum modules: Diagnosis, Drug Docking, AMR, Imaging — each paired with specific quantum algorithm", "Qiskit 1.x + PySCF + OpenFermion"],
          ["Layer 4 — Quantum Execution", "Transpiles circuits for IBM Quantum; auto-fallback to Qiskit Aer simulator if queue > 5 min", "Qiskit Runtime + Qiskit Aer 0.14.x"],
          ["Layer 5 — Cloud & Hardware", "IBM Quantum Eagle 127-qubit processor + PostgreSQL + Redis + cloud object storage", "IBM Quantum Free Tier + AWS/GCP"],
        ],
        [1800, 3800, 3200]
      ),

      ...tryAddImage(img2, "Figure 3: Q-MedLab Five-Layer System Architecture Diagram", 520, 260),

      new Paragraph({ spacing: { before: 120 } }),
      h2("5.2 Four Core Quantum Modules"),
      tbl(
        ["Module", "Algorithm", "Medical Use", "Dataset", "Target Accuracy"],
        [
          ["M1: Disease Diagnosis", "Grover's Search + Amplitude Est.", "84 symptoms → 40+ disease predictions", "40 symptom-disease mappings curated", "> 80% top-3 accuracy"],
          ["M2: Drug-Protein Docking", "Variational Quantum Eigensolver (VQE)", "Binding energy estimation", "30 drug-protein pairs (Imatinib, Sildenafil...)", "±0.05 Hartree accuracy"],
          ["M3: AMR Predictor", "Quantum SVM (QSVM)", "Antibiotic resistance classification", "40+ bacteria-antibiotic combinations", "91% vs SVM 74%"],
          ["M4: Medical Imaging", "QCNN + Amplitude Encoding", "MRI/CT anomaly classification", "Public medical imaging datasets", "85%+ vs CNN 78%"],
        ],
        [2000, 2000, 1700, 1700, 1400]
      ),

      ...tryAddImage(img3, "Figure 4: Quantum Circuit & Bloch Sphere Real-Time Visualization (Bell State Entanglement)", 520, 250),

      pb(),

      // ══════════════════════════════════
      // 6. CURATED DATASETS
      // ══════════════════════════════════
      h1("6. CURATED MEDICAL DATASETS"),
      para("Q-MedLab incorporates real, deterministic datasets curated from clinical literature, WHO antimicrobial lists, and PubChem gene target reference tables:"),
      
      h2("6.1 Disease Diagnosis Dataset (84 Symptoms, 40 Diseases)"),
      tbl(
        ["S.No", "Symptoms (Input)", "Possible Disease Prediction"],
        [
          ["1", "Fever, cough, sore throat", "Influenza / Respiratory infection"],
          ["2", "Excessive thirst, frequent urination, fatigue", "Diabetes"],
          ["3", "Chest discomfort, shortness of breath, sweating", "Possible cardiac condition"],
          ["4", "Headache, fever, neck stiffness", "Possible meningitis — Urgent evaluation"],
          ["5", "Weakness on one side, facial drooping, difficulty speaking", "Possible stroke — Emergency"],
          ["6", "Yellowing of skin/eyes, dark urine, abdominal discomfort", "Possible liver / biliary condition"],
          ["7", "Joint pain, morning stiffness, swelling", "Rheumatoid arthritis"],
          ["8", "Seizures, confusion, loss of consciousness", "Neurological disorder — Urgent"],
          ["...", "84 total symptoms tracked in engine", "40 disease predictions mapped"],
        ],
        [600, 3800, 4400]
      ),

      new Paragraph({ spacing: { before: 140 } }),
      h2("6.2 Drug-Protein Target Reference Dataset (30 Pairs)"),
      tbl(
        ["No.", "Drug Name", "Complete Protein Target Name", "Gene Symbol", "Main Medical Area"],
        [
          ["1", "Sildenafil", "Phosphodiesterase 5A", "PDE5A", "Cardiovascular"],
          ["2", "Losartan", "Angiotensin II receptor type 1", "AGTR1", "Hypertension"],
          ["3", "Fluoxetine", "Sodium-dependent serotonin transporter", "SLC6A4", "Depression"],
          ["4", "Imatinib", "Tyrosine-protein kinase ABL1", "ABL1", "Leukemia / Cancer"],
          ["5", "Erlotinib", "Epidermal growth factor receptor", "EGFR", "Oncology"],
          ["6", "Rivaroxaban", "Coagulation factor X", "F10", "Anticoagulation"],
          ["7", "Dapagliflozin", "Sodium/glucose cotransporter 2", "SLC5A2", "Diabetes"],
          ["...", "30 drug candidates total", "30 validated protein targets", "30 genes", "Multidisciplinary"],
        ],
        [600, 1600, 3000, 1400, 2200]
      ),

      ...tryAddImage(img4, "Figure 5: VQE Energy Convergence Curve — Drug-Protein Docking Simulation (Remdesivir + ACE2 Target)", 520, 250),

      new Paragraph({ spacing: { before: 140 } }),
      h2("6.3 Antibiotic Resistance Reference Dataset (22 Bacteria, 22 Antibiotics)"),
      tbl(
        ["Pathogen / Bacteria", "Gram Type", "WHO Priority", "Tested Antibiotic", "Resistance Mechanism"],
        [
          ["Streptococcus pneumoniae", "Gram +ve", "High Priority", "Ceftriaxone", "Cell-wall synthesis inhibition"],
          ["Enterobacter cloacae", "Gram -ve", "Critical Priority", "Meropenem", "Carbapenemase enzymatic degradation"],
          ["Serratia marcescens", "Gram -ve", "Critical Priority", "Aztreonam", "Monobactam hydrolysis"],
          ["Vibrio cholerae", "Gram -ve", "High Priority", "Doxycycline", "30S ribosomal subunit inhibition"],
          ["Mycoplasma pneumoniae", "No cell wall", "Standard", "Clarithromycin", "50S ribosomal subunit mutation"],
          ["...", "22 total pathogens", "WHO Tiered", "22 antibiotics", "40+ total combinations"],
        ],
        [2200, 1200, 1500, 1600, 2300]
      ),

      pb(),

      // ══════════════════════════════════
      // 7. MULTI-ROLE DASHBOARD SYSTEM
      // ══════════════════════════════════
      h1("7. MULTI-ROLE DASHBOARD SYSTEM"),
      para("Q-MedLab supports four distinct user roles, each with a dedicated dashboard and feature set designed for their specific use case:"),
      new Paragraph({ spacing: { before: 120 } }),
      h2("7.1 Role Overview"),
      tbl(
        ["Role", "Who", "Primary Purpose", "Key Features"],
        [
          ["Student", "MBBS/BPharm/CSE students", "Guided quantum learning without coding", "Guided modules, quiz, auto-report, leaderboard, AI chatbot"],
          ["Researcher", "PhD scholars, drug discovery teams", "Expert quantum experiments with full parameter control", "VQE/QSVM params, PDB upload, QGAN, polygenic risk, collab lab"],
          ["Clinician", "Doctors, microbiologists, radiologists", "Clinical decision support with XAI", "Disease diagnosis, AMR prediction, imaging, QKD data vault"],
          ["Admin", "HOD, lab coordinator, platform manager", "Platform and user management", "User CRUD, live account deletion, IBM credit control, analytics"],
        ],
        [1500, 2000, 2000, 3300]
      ),
      new Paragraph({ spacing: { before: 120 } }),
      h2("7.2 Feature Access Governance Matrix"),
      tbl(
        ["Feature", "Student", "Researcher", "Clinician", "Admin"],
        [
          ["Disease Diagnosis", "Guided Mode", "Expert + Custom", "Clinical View", "View Only"],
          ["Drug Docking (VQE)", "Guided Mode", "Full Control", "Not Available", "View Only"],
          ["AMR Predictor (QSVM)", "Guided Mode", "Expert Mode", "Clinical Mode", "View Only"],
          ["Medical Imaging (QCNN)", "Guided Mode", "Expert + Upload", "Clinical Mode", "View Only"],
          ["Custom Molecule Upload (.PDB)", "No", "Yes", "No", "Yes"],
          ["NISQ Noise Sandbox", "No", "Yes", "No", "No"],
          ["XAI Clinical Dashboard", "Basic", "Full", "Full", "View"],
          ["QGAN Image Augmentor", "No", "Yes", "No", "No"],
          ["Polygenic Risk Analyzer", "No", "Yes", "No", "No"],
          ["QKD Patient Data Vault", "Basic", "Full", "Full", "Full"],
          ["Auto-Report Generator (PDF)", "Yes", "Yes", "Yes", "Yes"],
          ["Leaderboard", "View + Submit", "No", "No", "Manage"],
          ["Live User CRUD & Account Delete", "No", "No", "No", "Full (Real Delete)"],
          ["IBM Quantum Credit Control", "No", "No", "No", "Full"],
        ],
        [3200, 1400, 1400, 1400, 1400]
      ),

      pb(),

      // ══════════════════════════════════
      // 8. TECHNOLOGY STACK
      // ══════════════════════════════════
      h1("8. PROPOSED TECHNOLOGY STACK"),
      tbl(
        ["Layer", "Technology", "Version", "Purpose", "Cost"],
        [
          ["Frontend UI", "React.js + Three.js + WebGL", "18.x / r160", "No-code browser UI + 3D molecular rendering", "Free"],
          ["Quantum Framework", "IBM Qiskit (primary)", "1.x", "Circuit building, transpilation, and execution", "Free"],
          ["Quantum Framework 2", "Google Cirq (secondary)", "Latest", "Multi-provider circuit support", "Free"],
          ["Quantum Hardware", "IBM Quantum Eagle 127q", "Free tier", "Real quantum computation", "Free"],
          ["Quantum Simulator", "Qiskit Aer", "0.14.x", "High-fidelity simulation fallback", "Free"],
          ["Chemistry Engine", "PySCF + OpenFermion", "Latest", "Molecular Hamiltonian generation for VQE", "Free"],
          ["AI Explanation Layer", "Claude API / GPT-4o", "Latest", "NL query parsing + result translation", "Paid API"],
          ["Backend API", "FastAPI + Python", "0.110+", "Quantum job orchestration + REST API", "Free"],
          ["Database", "PostgreSQL + Redis", "16.x", "Session storage + result caching", "Free"],
          ["Visualization", "D3.js + Plotly", "7.x", "Circuit diagrams + result charts", "Free"],
          ["Deployment", "Docker + AWS/GCP free tier", "Latest", "Containerized scalable deployment", "Free tier"],
          ["Security", "QKD simulation layer", "Proposed", "Patient data encryption simulation", "Free"],
        ],
        [1800, 2200, 900, 3000, 900]
      ),

      ...tryAddImage(img5, "Figure 6: Q-MedLab End-to-End Process Workflow Diagram (Student Query to Quantum Output)", 520, 250),

      divider(),

      // ══════════════════════════════════
      // 9. NINE NOVEL FEATURES
      // ══════════════════════════════════
      h1("9. NINE ADVANCED NOVEL FEATURES"),
      para("The following 9 features are proposed beyond the 4 core modules. Each is absent from ALL reviewed platforms (IBM Quantum, Labster, Schrodinger, and 8 IEEE papers):"),
      new Paragraph({ spacing: { before: 120 } }),
      tbl(
        ["#", "Feature", "What It Does", "Research Basis"],
        [
          ["01", "XAI Clinical Dashboard", "Translates quantum black-box decisions into transparent clinical language with qubit-contribution heatmaps", "Narendran 2025, Md Shabbeer 2025"],
          ["02", "NISQ Noise Sandbox", "Injects realistic IBM hardware noise models — students see VQE/QSVM degrade on real vs ideal simulators", "Domingo et al. IEEE QCE 2024"],
          ["03", "Multi-Provider Backend", "IBM Quantum + Azure Quantum + Amazon Braket — compare same circuit across gate-based and annealing hardware", "Lancellotti et al. IEEE QCE 2024"],
          ["04", "Collaborative Lab Sessions", "Real-time multi-user quantum circuit building via WebSocket — instructor + 30 students simultaneously", "Novel — no existing platform"],
          ["05", "QGAN Image Augmentor", "Quantum GAN generates synthetic medical images for rare disease training (5–10 scans available)", "Md Shabbeer 2025"],
          ["06", "Polygenic Risk Analyzer", "Genomic analysis speedup: 88.7 seconds (classical) → 19.3 seconds (quantum) — 4.6× faster", "Manish Kumar et al. 2025"],
          ["07", "QKD Patient Data Vault", "Quantum Key Distribution encryption — mathematically impossible to crack with future quantum computers", "Kumar et al. IEEE Access 2024"],
          ["08", "Auto-Report Generator", "Session auto-generates complete PDF/Word lab report with circuit diagrams, plots, methodology", "Identified gap in all 8 IEEE papers"],
          ["09", "Benchmark Leaderboard", "Community dashboard — submit results, compare quantum vs classical, encourage reproducibility", "Novel — no equivalent platform"],
        ],
        [400, 2000, 3600, 2800]
      ),

      pb(),

      // ══════════════════════════════════
      // 10. MEMBER TASK ALLOCATION
      // ══════════════════════════════════
      h1("10. MEMBER-WISE TASK ALLOCATION"),
      h2("10.1 Srija — Quantum Medical Imaging Lead"),
      tbl(
        ["Task", "Description", "Technology", "Phase"],
        [
          ["Module 4: QCNN Implementation", "Build Quantum CNN for MRI/CT scan anomaly detection", "Qiskit + PennyLane", "Phase 3"],
          ["Quantum Amplitude Encoding", "Encode medical images into quantum states for QCNN input", "Qiskit", "Phase 3"],
          ["Classical vs QCNN Comparison", "Side-by-side accuracy dashboard — classical CNN vs QCNN", "React.js + D3.js", "Phase 3"],
          ["QGAN Image Augmentor", "Quantum GAN for synthetic rare disease image generation", "PennyLane + PyTorch", "Phase 4"],
          ["Medical Imaging UI", "3D medical scan viewer with anomaly highlighting", "Three.js + WebGL", "Phase 2"],
          ["Literature: Narendran 2025", "Study QIP tumor segmentation and QCNN benchmark results", "Study", "Phase 1–2"],
        ],
        [2400, 2800, 1800, 1800]
      ),
      new Paragraph({ spacing: { before: 120 } }),
      h2("10.2 Sindhuja — Cybersecurity & AMR Lead"),
      tbl(
        ["Task", "Description", "Technology", "Phase"],
        [
          ["Module 3: QSVM Implementation", "Build Quantum SVM for antibiotic resistance classification", "Qiskit + Scikit-Learn", "Phase 3"],
          ["Quantum Kernel Estimation", "Implement quantum feature mapping into Hilbert space", "Qiskit Machine Learning", "Phase 3"],
          ["AMR Dataset Integration", "Curate 40+ bacteria-antibiotic combinations from uploaded reference list", "Python + PostgreSQL", "Phase 1–2"],
          ["QKD Patient Data Vault", "Implement Quantum Key Distribution simulation for patient data security", "Qiskit + BB84 protocol", "Phase 4"],
          ["NISQ Noise Sandbox", "Inject depolarizing noise models — QSVM under realistic hardware noise", "Qiskit Aer noise models", "Phase 4"],
          ["Clinician Dashboard AMR", "Build clinical AMR prediction interface with plain-language output", "React.js", "Phase 3"],
        ],
        [2400, 2800, 1800, 1800]
      ),
      new Paragraph({ spacing: { before: 120 } }),
      h2("10.3 Saniya — Virtual Lab UI/UX Lead"),
      tbl(
        ["Task", "Description", "Technology", "Phase"],
        [
          ["Frontend Architecture", "Design and build the entire React.js frontend framework", "React.js + Tailwind CSS", "Phase 1–2"],
          ["Student Dashboard", "Build guided student interface — all 4 modules in guided mode", "React.js + D3.js", "Phase 2–3"],
          ["Drag-Drop Circuit Builder", "Interactive quantum circuit builder for students", "React.js + D3.js", "Phase 2"],
          ["Leaderboard Feature", "Community benchmark leaderboard with scoring and ranking", "React.js + PostgreSQL", "Phase 4"],
          ["Auto-Report Generator UI", "Frontend for PDF/Word report generation from experiment sessions", "React.js + jsPDF", "Phase 4"],
          ["Collaborative Lab Sessions", "WebSocket-based real-time multi-user circuit building interface", "React.js + Socket.io", "Phase 4"],
        ],
        [2400, 2800, 1800, 1800]
      ),
      new Paragraph({ spacing: { before: 120 } }),
      h2("10.4 Nirmal — Cloud & Drug Discovery Lead"),
      tbl(
        ["Task", "Description", "Technology", "Phase"],
        [
          ["Module 2: VQE Drug Docking", "Implement Variational Quantum Eigensolver for drug-protein binding", "Qiskit + PySCF + OpenFermion", "Phase 2"],
          ["Molecular Hamiltonian Generation", "Convert 30 drug-protein pairs to quantum Hamiltonians for VQE", "PySCF + OpenFermion", "Phase 2"],
          ["3D Molecular Viewer", "Interactive 3D visualization of drug-protein docking geometry", "Three.js + WebGL", "Phase 2"],
          ["Drug-Protein Dataset", "Curate and integrate 30 drug-protein pairs from uploaded reference", "Python + PostgreSQL", "Phase 1"],
          ["Multi-Provider Backend", "Connect IBM Quantum + Azure Quantum + Amazon Braket APIs", "Qiskit + Azure SDK + Braket SDK", "Phase 4"],
          ["Cloud Infrastructure", "Docker containerization + AWS/GCP deployment + PostgreSQL setup", "Docker + AWS + PostgreSQL", "Phase 1–2"],
        ],
        [2400, 2800, 1800, 1800]
      ),
      new Paragraph({ spacing: { before: 120 } }),
      h2("10.5 Shaik Abdul Razak — Quantum Diagnosis & AI Lead"),
      tbl(
        ["Task", "Description", "Technology", "Phase"],
        [
          ["Module 1: Grover's Search", "Implement Grover's algorithm for 200+ disease evaluation in superposition", "Qiskit + Quantum Amplitude Estimation", "Phase 1"],
          ["Symptom-Disease Database", "Curate 84 symptoms + 40 disease predictions from uploaded document", "Python + PostgreSQL", "Phase 1"],
          ["AI Explanation Layer", "Build LLM integration converting quantum outputs to clinical language", "Claude API / GPT-4o + FastAPI", "Phase 3"],
          ["XAI Clinical Dashboard", "SHAP-style qubit-contribution heatmaps for diagnosis transparency", "React.js + SHAP + LLM", "Phase 3"],
          ["Admin Dashboard", "Build admin interface for user management, IBM credit control, analytics", "React.js + FastAPI", "Phase 3"],
          ["FastAPI Backend", "Build REST API backend orchestrating quantum jobs, auth, data flow", "FastAPI + Python + Redis", "Phase 1–2"],
        ],
        [2400, 2800, 1800, 1800]
      ),

      pb(),

      // ══════════════════════════════════
      // 11. CURRENT STATUS FOR REVIEW 1
      // ══════════════════════════════════
      h1("11. CURRENT PROJECT STATUS — REVIEW 1"),
      h2("11.1 Phase-wise Completion Status"),
      statusTbl(
        ["Phase", "Duration", "Key Activities", "Deliverables", "Status"],
        [
          ["Phase 1: Project Selection & Problem Definition", "Week 1–2", "Domain identified, title finalized, literature survey, dataset curation", "Abstract, Problem Statement, Methodology", "✅ Complete"],
          ["Phase 2: System Study & Design", "Week 3–4", "Research papers collected, architecture designed, modules identified, algorithms decided", "Architecture diagram, Module description, Gantt chart", "✅ Complete"],
          ["Phase 3: Implementation", "Week 5–7", "Coding started — Module 1 (Grover), Frontend setup, Backend API", "Working modules, Code snippets, Test cases", "🔄 In Progress"],
          ["Phase 4: Testing & Documentation", "Week 8", "System testing, bug fixes, project report, PPT", "Working prototype, Report draft, PPT", "📋 Planned"],
          ["Phase 5: Final Review & Submission", "Week 9–10", "Demo, viva, submission of report/PPT/GitHub", "Report, PPT, GitHub, Screenshots", "📋 Planned"],
        ],
        [1800, 900, 2400, 2000, 1700]
      ),
      new Paragraph({ spacing: { before: 160 } }),
      h2("11.2 Deliverables Completed for Review 1"),
      tbl(
        ["Deliverable", "Description", "Status"],
        [
          ["Project Abstract (2 pages)", "Full abstract covering motivation, gap, proposed solution, expected results", "✅ Submitted"],
          ["Problem Statement", "Three-way gap identified with literature evidence from 5 papers + 8 IEEE papers", "✅ Submitted"],
          ["Proposed Methodology", "Five-layer architecture + 4 quantum modules + 9 novel features defined", "✅ Submitted"],
          ["System Architecture Diagram", "Five-layer architecture: UI → AI → Modules → Quantum Execution → Hardware", "✅ Complete"],
          ["DFD / Module Description", "All 4 modules described with algorithm, input, output, dataset, accuracy targets", "✅ Complete"],
          ["Gantt Chart / Activity Plan", "6-phase 36-week roadmap with member-wise task allocation", "✅ Complete"],
          ["Literature Survey", "5 quantum papers + 5 virtual lab papers + 8 IEEE drug discovery papers reviewed", "✅ Complete"],
          ["Dataset Curation", "84 symptoms, 40 disease predictions, 30 drug-protein pairs, 40+ AMR combinations", "✅ Complete"],
          ["PPT (8 slides)", "Cover, Problem, Architecture, Modules, Novel Features, Comparison, Results, Team", "✅ Complete"],
          ["Project Report (15+ pages)", "Full advanced report with all sections, tables, figures, references (24 citations)", "✅ Complete"],
        ],
        [2600, 4200, 2000]
      ),

      pb(),

      // ══════════════════════════════════
      // 12. GANTT CHART
      // ══════════════════════════════════
      h1("12. PROJECT GANTT CHART"),
      tbl(
        ["Phase / Activity", "Wk 1", "Wk 2", "Wk 3", "Wk 4", "Wk 5", "Wk 6", "Wk 7", "Wk 8", "Wk 9", "Wk 10"],
        [
          ["Problem Definition & Title", "✓", "✓", "", "", "", "", "", "", "", ""],
          ["Literature Survey", "✓", "✓", "✓", "", "", "", "", "", "", ""],
          ["System Architecture Design", "", "", "✓", "✓", "", "", "", "", "", ""],
          ["Dataset Curation (Symptoms/Drugs/AMR)", "", "", "✓", "✓", "", "", "", "", "", ""],
          ["Module 1: Grover's Diagnosis", "", "", "", "", "✓", "✓", "", "", "", ""],
          ["Module 2: VQE Drug Docking", "", "", "", "", "✓", "✓", "✓", "", "", ""],
          ["Module 3: QSVM AMR Predictor", "", "", "", "", "", "✓", "✓", "", "", ""],
          ["Module 4: QCNN Imaging", "", "", "", "", "", "", "✓", "", "", ""],
          ["Frontend (React.js)", "", "", "", "✓", "✓", "✓", "✓", "", "", ""],
          ["Backend (FastAPI)", "", "", "", "✓", "✓", "✓", "", "", "", ""],
          ["AI Explanation Layer", "", "", "", "", "", "✓", "✓", "", "", ""],
          ["Integration & Testing", "", "", "", "", "", "", "", "✓", "", ""],
          ["Report + PPT", "", "", "", "", "", "", "", "✓", "", ""],
          ["Final Demo + Submission", "", "", "", "", "", "", "", "", "✓", "✓"],
        ],
        [2200,680,680,680,680,680,680,680,680,680,680]
      ),

      divider(),

      // ══════════════════════════════════
      // 13. EXPECTED RESULTS
      // ══════════════════════════════════
      h1("13. EXPECTED RESULTS & SUCCESS CRITERIA"),
      tbl(
        ["Module", "Metric", "Classical Baseline", "Q-MedLab Target", "Research Basis"],
        [
          ["M1: Diagnosis", "Search speed", "O(N) sequential", "O(√N) — 14× faster", "Grover 1996"],
          ["M1: Diagnosis", "Top-3 accuracy", "> 75% clinical standard", "> 80% benchmark", "Clinical NLP benchmarks"],
          ["M2: Docking", "Binding energy error", "±0.5 Hartree", "±0.05 Hartree (10×)", "Peruzzo et al. 2014"],
          ["M3: AMR Predictor", "Classification accuracy", "SVM: 74%, DL: 83%", "QSVM: 91%", "npj Digital Medicine 2025"],
          ["M4: Medical Imaging", "Anomaly detection", "CNN: 78%", "QCNN: 85%+", "Narendran 2025"],
          ["Feature 6: Genomics", "Execution time", "88.7 seconds", "19.3 seconds (4.6×)", "Manish Kumar et al. 2025"],
          ["Platform Overall", "Student completion", "Requires coding", "90%+ no-code", "Usability design targets"],
        ],
        [1800, 1700, 1700, 1700, 1900]
      ),

      ...tryAddImage(img6, "Figure 7: Accuracy Benchmark Comparison — Classical SVM vs Quantum QSVM / VQE Methods", 520, 250),

      divider(),

      // ══════════════════════════════════
      // 14. WHY BETTER
      // ══════════════════════════════════
      h1("14. WHY Q-MedLab IS BETTER — EVIDENCE"),
      tbl(
        ["Feature", "IBM Quantum", "Labster", "Schrodinger", "8 IEEE Papers", "Q-MedLab"],
        [
          ["Healthcare Focus", "No", "Partial", "Yes (classical)", "Research only", "YES (quantum)"],
          ["Quantum Algorithms", "Yes (code)", "None", "None", "Yes (research)", "YES (no-code)"],
          ["Free for Students", "Code needed", "$10k+/yr", "$25k+/yr", "N/A", "YES $0"],
          ["No-Code Interface", "No", "Yes", "No", "No", "YES"],
          ["AI Explanation Layer", "No", "No", "No", "No", "YES"],
          ["Drug Docking", "No", "No", "Classical only", "Research", "YES (VQE)"],
          ["Disease Diagnosis", "No", "No", "No", "No", "YES (Grover's)"],
          ["AMR Prediction", "No", "No", "No", "1 study 2025", "YES (QSVM 91%)"],
          ["Medical Imaging", "No", "Partial", "No", "Research", "YES (QCNN)"],
          ["9 Novel Features", "None", "None", "None", "None", "ALL 9"],
        ],
        [2200,1520,1520,1520,1520,1520]
      ),
      new Paragraph({ spacing: { before: 120 } }),
      para("Literature Search Proof: Systematic search across PubMed, IEEE Xplore, ACM DL, arXiv (July 2026) using terms 'quantum virtual laboratory healthcare', 'quantum simulation medical education', 'interactive quantum drug discovery platform' returned ZERO results describing an equivalent platform to Q-MedLab. The research exists — the accessible tool does not."),

      divider(),

      // ══════════════════════════════════
      // 15. CONCLUSION
      // ══════════════════════════════════
      h1("15. CONCLUSION"),
      para("Q-MedLab represents a genuinely novel contribution at the intersection of quantum computing, virtual laboratory education, and healthcare research. The platform addresses a critical three-way gap — quantum + healthcare + free — confirmed by systematic literature review (July 2026)."),
      para("Phase 1 (Project Selection & Problem Definition) and Phase 2 (System Study & Design) have been successfully completed. All datasets have been curated — 84 symptoms, 40 disease predictions, 30 drug-protein pairs, 22 bacteria, 22 antibiotics, and 40+ resistance combinations. The five-layer architecture, four quantum module designs, and nine novel features have been fully specified."),
      para("Phase 3 (Implementation) is currently in progress. Module 1 quantum circuits are being built, the React.js frontend scaffolding is ready, and the FastAPI backend structure is established. The team is on track for the Phase 4 deliverables."),
      para("McKinsey estimates $200–500 billion in quantum life sciences value by 2035. Q-MedLab is designed to ensure the next generation of healthcare researchers can participate in that transformation — starting today, for free."),

      divider(),

      // ══════════════════════════════════
      // 16. REFERENCES
      // ══════════════════════════════════
      h1("16. REFERENCES"),
      ...[
        "[1] Kale, A., et al. 'Future of Healthcare Technology: Quantum Machine Learning Perspectives.' IEEE, 2024.",
        "[2] Sita Rani, et al. 'Developments & Challenges in Quantum Computing for Healthcare.' Journal of Medical Systems, 2023.",
        "[3] Manish Kumar, et al. 'Implementation Challenges of Quantum Computing in Healthcare.' IEEE Access, 2025.",
        "[4] Narendran, et al. 'Transformational Potential of Quantum Computing in Clinical Medicine.' npj Digital Medicine, 2025.",
        "[5] Md Shabbeer, et al. 'QML Impact Survey: Quantum Machine Learning in Healthcare.' IEEE Transactions, 2025.",
        "[6] Kandula, S., et al. 'Quantum Computing Potentials for Drug Discovery.' IEEE CSCI, 2023.",
        "[7] Domingo, L., et al. 'Hybrid Quantum-Classical Fusion Neural Network for Binding Affinity.' IEEE QCE, 2024.",
        "[8] Sathan & Baichoo. 'Drug Target Interaction Prediction using Variational Quantum Classifier.' IEEE NextComp, 2024.",
        "[9] Kumar, A., et al. 'Recent Advances in Quantum Computing for Drug Discovery.' IEEE Access, 2024.",
        "[10] Lancellotti, B., et al. 'An Experimental Approach to Quantum Molecular Docking.' IEEE QCE, 2024.",
        "[11] Choppara & Lokesh. 'Q-BAFNet: Hybrid Quantum-Classical Drug-Target Binding Affinity Prediction.' IEEE TCBB, 2025.",
        "[12] Mayer, C., et al. 'First large-scale empirical evaluation of QSVM for antibiotic resistance.' npj Digital Medicine, 2025.",
        "[13] Lungu, B., et al. 'Integrating Virtual Laboratories in Medical Imaging Education.' 2025.",
        "[14] Han, J., et al. 'A Virtual Learning Platform for Biomedical Laboratory Scientists Using Unity3D.' 2023.",
        "[15] Darejeh, A., et al. 'VR-Based Laboratories vs Real Settings for PCR Procedures.' 2024.",
        "[16] McKinsey & Company. 'Quantum Technology Monitor — Life Sciences Value Forecast.' April 2024.",
        "[17] IBM Quantum. 'IBM Quantum Eagle 127-qubit Processor & Quantum Network.' IBM Research, 2023.",
        "[18] WHO. 'Antimicrobial Resistance Global Action Plan.' World Health Organization, 2024.",
        "[19] Peruzzo, A., et al. 'A variational eigenvalue solver on a photonic quantum processor.' Nature Communications, 2014.",
        "[20] Havlicek, V., et al. 'Supervised learning with quantum-enhanced feature spaces.' Nature, 2019.",
        "[21] Nielsen, M.A. & Chuang, I.L. 'Quantum Computation and Quantum Information.' Cambridge University Press, 2000.",
        "[22] Preskill, J. 'Quantum Computing in the NISQ era and beyond.' Quantum 2, 79, 2018.",
        "[23] Biamonte, J., et al. 'Quantum machine learning.' Nature 549, 195–202, 2017.",
        "[24] Cao, Y., et al. 'Quantum Chemistry in the Age of Quantum Computing.' Chemical Reviews, 2019."
      ].map(ref => new Paragraph({
        children: [new TextRun({ text: ref, size: 20, color: "333333" })],
        spacing: { before: 80, after: 80 },
        indent: { left: 200, hanging: 200 },
      })),

    ],
  }],
});

Packer.toBuffer(doc).then(buf => {
  const out1 = path.join(__dirname, "QMedLab_Review1_Report.docx");
  const out2 = "C:/Users/Shaik.AbdulRazak/Desktop/QMedLab_Review1_Report.docx";
  fs.writeFileSync(out1, buf);
  try {
    fs.writeFileSync(out2, buf);
  } catch (e) {
    console.log("Desktop write skipped:", e.message);
  }
  console.log("SUCCESS: Document generated at " + out1);
});
