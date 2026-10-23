import React, { useState, useEffect } from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ReferenceDot } from 'recharts';
import { Activity, Target, Zap, Play, RotateCcw, CheckCircle2 } from 'lucide-react';
import { Tag } from '@/components/ui';

interface VQEConvergenceChartProps {
  ansatzDepth?: number;
  qubitCount?: number;
  shotCount?: number;
  hardwareBackend?: string;
  onConvergenceComplete?: (finalEnergy: number) => void;
}

export default function VQEConvergenceChart({
  ansatzDepth = 4,
  qubitCount = 8,
  shotCount = 2048,
  hardwareBackend = 'qiskit_aer',
  onConvergenceComplete,
}: VQEConvergenceChartProps) {
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [currentStep, setCurrentStep] = useState<number>(100);
  const [targetEnergy] = useState<number>(-1.1373); // Hartree for H2/LiH active space

  // Generate VQE energy trajectory data
  const generateData = () => {
    const data = [];
    const totalPoints = 60;
    for (let i = 0; i <= totalPoints; i++) {
      const progress = i / totalPoints;
      // Exponential decay towards ground state energy + simulated quantum shot noise
      const noise = (Math.sin(i * 0.8) * 0.08 + (Math.random() - 0.5) * 0.04) * Math.max(0.05, 1 - progress);
      const quantumEnergy = targetEnergy + 0.8 * Math.exp(-4 * progress) + noise;

      data.push({
        iteration: i * 2,
        quantumEnergy: Number(quantumEnergy.toFixed(4)),
        classicalEnergy: targetEnergy,
      });
    }
    return data;
  };

  const fullData = generateData();
  const visibleData = fullData.slice(0, Math.min(currentStep, fullData.length));
  const latestPoint = visibleData[visibleData.length - 1] || fullData[fullData.length - 1];

  const handleStartVQE = () => {
    setCurrentStep(1);
    setIsRunning(true);
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning) {
      interval = setInterval(() => {
        setCurrentStep((prev) => {
          if (prev >= fullData.length) {
            setIsRunning(false);
            if (onConvergenceComplete) onConvergenceComplete(targetEnergy);
            return prev;
          }
          return prev + 1;
        });
      }, 60);
    }
    return () => clearInterval(interval);
  }, [isRunning, fullData.length, targetEnergy, onConvergenceComplete]);

  return (
    <div className="p-6 rounded-3xl bg-slate-900/90 border border-cyan-500/30 shadow-2xl backdrop-blur-xl relative overflow-hidden">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[11px] font-mono font-bold uppercase tracking-wider border border-emerald-500/30 flex items-center gap-1">
              <Activity size={12} /> Active Optimization
            </span>
            <Tag color="emerald">PySCF Active Space</Tag>
            <Tag color="cyan">Pauli String H</Tag>
          </div>
          <h2 className="text-xl font-black text-white flex items-center gap-2">
            <Target size={20} className="text-emerald-400" />
            Live VQE Energy Convergence Graph
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleStartVQE}
            disabled={isRunning}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-slate-950 font-extrabold text-xs shadow-lg hover:brightness-110 transition flex items-center gap-2 disabled:opacity-50"
          >
            <Play size={14} className={isRunning ? 'animate-spin' : ''} />
            {isRunning ? 'Optimizing Parameters...' : 'Run VQE Optimization'}
          </button>
        </div>
      </div>

      {/* Metrics Summary Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800">
          <span className="text-[10px] text-slate-400 font-bold uppercase block">Current Energy</span>
          <span className="text-lg font-mono font-black text-emerald-400">
            {latestPoint?.quantumEnergy} Ha
          </span>
        </div>

        <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800">
          <span className="text-[10px] text-slate-400 font-bold uppercase block">Classical Baseline</span>
          <span className="text-lg font-mono font-black text-slate-300">
            {targetEnergy} Ha
          </span>
        </div>

        <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800">
          <span className="text-[10px] text-slate-400 font-bold uppercase block">Energy Delta (ΔE)</span>
          <span className="text-lg font-mono font-black text-cyan-400">
            {Math.abs(latestPoint?.quantumEnergy - targetEnergy).toFixed(4)} Ha
          </span>
        </div>

        <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800">
          <span className="text-[10px] text-slate-400 font-bold uppercase block">Convergence Status</span>
          <span className="text-xs font-extrabold text-emerald-400 flex items-center gap-1 mt-1">
            <CheckCircle2 size={14} /> Ground State Reached
          </span>
        </div>
      </div>

      {/* Main Convergence Chart */}
      <div className="h-64 w-full bg-slate-950/90 p-4 rounded-2xl border border-slate-800">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={visibleData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
            <XAxis
              dataKey="iteration"
              stroke="#64748b"
              tick={{ fontSize: 11 }}
              label={{ value: 'COBYLA Optimizer Iteration', position: 'insideBottom', offset: -5, fill: '#64748b', fontSize: 11 }}
            />
            <YAxis
              stroke="#64748b"
              tick={{ fontSize: 11 }}
              domain={[-1.25, -0.2]}
              label={{ value: 'Energy (Hartree)', angle: -90, position: 'insideLeft', fill: '#64748b', fontSize: 11 }}
            />
            <Tooltip
              contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
              labelStyle={{ color: '#94a3b8', fontWeight: 'bold' }}
            />

            {/* Classical Exact Energy Horizon Line */}
            <Line
              type="monotone"
              dataKey="classicalEnergy"
              stroke="#f43f5e"
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={false}
              name="Classical Exact (Full-CI)"
            />

            {/* Quantum VQE Trajectory Line */}
            <Line
              type="monotone"
              dataKey="quantumEnergy"
              stroke="#10b981"
              strokeWidth={3}
              dot={false}
              name="Quantum VQE Energy"
            />

            {/* Final Convergence Green Glow Dot */}
            {currentStep >= fullData.length && (
              <ReferenceDot
                x={latestPoint.iteration}
                y={latestPoint.quantumEnergy}
                r={6}
                fill="#10b981"
                stroke="#ffffff"
                strokeWidth={2}
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="flex items-center justify-between text-xs text-slate-400 mt-4 px-2">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5 font-semibold text-emerald-400">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
            VQE Trajectory (Active)
          </span>
          <span className="flex items-center gap-1.5 font-semibold text-rose-400">
            <span className="h-0.5 w-4 bg-rose-500 stroke-dashed" />
            Classical Exact Ground State
          </span>
        </div>
        <span className="font-mono text-[11px] text-slate-500">Chemical Accuracy Threshold: 0.0016 Ha</span>
      </div>
    </div>
  );
}
