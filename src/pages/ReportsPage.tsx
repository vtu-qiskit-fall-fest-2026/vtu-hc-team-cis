import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FileText, Download, Trash2, FileJson } from 'lucide-react';
import { supabase, type Experiment } from '@/lib/supabase';
import { Card, PageHeader, Spinner, Tag, EmptyState } from '@/components/ui';
import { exportJSON, formatDate } from '@/utils/reports';

const MODULE_LABELS: Record<string, string> = {
  diagnosis: 'Disease Diagnosis',
  drug_discovery: 'Drug Discovery',
  antibiotic: 'Antibiotic Resistance',
  imaging: 'Medical Imaging',
};

export default function ReportsPage() {
  const [experiments, setExperiments] = useState<Experiment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from('experiments').select('*').order('created_at', { ascending: false }).then(({ data }) => {
      setExperiments((data as Experiment[]) ?? []);
      setLoading(false);
    });
  }, []);

  const handleDelete = async (id: string) => {
    await supabase.from('experiments').delete().eq('id', id);
    setExperiments((prev) => prev.filter((e) => e.id !== id));
  };

  if (loading) return <div className="flex justify-center py-20"><Spinner className="h-8 w-8 text-sky-500" /></div>;

  return (
    <div>
      <PageHeader title="Reports & Experiments" subtitle="Export, download, or delete your experiment records" icon={<FileText size={24} />} />
      {experiments.length ? (
        <Card className="!p-0 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 dark:bg-slate-900/40 text-left text-xs uppercase text-slate-500 dark:text-slate-400">
                <tr>
                  <th className="px-4 py-3">Title</th>
                  <th className="px-4 py-3">Module</th>
                  <th className="px-4 py-3">Algorithm</th>
                  <th className="px-4 py-3">Confidence</th>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {experiments.map((e) => (
                  <tr key={e.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/30">
                    <td className="px-4 py-3 font-medium text-slate-900 dark:text-white">{e.title}</td>
                    <td className="px-4 py-3"><Tag color="sky">{MODULE_LABELS[e.module] ?? e.module}</Tag></td>
                    <td className="px-4 py-3 text-slate-600 dark:text-slate-400">{e.algorithm}</td>
                    <td className="px-4 py-3 tabular-nums text-slate-700 dark:text-slate-300">{e.confidence ?? '—'}%</td>
                    <td className="px-4 py-3 text-slate-500 dark:text-slate-400">{formatDate(e.created_at)}</td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end gap-1">
                        <button onClick={() => exportJSON(`experiment-${e.id}.json`, e)} className="p-2 rounded-lg text-slate-400 hover:text-sky-600 hover:bg-sky-50 dark:hover:bg-sky-950/30" title="Export JSON">
                          <FileJson size={16} />
                        </button>
                        <button onClick={() => handleDelete(e.id)} className="p-2 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30" title="Delete">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      ) : (
        <Card>
          <EmptyState icon={<FileText size={48} />} title="No reports yet" message="Run experiments to generate downloadable reports. Start from the modules in the sidebar." />
        </Card>
      )}
    </div>
  );
}
