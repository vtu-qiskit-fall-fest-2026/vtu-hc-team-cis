import { type ReactNode } from 'react';
import { motion } from 'framer-motion';
import { Atom, Activity, ShieldCheck, Microscope, BrainCircuit } from 'lucide-react';

export default function AuthShell({ children, title, subtitle }: { children: ReactNode; title: string; subtitle: string }) {
  const features = [
    { icon: Atom, label: 'Quantum Algorithms', desc: 'Grover, VQE, QSVM, QCNN' },
    { icon: Microscope, label: 'Drug Discovery', desc: 'Live PubChem & PDB data' },
    { icon: BrainCircuit, label: 'AI Explanations', desc: 'Natural language insights' },
    { icon: ShieldCheck, label: 'Secure & Compliant', desc: 'JWT, RLS, role-based access' },
  ];
  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-slate-50 dark:bg-slate-950">
      {/* Left brand panel */}
      <div className="relative hidden lg:flex flex-col justify-between p-12 bg-gradient-to-br from-sky-700 via-sky-800 to-cyan-900 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 20% 30%, white 1px, transparent 1px), radial-gradient(circle at 80% 70%, white 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15 backdrop-blur ring-1 ring-white/30">
              <Atom size={26} />
            </div>
            <div>
              <p className="text-2xl font-bold tracking-tight">Q-MedLab</p>
              <p className="text-sm text-sky-200">Quantum-Powered Virtual Medical Laboratory</p>
            </div>
          </div>
        </motion.div>

        <div className="relative z-10 space-y-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <h2 className="text-3xl font-bold leading-tight">Healthcare Simulation & Drug Discovery, powered by Quantum Computing.</h2>
            <p className="mt-3 text-sky-200 max-w-md">A research-grade platform for final-year projects, hackathons, and IEEE publication-level demonstrations.</p>
          </motion.div>
          <div className="grid grid-cols-2 gap-4 max-w-md">
            {features.map((f, i) => (
              <motion.div
                key={f.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + i * 0.08 }}
                className="rounded-2xl bg-white/10 backdrop-blur p-4 ring-1 ring-white/20"
              >
                <f.icon size={20} className="text-cyan-300" />
                <p className="mt-2 font-semibold text-sm">{f.label}</p>
                <p className="text-xs text-sky-200">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="relative z-10 flex items-center gap-2 text-xs text-sky-200">
          <Activity size={14} className="animate-pulse" />
          Real datasets: WHO, ICD-11, PubChem, PDB, CARD
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex items-center justify-center p-6 sm:p-12">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500 to-cyan-400 text-white shadow-lg shadow-sky-500/30">
              <Atom size={24} />
            </div>
            <div>
              <p className="font-bold text-slate-900 dark:text-white">Q-MedLab</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">Quantum Medical Laboratory</p>
            </div>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{title}</h1>
          <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400">{subtitle}</p>
          <div className="mt-8">{children}</div>
        </motion.div>
      </div>
    </div>
  );
}
