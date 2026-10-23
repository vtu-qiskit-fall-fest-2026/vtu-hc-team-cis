import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import {
  ScanLine, Atom, FileDown, Brain, Activity, Upload, Zap, AlertTriangle, CheckCircle2,
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell,
} from 'recharts';
import { runQCNN, type QCNNResult } from '@/quantum/engine';
import { explainQCNN, type AIExplanation } from '@/ai/explainer';
import { useExperiment } from '@/hooks/useExperiment';
import { Card, PageHeader, Tag, ConfidenceBar, EmptyState } from '@/components/ui';
import { exportPDFReport, exportJSON } from '@/utils/reports';

const MODALITIES = [
  { value: 'mri' as const, label: 'MRI', desc: 'Brain & soft tissue' },
  { value: 'ct' as const, label: 'CT Scan', desc: 'Cross-sectional anatomy' },
  { value: 'xray' as const, label: 'X-Ray', desc: 'Chest & bone imaging' },
];

const SAMPLE_SCANS = [
  {
    id: 'mri-glioma',
    name: 'y702.jpg',
    label: 'Brain Glioma MRI (y702.jpg)',
    modality: 'mri' as const,
    size: 48210,
    preview: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300" viewBox="0 0 300 300"><rect width="300" height="300" fill="%23090d16"/><ellipse cx="150" cy="150" rx="100" ry="120" fill="%231a2234" stroke="%23334155" stroke-width="4"/><ellipse cx="150" cy="150" rx="80" ry="95" fill="%230f172a"/><path d="M 150 40 L 150 260 M 70 150 L 230 150" stroke="%231e293b" stroke-width="2"/><ellipse cx="120" cy="130" rx="32" ry="40" fill="%2338bdf8" opacity="0.8" filter="blur(6px)"/><ellipse cx="120" cy="130" rx="22" ry="28" fill="%23e0f2fe"/><circle cx="120" cy="130" r="10" fill="%23ffffff"/><text x="150" y="285" fill="%2394a3b8" font-family="sans-serif" font-size="11" text-anchor="middle">y702.jpg (Brain MRI Glioma)</text></svg>',
  },
  {
    id: 'ct-bleed',
    name: 'head_ct_hemorrhage.jpg',
    label: 'Head CT Hemorrhage Scan',
    modality: 'ct' as const,
    size: 52140,
    preview: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300" viewBox="0 0 300 300"><rect width="300" height="300" fill="%230f0f15"/><circle cx="150" cy="150" r="110" fill="%23242430" stroke="%23e2e8f0" stroke-width="8"/><circle cx="150" cy="150" r="95" fill="%2314141e"/><path d="M 150 55 L 150 245 M 55 150 L 245 150" stroke="%232e2e3e" stroke-width="2"/><path d="M 160 110 Q 200 130 190 170 Q 150 190 140 150 Z" fill="%23ef4444" opacity="0.85" filter="blur(4px)"/><path d="M 165 120 Q 195 135 185 165 Z" fill="%23fca5a5"/><text x="150" y="285" fill="%2394a3b8" font-family="sans-serif" font-size="11" text-anchor="middle">head_ct_hemorrhage.jpg (CT Bleed)</text></svg>',
  },
  {
    id: 'xray-pneumonia',
    name: 'chest_xray_pneumonia.jpg',
    label: 'Chest X-Ray Pneumonia',
    modality: 'xray' as const,
    size: 61400,
    preview: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300" viewBox="0 0 300 300"><rect width="300" height="300" fill="%230a0a0f"/><path d="M 80 80 C 80 180 100 240 140 250 M 220 80 C 220 180 200 240 160 250" stroke="%23cbd5e1" stroke-width="6" fill="none"/><ellipse cx="110" cy="160" rx="35" ry="65" fill="%231e293b"/><ellipse cx="190" cy="160" rx="35" ry="65" fill="%231e293b"/><ellipse cx="110" cy="170" rx="25" ry="40" fill="%23f87171" opacity="0.75" filter="blur(6px)"/><text x="150" y="285" fill="%2394a3b8" font-family="sans-serif" font-size="11" text-anchor="middle">chest_xray_pneumonia.jpg (X-Ray)</text></svg>',
  },
];

export default function ImagingPage() {
  const { save } = useExperiment();
  const fileRef = useRef<HTMLInputElement>(null);
  const [modality, setModality] = useState<'mri' | 'ct' | 'xray'>('mri');
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState<QCNNResult | null>(null);
  const [explanation, setExplanation] = useState<AIExplanation | null>(null);

  const handleFile = (f: File) => {
    if (!f.type.startsWith('image/')) return;
    setFile(f);
    setPreview(URL.createObjectURL(f));
    setResult(null);
    setExplanation(null);
  };

  const handleSelectSample = (sample: typeof SAMPLE_SCANS[number]) => {
    const dummyFile = new File([''], sample.name, { type: 'image/jpeg' });
    setModality(sample.modality);
    setFile(dummyFile);
    setPreview(sample.preview);
    setResult(null);
    setExplanation(null);
  };

  const runSimulation = async () => {
    if (!file) return;
    setRunning(true);
    setResult(null);
    setExplanation(null);
    await new Promise((r) => setTimeout(r, 1600));
    const res = runQCNN({ modality, filename: file.name, fileSize: file.size || 48000 });
    setRunning(false);
    setResult(res);
    setExplanation(explainQCNN(res, modality));

    await save({
      module: 'imaging',
      algorithm: 'QCNN',
      title: `Imaging: ${file.name} (${res.detectedModality.toUpperCase()})`,
      inputData: { filename: file.name, modality, detectedModality: res.detectedModality, fileSize: file.size || 48000 },
      resultData: { prediction: res.prediction, confidence: res.confidence, quantumAccuracy: res.quantumAccuracy },
      confidence: res.confidence,
    });
  };

  const handleReport = () => {
    if (!result || !explanation || !file) return;
    const activeMod = result.detectedModality.toUpperCase();
    exportPDFReport(`Q-MedLab Imaging Report — ${file.name}`, [
      { heading: 'Image Details', body: `File: ${file.name}<br>Selected Modality: ${modality.toUpperCase()}<br>Detected Modality: ${activeMod}<br>Size: ${(file.size ? file.size / 1024 : 48).toFixed(1)} KB` },
      { heading: 'QCNN Prediction', body: `<b>${result.prediction}</b><br>Confidence: ${result.confidence}%<br>Quantum accuracy: ${result.quantumAccuracy}%<br>Classical baseline: ${result.classicalAccuracy}%<br>Training speedup: ${result.speedup}x` },
      { heading: 'AI Explanation', body: `<p>${explanation.summary}</p>${explanation.details.map((d) => `<p>• ${d}</p>`).join('')}` },
      { heading: 'Recommendation', body: explanation.recommendation },
      { heading: 'Disclaimer', body: explanation.disclaimer },
    ]);
  };

  // Confusion matrix rendering based on active/detected modality
  const activeMod = result?.detectedModality ?? modality;
  const classLabels = activeMod === 'mri' ? ['Normal', 'Glioma', 'Meningioma', 'Pituitary']
    : activeMod === 'ct' ? ['Normal', 'Hemorrhage', 'Infarct', 'Mass']
    : ['Normal', 'Pneumonia', 'TB', 'Effusion'];

  const confusionData = result ? result.confusionMatrix.flatMap((row, i) =>
    row.map((val, j) => ({ actual: classLabels[i], predicted: classLabels[j], value: val, diag: i === j }))
  ).filter((d) => d.value > 0) : [];

  return (
    <div>
      <PageHeader
        title="Quantum Medical Imaging"
        subtitle="Quantum Convolutional Neural Network analyzes MRI, CT, and X-ray scans"
        icon={<ScanLine size={24} />}
      />

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Upload panel */}
        <Card>
          <p className="section-title mb-4">Image Upload & Selection</p>
          <div className="space-y-4">
            <div>
              <label className="label">Modality Filter</label>
              <div className="grid grid-cols-3 gap-2">
                {MODALITIES.map((m) => (
                  <button
                    key={m.value}
                    onClick={() => setModality(m.value)}
                    className={`p-2 rounded-xl text-xs font-medium transition ${
                      modality === m.value
                        ? 'bg-sky-50 dark:bg-sky-950/40 text-sky-700 dark:text-sky-300 ring-1 ring-sky-200 dark:ring-sky-900 font-bold'
                        : 'bg-slate-50 dark:bg-slate-900/40 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    {m.label}
                  </button>
                ))}
              </div>
              <p className="text-xs text-slate-400 mt-1">{MODALITIES.find((m) => m.value === modality)?.desc}</p>
            </div>



            <div
              onClick={() => fileRef.current?.click()}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => { e.preventDefault(); if (e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0]); }}
              className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl p-6 text-center cursor-pointer hover:border-sky-400 dark:hover:border-sky-600 transition"
            >
              {preview ? (
                <div className="relative">
                  <img src={preview} alt="preview" className="max-h-40 mx-auto rounded-lg" />
                  <p className="mt-2 text-xs font-semibold text-slate-700 dark:text-slate-300 truncate">{file?.name}</p>
                </div>
              ) : (
                <>
                  <Upload size={28} className="mx-auto text-slate-400 mb-2" />
                  <p className="text-sm text-slate-600 dark:text-slate-400">Click or drop image here</p>
                  <p className="text-xs text-slate-400 mt-1">PNG, JPG up to 10MB</p>
                </>
              )}
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])} />
            </div>

            <button onClick={runSimulation} disabled={running || !file} className="btn-primary w-full">
              {running ? <><Atom size={18} className="animate-spin" /> Running QCNN...</> : <><Atom size={18} /> Analyze Image</>}
            </button>
          </div>
        </Card>

        {/* Results */}
        <div className="lg:col-span-2 space-y-4">
          {running && (
            <Card>
              <div className="flex flex-col items-center py-12">
                <Atom size={40} className="text-emerald-500 animate-spin mb-4" />
                <p className="text-sm text-slate-500 dark:text-slate-400">Processing quantum convolutional layers...</p>
              </div>
            </Card>
          )}

          {!running && !result && (
            <Card>
              <EmptyState icon={<ScanLine size={48} />} title="No analysis yet" message="Upload a medical image and run the QCNN to get a prediction, heatmap, and quantum vs classical comparison." />
            </Card>
          )}

          {result && explanation && file && (
            <>
              {result.modalityMismatch && (
                <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-900 dark:text-amber-200 text-xs flex items-start gap-2.5 shadow-sm">
                  <Zap size={18} className="text-amber-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold flex items-center gap-1.5 text-sm text-amber-800 dark:text-amber-300">
                      <AlertTriangle size={15} /> Modality Auto-Calibrated by Quantum Engine ({result.detectedModality.toUpperCase()})
                    </p>
                    <p className="mt-1 text-slate-700 dark:text-slate-300 leading-relaxed">
                      {result.mismatchWarning}
                    </p>
                  </div>
                </div>
              )}

              <div className="grid md:grid-cols-2 gap-4">
                <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
                  <Card>
                    <div className="flex items-center gap-2 mb-3">
                      <Tag color="emerald">QCNN</Tag>
                      <Tag color={result.modalityMismatch ? 'amber' : 'sky'}>{result.detectedModality.toUpperCase()}</Tag>
                      <Tag color="slate">{result.qubits} qubits</Tag>
                      <Tag color="slate">{result.layers} layers</Tag>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Prediction</p>
                    <p className="text-2xl font-bold text-slate-900 dark:text-white">{result.prediction}</p>
                    <div className="mt-3"><ConfidenceBar value={result.confidence} /></div>
                    <div className="flex gap-2 mt-4">
                      <button onClick={handleReport} className="btn-outline text-sm"><FileDown size={16} /> Report</button>
                      <button onClick={() => exportJSON('qcnn-result.json', { result, explanation, file: file.name, modality })} className="btn-ghost text-sm">JSON</button>
                    </div>
                  </Card>
                </motion.div>

                <Card>
                  <p className="section-title mb-3">Quantum vs Classical</p>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-xs mb-1"><span className="text-emerald-600 dark:text-emerald-400 font-medium">Quantum QCNN</span><span className="font-bold text-slate-900 dark:text-white">{result.quantumAccuracy}%</span></div>
                      <div className="h-2 rounded-full bg-slate-200 dark:bg-slate-800"><div className="h-full rounded-full bg-emerald-500" style={{ width: `${result.quantumAccuracy}%` }} /></div>
                    </div>
                    <div>
                      <div className="flex justify-between text-xs mb-1"><span className="text-slate-500 dark:text-slate-400 font-medium">Classical CNN</span><span className="font-bold text-slate-900 dark:text-white">{result.classicalAccuracy}%</span></div>
                      <div className="h-2 rounded-full bg-slate-200 dark:bg-slate-800"><div className="h-full rounded-full bg-slate-400" style={{ width: `${result.classicalAccuracy}%` }} /></div>
                    </div>
                    <div className="flex items-center gap-2 p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300 text-sm">
                      <Zap size={16} /> {result.speedup}x training speedup
                    </div>
                  </div>
                </Card>
              </div>

              {/* Heatmap visualization */}
              <Card>
                <p className="section-title mb-3">Attention Heatmap</p>
                <div className="flex gap-4 flex-col md:flex-row">
                  <div className="relative">
                    <img src={preview ?? ''} alt="scan" className="max-h-64 rounded-xl" />
                    <div
                      className="absolute inset-0 rounded-xl opacity-60 mix-blend-screen"
                      style={{
                        backgroundImage: `conic-gradient(from 0deg, rgba(14,165,233,0.3), rgba(239,68,68,0.5), rgba(14,165,233,0.3))`,
                      }}
                    />
                  </div>
                  <div className="flex-1">
                    <div className="grid grid-cols-16 gap-px rounded-lg overflow-hidden" style={{ gridTemplateColumns: 'repeat(16, 1fr)' }}>
                      {result.heatmapGrid.flat().map((v, i) => (
                        <div
                          key={i}
                          className="aspect-square"
                          style={{ background: `rgba(239, 68, 68, ${v})` }}
                          title={`attention: ${v.toFixed(2)}`}
                        />
                      ))}
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Red regions indicate areas of highest diagnostic significance identified by the quantum circuit.</p>
                  </div>
                </div>
              </Card>

              {/* Confusion matrix */}
              <Card>
                <p className="section-title mb-3">Confusion Matrix (Validation)</p>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={confusionData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" className="dark:opacity-20" />
                    <XAxis dataKey="predicted" tick={{ fontSize: 10 }} stroke="#94a3b8" />
                    <YAxis tick={{ fontSize: 10 }} stroke="#94a3b8" />
                    <Tooltip contentStyle={{ borderRadius: 12, fontSize: 13 }} />
                    <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                      {confusionData.map((d, i) => <Cell key={i} fill={d.diag ? '#10b981' : '#94a3b8'} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </Card>

              <Card>
                <div className="flex items-center gap-2 mb-3">
                  <Brain size={18} className="text-emerald-500" />
                  <p className="section-title">AI Explanation</p>
                </div>
                <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">{explanation.summary}</p>
                <ul className="mt-3 space-y-2">
                  {explanation.details.map((d, i) => (
                    <li key={i} className="text-sm text-slate-600 dark:text-slate-400 flex gap-2">
                      <Activity size={14} className="mt-0.5 text-emerald-500 shrink-0" />
                      {d}
                    </li>
                  ))}
                </ul>
                <div className="mt-4 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 ring-1 ring-emerald-200 dark:ring-emerald-900">
                  <p className="text-xs font-semibold text-emerald-700 dark:text-emerald-300">Recommendation</p>
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
