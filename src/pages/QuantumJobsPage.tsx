import { useEffect, useState } from 'react';
import { Atom, Loader2, Clock, CheckCircle2, Cpu } from 'lucide-react';
import { supabase, type QuantumJob } from '@/lib/supabase';
import { Card, PageHeader, Spinner, EmptyState, Tag } from '@/components/ui';
import { formatDate } from '@/utils/reports';

const BACKENDS = [
  { id: 'ibmq_qasm_simulator', name: 'QASM Simulator', type: 'simulator' },
  { id: 'ibm_osaka', name: 'IBM Osaka', type: 'hardware' },
  { id: 'ibm_kyoto', name: 'IBM Kyoto', type: 'hardware' },
  { id: 'ibm_brisbane', name: 'IBM Brisbane', type: 'hardware' },
];

export default function QuantumJobsPage() {
  const [jobs, setJobs] = useState<QuantumJob[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from('quantum_jobs').select('*').order('created_at', { ascending: false }).then(({ data }) => {
      setJobs((data as QuantumJob[]) ?? []);
      setLoading(false);
    });
  }, []);

  if (loading) return <div className="flex justify-center py-20"><Spinner className="h-8 w-8 text-sky-500" /></div>;

  const statusColor = (s: string) => s === 'completed' ? 'emerald' : s === 'running' ? 'amber' : s === 'failed' ? 'rose' : 'slate';

  return (
    <div>
      <PageHeader title="Quantum Jobs" subtitle="Monitor your quantum circuit submissions to IBM Quantum backends" icon={<Atom size={24} />} />

      {/* Backend status */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {BACKENDS.map((b) => (
          <Card key={b.id} className="!p-4">
            <div className="flex items-center justify-between">
              <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${b.type === 'hardware' ? 'bg-violet-50 dark:bg-violet-950/40 text-violet-600' : 'bg-sky-50 dark:bg-sky-950/40 text-sky-600'}`}>
                <Cpu size={18} />
              </div>
              <span className="flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" /> Online
              </span>
            </div>
            <p className="mt-2 text-sm font-semibold text-slate-900 dark:text-white">{b.name}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 capitalize">{b.type}</p>
          </Card>
        ))}
      </div>

      {jobs.length ? (
        <Card className="!p-0 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 dark:bg-slate-900/40 text-left text-xs uppercase text-slate-500 dark:text-slate-400">
                <tr>
                  <th className="px-4 py-3">Algorithm</th>
                  <th className="px-4 py-3">Backend</th>
                  <th className="px-4 py-3">Qubits</th>
                  <th className="px-4 py-3">Shots</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Submitted</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {jobs.map((j) => (
                  <tr key={j.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/30">
                    <td className="px-4 py-3 font-medium text-slate-900 dark:text-white">{j.algorithm}</td>
                    <td className="px-4 py-3 text-slate-600 dark:text-slate-400 font-mono text-xs">{j.backend}</td>
                    <td className="px-4 py-3 tabular-nums text-slate-700 dark:text-slate-300">{j.qubits}</td>
                    <td className="px-4 py-3 tabular-nums text-slate-700 dark:text-slate-300">{j.shots}</td>
                    <td className="px-4 py-3"><Tag color={statusColor(j.status)}>{j.status}</Tag></td>
                    <td className="px-4 py-3 text-slate-500 dark:text-slate-400">{formatDate(j.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      ) : (
        <Card><EmptyState icon={<Atom size={48} />} title="No quantum jobs yet" message="Each experiment you run submits a quantum job. They'll appear here with backend and queue information." /></Card>
      )}
    </div>
  );
}
