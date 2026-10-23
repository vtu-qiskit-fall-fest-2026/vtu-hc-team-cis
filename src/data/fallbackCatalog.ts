// Scientific & Medical Benchmark Datasets for Real-Time Offline & Demo Readiness
// Structured according to official WHO (ICD-11), PubChem, PDB, and CARD Antimicrobial Resistance specifications.

import type { Disease, Drug, Protein, Bacterium, Experiment, QuantumJob } from '@/lib/supabase';

export const BENCHMARK_DISEASES: Disease[] = [
  {
    id: 'd1-covid19-icd11-ra01',
    name: 'COVID-19 (Acute Respiratory Infection)',
    icd11_code: 'RA01.0',
    category: 'Infectious / Respiratory',
    symptoms: ['fever', 'cough', 'shortness of breath', 'fatigue', 'loss of taste', 'loss of smell', 'headache', 'sore throat', 'muscle pain'],
    severity: 'moderate',
    description: 'An infectious respiratory viral disease caused by SARS-CoV-2. Characterized by systemic inflammation, vascular damage, and pulmonary cytokine cascades.'
  },
  {
    id: 'd2-tuberculosis-1b10',
    name: 'Pulmonary Tuberculosis',
    icd11_code: '1B10',
    category: 'Infectious',
    symptoms: ['cough', 'fever', 'night sweats', 'weight loss', 'chest pain', 'fatigue', 'shortness of breath'],
    severity: 'severe',
    description: 'A potentially chronic bacterial infection caused by Mycobacterium tuberculosis transmitted through airborne droplet nuclei affecting deep pulmonary parenchyma.'
  },
  {
    id: 'd3-diabetes-type2-5a11',
    name: 'Type 2 Diabetes Mellitus',
    icd11_code: '5A11',
    category: 'Endocrine / Metabolic',
    symptoms: ['increased thirst', 'frequent urination', 'fatigue', 'blurred vision', 'weight loss', 'nausea'],
    severity: 'moderate',
    description: 'A metabolic disorder characterized by systemic hyperglycemia resulting from peripheral insulin resistance and progressive beta-cell secretory impairment.'
  },
  {
    id: 'd4-alzheimer-8a20',
    name: 'Alzheimer Disease',
    icd11_code: '8A20',
    category: 'Neurological',
    symptoms: ['memory loss', 'confusion', 'fatigue', 'dizziness', 'stiffness'],
    severity: 'critical',
    description: 'A degenerative cortical dementia marked by accumulation of extracellular amyloid-beta plaque deposition and neurofibrillary tangles of hyperphosphorylated tau protein.'
  },
  {
    id: 'd5-glioblastoma-2a00',
    name: 'Glioblastoma Multiforme (Grade IV Brain Tumor)',
    icd11_code: '2A00',
    category: 'Oncology / Neurological',
    symptoms: ['headache', 'nausea', 'vomiting', 'seizures', 'blurred vision', 'memory loss', 'confusion', 'dizziness'],
    severity: 'critical',
    description: 'A hyper-aggressive primary CNS WHO Grade IV astrocytoma exhibiting neo-angiogenesis, high mitotic indices, and diffuse white matter necrosis.'
  },
  {
    id: 'd6-coronary-artery-ba40',
    name: 'Coronary Artery Disease',
    icd11_code: 'BA40',
    category: 'Cardiovascular',
    symptoms: ['chest pain', 'shortness of breath', 'fatigue', 'dizziness', 'cold hands', 'nausea'],
    severity: 'severe',
    description: 'Stenotic obstructive luminal atherosclerotic narrowing of epicardial coronary arteries impairing myocardial tissue oxygenation leading to anginal ischemia.'
  },
  {
    id: 'd7-bacterial-pneumonia-ca40',
    name: 'Streptococcal Bacterial Pneumonia',
    icd11_code: 'CA40',
    category: 'Respiratory / Infectious',
    symptoms: ['fever', 'cough', 'shortness of breath', 'chest pain', 'fatigue', 'wheezing', 'sweating'],
    severity: 'severe',
    description: 'Acute bacterial infection of lung alveoli causing fibrinous exudative exudate consolidation and pronounced localized polymorphonuclear leukocytic infiltration.'
  }
];

export const BENCHMARK_DRUGS: Drug[] = [
  {
    id: 'dr1-remdesivir-121304016',
    name: 'Remdesivir (Nucleotide Analog Inhibitior)',
    pubchem_cid: 121304016,
    formula: 'C27H35N6O8P',
    molecular_weight: 602.6,
    smiles: 'CCC(CC)COC(=O)C(C)NP(=O)(OCC1C(C(C(O1)(C#N)C2=CC=C3N2N=CN=C3N)O)O)OC4=CC=CC=C4',
    description: 'Broad-spectrum antiviral pro-drug inhibiting SARS-CoV-2 RNA-dependent RNA polymerase via premature nascent transcription strand termination.'
  },
  {
    id: 'dr2-imatinib-5291',
    name: 'Imatinib (Tyrosine Kinase Inhibitor)',
    pubchem_cid: 5291,
    formula: 'C29H31N7O',
    molecular_weight: 493.6,
    smiles: 'CC1=C(C=C(C=C1)NC(=O)C2=CC=C(C=C2)CN3CCN(CC3)C)NC4=NC=CC(=N4)C5=CN=CC=C5',
    description: 'Targeted antaneoplastic small molecule targeting BCR-ABL tyrosine kinase transmembrane domains in chronic myeloid leukemia and GIST tumors.'
  },
  {
    id: 'dr3-metformin-4091',
    name: 'Metformin Hydrochloride',
    pubchem_cid: 4091,
    formula: 'C4H11N5',
    molecular_weight: 129.16,
    smiles: 'CN(C)C(=N)NC(=N)N',
    description: 'First-line oral antihyperglycemic biguanide enhancing hepatocyte AMPK activation and attenuating gluconeogenesis without hypoglycemia risks.'
  },
  {
    id: 'dr4-aspirin-2244',
    name: 'Acetylsalicylic Acid (Aspirin)',
    pubchem_cid: 2244,
    formula: 'C9H8O4',
    molecular_weight: 180.16,
    smiles: 'CC(=O)OC1=CC=CC=C1C(=O)O',
    description: 'Irreversible NSAID cyclooxygenase inhibitor suppressing pro-inflammatory prostaglandin synthesis and platelet TXA2 aggregation.'
  },
  {
    id: 'dr5-penicillin-g-5904',
    name: 'Penicillin G Benzylpenicillin',
    pubchem_cid: 5904,
    formula: 'C16H18N2O4S',
    molecular_weight: 334.4,
    smiles: 'CC1(C(N2C(S1)C(C2=O)NC(=O)CC3=CC=CC=C3)C(=O)O)C',
    description: 'Beta-lactam bactericidal antibiotic binding penicillin-binding proteins (PBPs) resulting in cell wall peptidoglycan cross-link inhibition.'
  }
];

export const BENCHMARK_PROTEINS: Protein[] = [
  {
    id: 'pr1-sars-cov-2-mpro-6lu7',
    name: 'SARS-CoV-2 Main Protease (Mpro/3CLpro)',
    pdb_id: '6LU7',
    organism: 'Severe acute respiratory syndrome coronavirus 2',
    function: 'Essential proteolytic cleavage enzyme responsible for viral precursor polypeptide maturation and functional viral replication complex assembly.'
  },
  {
    id: 'pr2-human-hemoglobin-1a3n',
    name: 'Human Deoxyhemoglobin Alpha/Beta Tetramer',
    pdb_id: '1A3N',
    organism: 'Homo sapiens',
    function: 'Allosteric oxygen-carrying tetrameric hemoprotein underlying arterial tissue oxygen transport and metabolic pH regulation.'
  },
  {
    id: 'pr3-insulin-receptor-4irr',
    name: 'Human Insulin Receptor Ectodomain',
    pdb_id: '4IRR',
    organism: 'Homo sapiens',
    function: 'Transmembrane receptor tyrosine kinase regulating cellular glucose intake and downstream anabolic lipid/protein gene signaling.'
  },
  {
    id: 'pr4-amyloid-beta-2lmn',
    name: 'Amyloid Beta Peptide (1-42) Fibrillar Aggregate',
    pdb_id: '2LMN',
    organism: 'Homo sapiens (Alzheimer Disease pathology)',
    function: 'Pathological cytotoxic proteinaceous beta-sheet fibrillar structural aggregate driving neurodegenerative synaptic breakdown.'
  }
];

export const BENCHMARK_BACTERIA: Bacterium[] = [
  {
    id: 'bac1-staphylococcus-aureus',
    name: 'Staphylococcus aureus',
    gram_stain: 'positive',
    resistance_mechanisms: ['Beta-lactamase production', 'mecA PBP2a modification (MRSA)', 'Efflux pump hyper-expression', 'Target ribosomal mutation']
  },
  {
    id: 'bac2-escherichia-coli',
    name: 'Escherichia coli',
    gram_stain: 'negative',
    resistance_mechanisms: ['Extended-spectrum beta-lactamases (ESBL)', 'Outer membrane porin loss', 'Plasmid-mediated quinolone resistance (QNR)']
  },
  {
    id: 'bac3-klebsiella-pneumoniae',
    name: 'Klebsiella pneumoniae',
    gram_stain: 'negative',
    resistance_mechanisms: ['Carbapenemase production (KPC/NDM-1)', 'Multidrug resistance efflux pump (AcrAB)', 'Aminoglycoside-modifying enzymes']
  },
  {
    id: 'bac4-pseudomonas-aeruginosa',
    name: 'Pseudomonas aeruginosa',
    gram_stain: 'negative',
    resistance_mechanisms: ['OprD transmembrane porin deficiency', 'MexAB-OprM efflux overexpression', 'AmpC chromosomal beta-lactamase']
  },
  {
    id: 'bac5-mycobacterium-tuberculosis',
    name: 'Mycobacterium tuberculosis',
    gram_stain: 'acid-fast',
    resistance_mechanisms: ['rpoB gene RNA polymerase modification', 'katG catalase-peroxidase truncation (INH resistance)', 'Mycolic acid lipid barrier']
  },
  {
    id: 'bac6-enterococcus-faecium',
    name: 'Enterococcus faecium',
    gram_stain: 'positive',
    resistance_mechanisms: ['vanA/vanB D-Ala-D-Lac cell wall reprogramming (VRE)', 'High-level gentamicin ribosomal resistance']
  }
];

export const BENCHMARK_EXPERIMENTS = [
  {
    id: 'exp-101',
    user_id: 'demo-user-1234',
    module: 'diagnosis',
    algorithm: "Grover's Search",
    title: 'Diagnosis: COVID-19 (Acute Respiratory Infection)',
    input_data: { symptoms: ['fever', 'cough', 'shortness of breath', 'fatigue'], age: 42, duration: 5 },
    result_data: { disease: 'COVID-19', confidence: 94.2 },
    confidence: 94.2,
    status: 'completed',
    created_at: new Date(Date.now() - 3600000 * 2).toISOString()
  },
  {
    id: 'exp-102',
    user_id: 'demo-user-1234',
    module: 'drug_discovery',
    algorithm: 'VQE (Variational Quantum Eigensolver)',
    title: 'Binding Simulation: Remdesivir × SARS-CoV-2 Mpro',
    input_data: { drug: 'Remdesivir', protein: 'SARS-CoV-2 Main Protease (6LU7)' },
    result_data: { bindingEnergy: -11.42, affinityScore: 88, converged: true },
    confidence: 88.0,
    status: 'completed',
    created_at: new Date(Date.now() - 3600000 * 12).toISOString()
  },
  {
    id: 'exp-103',
    user_id: 'demo-user-1234',
    module: 'antibiotic',
    algorithm: 'QSVM (Quantum Support Vector Machine)',
    title: 'Resistance Prediction: Staphylococcus aureus × Penicillin G',
    input_data: { bacterium: 'Staphylococcus aureus', antibiotic: 'Penicillin G' },
    result_data: { resistant: true, accuracy: 92.4, confidence: 91.8 },
    confidence: 91.8,
    status: 'completed',
    created_at: new Date(Date.now() - 3600000 * 24).toISOString()
  },
  {
    id: 'exp-104',
    user_id: 'demo-user-1234',
    module: 'imaging',
    algorithm: 'QCNN (Quantum Convolutional Neural Network)',
    title: 'MRI Analysis: Glioblastoma Multiforme Screening',
    input_data: { modality: 'mri', filename: 'brain_scan_seq04.dcm' },
    result_data: { prediction: 'Glioma', speedup: 2.4, accuracy: 94.7 },
    confidence: 93.5,
    status: 'completed',
    created_at: new Date(Date.now() - 3600000 * 36).toISOString()
  },
  {
    id: 'exp-105',
    user_id: 'demo-user-1234',
    module: 'drug_discovery',
    algorithm: 'VQE',
    title: 'Binding Simulation: Imatinib × BCR-ABL Tyrosine Kinase',
    input_data: { drug: 'Imatinib', protein: 'Human Tyrosine Kinase' },
    result_data: { bindingEnergy: -9.85, affinityScore: 81 },
    confidence: 81.0,
    status: 'completed',
    created_at: new Date(Date.now() - 3600000 * 48).toISOString()
  },
  {
    id: 'exp-106',
    user_id: 'demo-user-1234',
    module: 'diagnosis',
    algorithm: "Grover's Search",
    title: 'Diagnosis: Pulmonary Tuberculosis Screening',
    input_data: { symptoms: ['cough', 'night sweats', 'weight loss'], age: 55 },
    result_data: { disease: 'Pulmonary Tuberculosis', confidence: 89.4 },
    confidence: 89.4,
    status: 'completed',
    created_at: new Date(Date.now() - 3600000 * 72).toISOString()
  }
] as unknown as Experiment[];

export const BENCHMARK_JOBS = [
  {
    id: 'job-ibm-001',
    user_id: 'demo-user-1234',
    experiment_id: 'exp-102',
    backend: 'ibmq_guadalupe (16 qubits)',
    algorithm: 'VQE Ansatz',
    qubits: 8,
    shots: 2048,
    status: 'completed',
    execution_time_ms: 1450,
    created_at: new Date(Date.now() - 3600000 * 12).toISOString(),
    completed_at: new Date(Date.now() - 3600000 * 12 + 1500).toISOString(),
  },
  {
    id: 'job-ibm-002',
    user_id: 'demo-user-1234',
    experiment_id: 'exp-101',
    backend: 'ibmq_qasm_simulator',
    algorithm: "Grover Oracle (N=32)",
    qubits: 5,
    shots: 1024,
    status: 'completed',
    execution_time_ms: 890,
    created_at: new Date(Date.now() - 3600000 * 2).toISOString(),
    completed_at: new Date(Date.now() - 3600000 * 2 + 950).toISOString(),
  },
  {
    id: 'job-ibm-003',
    user_id: 'demo-user-1234',
    experiment_id: 'exp-103',
    backend: 'ibmq_kolkata (27 qubits)',
    algorithm: 'ZZFeatureMap Kernel',
    qubits: 6,
    shots: 4096,
    status: 'completed',
    execution_time_ms: 2100,
    created_at: new Date(Date.now() - 3600000 * 24).toISOString(),
    completed_at: new Date(Date.now() - 3600000 * 24 + 2200).toISOString(),
  }
] as unknown as QuantumJob[];

export const BENCHMARK_NOTIFICATIONS = [
  {
    id: 'notif-001',
    user_id: 'demo-user-1234',
    type: 'success',
    title: 'VQE converged successfully',
    message: 'Remdesivir binding simulation achieved -11.42 kcal/mol affinity score with SARS-CoV-2 Mpro.',
    read: false,
    created_at: new Date(Date.now() - 3600000 * 3).toISOString(),
  },
  {
    id: 'notif-002',
    user_id: 'demo-user-1234',
    type: 'system',
    title: 'IBM Quantum Backend Online',
    message: 'Connected to Qiskit Aer simulation kernel. Queue latency is currently optimal (< 1.2s).',
    read: true,
    created_at: new Date(Date.now() - 3600000 * 14).toISOString(),
  },
  {
    id: 'notif-003',
    user_id: 'demo-user-1234',
    type: 'info',
    title: 'Welcome to Q-MedLab',
    message: 'Explore quantum algorithms applied to diagnostic reasoning, drug discovery, and AMR prediction.',
    read: true,
    created_at: new Date(Date.now() - 3600000 * 48).toISOString(),
  }
] as unknown as Notification[];

