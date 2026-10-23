import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Play, RotateCcw, Cpu, Sparkles, HelpCircle } from 'lucide-react';
import { Tag } from '@/components/ui';

interface Gate {
  id: string;
  type: 'H' | 'CNOT_CONTROL' | 'CNOT_TARGET' | 'Rz' | 'M' | 'X';
  targetQubit: number;
  controlQubit?: number;
  step: number;
  label?: string;
}

interface LiveQuantumCircuitProps {
  qubitsCount?: number;
  ansatzDepth?: number;
  isSimulating?: boolean;
}

export default function LiveQuantumCircuit({
  qubitsCount = 4,
  ansatzDepth = 4,
  isSimulating = false,
}: LiveQuantumCircuitProps) {
  const [activeStep, setActiveStep] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [selectedGate, setSelectedGate] = useState<Gate | null>(null);

  const numSteps = Math.max(6, ansatzDepth * 2);

  const generateCircuit = (): Gate[] => {
    const gates: Gate[] = [];
    let idCounter = 1;

    // Layer 1: Hadamard gates
    for (let q = 0; q < qubitsCount; q++) {
      gates.push({
        id: `gate-${idCounter++}`,
        type: 'H',
        targetQubit: q,
        step: 0,
        label: 'H',
      });
    }

    // Layer 2..depth: Rz and CNOT entanglement layers
    for (let d = 0; d < ansatzDepth; d++) {
      const stepOffset = 1 + d * 2;
      for (let q = 0; q < qubitsCount; q++) {
        gates.push({
          id: `gate-${idCounter++}`,
          type: 'Rz',
          targetQubit: q,
          step: stepOffset,
          label: `Rz(θ${q + 1})`,
        });
      }

      for (let q = 0; q < qubitsCount - 1; q++) {
        gates.push({
          id: `gate-${idCounter++}`,
          type: 'CNOT_CONTROL',
          targetQubit: q,
          controlQubit: q + 1,
          step: stepOffset + 1,
        });
        gates.push({
          id: `gate-${idCounter++}`,
          type: 'CNOT_TARGET',
          targetQubit: q + 1,
          controlQubit: q,
          step: stepOffset + 1,
        });
      }
    }

    // Final Layer: Measurement gates
    const finalStep = 1 + ansatzDepth * 2;
    for (let q = 0; q < qubitsCount; q++) {
      gates.push({
        id: `gate-${idCounter++}`,
        type: 'M',
        targetQubit: q,
        step: finalStep,
        label: 'M',
      });
    }

    return gates;
  };

  const gates = generateCircuit();

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying || isSimulating) {
      interval = setInterval(() => {
        setActiveStep((prev) => (prev >= numSteps ? 0 : prev + 1));
      }, 700);
    }
    return () => clearInterval(interval);
  }, [isPlaying, isSimulating, numSteps]);

  const theta = (activeStep / numSteps) * Math.PI;
  const phi = (activeStep / numSteps) * Math.PI * 1.5;
  const blochX = Math.sin(theta) * Math.cos(phi);
  const blochY = Math.sin(theta) * Math.sin(phi);
  const blochZ = Math.cos(theta);

  const blochCenterX = 100;
  const blochCenterY = 100;
  const blochRadius = 65;

  const vecX = blochCenterX + blochX * blochRadius + blochY * 18;
  const vecY = blochCenterY - blochZ * blochRadius + blochY * 10;

  return (
    <div className="p-6 rounded-3xl bg-slate-900/90 border border-cyan-500/30 shadow-2xl backdrop-blur-xl relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 blur-3xl pointer-events-none" />

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 text-[11px] font-mono font-bold uppercase tracking-wider border border-cyan-500/30 flex items-center gap-1">
              <Cpu size={12} /> Quantum Circuit Engine
            </span>
            <Tag color="sky">{qubitsCount} Qubits</Tag>
            <Tag color="violet">Ansatz Depth {ansatzDepth}</Tag>
          </div>
          <h2 className="text-xl font-black text-white flex items-center gap-2">
            <Sparkles size={20} className="text-cyan-400" />
            Live Real-Time Quantum Circuit Visualizer
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 shadow-lg ${
              isPlaying
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30'
                : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-extrabold shadow-cyan-500/25'
            }`}
          >
            <Play size={14} className={isPlaying ? 'animate-spin' : ''} />
            {isPlaying ? 'Pause Gate Flow' : 'Animate Gates'}
          </button>

          <button
            onClick={() => setActiveStep(0)}
            className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition"
            title="Reset to Step 0"
          >
            <RotateCcw size={16} />
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-6 items-center">
        {/* Left: Dynamic Gate Grid Circuit Board */}
        <div className="lg:col-span-8 p-4 rounded-2xl bg-slate-950/80 border border-slate-800 overflow-x-auto">
          <div className="min-w-[500px] space-y-6 relative py-2">
            <div className="flex justify-between pl-16 pr-4 text-[10px] font-mono font-bold text-slate-500 border-b border-slate-800/80 pb-2">
              {Array.from({ length: numSteps + 1 }).map((_, stepIdx) => (
                <span
                  key={stepIdx}
                  className={`transition-colors cursor-pointer ${
                    activeStep === stepIdx ? 'text-cyan-400 font-extrabold text-xs underline' : ''
                  }`}
                  onClick={() => setActiveStep(stepIdx)}
                >
                  S{stepIdx}
                </span>
              ))}
            </div>

            {Array.from({ length: qubitsCount }).map((_, qIdx) => (
              <div key={qIdx} className="relative flex items-center h-12">
                <div className="w-14 shrink-0 text-xs font-mono font-bold text-cyan-400 flex items-center gap-1">
                  <span className="px-2 py-0.5 rounded bg-cyan-950 border border-cyan-800/60">
                    q[{qIdx}]
                  </span>
                </div>

                <div className="absolute left-14 right-4 h-0.5 bg-slate-700 top-1/2 -translate-y-1/2 z-0">
                  <div
                    className="h-full bg-cyan-400 transition-all duration-300 shadow-[0_0_8px_rgba(34,211,238,0.8)]"
                    style={{ width: `${(activeStep / numSteps) * 100}%` }}
                  />
                </div>

                <div className="w-full flex justify-between pr-4 pl-2 relative z-10">
                  {Array.from({ length: numSteps + 1 }).map((_, stepIdx) => {
                    const stepGates = gates.filter((g) => g.targetQubit === qIdx && g.step === stepIdx);
                    const isStepActive = activeStep === stepIdx;

                    if (!stepGates.length) {
                      return <div key={stepIdx} className="w-9 h-9" />;
                    }

                    return (
                      <div key={stepIdx} className="w-9 h-9 flex items-center justify-center relative">
                        {stepGates.map((gate) => {
                          if (gate.type === 'CNOT_CONTROL') {
                            return (
                              <motion.div
                                key={gate.id}
                                whileHover={{ scale: 1.2 }}
                                onClick={() => setSelectedGate(gate)}
                                className={`w-4 h-4 rounded-full border-2 transition cursor-pointer ${
                                  isStepActive
                                    ? 'bg-cyan-400 border-white shadow-[0_0_12px_rgba(34,211,238,1)]'
                                    : 'bg-slate-400 border-slate-600'
                                }`}
                              />
                            );
                          }

                          if (gate.type === 'CNOT_TARGET') {
                            return (
                              <motion.div
                                key={gate.id}
                                whileHover={{ scale: 1.2 }}
                                onClick={() => setSelectedGate(gate)}
                                className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs border transition cursor-pointer ${
                                  isStepActive
                                    ? 'bg-cyan-500 border-white text-slate-950 shadow-[0_0_12px_rgba(34,211,238,1)]'
                                    : 'bg-slate-800 border-slate-600 text-slate-300'
                                }`}
                              >
                                ⊕
                              </motion.div>
                            );
                          }

                          return (
                            <motion.button
                              key={gate.id}
                              whileHover={{ scale: 1.1 }}
                              onClick={() => setSelectedGate(gate)}
                              className={`px-2 py-1 rounded-lg text-xs font-mono font-bold border transition shadow-md ${
                                isStepActive
                                  ? 'bg-cyan-500 text-slate-950 border-white shadow-[0_0_12px_rgba(34,211,238,0.8)] scale-110'
                                  : gate.type === 'H'
                                  ? 'bg-indigo-900/80 border-indigo-500/50 text-indigo-300'
                                  : gate.type === 'Rz'
                                  ? 'bg-purple-950 border-purple-500/50 text-purple-300'
                                  : 'bg-emerald-950 border-emerald-500/50 text-emerald-300'
                              }`}
                            >
                              {gate.label || gate.type}
                            </motion.button>
                          );
                        })}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Live Bloch Sphere & Quantum State Info */}
        <div className="lg:col-span-4 p-5 rounded-2xl bg-slate-950/90 border border-slate-800 text-center relative flex flex-col items-center">
          <div className="w-full flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Live Bloch Vector</span>
            <span className="px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 text-[10px] font-mono font-bold border border-cyan-800">
              |ψ⟩ State
            </span>
          </div>

          <div className="relative my-2">
            <svg width="180" height="180" className="overflow-visible">
              <circle cx={blochCenterX} cy={blochCenterY} r={blochRadius} fill="none" stroke="#334155" strokeWidth="2" strokeDasharray="4 4" />
              <ellipse cx={blochCenterX} cy={blochCenterY} rx={blochRadius} ry={18} fill="none" stroke="#1e293b" strokeWidth="1.5" />

              <line x1={blochCenterX} y1={blochCenterY - blochRadius - 10} x2={blochCenterX} y2={blochCenterY + blochRadius + 10} stroke="#475569" strokeWidth="1.5" />
              <text x={blochCenterX - 8} y={blochCenterY - blochRadius - 14} fill="#38bdf8" fontSize="12" fontWeight="bold">|0⟩</text>
              <text x={blochCenterX - 8} y={blochCenterY + blochRadius + 24} fill="#38bdf8" fontSize="12" fontWeight="bold">|1⟩</text>

              <line x1={blochCenterX - blochRadius - 5} y1={blochCenterY} x2={blochCenterX + blochRadius + 5} y2={blochCenterY} stroke="#334155" strokeWidth="1" />

              <motion.line
                x1={blochCenterX}
                y1={blochCenterY}
                x2={vecX}
                y2={vecY}
                stroke="#22d3ee"
                strokeWidth="3"
                strokeLinecap="round"
                animate={{ x2: vecX, y2: vecY }}
                transition={{ type: 'spring', damping: 15 }}
              />
              <motion.circle
                cx={vecX}
                cy={vecY}
                r="5"
                fill="#22d3ee"
                animate={{ cx: vecX, cy: vecY }}
              />
            </svg>
          </div>

          <div className="w-full grid grid-cols-2 gap-2 text-xs font-mono mt-2">
            <div className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-left">
              <span className="text-slate-400 block text-[10px]">THETA (θ)</span>
              <span className="font-bold text-cyan-400">{theta.toFixed(3)} rad</span>
            </div>
            <div className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-left">
              <span className="text-slate-400 block text-[10px]">PHI (φ)</span>
              <span className="font-bold text-indigo-400">{phi.toFixed(3)} rad</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
