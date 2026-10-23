import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Cpu, Clock, Zap, CheckCircle2, AlertTriangle, RefreshCw, Layers, ArrowRight } from 'lucide-react';
import { Tag } from '@/components/ui';

interface Job {
  id: string;
  name: string;
  backend: string;
  shots: number;
  status: 'QUEUED' | 'RUNNING' | 'COMPLETED' | 'CANCELLED';
  queuePos?: number;
  estMinutes?: number;
  submittedAt: string;
  executionTimeSec?: number;
  accuracy?: string;
}

interface QuantumJobQueueMonitorProps {
  onSwitchToAer?: () => void;
}

export default function QuantumJobQueueMonitor({ onSwitchToAer }: QuantumJobQueueMonitorProps) {
  const [activeQueuePos, setActiveQueuePos] = useState<number>(3);
  const [estRemainingMin, setEstRemainingMin] = useState<number>(4);

  const [jobs, setJobs] = useState<Job[]>([
    { id: 'JOB-90812', name: 'VQE_Drug_Docking_ActiveSite', backend: 'ibm_eagle_127q', shots: 4096, status: 'QUEUED', queuePos: 3, estMinutes: 4, submittedAt: '14:52:10' },
    { id: 'JOB-90811', name: 'Polygenic_Risk_Genomics_VCF', backend: 'qiskit_aer_sim', shots: 2048, status: 'RUNNING', submittedAt: '14:48:33', executionTimeSec: 19.3, accuracy: '94.2%' },
    { id: 'JOB-90810', name: 'NISQ_Depolarizing_Noise_ZNE', backend: 'qiskit_aer_sim', shots: 2048, status: 'COMPLETED', submittedAt: '14:35:12', executionTimeSec: 4.8, accuracy: '98.1%' },
    { id: 'JOB-90809', name: 'QSVM_Antibiotic_Resistance_Eval', backend: 'dwave_advantage', shots: 1024, status: 'COMPLETED', submittedAt: '14:10:05', executionTimeSec: 12.1, accuracy: '91.5%' },
    { id: 'JOB-90808', name: 'QCNN_Brain_MRI_Augmentation', backend: 'ibm_eagle_127q', shots: 8192, status: 'COMPLETED', submittedAt: '13:45:00', executionTimeSec: 42.6, accuracy: '96.7%' },
    { id: 'JOB-90807', name: 'VQE_Kinase_Inhibitor_Minimization', backend: 'azure_ionq_aria', shots: 2048, status: 'COMPLETED', submittedAt: '13:12:40', executionTimeSec: 8.4, accuracy: '95.0%' },
  ]);

  const handleCancelJob = (id: string) => {
    setJobs((prev) =>
      prev.map((j) => (j.id === id ? { ...j, status: 'CANCELLED' } : j))
    );
  };

  return (
    <div className="p-6 rounded-3xl bg-slate-900/90 border border-cyan-500/30 shadow-2xl backdrop-blur-xl relative overflow-hidden space-y-6">
      {/* Active Hardware Job Banner */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-cyan-950 via-slate-900 to-indigo-950 border border-cyan-500/40 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="p-3 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 shrink-0">
            <Cpu size={24} className="animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 text-[10px] font-mono font-bold uppercase border border-cyan-500/30">
                Active Queue Telemetry
              </span>
              <span className="text-xs text-slate-400">IBM Quantum Eagle (127 Qubits)</span>
            </div>
            <h3 className="text-base font-extrabold text-white">Your VQE job is #{activeQueuePos} in hardware queue</h3>
            <p className="text-xs text-slate-300 mt-0.5 flex items-center gap-1.5">
              <Clock size={13} className="text-cyan-400" />
              Estimated execution time remaining: <strong className="text-cyan-300 font-mono">{estRemainingMin} minutes</strong>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={onSwitchToAer}
            className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs shadow-lg shadow-cyan-500/25 flex items-center gap-1.5 transition"
          >
            <Zap size={14} /> Switch to Aer Simulator (0 Queue Time)
          </button>
        </div>
      </div>

      {/* Past 10 Jobs Queue History Table */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-bold text-white flex items-center gap-2">
            <Layers size={16} className="text-cyan-400" />
            Recent Quantum Execution History
          </h4>
          <span className="text-xs text-slate-400 font-mono">Total Submitted: {jobs.length} Jobs</span>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-950/80">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/90 text-slate-400 font-mono text-[10px] uppercase border-b border-slate-800">
              <tr>
                <th className="p-3">Job ID</th>
                <th className="p-3">Experiment Name</th>
                <th className="p-3">Hardware Backend</th>
                <th className="p-3">Shots</th>
                <th className="p-3">Status</th>
                <th className="p-3">Runtime</th>
                <th className="p-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300 font-mono">
              {jobs.map((job) => (
                <tr key={job.id} className="hover:bg-slate-900/50 transition">
                  <td className="p-3 font-bold text-cyan-400">{job.id}</td>
                  <td className="p-3 font-sans font-semibold text-white">{job.name}</td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded bg-slate-900 text-slate-300 border border-slate-800 text-[10px]">
                      {job.backend}
                    </span>
                  </td>
                  <td className="p-3">{job.shots.toLocaleString()}</td>
                  <td className="p-3 font-sans">
                    {job.status === 'QUEUED' && (
                      <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[10px] font-bold border border-amber-500/30 flex items-center gap-1 w-fit">
                        <Clock size={10} /> Queue #{job.queuePos}
                      </span>
                    )}
                    {job.status === 'RUNNING' && (
                      <span className="px-2 py-0.5 rounded bg-sky-500/20 text-sky-300 text-[10px] font-bold border border-sky-500/30 flex items-center gap-1 w-fit">
                        <RefreshCw size={10} className="animate-spin" /> Running
                      </span>
                    )}
                    {job.status === 'COMPLETED' && (
                      <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-500/30 flex items-center gap-1 w-fit">
                        <CheckCircle2 size={10} /> Completed
                      </span>
                    )}
                    {job.status === 'CANCELLED' && (
                      <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-500 text-[10px] font-bold w-fit">
                        Cancelled
                      </span>
                    )}
                  </td>
                  <td className="p-3 text-slate-400">
                    {job.executionTimeSec ? `${job.executionTimeSec}s` : job.estMinutes ? `Est ${job.estMinutes}m` : '-'}
                  </td>
                  <td className="p-3 text-right font-sans">
                    {job.status === 'QUEUED' ? (
                      <button
                        onClick={() => handleCancelJob(job.id)}
                        className="text-[11px] text-rose-400 hover:underline"
                      >
                        Cancel Job
                      </button>
                    ) : (
                      <button className="text-[11px] text-cyan-400 hover:underline flex items-center gap-1 ml-auto">
                        View Result <ArrowRight size={10} />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
