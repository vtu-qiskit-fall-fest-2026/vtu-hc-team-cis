import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { ShieldAlert, Play, Download, CheckCircle2, Sliders, RefreshCw, Zap } from 'lucide-react';
import { Tag } from '@/components/ui';
import { runNISQNoiseSimulation, type NISQNoiseResult } from '@/quantum/engine';
import { realtimeTracker } from '@/lib/realtimeTracker';

export default function NISQNoiseReport() {
  const [depolarizingRate, setDepolarizingRate] = useState<number>(0.02);
  const [readoutErrorRate, setReadoutErrorRate] = useState<number>(0.04);
  const [thermalT1, setThermalT1] = useState<number>(50);
  const [isInjecting, setIsInjecting] = useState<boolean>(false);

  // Live real-time noise simulation calculation whenever sliders move
  const nisqResult: NISQNoiseResult = useMemo(() => {
    return runNISQNoiseSimulation({
      depolarizingRate,
      readoutErrorRate,
      thermalT1,
      shots: 2048,
    });
  }, [depolarizingRate, readoutErrorRate, thermalT1]);

  const handleSimulateNoise = () => {
    setIsInjecting(true);
    setTimeout(() => {
      setIsInjecting(false);
      realtimeTracker.recordProjectRun({
        module: 'drug_discovery',
        algorithm: 'NISQ Physical Decoherence & ZNE Kernel',
        title: `Noise Injection (Depol: ${(depolarizingRate * 100).toFixed(1)}%, Readout: ${(readoutErrorRate * 100).toFixed(1)}%)`,
        confidence: nisqResult.mitigatedFidelity,
        qubits: 8,
        metrics: `Noisy Fidelity: ${nisqResult.fidelity}% → Mitigated: ${nisqResult.mitigatedFidelity}% (+${nisqResult.restoredPercent}%)`,
      });
    }, 600);
  };

  return (
    <div className="p-6 rounded-3xl bg-slate-900/90 border border-cyan-500/30 shadow-2xl backdrop-blur-xl space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[11px] font-mono font-bold uppercase tracking-wider border border-amber-500/30 flex items-center gap-1">
              <ShieldAlert size={12} /> Hardware Decoherence Sandbox
            </span>
            <Tag color="amber">ZNE Active</Tag>
          </div>
          <h2 className="text-xl font-black text-white flex items-center gap-2">
            NISQ Noise Analysis & Fidelity Benchmarking
          </h2>
        </div>

        <button
          onClick={handleSimulateNoise}
          disabled={isInjecting}
          className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs shadow-lg shadow-amber-500/25 flex items-center gap-2 transition disabled:opacity-50"
        >
          {isInjecting ? <RefreshCw size={14} className="animate-spin" /> : <Play size={14} />}
          {isInjecting ? 'Injecting Noise Vectors...' : 'Inject Physical Decoherence Noise'}
        </button>
      </div>

      <div className="grid lg:grid-cols-12 gap-6">
        {/* Left: Sliders */}
        <div className="lg:col-span-5 p-5 rounded-2xl bg-slate-950/90 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-white flex items-center gap-1.5">
              <Sliders size={14} className="text-amber-400" /> Physical Noise Parameters
            </h3>
            <span className="text-[10px] font-mono text-cyan-400 font-bold bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
              Live Real-Time
            </span>
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <div className="flex justify-between font-semibold mb-1">
                <span className="text-slate-300">Depolarizing Channel Rate:</span>
                <span className="font-mono text-amber-400 font-bold">{(depolarizingRate * 100).toFixed(1)}%</span>
              </div>
              <input
                type="range"
                min={0.001}
                max={0.05}
                step={0.001}
                value={depolarizingRate}
                onChange={(e) => setDepolarizingRate(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded accent-amber-500 cursor-pointer"
              />
              <p className="text-[10px] text-slate-500 mt-0.5">Controls bit-flip & phase-flip quantum error rates.</p>
            </div>

            <div>
              <div className="flex justify-between font-semibold mb-1">
                <span className="text-slate-300">Readout Measurement Error:</span>
                <span className="font-mono text-amber-400 font-bold">{(readoutErrorRate * 100).toFixed(1)}%</span>
              </div>
              <input
                type="range"
                min={0.001}
                max={0.1}
                step={0.005}
                value={readoutErrorRate}
                onChange={(e) => setReadoutErrorRate(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded accent-amber-500 cursor-pointer"
              />
              <p className="text-[10px] text-slate-500 mt-0.5">Measurement state assignment error probability.</p>
            </div>

            <div>
              <div className="flex justify-between font-semibold mb-1">
                <span className="text-slate-300">Thermal Relaxation Time (T1):</span>
                <span className="font-mono text-amber-400 font-bold">{thermalT1} µs</span>
              </div>
              <input
                type="range"
                min={10}
                max={150}
                step={5}
                value={thermalT1}
                onChange={(e) => setThermalT1(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded accent-amber-500 cursor-pointer"
              />
              <p className="text-[10px] text-slate-500 mt-0.5">Shorter T1 causes rapid qubit energy decay.</p>
            </div>
          </div>
        </div>

        {/* Right: Fidelity Report & Zero-Noise Extrapolation */}
        <div className="lg:col-span-7 p-5 rounded-2xl bg-slate-950/90 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-white">Ideal vs Noisy Circuit Fidelity Comparison</h3>
            <span className="text-[10px] font-mono text-slate-400">
              Noise Channel: <strong className="text-rose-400 font-bold">{nisqResult.errorRatePercent}% Error</strong>
            </span>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3 text-xs font-mono">
              <motion.div
                key={`noisy-${nisqResult.fidelity}`}
                initial={{ scale: 0.98 }}
                animate={{ scale: 1 }}
                className="p-3.5 rounded-xl bg-slate-900 border border-rose-500/30 space-y-1"
              >
                <span className="text-slate-400 text-[10px] font-bold block">NOISY FIDELITY</span>
                <span className="text-2xl font-black text-rose-400">{nisqResult.fidelity}%</span>
                <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden mt-1">
                  <div className="h-full bg-rose-500" style={{ width: `${nisqResult.fidelity}%` }} />
                </div>
              </motion.div>

              <motion.div
                key={`mitigated-${nisqResult.mitigatedFidelity}`}
                initial={{ scale: 0.98 }}
                animate={{ scale: 1 }}
                className="p-3.5 rounded-xl bg-slate-900 border border-emerald-500/30 space-y-1"
              >
                <span className="text-slate-400 text-[10px] font-bold block">ZNE MITIGATED FIDELITY</span>
                <span className="text-2xl font-black text-emerald-400">{nisqResult.mitigatedFidelity}%</span>
                <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden mt-1">
                  <div className="h-full bg-emerald-400" style={{ width: `${nisqResult.mitigatedFidelity}%` }} />
                </div>
              </motion.div>
            </div>

            <motion.div
              key={`restored-${nisqResult.restoredPercent}`}
              initial={{ opacity: 0.8 }}
              animate={{ opacity: 1 }}
              className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-xs text-emerald-300 flex items-center justify-between shadow-md"
            >
              <span className="flex items-center gap-2 font-bold">
                <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
                Zero-Noise Extrapolation (ZNE) restored fidelity by +{nisqResult.restoredPercent}%
              </span>
              <span className="px-2.5 py-0.5 rounded-md bg-emerald-500/20 text-[10px] font-black uppercase text-emerald-300 border border-emerald-500/40 shrink-0">
                Mitigated
              </span>
            </motion.div>

            {/* Error Breakdown Metric */}
            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between text-[11px] text-slate-300 font-mono">
              <span className="flex items-center gap-1.5">
                <Zap size={12} className="text-amber-400" /> State Leakage Noise:
              </span>
              <span className="text-amber-300 font-bold">
                |000⟩ → |111⟩ Leakage: {(depolarizingRate * 120).toFixed(1)}% | Readout Shifts: {(readoutErrorRate * 85).toFixed(1)}%
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

