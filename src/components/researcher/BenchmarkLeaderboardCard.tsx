import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Award, Trophy, Star, Send, Zap, CheckCircle2, TrendingUp } from 'lucide-react';
import { Tag } from '@/components/ui';

interface BenchmarkLeaderboardCardProps {
  userPoints?: number;
}

export default function BenchmarkLeaderboardCard({ userPoints = 1850 }: BenchmarkLeaderboardCardProps) {
  const [submitted, setSubmitted] = useState<boolean>(false);

  const handleBenchmarkSubmit = () => {
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 4000);
  };

  return (
    <div className="p-6 rounded-3xl bg-slate-900/90 border border-cyan-500/30 shadow-2xl backdrop-blur-xl space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[11px] font-mono font-bold uppercase tracking-wider border border-amber-500/30 flex items-center gap-1">
              <Trophy size={12} /> Community Leaderboard
            </span>
            <Tag color="amber">Global Top 5%</Tag>
          </div>
          <h2 className="text-xl font-black text-white flex items-center gap-2">
            Quantum Benchmark Ranking & Challenge
          </h2>
        </div>

        <button
          onClick={handleBenchmarkSubmit}
          disabled={submitted}
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-slate-950 font-black text-xs shadow-lg hover:brightness-110 transition flex items-center gap-2"
        >
          {submitted ? <CheckCircle2 size={14} /> : <Send size={14} />}
          {submitted ? 'Submitted to Leaderboard!' : 'Submit Benchmark Run'}
        </button>
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        {/* Global Rank Card */}
        <div className="p-4 rounded-2xl bg-slate-950/90 border border-slate-800 space-y-1">
          <span className="text-[10px] text-slate-400 font-bold uppercase block">Global Research Rank</span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-amber-400 font-mono">#12</span>
            <span className="text-xs text-slate-400 font-bold">out of 4,890</span>
          </div>
          <p className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
            <TrendingUp size={12} /> Climbed 3 spots this week
          </p>
        </div>

        {/* Institution Rank Card */}
        <div className="p-4 rounded-2xl bg-slate-950/90 border border-slate-800 space-y-1">
          <span className="text-[10px] text-slate-400 font-bold uppercase block">Institutional Rank</span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-cyan-400 font-mono">#3</span>
            <span className="text-xs text-slate-400 font-bold">in Institute</span>
          </div>
          <p className="text-[11px] text-slate-400">Quantum Bio-Simulation Institute</p>
        </div>

        {/* Researcher Credits Card */}
        <div className="p-4 rounded-2xl bg-slate-950/90 border border-slate-800 space-y-1">
          <span className="text-[10px] text-slate-400 font-bold uppercase block">Quantum XP & Credits</span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-purple-400 font-mono">{userPoints}</span>
            <span className="text-xs text-slate-400 font-bold">/ 2,000 pts</span>
          </div>
          <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden mt-1">
            <div className="h-full bg-purple-500" style={{ width: `${(userPoints / 2000) * 100}%` }} />
          </div>
        </div>
      </div>

      {/* Weekly Challenge Banner */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-950 via-indigo-950 to-slate-950 border border-purple-500/40 flex items-center justify-between">
        <div>
          <span className="text-[10px] text-purple-300 font-mono font-bold uppercase block">Weekly Research Challenge</span>
          <h4 className="text-sm font-extrabold text-white">Best QSVM Classification Accuracy for Antibiotic Resistance</h4>
          <p className="text-xs text-slate-300 mt-0.5">Top submission wins +500 hardware execution credits.</p>
        </div>
        <span className="px-3 py-1.5 rounded-xl bg-purple-500 text-slate-950 font-black text-xs shrink-0">
          Leader: 98.4% Acc
        </span>
      </div>
    </div>
  );
}
