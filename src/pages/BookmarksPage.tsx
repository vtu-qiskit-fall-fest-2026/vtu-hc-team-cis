import { useEffect, useState } from 'react';
import { Bookmark, Trash2, Atom } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { Card, PageHeader, Spinner, EmptyState, Tag } from '@/components/ui';
import { formatDate } from '@/utils/reports';

interface BookmarkRow {
  id: string;
  experiment_id: string;
  label: string | null;
  created_at: string;
  experiments: { title: string; module: string; algorithm: string }[];
}

export default function BookmarksPage() {
  const [rows, setRows] = useState<BookmarkRow[]>([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    supabase.from('bookmarks').select('id, experiment_id, label, created_at, experiments(title, module, algorithm)').order('created_at', { ascending: false }).then(({ data }) => {
      setRows((data as BookmarkRow[]) ?? []);
      setLoading(false);
    });
  };
  useEffect(load, []);

  const handleDelete = async (id: string) => {
    await supabase.from('bookmarks').delete().eq('id', id);
    setRows((prev) => prev.filter((r) => r.id !== id));
  };

  if (loading) return <div className="flex justify-center py-20"><Spinner className="h-8 w-8 text-sky-500" /></div>;

  return (
    <div>
      <PageHeader title="Bookmarks" subtitle="Your saved experiments for quick reference" icon={<Bookmark size={24} />} />
      {rows.length ? (
        <div className="grid md:grid-cols-2 gap-4">
          {rows.map((r) => (
            <Card key={r.id} className="!p-4">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-50 dark:bg-sky-950/40 text-sky-600 dark:text-sky-400">
                  <Atom size={18} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-slate-900 dark:text-white truncate">{r.experiments?.[0]?.title ?? 'Unknown'}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Tag color="sky">{r.experiments?.[0]?.module}</Tag>
                    <span className="text-xs text-slate-500 dark:text-slate-400">{formatDate(r.created_at)}</span>
                  </div>
                </div>
                <button onClick={() => handleDelete(r.id)} className="p-2 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30">
                  <Trash2 size={16} />
                </button>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card><EmptyState icon={<Bookmark size={48} />} title="No bookmarks yet" message="Save experiments from the results pages to find them quickly here later." /></Card>
      )}
    </div>
  );
}
