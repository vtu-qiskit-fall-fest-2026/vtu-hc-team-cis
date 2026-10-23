import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Stethoscope, Search, FileDown, Brain, Activity, Atom, CheckCircle2,
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell,
} from 'recharts';
import { supabase, type Disease } from '@/lib/supabase';
import { runGroverDiagnosis, type DiagnosisInput, type DiagnosisResult } from '@/quantum/engine';
import { explainDiagnosis, type AIExplanation } from '@/ai/explainer';
import { useExperiment } from '@/hooks/useExperiment';
import { useAuth } from '@/context/AuthContext';
import { Card, PageHeader, Spinner, Tag, ConfidenceBar, EmptyState } from '@/components/ui';
import { exportPDFReport, exportJSON, formatDate } from '@/utils/reports';
import { BENCHMARK_DISEASES } from '@/data/fallbackCatalog';
import { REAL_SYMPTOMS_84, REAL_CLINICAL_CASES_40 } from '@/data/realTimeCatalog';

const ALL_84_SYMPTOMS = REAL_SYMPTOMS_84;

const PDF_DISEASES_40: Disease[] = REAL_CLINICAL_CASES_40.map((c) => ({
  id: `pdf-dis-${c.id}`,
  name: c.prediction,
  icd11_code: `PDF-${c.id.toString().padStart(3, '0')}`,
  category: c.prediction.includes('heart') || c.prediction.includes('cardiac') ? 'Cardiovascular' :
            c.prediction.includes('cough') || c.prediction.includes('Respiratory') || c.prediction.includes('Asthma') ? 'Respiratory' :
            c.prediction.includes('Diabetes') ? 'Metabolic' :
            c.prediction.includes('Neurological') || c.prediction.includes('Migraine') || c.prediction.includes('stroke') ? 'Neurological' : 'General Practice',
  symptoms: c.symptoms.map((s) => s.toLowerCase()),
  severity: c.prediction.includes('Emergency') || c.prediction.includes('Urgent') ? 'critical' : 'moderate',
  description: `Symptom cluster presentation matching clinical diagnosis: ${c.prediction}.`,
}));

export default function DiagnosisPage() {
  const { profile } = useAuth();
  const { save } = useExperiment();
  const role = profile?.role ?? 'researcher';

  const themeClasses = useMemo(() => {
    switch (role) {
      case 'student':
        return {
          btn: '!bg-emerald-600 hover:!bg-emerald-500',
          activeSymptom: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 ring-1 ring-emerald-200 dark:ring-emerald-900',
          badgeColor: 'emerald' as const,
          title: 'Quantum Disease Diagnosis (Student Theme)',
        };
      case 'clinician':
        return {
          btn: '!bg-teal-600 hover:!bg-teal-500',
          activeSymptom: 'bg-teal-50 dark:bg-teal-950/40 text-teal-700 dark:text-teal-300 ring-1 ring-teal-200 dark:ring-teal-900',
          badgeColor: 'teal' as const,
          title: 'Quantum Clinical Triage (Clinician Theme)',
        };
      case 'admin':
        return {
          btn: '!bg-amber-600 hover:!bg-amber-500',
          activeSymptom: 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 ring-1 ring-amber-200 dark:ring-amber-900',
          badgeColor: 'amber' as const,
          title: 'Quantum Telemetry Diagnosis (Admin Theme)',
        };
      default:
        return {
          btn: '!bg-purple-600 hover:!bg-purple-500',
          activeSymptom: 'bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 ring-1 ring-purple-200 dark:ring-purple-900',
          badgeColor: 'purple' as const,
          title: 'Quantum Bio-Oracle Diagnosis (Researcher Theme)',
        };
    }
  }, [role]);

  const [diseases, setDiseases] = useState<Disease[]>([]);
  const [loading, setLoading] = useState(true);
  const [symptoms, setSymptoms] = useState<string[]>([]);
  const [age, setAge] = useState(35);
  const [gender, setGender] = useState('male');
  const [duration, setDuration] = useState(7);
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState<DiagnosisResult | null>(null);
  const [explanation, setExplanation] = useState<AIExplanation | null>(null);
  const [symptomSearch, setSymptomSearch] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const { data, error } = await supabase.from('diseases').select('*').order('name');
        if (error || !data || data.length === 0) {
          setDiseases(PDF_DISEASES_40);
        } else {
          setDiseases([...data as Disease[], ...PDF_DISEASES_40]);
        }
      } catch {
        setDiseases(PDF_DISEASES_40);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const filteredSymptoms = useMemo(() => {
    if (!symptomSearch) return ALL_84_SYMPTOMS;
    return ALL_84_SYMPTOMS.filter((s) => s.toLowerCase().includes(symptomSearch.toLowerCase()));
  }, [symptomSearch]);

  const toggleSymptom = (s: string) => {
    setSymptoms((prev) => (prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]));
  };

  const runDiagnosis = async () => {
    if (symptoms.length < 2 || !diseases.length) return;
    setRunning(true);
    setResult(null);
    setExplanation(null);

    // Simulate quantum execution latency
    await new Promise((r) => setTimeout(r, 1400));

    const input: DiagnosisInput = { symptoms, age, gender, duration };
    const res = runGroverDiagnosis(input, diseases);
    setRunning(false);
    if (!res) return;
    setResult(res);
    setExplanation(explainDiagnosis(res));

    await save({
      module: 'diagnosis',
      algorithm: "Grover's Search",
      title: `Diagnosis: ${res.disease.name}`,
      inputData: { ...input } as Record<string, unknown>,
      resultData: { disease: res.disease.name, confidence: res.confidence, matched: res.matchedSymptoms },
      confidence: res.confidence,
    });
  };

  const handleReport = () => {
    if (!result || !explanation) return;
    exportPDFReport(`Q-MedLab Diagnosis Report — ${result.disease.name}`, [
      { heading: 'Patient Profile', body: `Age: ${age}<br>Gender: ${gender}<br>Symptom duration: ${duration} days` },
      { heading: 'Selected Symptoms', body: symptoms.map((s) => `<span class="badge">${s}</span>`).join(' ') },
      { heading: 'Quantum Diagnosis', body: `<p><b>${result.disease.name}</b> (ICD-11: ${result.disease.icd11_code ?? 'N/A'})</p><p>Confidence: ${result.confidence}%</p>` },
      { heading: 'Main Cause & Clinical Rationale', body: `<p>${result.mainReasonText}</p>` },
      { heading: 'Differential Diagnoses Breakdown', body: result.differentialDiagnoses.map((d, i) => `<p>#${i + 1} <b>${d.diseaseName}</b> (${d.category}) — Confidence: <b>${d.confidence}%</b> (${d.matchedSymptomsCount}/${d.totalSymptomsCount} symptoms matched)</p>`).join('') },
      { heading: 'Algorithm Details', body: `Grover's Search over ${result.qubits} qubits, ${result.groverIterations} iterations, circuit depth ${result.circuitDepth}.` },
      { heading: 'AI Explanation', body: `<p>${explanation.summary}</p>${explanation.details.map((d) => `<p>• ${d}</p>`).join('')}` },
      { heading: 'Recommendation', body: explanation.recommendation },
      { heading: 'Disclaimer', body: explanation.disclaimer },
    ]);
  };

  const chartData = result
    ? Object.entries(result.measurementCounts)
        .map(([state, count]) => ({ state, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 6)
    : [];

  if (loading) return <div className="flex justify-center py-20"><Spinner className="h-8 w-8 text-sky-500" /></div>;

  return (
    <div>
      <PageHeader
        title={themeClasses.title}
        subtitle="Grover's Search algorithm matches symptoms against ICD-11 disease states"
        icon={<Stethoscope size={24} />}
      />

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Input panel */}
        <Card className="lg:col-span-1">
          <p className="section-title mb-4">Patient Input</p>
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="label">Age</label>
                <input type="number" min={1} max={120} value={age} onChange={(e) => setAge(Number(e.target.value))} className="input-field" />
              </div>
              <div>
                <label className="label">Gender</label>
                <select value={gender} onChange={(e) => setGender(e.target.value)} className="input-field">
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="label">Days</label>
                <input type="number" min={1} value={duration} onChange={(e) => setDuration(Number(e.target.value))} className="input-field" />
              </div>
            </div>

            <div>
              <label className="label">Search symptoms</label>
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input value={symptomSearch} onChange={(e) => setSymptomSearch(e.target.value)} className="input-field pl-9" placeholder="Filter symptoms..." />
              </div>
            </div>

            <div>
              <label className="label">Select symptoms ({symptoms.length})</label>
              <div className="max-h-64 overflow-y-auto rounded-xl border border-slate-200 dark:border-slate-800 p-2 space-y-1">
                {filteredSymptoms.map((s) => (
                  <button
                    key={s}
                    onClick={() => toggleSymptom(s)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition ${
                      symptoms.includes(s)
                        ? themeClasses.activeSymptom
                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                    }`}
                  >
                    {symptoms.includes(s) && <CheckCircle2 size={14} className="inline mr-1.5" />}
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <button onClick={runDiagnosis} disabled={running || symptoms.length < 2} className={`btn-primary w-full ${themeClasses.btn}`}>
              {running ? <><Atom size={18} className="animate-spin" /> Running Grover...</> : <><Atom size={18} /> Run Quantum Diagnosis</>}
            </button>
            {symptoms.length < 2 && <p className="text-xs text-slate-400 text-center">Select at least 2 symptoms</p>}
          </div>
        </Card>

        {/* Result panel */}
        <div className="lg:col-span-2 space-y-4">
          {running && (
            <Card>
              <div className="flex flex-col items-center py-12">
                <Atom size={40} className="text-sky-500 animate-spin mb-4" />
                <p className="text-sm text-slate-500 dark:text-slate-400">Amplifying oracle states with Grover's algorithm...</p>
              </div>
            </Card>
          )}

          {!running && !result && (
            <Card>
              <EmptyState
                icon={<Stethoscope size={48} />}
                title="No diagnosis yet"
                message="Select patient symptoms and run the quantum diagnosis to see results, confidence scores, and AI explanation."
              />
            </Card>
          )}

          {result && explanation && (
            <>
              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                <Card>
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <Tag color="sky">Grover Search</Tag>
                        <Tag color="slate">{result.qubits} qubits</Tag>
                        <Tag color="slate">{result.groverIterations} iterations</Tag>
                      </div>
                      <h3 className="mt-2 text-xl font-bold text-slate-900 dark:text-white">{result.disease.name}</h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        ICD-11: {result.disease.icd11_code} · {result.disease.category} · Severity: {result.disease.severity}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-3xl font-bold text-sky-600 dark:text-sky-400 tabular-nums">{result.confidence}%</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">confidence</p>
                    </div>
                  </div>
                  <div className="mb-3"><ConfidenceBar value={result.confidence} /></div>
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {result.matchedSymptoms.map((s) => <Tag key={s} color="emerald">{s}</Tag>)}
                  </div>
                  <div className="flex gap-2 mt-4">
                    <button onClick={handleReport} className="btn-outline text-sm">
                      <FileDown size={16} /> Download Report
                    </button>
                    <button onClick={() => exportJSON(`diagnosis-${result.disease.name.toLowerCase().replace(/\s/g, '-')}.json`, { result, explanation, input: { age, gender, duration, symptoms } })} className="btn-ghost text-sm">
                      Export JSON
                    </button>
                  </div>
                </Card>

                {/* Main Reason Rationale Card */}
                {result.mainReasonText && (
                  <Card className="border-l-4 border-l-sky-500 bg-gradient-to-r from-sky-50/60 to-indigo-50/40 dark:from-sky-950/30 dark:to-indigo-950/20">
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-xl bg-sky-500/10 text-sky-600 dark:text-sky-400 shrink-0 mt-0.5">
                        <Brain size={20} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-bold text-slate-900 dark:text-white">Main Reason & Diagnostic Rationale</h4>
                          <Tag color="sky">Age & Symptom Weighting</Tag>
                        </div>
                        <p className="text-sm text-slate-700 dark:text-slate-300 mt-1.5 leading-relaxed font-medium">
                          {result.mainReasonText}
                        </p>
                      </div>
                    </div>
                  </Card>
                )}

                {/* Differential Diagnoses Probability Breakdown Card */}
                {result.differentialDiagnoses && result.differentialDiagnoses.length > 0 && (
                  <Card>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <Activity size={18} className="text-emerald-500" />
                        <p className="section-title">Differential Diagnosis Candidate Breakdown</p>
                      </div>
                      <span className="text-xs font-medium text-slate-500">Top Probability Matches</span>
                    </div>
                    <div className="space-y-3">
                      {result.differentialDiagnoses.map((diff, idx) => (
                        <div
                          key={diff.diseaseName}
                          className={`p-3.5 rounded-xl border transition ${
                            idx === 0
                              ? 'bg-sky-50/80 dark:bg-sky-950/40 border-sky-200 dark:border-sky-800/60 ring-1 ring-sky-300/50 dark:ring-sky-700/50'
                              : 'bg-slate-50/60 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <span
                                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                                  idx === 0
                                    ? 'bg-sky-500 text-white'
                                    : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                                }`}
                              >
                                #{idx + 1}
                              </span>
                              <div>
                                <h5 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                  {diff.diseaseName}
                                  {idx === 0 && <Tag color="sky">Primary Diagnosis</Tag>}
                                </h5>
                                <p className="text-xs text-slate-500 dark:text-slate-400">
                                  Category: {diff.category} · Symptoms Matched: {diff.matchedSymptomsCount}/{diff.totalSymptomsCount}
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <span className="text-lg font-extrabold text-slate-900 dark:text-white tabular-nums">
                                {diff.confidence}%
                              </span>
                              <p className="text-[10px] text-slate-400">probability</p>
                            </div>
                          </div>
                          <ConfidenceBar value={diff.confidence} />
                        </div>
                      ))}
                    </div>
                  </Card>
                )}
              </motion.div>

              {/* Measurement histogram */}
              <Card>
                <p className="section-title mb-3">Quantum Measurement Distribution</p>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" className="dark:opacity-20" />
                    <XAxis dataKey="state" tick={{ fontSize: 11 }} stroke="#94a3b8" />
                    <YAxis tick={{ fontSize: 11 }} stroke="#94a3b8" />
                    <Tooltip contentStyle={{ borderRadius: 12, fontSize: 13 }} />
                    <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                      {chartData.map((_, i) => <Cell key={i} fill={i === 0 ? '#0ea5e9' : '#cbd5e1'} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Winner state amplified by Grover iterations — quadratic speedup over classical search.</p>
              </Card>

              {/* AI explanation */}
              <Card>
                <div className="flex items-center gap-2 mb-3">
                  <Brain size={18} className="text-violet-500" />
                  <p className="section-title">AI Explanation</p>
                </div>
                <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">{explanation.summary}</p>
                <ul className="mt-3 space-y-2">
                  {explanation.details.map((d, i) => (
                    <li key={i} className="text-sm text-slate-600 dark:text-slate-400 flex gap-2">
                      <Activity size={14} className="mt-0.5 text-sky-500 shrink-0" />
                      {d}
                    </li>
                  ))}
                </ul>
                <div className="mt-4 p-3 rounded-xl bg-sky-50 dark:bg-sky-950/30 ring-1 ring-sky-200 dark:ring-sky-900">
                  <p className="text-xs font-semibold text-sky-700 dark:text-sky-300">Recommendation</p>
                  <p className="text-sm text-slate-700 dark:text-slate-300 mt-1">{explanation.recommendation}</p>
                </div>
                <p className="mt-3 text-xs text-slate-400 italic">{explanation.disclaimer}</p>
              </Card>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
