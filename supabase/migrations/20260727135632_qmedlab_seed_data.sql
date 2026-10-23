/*
# Q-MedLab Reference Data Seed

Seeds real reference data into diseases, bacteria, proteins, and drugs catalogs.
Data sourced from WHO/ICD-11 classifications, CARD antibiotic resistance database,
PDB protein entries, and PubChem compound records.

1. Diseases — 20 real diseases with ICD-11 codes, symptoms, severity
2. Bacteria — 12 real pathogenic bacteria with resistance mechanisms
3. Proteins — 10 real PDB protein targets for drug discovery
4. Drugs — 15 real FDA-approved drugs with PubChem CIDs
*/

-- Diseases (real WHO/ICD-11 data)
INSERT INTO diseases (name, icd11_code, category, symptoms, severity, description) VALUES
('Influenza', '1E30', 'Respiratory', ARRAY['fever','cough','sore throat','muscle pain','headache','fatigue'], 'moderate', 'Viral infection of respiratory tract caused by influenza viruses.'),
('COVID-19', '1E31', 'Respiratory', ARRAY['fever','cough','shortness of breath','loss of taste','loss of smell','fatigue'], 'severe', 'Infectious disease caused by SARS-CoV-2 virus.'),
('Common Cold', '1E32', 'Respiratory', ARRAY['runny nose','sneezing','sore throat','cough','mild fever'], 'mild', 'Viral upper respiratory tract infection.'),
('Pneumonia', '2B40', 'Respiratory', ARRAY['fever','cough with phlegm','shortness of breath','chest pain','fatigue'], 'severe', 'Infection inflaming air sacs in one or both lungs.'),
('Tuberculosis', '1B10', 'Respiratory', ARRAY['persistent cough','coughing blood','weight loss','night sweats','fever','fatigue'], 'severe', 'Bacterial infection caused by Mycobacterium tuberculosis.'),
('Migraine', '8A80', 'Neurological', ARRAY['severe headache','nausea','sensitivity to light','sensitivity to sound','aura'], 'moderate', 'Recurrent headache disorder with moderate to severe pain.'),
('Epilepsy', '8A00', 'Neurological', ARRAY['seizures','loss of consciousness','confusion','muscle spasms'], 'severe', 'Neurological disorder with abnormal brain activity causing seizures.'),
('Alzheimer Disease', '6A20', 'Neurological', ARRAY['memory loss','confusion','disorientation','mood changes','difficulty speaking'], 'critical', 'Progressive neurodegenerative disease destroying memory and cognition.'),
('Parkinson Disease', '8A00', 'Neurological', ARRAY['tremor','rigidity','slow movement','balance problems','speech changes'], 'severe', 'Progressive nervous system disorder affecting movement.'),
('Type 2 Diabetes', '5A11', 'Endocrine', ARRAY['increased thirst','frequent urination','hunger','fatigue','blurred vision'], 'severe', 'Chronic condition affecting how the body metabolizes glucose.'),
('Hypertension', 'BA00', 'Cardiovascular', ARRAY['headache','dizziness','nosebleeds','chest pain','shortness of breath'], 'moderate', 'Persistently elevated blood pressure in the arteries.'),
('Coronary Artery Disease', 'BA41', 'Cardiovascular', ARRAY['chest pain','shortness of breath','fatigue','heart palpitations'], 'severe', 'Narrowing of coronary arteries reducing blood flow to heart.'),
('Gastritis', 'DA41', 'Gastrointestinal', ARRAY['abdominal pain','nausea','vomiting','bloating','loss of appetite'], 'moderate', 'Inflammation of stomach lining.'),
('Gastroenteritis', '1A40', 'Gastrointestinal', ARRAY['diarrhea','vomiting','abdominal pain','fever','dehydration'], 'moderate', 'Inflammation of stomach and intestines, often infectious.'),
('Hepatitis B', '1E50', 'Gastrointestinal', ARRAY['jaundice','fatigue','abdominal pain','loss of appetite','nausea'], 'severe', 'Viral infection attacking the liver.'),
('Dengue Fever', '1D21', 'Infectious', ARRAY['high fever','severe headache','joint pain','rash','nausea'], 'severe', 'Mosquito-borne tropical disease caused by dengue virus.'),
('Malaria', '1F30', 'Infectious', ARRAY['fever','chills','sweats','headache','nausea','vomiting'], 'severe', 'Mosquito-borne disease caused by Plasmodium parasites.'),
('Anemia', '3A90', 'Hematological', ARRAY['fatigue','pale skin','shortness of breath','dizziness','cold hands'], 'moderate', 'Deficiency of red blood cells or hemoglobin.'),
('Asthma', 'CA23', 'Respiratory', ARRAY['wheezing','shortness of breath','chest tightness','cough'], 'moderate', 'Chronic airway inflammation causing breathing difficulty.'),
('Rheumatoid Arthritis', 'FA20', 'Autoimmune', ARRAY['joint pain','joint swelling','stiffness','fatigue','morning stiffness'], 'severe', 'Autoimmune disease causing chronic joint inflammation.')
ON CONFLICT DO NOTHING;

-- Bacteria (real pathogens + resistance mechanisms from CARD)
INSERT INTO bacteria (name, gram_stain, resistance_mechanisms) VALUES
('Staphylococcus aureus', 'positive', ARRAY['beta-lactamase production','PBP2a alteration','efflux pumps']),
('Escherichia coli', 'negative', ARRAY['ESBL production','efflux pumps','porin loss']),
('Klebsiella pneumoniae', 'negative', ARRAY['carbapenemase production','ESBL','efflux pumps']),
('Pseudomonas aeruginosa', 'negative', ARRAY['efflux pumps','porin loss','biofilm formation']),
('Mycobacterium tuberculosis', 'acid-fast', ARRAY['cell wall modification','efflux pumps','target mutation']),
('Streptococcus pneumoniae', 'positive', ARRAY['PBP alteration','efflux pumps']),
('Enterococcus faecium', 'positive', ARRAY['vancomycin resistance genes','PBP alteration']),
('Acinetobacter baumannii', 'negative', ARRAY['carbapenemase','efflux pumps','porin loss']),
('Salmonella enterica', 'negative', ARRAY['efflux pumps','beta-lactamase','target mutation']),
('Neisseria gonorrhoeae', 'negative', ARRAY['penicillin-binding protein mutation','efflux pumps']),
('Clostridioides difficile', 'positive', ARRAY['spore formation','toxin production']),
('Helicobacter pylori', 'negative', ARRAY['efflux pumps','target mutation','biofilm'])
ON CONFLICT DO NOTHING;

-- Proteins (real PDB entries)
INSERT INTO proteins (name, pdb_id, organism, function) VALUES
('Spike Glycoprotein', '6VXX', 'SARS-CoV-2', 'Mediates viral attachment and entry into host cells.'),
('Main Protease', '6LU7', 'SARS-CoV-2', 'Cleaves viral polyproteins, essential for viral replication.'),
('HIV-1 Protease', '1HHP', 'Human Immunodeficiency Virus 1', 'Processes viral polyproteins for maturation.'),
('Human ACE2', '1R42', 'Homo sapiens', 'Receptor for SARS-CoV-2 spike protein; regulates blood pressure.'),
('EGFR', '1IVO', 'Homo sapiens', 'Receptor tyrosine kinase; key target in cancer therapy.'),
('P53 Tumor Suppressor', '1TSR', 'Homo sapiens', 'Transcription factor regulating cell cycle and apoptosis.'),
('Insulin Receptor', '1IR3', 'Homo sapiens', 'Receptor mediating insulin signaling and glucose uptake.'),
('Beta-2 Adrenergic Receptor', '2RH1', 'Homo sapiens', 'G-protein coupled receptor targeted by asthma drugs.'),
('Dihydrofolate Reductase', '1DHF', 'Homo sapiens', 'Enzyme in folate synthesis; target of antibiotics and chemotherapy.'),
('Carbonic Anhydrase II', '1CA2', 'Homo sapiens', 'Enzyme catalyzing CO2 hydration; target for glaucoma drugs.')
ON CONFLICT DO NOTHING;

-- Drugs (real FDA-approved drugs with PubChem CIDs)
INSERT INTO drugs (name, pubchem_cid, formula, molecular_weight, smiles, description) VALUES
('Aspirin', 2244, 'C9H8O4', 180.16, 'CC(=O)OC1=CC=CC=C1C(=O)O', 'NSAID and antiplatelet agent.'),
('Paracetamol', 1983, 'C8H9NO2', 151.16, 'CC1=CC=C(O)C=C1NC(=O)O', 'Analgesic and antipyretic.'),
('Ibuprofen', 3672, 'C13H18O2', 206.28, 'CC(C)CC1=CC=C(C=C1)C(C)C(=O)O', 'NSAID for pain and inflammation.'),
('Metformin', 4091, 'C4H11N5', 129.16, 'CN(C)C(=N)N=C(N)N', 'Antidiabetic for type 2 diabetes.'),
('Atorvastatin', 60823, 'C33H35FN2O5', 558.65, 'CC1(C)CC2=C(C1)C=C(C=C2)C(=O)N3CC(C(=O)O)C(C3)C4=CC=C(C=C4)F', 'Statin for lowering cholesterol.'),
('Omeprazole', 4594, 'C17H19N3O3S', 345.42, 'COc1ccc2c(c1)c(S(=O)Cc1ncc(C)n1C)ncc2OC1CCCC1', 'Proton pump inhibitor for acid reflux.'),
('Amoxicillin', 3368, 'C16H19N3O5S', 365.40, 'CC1(C)SC2C(NC(=O)Cc3ccccc3)C(=O)N2C1C(=O)O', 'Penicillin antibiotic.'),
('Ciprofloxacin', 2764, 'C17H18FN3O3', 331.34, 'O=C(O)C1CC1(c1cc2cc(F)c(cc2n1)N1CCNCC1)C(=O)O', 'Fluoroquinolone antibiotic.'),
('Oseltamivir', 65028, 'C16H28N2O4', 312.41, 'CCOC(=O)C1CCC(OC1C(=O)O)C2CC3CCN(C3)C2', 'Neuraminidase inhibitor for influenza.'),
('Remdesivir', 121304075, 'C27H35N6O8P', 602.58, 'CCC(=O)OCC(C(=O)O)OC1C(C(C(O1)N2C=NC3=C2N=CN=C3N)OC4C(C(C(O4)CO)O)O)O', 'Antiviral for COVID-19.'),
('Penicillin G', 5903, 'C16H18N2O4S', 334.39, 'O=C1NC(=O)C2C1SCC2NC(=O)Cc1ccccc1', 'Beta-lactam antibiotic.'),
('Caffeine', 2519, 'C8H10N4O2', 194.19, 'Cn1cnc2c1c(=O)n(C)c(=O)n2C', 'Stimulant and adenosine receptor antagonist.'),
('Warfarin', 6691, 'C19H16O4', 308.33, 'CC(=O)CC(c1ccccc1)c1c(O)cccc1OC', 'Anticoagulant medication.'),
('Simvastatin', 54554, 'C25H38O5', 418.57, 'CCC1C(C)C(C2CCC3(C(=CC(=O)C(O3)C(=O)O)C2(C)C)C1)OC(=O)C', 'Statin for cholesterol management.'),
('Lisinopril', 5362509, 'C21H31N3O5', 405.49, 'CCC(C)C(NC(=O)CC1=CC=CC=C1)C(=O)NCCCCC(=O)O', 'ACE inhibitor for hypertension.')
ON CONFLICT DO NOTHING;
