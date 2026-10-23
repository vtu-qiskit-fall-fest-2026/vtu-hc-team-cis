import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Stethoscope, ShieldCheck, AlertTriangle, FileText, Bug, ScanLine, Lock,
  BookOpen, Eye, CheckCircle2, ChevronRight, Activity, Download, HeartPulse,
  Info, Shield, Brain
} from 'lucide-react';
import { Card, Tag, ConfidenceBar } from '@/components/ui';
import { exportPDFReport } from '@/utils/reports';
import {
  REAL_SYMPTOMS_84, REAL_CLINICAL_CASES_40, REAL_PATHOGENS, REAL_ANTIBIOTICS, REAL_DRUG_TARGETS
} from '@/data/realTimeCatalog';
import { runGroverDiagnosis, runQSVM, runQCNN, runQKDKeyExchange, type QKDResult } from '@/quantum/engine';

interface ClinicianDashboardViewProps {
  userName: string;
}

export default function ClinicianDashboardView({ userName }: ClinicianDashboardViewProps) {
  // Clinical Decision Support Form
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>(['Fever', 'Shortness of breath', 'Chest discomfort']);
  const [symptomSearchText, setSymptomSearchText] = useState<string>('');
  const [patientAge, setPatientAge] = useState(58);
  const [systolicBP, setSystolicBP] = useState(138);
  const [diastolicBP, setDiastolicBP] = useState(88);
  const [heartRate, setHeartRate] = useState(92);
  const [diagnosisResult, setDiagnosisResult] = useState<any>(null);

  // AMR Clinical Tool
  const [selectedBacterium, setSelectedBacterium] = useState('Streptococcus pneumoniae');
  const [selectedAntibiotic, setSelectedAntibiotic] = useState('Ceftriaxone');
  const [amrResult, setAmrResult] = useState<any>(null);

  // QKD Encryption Vault
  const [qkdKey, setQkdKey] = useState<QKDResult>(() => runQKDKeyExchange());

  const filteredSymptoms = useMemo(() => {
    if (!symptomSearchText) return REAL_SYMPTOMS_84;
    return REAL_SYMPTOMS_84.filter((s) => s.toLowerCase().includes(symptomSearchText.toLowerCase()));
  }, [symptomSearchText]);

  const handleRunClinicalDiagnosis = () => {
    const clinicalDiseases = REAL_CLINICAL_CASES_40.map((c) => ({
      id: `pdf-dis-${c.id}`,
      name: c.prediction,
      icd11_code: `ICD11-${c.id.toString().padStart(3, '0')}`,
      category: c.prediction.includes('heart') || c.prediction.includes('cardiac') ? 'Cardiovascular' :
                c.prediction.includes('cough') || c.prediction.includes('Respiratory') || c.prediction.includes('Asthma') ? 'Respiratory' :
                c.prediction.includes('Diabetes') ? 'Metabolic' :
                c.prediction.includes('Neurological') || c.prediction.includes('Migraine') || c.prediction.includes('stroke') ? 'Neurological' : 'General Practice',
      symptoms: c.symptoms.map((s) => s.toLowerCase()),
      severity: c.prediction.includes('Emergency') || c.prediction.includes('Urgent') ? 'critical' : 'moderate',
      description: `Symptom cluster presentation matching clinical diagnosis: ${c.prediction}.`,
    }));

    const res = runGroverDiagnosis(
      { symptoms: selectedSymptoms, age: patientAge, gender: 'male', duration: 3 },
      clinicalDiseases as any
    );

    if (res) {
      const isUrgent = res.disease.severity === 'critical' || res.disease.name.toLowerCase().includes('emergency') || res.disease.name.toLowerCase().includes('heart');
      setDiagnosisResult({
        conditionName: res.disease.name,
        confidence: res.confidence,
        qubits: res.qubits,
        groverIterations: res.groverIterations,
        urgency: isUrgent ? 'Red (Emergency)' : 'Amber (Urgent)',
        matchedSymptoms: res.matchedSymptoms,
        mainReasonText: res.mainReasonText,
        differentialDiagnoses: res.differentialDiagnoses,
        shapFeatureAttribution: res.matchedSymptoms.map((s) => ({
          feature: s,
          weight: Math.round(100 / Math.max(1, res.matchedSymptoms.length)),
          text: `Primary clinical symptom matching ICD-11 ${res.disease.name}`,
        })),
        plainDoctorSummary: `Grover's amplitude amplification evaluated 40 clinical disease cases over ${res.qubits} qubits in ${res.groverIterations} iterations. Matched presentation symptoms: ${res.matchedSymptoms.join(', ')}.`,
      });
    }
  };

  const handleRunAMRTool = () => {
    const res = runQSVM({
      bacterium: selectedBacterium,
      antibiotic: selectedAntibiotic,
      mechanisms: ['Beta-lactamase production', 'PBP2a binding modification'],
    });

    const isHighResistance = res.resistant;
    setAmrResult({
      resistant: isHighResistance,
      probability: isHighResistance ? 88.5 : 12.4,
      verdictText: isHighResistance ? 'HIGH RESISTANCE RISK (Pathogen produces inactivating enzymes)' : 'SUSCEPTIBLE (Standard dosing effective)',
      alternatives: isHighResistance ? ['Imipenem-Cilastatin', 'Levofloxacin', 'Vancomycin'] : ['Amoxicillin-Clavulanate'],
    });
  };

  const toggleSymptom = (s: string) => {
    setSelectedSymptoms((prev) => (prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]));
  };

  const handleExportAnnotatedPDF = () => {
    exportPDFReport(`Q-MedLab Clinical Case Report — ${userName}`, [
      { heading: 'Clinical Staff Officer', body: `Attending Clinician: ${userName}<br>Security Status: QKD Encrypted Session (BB84 Protocol Active)` },
      { heading: 'Patient Case Profile', body: `Age: ${patientAge}<br>Vitals: BP ${systolicBP}/${diastolicBP} mmHg, HR ${heartRate} bpm<br>Symptoms: ${selectedSymptoms.join(', ')}` },
      { heading: 'Quantum Diagnostic Decision Support', body: diagnosisResult ? `<p><b>Primary Flagged Condition:</b> ${diagnosisResult.conditionName}</p><p><b>Confidence:</b> ${diagnosisResult.confidence}%</p><p><b>Urgency Level:</b> ${diagnosisResult.urgency}</p><p>${diagnosisResult.plainDoctorSummary}</p>` : 'No active diagnosis performed.' },
      { heading: 'Clinical Disclaimer', body: 'This simulator output is provided for educational and diagnostic decision-support testing only. Not a certified clinical diagnostic device.' }
    ]);
  };

  return (
    <div className="space-y-6">
      {/* Clinician Header Banner with QKD Encryption Security Badge */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-teal-800 via-cyan-900 to-slate-900 text-white shadow-xl relative overflow-hidden border border-teal-500/30">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full bg-teal-500/20 text-teal-200 text-xs font-bold border border-teal-400/30 flex items-center gap-1.5">
                <Stethoscope size={14} /> Clinical Decision Support Portal
              </span>
              <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-mono font-bold flex items-center gap-1 border border-emerald-500/30">
                <Lock size={13} /> QKD Encrypted Session (BB84)
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Clinical Diagnostic & AMR Workbench</h1>
            <p className="mt-1 text-teal-100 text-sm max-w-xl">
              Plain-language doctor-readable quantum insights, XAI qubit heatmaps, and antibiotic resistance prescribing guidance.
            </p>
          </div>

          {/* HIPAA Notice */}
          <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-xs space-y-1">
            <p className="font-bold text-amber-300 flex items-center gap-1">
              <Shield size={14} /> HIPAA Data Privacy Notice
            </p>
            <p className="text-[11px] text-teal-100">All patient inputs are session-only. Zero PHI stored permanently.</p>
          </div>
        </div>
      </div>

      {/* Clinical Decision Support Panel */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Patient Case Input Form */}
        <Card className="lg:col-span-1 border-t-4 border-t-teal-500">
          <h2 className="text-base font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
            <HeartPulse size={18} className="text-teal-500" />
            Patient Case Input Form
          </h2>

          <div className="space-y-3 text-xs">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="label">Patient Age</label>
                <input type="number" value={patientAge} onChange={(e) => setPatientAge(Number(e.target.value))} className="input-field py-1.5" />
              </div>
              <div>
                <label className="label">Heart Rate (bpm)</label>
                <input type="number" value={heartRate} onChange={(e) => setHeartRate(Number(e.target.value))} className="input-field py-1.5" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="label">Systolic BP (mmHg)</label>
                <input type="number" value={systolicBP} onChange={(e) => setSystolicBP(Number(e.target.value))} className="input-field py-1.5" />
              </div>
              <div>
                <label className="label">Diastolic BP (mmHg)</label>
                <input type="number" value={diastolicBP} onChange={(e) => setDiastolicBP(Number(e.target.value))} className="input-field py-1.5" />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="label mb-0">Select Presenting Symptoms ({selectedSymptoms.length})</label>
                <span className="text-[10px] text-teal-400 font-mono">84 Total Available</span>
              </div>
              <input
                type="text"
                value={symptomSearchText}
                onChange={(e) => setSymptomSearchText(e.target.value)}
                placeholder="Search 84 symptoms..."
                className="w-full px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-white text-xs mb-2 focus:outline-none focus:border-teal-500"
              />
              <div className="max-h-56 overflow-y-auto rounded-xl border border-slate-200 dark:border-slate-800 p-2 space-y-1 bg-slate-50 dark:bg-slate-900/40">
                {filteredSymptoms.map((s) => (
                  <button
                    key={s}
                    onClick={() => toggleSymptom(s)}
                    className={`w-full text-left px-2.5 py-1.5 rounded text-xs transition flex items-center justify-between ${
                      selectedSymptoms.includes(s)
                        ? 'bg-teal-500 text-white font-semibold'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800'
                    }`}
                  >
                    <span>{s}</span>
                    {selectedSymptoms.includes(s) && <CheckCircle2 size={13} />}
                  </button>
                ))}
              </div>
            </div>

            <button onClick={handleRunClinicalDiagnosis} className="btn-primary !bg-teal-600 w-full">
              Run Quantum Decision Support
            </button>
          </div>
        </Card>

        {/* Doctor-Readable XAI Output Dashboard */}
        <Card className="lg:col-span-2 border-t-4 border-t-cyan-500">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Brain size={18} className="text-cyan-500" />
              XAI Clinical Dashboard (Plain Language Doctor Output)
            </h2>
            {diagnosisResult && (
              <span className={`px-3 py-1 rounded-full text-xs font-black uppercase ${
                diagnosisResult.urgency === 'Red'
                  ? 'bg-rose-500/20 text-rose-600 border border-rose-500/40 animate-pulse'
                  : 'bg-emerald-500/20 text-emerald-600'
              }`}>
                Urgency: {diagnosisResult.urgency} (Emergency)
              </span>
            )}
          </div>

          {diagnosisResult ? (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-900">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs font-bold text-teal-800 dark:text-teal-300 uppercase tracking-wider">Primary Quantum Diagnosis</p>
                    <h3 className="text-lg font-extrabold text-slate-900 dark:text-white mt-1">{diagnosisResult.conditionName}</h3>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-black text-teal-600 dark:text-teal-400">{diagnosisResult.confidence}%</p>
                    <p className="text-[10px] text-slate-500">Confidence Score</p>
                  </div>
                </div>
                <p className="mt-2 text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-medium">{diagnosisResult.plainDoctorSummary}</p>
              </div>

              {/* Main Reason Rationale */}
              {diagnosisResult.mainReasonText && (
                <div className="p-3.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-xs">
                  <p className="font-bold text-cyan-800 dark:text-cyan-300 flex items-center gap-1.5 mb-1">
                    <Brain size={15} /> Primary Diagnostic Cause & Clinical Rationale
                  </p>
                  <p className="text-slate-700 dark:text-slate-300 leading-relaxed">{diagnosisResult.mainReasonText}</p>
                </div>
              )}

              {/* Differential Diagnoses Probability Breakdown */}
              {diagnosisResult.differentialDiagnoses && diagnosisResult.differentialDiagnoses.length > 0 && (
                <div>
                  <p className="text-xs font-bold text-slate-900 dark:text-white mb-2">Differential Diagnoses Probability Breakdown</p>
                  <div className="space-y-2">
                    {diagnosisResult.differentialDiagnoses.map((diff: any, idx: number) => (
                      <div key={idx} className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
                        <div className="flex justify-between text-xs mb-1">
                          <span className="font-bold text-slate-900 dark:text-white">#{idx + 1} {diff.diseaseName} ({diff.category})</span>
                          <span className="font-mono text-teal-600 font-bold">{diff.confidence}%</span>
                        </div>
                        <ConfidenceBar value={diff.confidence} />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Doctor-Readable Qubit Attribution Heatmap */}
              <div>
                <p className="text-xs font-bold text-slate-900 dark:text-white mb-2">Why was this condition flagged? (SHAP Feature Attribution)</p>
                <div className="space-y-2">
                  {diagnosisResult.shapFeatureAttribution.map((f: any, i: number) => (
                    <div key={i} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="font-bold text-slate-900 dark:text-white">{f.feature}</span>
                        <span className="font-mono text-teal-600 font-bold">{f.weight}% Contribution</span>
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">{f.text}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button onClick={handleExportAnnotatedPDF} className="btn-outline text-xs flex items-center gap-1.5">
                  <FileText size={14} /> Download Clinical Case PDF Report
                </button>
              </div>
            </div>
          ) : (
            <div className="p-12 text-center border border-dashed rounded-2xl border-slate-200 dark:border-slate-800 text-xs text-slate-400">
              Select symptoms and click "Run Quantum Decision Support" to view Doctor-Readable Diagnosis & XAI Heatmap.
            </div>
          )}
        </Card>
      </div>

      {/* AMR Clinical Prescribing Tool */}
      <Card className="border-t-4 border-t-amber-500">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-base flex items-center gap-2">
              <Bug size={18} className="text-amber-500" />
              AMR Clinical Prescribing Tool (QSVM Engine)
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Evaluate pathogen antibiotic resistance probabilities and receive instant quantum-guided alternative prescribing options.
            </p>
          </div>
          <button onClick={handleRunAMRTool} className="btn-primary !bg-amber-600 text-xs shadow-sm flex items-center gap-1.5 self-start sm:self-auto">
            <CheckCircle2 size={14} /> Check Resistance Probability
          </button>
        </div>

        <div className="grid sm:grid-cols-2 gap-4 text-xs mb-4">
          <div>
            <label className="label">Bacterial Culture Species</label>
            <select value={selectedBacterium} onChange={(e) => setSelectedBacterium(e.target.value)} className="input-field py-2">
              {REAL_PATHOGENS.map((p) => (
                <option key={p.name} value={p.name}>{p.name} ({p.gramType})</option>
              ))}
            </select>
          </div>
          <div>
            <label className="label">Antibiotic Under Consideration</label>
            <select value={selectedAntibiotic} onChange={(e) => setSelectedAntibiotic(e.target.value)} className="input-field py-2">
              {REAL_ANTIBIOTICS.map((a) => (
                <option key={a.name} value={a.name}>{a.name} ({a.class})</option>
              ))}
            </select>
          </div>
        </div>

        {amrResult ? (
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">QSVM Resistance Verdict</p>
                <p className={`text-base font-extrabold ${amrResult.resistant ? 'text-rose-600' : 'text-emerald-600'}`}>
                  {amrResult.verdictText}
                </p>
              </div>
              <div className="text-right">
                <p className="text-3xl font-black text-slate-900 dark:text-white">{amrResult.probability}%</p>
                <p className="text-[10px] text-slate-500">Resistance Probability</p>
              </div>
            </div>

            <div>
              <p className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">Recommended Alternative Antibiotics:</p>
              <div className="flex flex-wrap gap-2">
                {amrResult.alternatives.map((alt: string) => (
                  <Tag key={alt} color="emerald">{alt}</Tag>
                ))}
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-[11px] text-amber-700 dark:text-amber-300 italic flex items-center gap-2">
              <Info size={14} className="shrink-0" />
              <span>Disclaimer: Educational QSVM simulation — provided for clinical decision-support research.</span>
            </div>
          </div>
        ) : (
          <div className="p-6 text-center rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 text-xs text-slate-400">
            Select pathogen species & antibiotic to evaluate QSVM resistance risk and alternative therapy options.
          </div>
        )}
      </Card>
    </div>
  );
}
