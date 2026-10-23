import { useEffect, useState } from 'react';
import { Search as SearchIcon, Atom } from 'lucide-react';
import { supabase, type Experiment } from '@/lib/supabase';
import { Card, PageHeader, Spinner, EmptyState, Tag } from '@/components/ui';
import { formatDate } from '@/utils/reports';

const MODULE_LABELS: Record<string, string> = {
  diagnosis: 'Disease Diagnosis',
  drug_discovery: 'Drug Discovery',
  antibiotic: 'Antibiotic Resistance',
  imaging: 'Medical Imaging',
};

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Experiment[]>([]);
  const [all, setAll] = useState<Experiment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from('experiments').select('*').order('created_at', { ascending: false }).then(({ data }) => {
      setAll((data as Experiment[]) ?? []);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    if (!query.trim()) { setResults(all); return; }
    const q = query.toLowerCase();
    setResults(all.filter((e) =>
      e.title.toLowerCase().includes(q) ||
      e.algorithm.toLowerCase().includes(q) ||
      e.module.toLowerCase().includes(q) ||
      JSON.stringify(e.result_data).toLowerCase().includes(q)
    ));
  }, [query, all]);

  if (loading) return <div className="flex justify-center py-20"><Spinner className="h-8 w-8 text-sky-500" /></div>;

  return (
    <div>
      <PageHeader title="Search" subtitle="Find experiments across all modules" icon={<SearchIcon size={24} />} />
      <Card className="mb-4">
        <div className="relative">
          <SearchIcon size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input autoFocus value={query} onChange={(e) => setQuery(e.target.value)} className="input-field pl-10" placeholder="Search by title, algorithm, module, or result..." />
        </div>
      </Card>
      {results.length ? (
        <div className="space-y-2">
          {results.map((e) => (
            <Card key={e.id} className="!p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-sky-50 dark:bg-sky-950/40 text-sky-600"><Atom size={16} /></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-900 dark:text-white">{e.title}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Tag color="sky">{MODULE_LABELS[e.module] ?? e.module}</Tag>
                    <Tag color="slate">{e.algorithm}</Tag>
                    <span className="text-xs text-slate-500 dark:text-slate-400">{formatDate(e.created_at)}</span>
                  </div>
                </div>
                {e.confidence != null && <span className="text-sm font-semibold text-slate-700 dark:text-slate-300 tabular-nums">{e.confidence}%</span>}
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card><EmptyState icon={<SearchIcon size={48} />} title="No matches" message={query ? `No experiments match "${query}".` : 'No experiments to search.'} /></Card>
      )}
    </div>
  );
}
