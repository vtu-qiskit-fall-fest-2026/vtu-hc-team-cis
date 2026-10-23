// Official Q-MedLab Real-Time Datasets matching IEEE & Academic Project Report 2026-2027
// Integrating VQE, QSVM, Grover's Search, QCNN, XAI, QKD, and QGAN

export interface ProjectReportDrug {
  id: number;
  drug: string;
  targetName: string;
  geneSymbol: string;
  medicalArea: string;
  smiles?: string;
  pdbId?: string;
  pdbTitle?: string;
}

export interface ProjectReportPathogen {
  name: string;
  gramType: 'Gram +ve' | 'Gram -ve' | 'No cell wall' | 'Gram -ve (atypical)';
  infections: string;
  whoPriority: 'Critical' | 'High' | 'Medium' | 'Standard';
}

export interface ProjectReportAntibiotic {
  name: string;
  class: string;
  mechanism: string;
  route: string;
}

export interface ProjectReportClinicalCase {
  id: number;
  symptoms: string[];
  prediction: string;
}

// 30 Real Drugs & Protein Targets with Official RCSB PDB ID Mappings
export const REAL_DRUG_TARGETS: ProjectReportDrug[] = [
  { id: 1, drug: 'Sildenafil', targetName: 'Phosphodiesterase 5A', geneSymbol: 'PDE5A', medicalArea: 'Cardiovascular / erectile dysfunction', smiles: 'CCCC1=NN(C2=C1N=C(NC2=O)C3=C(C=CC(=C3)S(=O)(=O)N4CCN(CC4)C)OCC)C', pdbId: '3N55', pdbTitle: 'Human PDE5A catalytic domain complexed with Sildenafil' },
  { id: 2, drug: 'Tadalafil', targetName: 'Phosphodiesterase 5A', geneSymbol: 'PDE5A', medicalArea: 'Cardiovascular / erectile dysfunction', smiles: 'O=C1N(C)CC(=O)N2[C@H]1CC3=C(N2)C4=CC=CC=C4C=C3C5=CC6=C(OCO6)C=C5', pdbId: '1UDU', pdbTitle: 'Human PDE5A catalytic domain complexed with Tadalafil' },
  { id: 3, drug: 'Losartan', targetName: 'Angiotensin II receptor type 1', geneSymbol: 'AGTR1', medicalArea: 'Hypertension', smiles: 'CCCC1=NC(=C(N1CC2=CC=C(C=C2)C3=CC=CC=C3C4=NNN[N-]4)CO)Cl', pdbId: '4YAY', pdbTitle: 'Human Angiotensin II Type 1 Receptor (AGTR1) bound to Losartan' },
  { id: 4, drug: 'Amlodipine', targetName: 'Voltage-dependent L-type calcium channel alpha-1C', geneSymbol: 'CACNA1C', medicalArea: 'Cardiovascular', smiles: 'CCOC(=O)C1=C(NC(=C(C1C2=CC=CC=C2Cl)C(=O)OC)C)COCCN', pdbId: '6JPB', pdbTitle: 'L-type Calcium Channel Cav1.2 complexed with Amlodipine' },
  { id: 5, drug: 'Propranolol', targetName: 'Beta-1 adrenergic receptor', geneSymbol: 'ADRB1', medicalArea: 'Cardiovascular', smiles: 'CC(C)NCC(COC1=CC=CC2=CC=CC=C21)O', pdbId: '2VT4', pdbTitle: 'Beta-1 Adrenergic Receptor complexed with Propranolol antagonist' },
  { id: 6, drug: 'Salbutamol', targetName: 'Beta-2 adrenergic receptor', geneSymbol: 'ADRB2', medicalArea: 'Asthma / respiratory', smiles: 'CC(C)(C)NCC(C1=CC(=C(C=C1)O)CO)O', pdbId: '2RH1', pdbTitle: 'Human Beta-2 Adrenergic Receptor complexed with agonist Salbutamol' },
  { id: 7, drug: 'Montelukast', targetName: 'Cysteinyl leukotriene receptor 1', geneSymbol: 'CYSLTR1', medicalArea: 'Asthma / inflammation', smiles: 'CC(C)(C1=CC=CC=C1CCC(C2=CC=CC(=C2)/C=C/C3=NC4=C(C=C3)C=CC(=C4)Cl)SCC5(CC5)CC(=O)O)O', pdbId: '6RZ5', pdbTitle: 'Human Cysteinyl Leukotriene Receptor CysLT1 bound to Montelukast' },
  { id: 8, drug: 'Cetirizine', targetName: 'Histamine H1 receptor', geneSymbol: 'HRH1', medicalArea: 'Allergy / immunology', smiles: 'C1CN(CCN1CCOCC(=O)O)C(C2=CC=CC=C2)C3=CC=C(C=C3)Cl', pdbId: '3RZE', pdbTitle: 'Human Histamine H1 Receptor complexed with Cetirizine' },
  { id: 9, drug: 'Fluoxetine', targetName: 'Sodium-dependent serotonin transporter', geneSymbol: 'SLC6A4', medicalArea: 'Depression / neuroscience', smiles: 'CNCCC(C1=CC=CC=C1)OC2=CC=C(C=C2)C(F)(F)F', pdbId: '6DZY', pdbTitle: 'Human Serotonin Transporter SLC6A4 bound to Fluoxetine (Prozac)' },
  { id: 10, drug: 'Sertraline', targetName: 'Sodium-dependent serotonin transporter', geneSymbol: 'SLC6A4', medicalArea: 'Depression / neuroscience', smiles: 'CNC1CCC(C2=CC=CC=C12)C3=CC(=C(C=C3)Cl)Cl', pdbId: '6DZZ', pdbTitle: 'Human Serotonin Transporter SLC6A4 bound to Sertraline (Zoloft)' },
  { id: 11, drug: 'Duloxetine', targetName: 'Sodium-dependent serotonin transporter', geneSymbol: 'SLC6A4', medicalArea: 'Depression / neuroscience', smiles: 'CNCCC(C1=CC=CS1)OC2=CC=CC3=CC=CC=C32', pdbId: '6E7Y', pdbTitle: 'Human Serotonin Transporter SLC6A4 complexed with Duloxetine (Cymbalta)' },
  { id: 12, drug: 'Morphine', targetName: 'Mu-type opioid receptor', geneSymbol: 'OPRM1', medicalArea: 'Pain / neuroscience', smiles: 'CN1CCC23C4C1CC5=C2C(=C(C=C5)O)OC3C(C=C4)O', pdbId: '5C1M', pdbTitle: 'Mu-Type Opioid Receptor OPRM1 bound to Morphine agonist' },
  { id: 13, drug: 'Naloxone', targetName: 'Mu-type opioid receptor', geneSymbol: 'OPRM1', medicalArea: 'Opioid research', smiles: 'C=CCN1CCC23C4C1CC5=C2C(=C(C=C5)O)OC3C(=O)CC4(O)O', pdbId: '4DKL', pdbTitle: 'Mu-Type Opioid Receptor OPRM1 bound to Naloxone antagonist' },
  { id: 14, drug: 'Diazepam', targetName: 'Gamma-aminobutyric acid receptor subunit alpha-1', geneSymbol: 'GABRA1', medicalArea: 'Neuroscience', smiles: 'CN1C(=O)CN=C(C2=C1C=CC(=C2)Cl)C3=CC=CC=C3', pdbId: '6X3X', pdbTitle: 'Human GABA-A Receptor Subunit Alpha-1 complexed with Diazepam (Valium)' },
  { id: 15, drug: 'Levodopa', targetName: 'Aromatic-L-amino-acid decarboxylase', geneSymbol: 'DDC', medicalArea: "Parkinson's disease", smiles: 'C1=CC(=C(C=C1CC(C(=O)O)N)O)O', pdbId: '3R24', pdbTitle: 'Human DOPA Decarboxylase (DDC) complexed with Levodopa' },
  { id: 16, drug: 'Clopidogrel', targetName: 'P2Y purinoceptor 12', geneSymbol: 'P2RY12', medicalArea: 'Platelet / cardiovascular', smiles: 'COC(=O)C(C1=CC=CC=C1Cl)N2CCC3=C(C2)C=CS3', pdbId: '4NTJ', pdbTitle: 'Human P2Y12 Platelet Receptor complexed with Clopidogrel (Plavix)' },
  { id: 17, drug: 'Rivaroxaban', targetName: 'Coagulation factor X', geneSymbol: 'F10', medicalArea: 'Anticoagulation', smiles: 'O=C1N(CC(O1)CNC(=O)C2=CC=C(S2)Cl)C3=CC=C(N4CCOCC4=O)C=C3', pdbId: '2P16', pdbTitle: 'Human Coagulation Factor Xa complexed with Rivaroxaban (Xarelto)' },
  { id: 18, drug: 'Apixaban', targetName: 'Coagulation factor X', geneSymbol: 'F10', medicalArea: 'Anticoagulation', smiles: 'COC1=CC=C(C=C1)N2C=C(C3=C2N(N=C3)C4=CC=C(C=C4)N5CCCCC5=O)C(=O)N', pdbId: '2P3F', pdbTitle: 'Human Coagulation Factor Xa complexed with Apixaban (Eliquis)' },
  { id: 19, drug: 'Dabigatran', targetName: 'Coagulation factor II / Prothrombin', geneSymbol: 'F2', medicalArea: 'Coagulation', smiles: 'CN(CC1=NC2=C(N1)C=C(C=C2)C(=O)N(CCC(=O)O)C3=CC=CC=N3)C4=CC=C(C=C4)C(=N)N', pdbId: '1K22', pdbTitle: 'Human Thrombin Catalytic Domain complexed with Dabigatran' },
  { id: 20, drug: 'Alteplase', targetName: 'Plasminogen', geneSymbol: 'PLG', medicalArea: 'Thrombolysis', smiles: 'Recombinant tissue plasminogen activator protein (527 amino acids)', pdbId: '1A5H', pdbTitle: 'Human Tissue Plasminogen Activator (t-PA) catalytic domain' },
  { id: 21, drug: 'Imatinib', targetName: 'Tyrosine-protein kinase ABL1', geneSymbol: 'ABL1', medicalArea: 'Cancer / leukemia', smiles: 'CC1=C(C=C(C=C1)NC(=O)C2=CC=C(C=C2)CN3CCN(CC3)C)NC4=NC=CC(=N4)C5=CN=CC=C5', pdbId: '1T46', pdbTitle: 'Human ABL1 Tyrosine Kinase Domain bound to Imatinib (Gleevec STI-571)' },
  { id: 22, drug: 'Erlotinib', targetName: 'Epidermal growth factor receptor', geneSymbol: 'EGFR', medicalArea: 'Cancer', smiles: 'COCCOC1=C(C=C2C(=C1)C(=NC=N2)NC3=CC=CC(=C3)C#C)OCCOC', pdbId: '1M17', pdbTitle: 'Human EGFR Kinase Domain complexed with Erlotinib (Tarceva)' },
  { id: 23, drug: 'Gefitinib', targetName: 'Epidermal growth factor receptor', geneSymbol: 'EGFR', medicalArea: 'Cancer', smiles: 'COC1=C(C=C2C(=C1)N=CN=C2NC3=CC(=C(C=C3)F)Cl)OCCCN4CCOCC4', pdbId: '2EBV', pdbTitle: 'Human EGFR Kinase Domain complexed with Gefitinib (Iressa)' },
  { id: 24, drug: 'Trastuzumab', targetName: 'Receptor tyrosine-protein kinase erbB-2', geneSymbol: 'ERBB2 / HER2', medicalArea: 'Cancer', smiles: 'Monoclonal antibody IgG1 targeting extracellular domain IV of HER2', pdbId: '1N8Z', pdbTitle: 'Human HER2 Extracellular Domain IV complexed with Trastuzumab (Herceptin)' },
  { id: 25, drug: 'Tamoxifen', targetName: 'Estrogen receptor alpha', geneSymbol: 'ESR1', medicalArea: 'Breast cancer', smiles: 'CCC(=C(C1=CC=CC=C1)C2=CC=C(C=C2)OCCN(C)C)C3=CC=CC=C3', pdbId: '3ERT', pdbTitle: 'Human Estrogen Receptor Alpha LBD bound to 4-hydroxytamoxifen' },
  { id: 26, drug: 'Anastrozole', targetName: 'Cytochrome P450 19A1 / Aromatase', geneSymbol: 'CYP19A1', medicalArea: 'Breast cancer', smiles: 'CC(C)(C#N)C1=CC(=CC(=C1)CN2C=NC=N2)C(C)(C)C#N', pdbId: '3S79', pdbTitle: 'Human Aromatase CYP19A1 bound to Anastrozole (Arimidex)' },
  { id: 27, drug: 'Methotrexate', targetName: 'Dihydrofolate reductase', geneSymbol: 'DHFR', medicalArea: 'Cancer / autoimmune', smiles: 'CN(CC1=CN=C2C(=N1)C(=NC(=N2)N)N)C3=CC=C(C=C3)C(=O)NC(CCC(=O)O)C(=O)O', pdbId: '1DHF', pdbTitle: 'Human Dihydrofolate Reductase (DHFR) complexed with Methotrexate' },
  { id: 28, drug: 'Sitagliptin', targetName: 'Dipeptidyl peptidase-4', geneSymbol: 'DPP4', medicalArea: 'Diabetes', smiles: 'C1CN2C(=NN=C2C(F)(F)F)CN1C(=O)CC(CC3=CC(=C(C=C3F)F)F)N', pdbId: '1XOI', pdbTitle: 'Human Dipeptidyl Peptidase IV (DPP4) complexed with Sitagliptin (Januvia)' },
  { id: 29, drug: 'Dapagliflozin', targetName: 'Sodium/glucose cotransporter 2', geneSymbol: 'SLC5A2', medicalArea: 'Diabetes / metabolism', smiles: 'CCOC1=CC=C(C=C1)CC2=C(C=CC(=C2)Cl)[C@H]3[C@@H]([C@H]([C@@H]([C@H](O3)CO)O)O)O', pdbId: '7SL8', pdbTitle: 'Human SGLT2 Transport Complexed with Dapagliflozin (Farxiga)' },
  { id: 30, drug: 'Allopurinol', targetName: 'Xanthine dehydrogenase/oxidase', geneSymbol: 'XDH', medicalArea: 'Metabolism / gout', smiles: 'C1=C2C(=NNC2=O)N=CN1', pdbId: '3BDJ', pdbTitle: 'Bovine Xanthine Oxidase (XDH) complexed with Allopurinol' },
];

// 22 Bacterial Pathogens from Project Report PDF
export const REAL_PATHOGENS: ProjectReportPathogen[] = [
  { name: 'Streptococcus pneumoniae', gramType: 'Gram +ve', infections: 'Pneumonia, meningitis, otitis media', whoPriority: 'High' },
  { name: 'Streptococcus pyogenes', gramType: 'Gram +ve', infections: 'Strep throat, cellulitis, rheumatic fever', whoPriority: 'Standard' },
  { name: 'Streptococcus agalactiae (Group B)', gramType: 'Gram +ve', infections: 'Neonatal sepsis, meningitis', whoPriority: 'Standard' },
  { name: 'Enterobacter cloacae', gramType: 'Gram -ve', infections: 'Hospital-acquired bloodstream, UTI', whoPriority: 'Critical' },
  { name: 'Serratia marcescens', gramType: 'Gram -ve', infections: 'UTI, wound & respiratory infections', whoPriority: 'Critical' },
  { name: 'Proteus mirabilis', gramType: 'Gram -ve', infections: 'UTI, kidney stones, wound infection', whoPriority: 'High' },
  { name: 'Shigella flexneri', gramType: 'Gram -ve', infections: 'Bacillary dysentery', whoPriority: 'High' },
  { name: 'Campylobacter jejuni', gramType: 'Gram -ve', infections: 'Acute gastroenteritis', whoPriority: 'High' },
  { name: 'Vibrio cholerae', gramType: 'Gram -ve', infections: 'Cholera (severe watery diarrhoea)', whoPriority: 'Standard' },
  { name: 'Haemophilus influenzae', gramType: 'Gram -ve', infections: 'Meningitis, pneumonia, sinusitis', whoPriority: 'Medium' },
  { name: 'Legionella pneumophila', gramType: 'Gram -ve', infections: "Legionnaires' disease (pneumonia)", whoPriority: 'Standard' },
  { name: 'Listeria monocytogenes', gramType: 'Gram +ve', infections: 'Foodborne meningitis, sepsis', whoPriority: 'Standard' },
  { name: 'Bacillus anthracis', gramType: 'Gram +ve', infections: 'Anthrax (cutaneous / inhalational)', whoPriority: 'Standard' },
  { name: 'Clostridium perfringens', gramType: 'Gram +ve', infections: 'Gas gangrene, food poisoning', whoPriority: 'Standard' },
  { name: 'Corynebacterium diphtheriae', gramType: 'Gram +ve', infections: 'Diphtheria', whoPriority: 'Standard' },
  { name: 'Bordetella pertussis', gramType: 'Gram -ve', infections: 'Whooping cough', whoPriority: 'Standard' },
  { name: 'Mycoplasma pneumoniae', gramType: 'No cell wall', infections: 'Atypical (walking) pneumonia', whoPriority: 'Standard' },
  { name: 'Chlamydia trachomatis', gramType: 'Gram -ve (atypical)', infections: 'STI, trachoma, conjunctivitis', whoPriority: 'Standard' },
  { name: 'Stenotrophomonas maltophilia', gramType: 'Gram -ve', infections: 'Opportunistic respiratory/ICU infection', whoPriority: 'Standard' },
  { name: 'Burkholderia cepacia', gramType: 'Gram -ve', infections: 'Cystic fibrosis lung infection', whoPriority: 'Standard' },
  { name: 'Moraxella catarrhalis', gramType: 'Gram -ve', infections: 'Sinusitis, otitis media, bronchitis', whoPriority: 'Standard' },
  { name: 'Yersinia pestis', gramType: 'Gram -ve', infections: 'Plague (bubonic/pneumonic)', whoPriority: 'Standard' },
];

// 22 Antibiotics from Project Report PDF
export const REAL_ANTIBIOTICS: ProjectReportAntibiotic[] = [
  { name: 'Ceftriaxone', class: 'Cephalosporin (3rd gen)', mechanism: 'Inhibits cell-wall synthesis', route: 'IV/IM' },
  { name: 'Cefepime', class: 'Cephalosporin (4th gen)', mechanism: 'Inhibits cell-wall synthesis', route: 'IV' },
  { name: 'Piperacillin-Tazobactam', class: 'Penicillin + beta-lactamase inhibitor', mechanism: 'Cell-wall synthesis inhibition', route: 'IV' },
  { name: 'Imipenem-Cilastatin', class: 'Carbapenem', mechanism: 'Broad-spectrum cell-wall inhibition', route: 'IV' },
  { name: 'Ertapenem', class: 'Carbapenem', mechanism: 'Cell-wall synthesis inhibition', route: 'IV/IM' },
  { name: 'Aztreonam', class: 'Monobactam', mechanism: 'Cell-wall synthesis (Gram -ve only)', route: 'IV/IM' },
  { name: 'Gentamicin', class: 'Aminoglycoside', mechanism: 'Inhibits 30S ribosomal protein synthesis', route: 'IV/IM' },
  { name: 'Amikacin', class: 'Aminoglycoside', mechanism: 'Inhibits 30S ribosomal protein synthesis', route: 'IV/IM' },
  { name: 'Tobramycin', class: 'Aminoglycoside', mechanism: 'Inhibits 30S ribosomal protein synthesis', route: 'IV/Inhaled' },
  { name: 'Doxycycline', class: 'Tetracycline', mechanism: 'Inhibits 30S ribosomal protein synthesis', route: 'Oral/IV' },
  { name: 'Tigecycline', class: 'Glycylcycline', mechanism: 'Inhibits 30S ribosomal protein synthesis', route: 'IV' },
  { name: 'Clindamycin', class: 'Lincosamide', mechanism: 'Inhibits 50S ribosomal protein synthesis', route: 'Oral/IV' },
  { name: 'Metronidazole', class: 'Nitroimidazole', mechanism: 'DNA strand breakage (anaerobes)', route: 'Oral/IV' },
  { name: 'Trimethoprim-Sulfamethoxazole', class: 'Folate-pathway inhibitor', mechanism: 'Blocks folic-acid synthesis', route: 'Oral/IV' },
  { name: 'Rifampin', class: 'Rifamycin', mechanism: 'Inhibits RNA polymerase', route: 'Oral/IV' },
  { name: 'Isoniazid', class: 'Anti-tubercular', mechanism: 'Inhibits mycolic-acid synthesis', route: 'Oral' },
  { name: 'Ethambutol', class: 'Anti-tubercular', mechanism: 'Inhibits arabinogalactan synthesis', route: 'Oral' },
  { name: 'Colistin (Polymyxin E)', class: 'Polymyxin', mechanism: 'Disrupts outer bacterial membrane', route: 'IV/Inhaled' },
  { name: 'Fosfomycin', class: 'Phosphonic acid', mechanism: 'Inhibits early cell-wall synthesis', route: 'Oral/IV' },
  { name: 'Nitrofurantoin', class: 'Nitrofuran', mechanism: 'Damages bacterial DNA/ribosomes', route: 'Oral' },
  { name: 'Levofloxacin', class: 'Fluoroquinolone', mechanism: 'Inhibits DNA gyrase/topoisomerase IV', route: 'Oral/IV' },
  { name: 'Moxifloxacin', class: 'Fluoroquinolone', mechanism: 'Inhibits DNA gyrase/topoisomerase IV', route: 'Oral/IV' },
];

// Complete 84 Symptoms from Project Report PDF
export const REAL_SYMPTOMS_84: string[] = [
  'Fever', 'Cough', 'Sore throat', 'Headache', 'Body pain',
  'Excessive thirst', 'Frequent urination', 'Fatigue', 'Chest discomfort', 'Shortness of breath',
  'Sweating', 'Abdominal pain', 'Nausea', 'Vomiting', 'Joint pain',
  'Joint swelling', 'Joint stiffness', 'Sensitivity to light', 'Runny nose', 'Sneezing',
  'Itchy eyes', 'Mucus', 'Chest congestion', 'Wheezing', 'Chest tightness',
  'Swollen tonsils', 'Difficulty swallowing', 'Chills', 'Muscle aches', 'Diarrhea',
  'Abdominal cramps', 'Heartburn', 'Acid reflux', 'Chest burning after meals', 'Bloating',
  'Constipation', 'Loss of appetite', 'Burning while urinating', 'Lower abdominal discomfort', 'Back/flank pain',
  'Painful urination', 'Blood in urine', 'Pale skin', 'Weakness', 'Dizziness',
  'Weight loss', 'Increased appetite', 'Weight gain', 'Cold sensitivity', 'Trembling',
  'Rapid heartbeat', 'Heat intolerance', 'Skin rash', 'Itching', 'Redness',
  'Scaly skin patches', 'Ring-shaped skin rash', 'Severe itching at night', 'Blurred vision', 'Neck stiffness',
  'Weakness on one side', 'Facial drooping', 'Difficulty speaking', 'Severe chest pain', 'Swollen lymph nodes',
  'Yellowing of skin/eyes', 'Dark urine', 'Leg swelling', 'Lower back pain', 'Limited movement',
  'Morning stiffness', 'Visual disturbances', 'Seizures', 'Confusion', 'Loss of consciousness',
  'Difficulty sleeping', 'Daytime fatigue', 'Difficulty concentrating', 'Persistent sadness', 'Loss of interest',
  'Sleep changes', 'Appetite changes', 'Excessive worry', 'Restlessness',
];

// 40 Real-World Clinical Cases from Project Report PDF
export const REAL_CLINICAL_CASES_40: ProjectReportClinicalCase[] = [
  { id: 1, symptoms: ['Fever', 'Cough', 'Sore throat'], prediction: 'Influenza / Respiratory infection' },
  { id: 2, symptoms: ['Fever', 'Headache', 'Body pain'], prediction: 'Viral infection / Influenza' },
  { id: 3, symptoms: ['Excessive thirst', 'Frequent urination', 'Fatigue'], prediction: 'Diabetes Mellitus' },
  { id: 4, symptoms: ['Chest discomfort', 'Shortness of breath', 'Sweating'], prediction: 'Possible cardiac condition (Angina/MI)' },
  { id: 5, symptoms: ['Abdominal pain', 'Nausea', 'Vomiting'], prediction: 'Gastrointestinal conditions' },
  { id: 6, symptoms: ['Joint pain', 'Joint swelling', 'Joint stiffness'], prediction: 'Arthritis-related condition' },
  { id: 7, symptoms: ['Headache', 'Nausea', 'Sensitivity to light'], prediction: 'Migraine' },
  { id: 8, symptoms: ['Runny nose', 'Sneezing', 'Itchy eyes'], prediction: 'Allergic rhinitis' },
  { id: 9, symptoms: ['Persistent cough', 'Mucus', 'Chest congestion'], prediction: 'Bronchitis / Respiratory infection' },
  { id: 10, symptoms: ['Wheezing', 'Shortness of breath', 'Chest tightness'], prediction: 'Asthma' },
  { id: 11, symptoms: ['Sore throat', 'Swollen tonsils', 'Difficulty swallowing'], prediction: 'Pharyngitis / Tonsillitis' },
  { id: 12, symptoms: ['Fever', 'Chills', 'Cough', 'Muscle aches'], prediction: 'Influenza / Respiratory infection' },
  { id: 13, symptoms: ['Nausea', 'Vomiting', 'Diarrhea', 'Abdominal cramps'], prediction: 'Gastroenteritis' },
  { id: 14, symptoms: ['Heartburn', 'Acid reflux', 'Chest burning after meals'], prediction: 'GERD (Gastroesophageal Reflux)' },
  { id: 15, symptoms: ['Abdominal pain', 'Bloating', 'Alternating diarrhea and constipation'], prediction: 'Irritable bowel syndrome (IBS)' },
  { id: 16, symptoms: ['Severe abdominal pain', 'Fever', 'Loss of appetite'], prediction: 'Possible appendicitis' },
  { id: 17, symptoms: ['Frequent urination', 'Burning while urinating', 'Lower abdominal discomfort'], prediction: 'Urinary tract infection (UTI)' },
  { id: 18, symptoms: ['Back/flank pain', 'Painful urination', 'Blood in urine'], prediction: 'Possible kidney stone / Urinary condition' },
  { id: 19, symptoms: ['Fatigue', 'Pale skin', 'Weakness', 'Dizziness'], prediction: 'Possible anemia' },
  { id: 20, symptoms: ['Weight loss', 'Increased appetite', 'Excessive thirst'], prediction: 'Diabetes / Metabolic disorder' },
  { id: 21, symptoms: ['Weight gain', 'Fatigue', 'Cold sensitivity'], prediction: 'Possible hypothyroidism' },
  { id: 22, symptoms: ['Trembling', 'Sweating', 'Rapid heartbeat', 'Heat intolerance'], prediction: 'Possible hyperthyroidism' },
  { id: 23, symptoms: ['Skin rash', 'Itching', 'Redness'], prediction: 'Dermatitis / Allergic skin condition' },
  { id: 24, symptoms: ['Scaly skin patches', 'Itching'], prediction: 'Eczema / Dermatitis' },
  { id: 25, symptoms: ['Ring-shaped skin rash', 'Itching'], prediction: 'Fungal skin infection (Tinea)' },
  { id: 26, symptoms: ['Severe itching at night', 'Skin rash'], prediction: 'Scabies / Dermatological condition' },
  { id: 27, symptoms: ['Persistent headache', 'Blurred vision', 'Dizziness'], prediction: 'Possible neurological / vascular condition' },
  { id: 28, symptoms: ['Headache', 'Fever', 'Neck stiffness'], prediction: 'Possible meningitis — Urgent evaluation' },
  { id: 29, symptoms: ['Weakness on one side', 'Facial drooping', 'Difficulty speaking'], prediction: 'Possible stroke — Emergency' },
  { id: 30, symptoms: ['Severe chest pain', 'Sweating', 'Shortness of breath'], prediction: 'Possible heart attack — Emergency' },
  { id: 31, symptoms: ['Persistent fatigue', 'Swollen lymph nodes', 'Sore throat'], prediction: 'Possible infectious mononucleosis' },
  { id: 32, symptoms: ['Yellowing of skin/eyes', 'Dark urine', 'Abdominal discomfort'], prediction: 'Possible liver / biliary condition (Hepatitis/Jaundice)' },
  { id: 33, symptoms: ['Leg swelling', 'Shortness of breath', 'Fatigue'], prediction: 'Possible congestive heart failure' },
  { id: 34, symptoms: ['Lower back pain', 'Stiffness', 'Limited movement'], prediction: 'Musculoskeletal condition / Lumbar strain' },
  { id: 35, symptoms: ['Joint pain', 'Morning stiffness', 'Joint swelling'], prediction: 'Rheumatoid arthritis' },
  { id: 36, symptoms: ['Frequent headaches with visual disturbances'], prediction: 'Migraine with aura' },
  { id: 37, symptoms: ['Seizures', 'Confusion', 'Loss of consciousness'], prediction: 'Neurological disorder / Epilepsy — Urgent' },
  { id: 38, symptoms: ['Difficulty sleeping', 'Daytime fatigue', 'Difficulty concentrating'], prediction: 'Sleep disorder / Insomnia' },
  { id: 39, symptoms: ['Persistent sadness', 'Loss of interest', 'Sleep changes', 'Appetite changes'], prediction: 'Major depressive disorder' },
  { id: 40, symptoms: ['Excessive worry', 'Restlessness', 'Rapid heartbeat'], prediction: 'Generalized anxiety disorder' },
];

// The 9 Advanced Novel Features from Project Report PDF
export const PROJECT_9_NOVEL_FEATURES = [
  {
    number: '01',
    title: 'Translate-to-Clinician XAI Dashboard',
    researchBasis: 'Narendran 2025 (npj Digital Medicine)',
    desc: 'Translates raw quantum probabilities and Hartree energies into transparent clinical explanations with SHAP-style qubit contribution heatmaps.',
  },
  {
    number: '02',
    title: 'NISQ Noise Sandbox',
    researchBasis: 'Domingo et al. 2024 (IEEE QCE)',
    desc: 'Interactive toggles to inject depolarizing noise, readout error mitigation, and zero-noise extrapolation (ZNE) to observe real hardware decoherence.',
  },
  {
    number: '03',
    title: 'Multi-Provider Quantum Backend',
    researchBasis: 'Lancellotti et al. 2024 (IEEE QCE)',
    desc: 'Simultaneously compare quantum circuits across IBM Quantum Eagle 127q (gate-based) and D-Wave (quantum annealing) hardware.',
  },
  {
    number: '04',
    title: 'Collaborative Multi-User Lab Sessions',
    researchBasis: 'CRDT & Yjs Realtime Framework',
    desc: 'Shared classroom quantum circuit builder enabling professors to assign docking problems and 30+ students to simulate different drug candidates simultaneously.',
  },
  {
    number: '05',
    title: 'QGAN Medical Image Augmentor',
    researchBasis: 'Md Shabbeer 2025 (IEEE Transactions)',
    desc: 'Quantum Generative Adversarial Networks (QGANs) generate high-fidelity synthetic scans for rare medical conditions with scarce patient data.',
  },
  {
    number: '06',
    title: 'Ultra-Fast Polygenic Risk Analyzer',
    researchBasis: 'Manish Kumar et al. 2025 (IEEE Access)',
    desc: 'Processes 100k genomic VCF matrices with 4.6x quantum speedup (execution time slashed from 88.7s to 19.3s).',
  },
  {
    number: '07',
    title: 'QKD Patient Data Vault',
    researchBasis: 'Kumar et al. 2024',
    desc: 'Quantum Key Distribution (BB84 protocol) simulation providing mathematically uncrackable post-quantum encryption for patient health records.',
  },
  {
    number: '08',
    title: 'Auto-Report Generator',
    researchBasis: 'Academic Coursework & IEEE Standard',
    desc: 'Instantly exports publication-ready PDF/Word lab reports with circuit diagrams, convergence graphs, and clinical AI summaries.',
  },
  {
    number: '09',
    title: 'Public Benchmark Leaderboard',
    researchBasis: 'Open Science Community',
    desc: 'Peer benchmarking tracking VQE docking energy accuracy, QSVM resistance classification hit rate, and student gamification XP.',
  },
];
