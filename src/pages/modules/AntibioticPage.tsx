import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Bug, Atom, FileDown, Brain, Activity, ShieldAlert, CheckCircle2, Loader2,
} from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, ReferenceLine,
} from 'recharts';
import { supabase, type Bacterium } from '@/lib/supabase';
import { runQSVM, type QSVMResult } from '@/quantum/engine';
import { explainQSVM, type AIExplanation } from '@/ai/explainer';
import { useAuth } from '@/context/AuthContext';
import { useExperiment } from '@/hooks/useExperiment';
import { Card, PageHeader, Spinner, Tag, ConfidenceBar, EmptyState } from '@/components/ui';
import { exportPDFReport, exportJSON } from '@/utils/reports';
import { BENCHMARK_BACTERIA } from '@/data/fallbackCatalog';
import { REAL_PATHOGENS, REAL_ANTIBIOTICS } from '@/data/realTimeCatalog';

const ALL_22_PATHOGENS: Bacterium[] = REAL_PATHOGENS.map((p, idx) => ({
  id: `path-${idx + 1}`,
  name: p.name,
  gram_stain: p.gramType.includes('+ve') ? 'positive' : 'negative',
  resistance_mechanisms: [
    `Clinical Infection: ${p.infections}`,
    `WHO Priority: ${p.whoPriority}`,
    'Target ribosomal mutation / cell wall modification',
  ],
}));

const ALL_22_ANTIBIOTICS = REAL_ANTIBIOTICS.map((a) => `${a.name} (${a.class})`);
const ALTERNATIVES = ['Imipenem-Cilastatin', 'Colistin (Polymyxin E)', 'Tigecycline', 'Amikacin', 'Moxifloxacin', 'Fosfomycin'];

export default function AntibioticPage() {
  const { profile } = useAuth();
  const { save } = useExperiment();
  const role = profile?.role ?? 'researcher';

  const themeBtnStyle = {
    student: '!bg-emerald-600 hover:!bg-emerald-500',
    clinician: '!bg-teal-600 hover:!bg-teal-500',
    researcher: '!bg-purple-600 hover:!bg-purple-500',
    admin: '!bg-amber-600 hover:!bg-amber-500',
  }[role] || '!bg-amber-600';

  const [bacteria, setBacteria] = useState<Bacterium[]>([]);
  const [loading, setLoading] = useState(true);
  const [bacteriumName, setBacteriumName] = useState('');
  const [antibiotic, setAntibiotic] = useState(ALL_22_ANTIBIOTICS[0]);
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState<QSVMResult | null>(null);
  const [explanation, setExplanation] = useState<AIExplanation | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const { data, error } = await supabase.from('bacteria').select('*').order('name');
        if (error || !data || data.length === 0) {
          setBacteria(ALL_22_PATHOGENS);
        } else {
          setBacteria([...data as Bacterium[], ...ALL_22_PATHOGENS]);
        }
      } catch {
        setBacteria(ALL_22_PATHOGENS);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const selectedBacterium = bacteria.find((b) => b.name === bacteriumName);

  const runSimulation = async () => {
    if (!selectedBacterium) return;
    setRunning(true);
    setResult(null);
    setExplanation(null);
    await new Promise((r) => setTimeout(r, 1400));
    const res = runQSVM({
      bacterium: selectedBacterium.name,
      antibiotic,
      mechanisms: selectedBacterium.resistance_mechanisms,
    });
    setRunning(false);
    setResult(res);
    setExplanation(explainQSVM(res, selectedBacterium.name, antibiotic));

    await save({
      module: 'antibiotic',
      algorithm: 'QSVM',
      title: `Resistance: ${selectedBacterium.name} × ${antibiotic}`,
      inputData: { bacterium: selectedBacterium.name, antibiotic, mechanisms: selectedBacterium.resistance_mechanisms },
      resultData: { resistant: res.resistant, confidence: res.confidence, accuracy: res.accuracy },
      confidence: res.confidence,
    });
  };

  const handleReport = () => {
    if (!result || !explanation || !selectedBacterium) return;
    exportPDFReport(`Q-MedLab Antibiotic Resistance Report — ${selectedBacterium.name}`, [
      { heading: 'Pathogen', body: `<b>${selectedBacterium.name}</b><br>Gram stain: ${selectedBacterium.gram_stain}<br>Resistance mechanisms: ${selectedBacterium.resistance_mechanisms.join(', ')}` },
      { heading: 'Tested Antibiotic', body: antibiotic },
      { heading: 'QSVM Prediction', body: `Result: <b>${result.resistant ? 'RESISTANT' : 'SUSCEPTIBLE'}</b><br>Confidence: ${result.confidence}%<br>Model accuracy: ${result.accuracy}%<br>Qubits: ${result.qubits}<br>Support vectors: ${result.supportVectors}` },
      { heading: 'AI Explanation', body: `<p>${explanation.summary}</p>${explanation.details.map((d) => `<p>• ${d}</p>`).join('')}` },
      { heading: 'Recommendation', body: explanation.recommendation },
      { heading: 'Disclaimer', body: explanation.disclaimer },
    ]);
  };

  const rocData = result?.rocCurve.map((p) => ({ fpr: p.fpr, tpr: p.tpr })) ?? [];

  if (loading) return <div className="flex justify-center py-20"><Spinner className="h-8 w-8 text-sky-500" /></div>;

  return (
    <div>
      <PageHeader
        title="Antibiotic Resistance Prediction"
        subtitle="Quantum Support Vector Machine classifies resistance patterns from pathogen mechanisms"
        icon={<Bug size={24} />}
      />

      <div className="grid lg:grid-cols-3 gap-6">
        <Card>
          <p className="section-title mb-4">Test Configuration</p>
          <div className="space-y-4">
            <div>
              <label className="label">Select Bacteria</label>
              <select value={bacteriumName} onChange={(e) => setBacteriumName(e.target.value)} className="input-field">
                <option value="">Choose a pathogen...</option>
                {bacteria.map((b) => <option key={b.id} value={b.name}>{b.name}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Select Antibiotic</label>
              <select value={antibiotic} onChange={(e) => setAntibiotic(e.target.value)} className="input-field">
                {ALL_22_ANTIBIOTICS.map((a) => <option key={a} value={a}>{a}</option>)}
              </select>
            </div>

            {selectedBacterium && (
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/40">
                <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">Known resistance mechanisms</p>
                <div className="flex flex-wrap gap-1.5">
                  {selectedBacterium.resistance_mechanisms.map((m) => <Tag key={m} color="rose">{m}</Tag>)}
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Gram stain: {selectedBacterium.gram_stain}</p>
              </div>
            )}

            <button onClick={runSimulation} disabled={running || !selectedBacterium} className="btn-primary w-full">
              {running ? <><Atom size={18} className="animate-spin" /> Training QSVM...</> : <><Atom size={18} /> Predict Resistance</>}
            </button>
          </div>
        </Card>

        <div className="lg:col-span-2 space-y-4">
          {running && (
            <Card>
              <div className="flex flex-col items-center py-12">
                <Atom size={40} className="text-amber-500 animate-spin mb-4" />
                <p className="text-sm text-slate-500 dark:text-slate-400">Evaluating quantum kernel...</p>
              </div>
            </Card>
          )}

          {!running && !result && (
            <Card>
              <EmptyState icon={<Bug size={48} />} title="No prediction yet" message="Select a pathogen and antibiotic to predict resistance using the QSVM classifier." />
            </Card>
          )}

          {result && explanation && selectedBacterium && (
            <>
              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
                <Card>
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Tag color="amber">QSVM</Tag>
                        <Tag color="slate">{result.qubits} qubits</Tag>
                        <Tag color="slate">{result.supportVectors} SVs</Tag>
                      </div>
                      <div className="flex items-center gap-3">
                        {result.resistant ? (
                          <ShieldAlert size={32} className="text-rose-500" />
                        ) : (
                          <CheckCircle2 size={32} className="text-emerald-500" />
                        )}
                        <div>
                          <p className="text-2xl font-bold text-slate-900 dark:text-white">
                            {result.resistant ? 'RESISTANT' : 'SUSCEPTIBLE'}
                          </p>
                          <p className="text-sm text-slate-500 dark:text-slate-400">
                            {selectedBacterium.name} → {antibiotic}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-3xl font-bold text-amber-600 dark:text-amber-400 tabular-nums">{result.confidence}%</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">confidence</p>
                    </div>
                  </div>
                  <ConfidenceBar value={result.confidence} />

                  {result.resistant && (
                    <div className="mt-4 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/30 ring-1 ring-rose-200 dark:ring-rose-900">
                      <p className="text-xs font-semibold text-rose-700 dark:text-rose-300 mb-2">Alternative Antibiotics</p>
                      <div className="flex flex-wrap gap-1.5">
                        {ALTERNATIVES.filter((a) => a !== antibiotic).slice(0, 4).map((a) => (
                          <Tag key={a} color="emerald">{a}</Tag>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex gap-2 mt-4">
                    <button onClick={handleReport} className="btn-outline text-sm"><FileDown size={16} /> Report</button>
                    <button onClick={() => exportJSON('qsvm-result.json', { result, explanation, bacterium: selectedBacterium, antibiotic })} className="btn-ghost text-sm">JSON</button>
                  </div>
                </Card>
              </motion.div>

              <Card>
                <p className="section-title mb-3">ROC Curve (Classifier Performance)</p>
                <ResponsiveContainer width="100%" height={220}>
                  <LineChart data={rocData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" className="dark:opacity-20" />
                    <XAxis dataKey="fpr" tick={{ fontSize: 11 }} stroke="#94a3b8" label={{ value: 'FPR', position: 'insideBottom', offset: -2, fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} stroke="#94a3b8" label={{ value: 'TPR', angle: -90, position: 'insideLeft', fontSize: 11 }} />
                    <Tooltip contentStyle={{ borderRadius: 12, fontSize: 13 }} />
                    <ReferenceLine segment={[{ x: 0, y: 0 }, { x: 1, y: 1 }]} stroke="#cbd5e1" strokeDasharray="4 4" />
                    <Line type="monotone" dataKey="tpr" stroke="#f59e0b" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
                <div className="mt-3 grid grid-cols-3 gap-3 text-center">
                  <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-900/40">
                    <p className="text-lg font-bold text-slate-900 dark:text-white">{result.accuracy}%</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Accuracy</p>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-900/40">
                    <p className="text-lg font-bold text-slate-900 dark:text-white">{result.kernelEvaluations}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Kernel evals</p>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-900/40">
                    <p className="text-lg font-bold text-slate-900 dark:text-white">{result.featureMap.join(' + ')}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Feature map</p>
                  </div>
                </div>
              </Card>

              <Card>
                <div className="flex items-center gap-2 mb-3">
                  <Brain size={18} className="text-amber-500" />
                  <p className="section-title">AI Report</p>
                </div>
                <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">{explanation.summary}</p>
                <ul className="mt-3 space-y-2">
                  {explanation.details.map((d, i) => (
                    <li key={i} className="text-sm text-slate-600 dark:text-slate-400 flex gap-2">
                      <Activity size={14} className="mt-0.5 text-amber-500 shrink-0" />
                      {d}
                    </li>
                  ))}
                </ul>
                <div className="mt-4 p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 ring-1 ring-amber-200 dark:ring-amber-900">
                  <p className="text-xs font-semibold text-amber-700 dark:text-amber-300">Recommendation</p>
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
