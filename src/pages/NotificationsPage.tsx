import { useEffect, useState } from 'react';
import { Bell, CheckCheck, Trash2 } from 'lucide-react';
import { supabase, type Notification } from '@/lib/supabase';
import { Card, PageHeader, Spinner, EmptyState, Tag } from '@/components/ui';
import { formatDate } from '@/utils/reports';

export default function NotificationsPage() {
  const [rows, setRows] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    supabase.from('notifications').select('*').order('created_at', { ascending: false }).then(({ data }) => {
      setRows((data as Notification[]) ?? []);
      setLoading(false);
    });
  };
  useEffect(load, []);

  const markAllRead = async () => {
    await supabase.from('notifications').update({ read: true }).eq('read', false);
    load();
  };

  const handleDelete = async (id: string) => {
    await supabase.from('notifications').delete().eq('id', id);
    setRows((prev) => prev.filter((r) => r.id !== id));
  };

  if (loading) return <div className="flex justify-center py-20"><Spinner className="h-8 w-8 text-sky-500" /></div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <PageHeader title="Notifications" subtitle="Stay updated on your experiments and system alerts" icon={<Bell size={24} />} />
        {rows.some((r) => !r.read) && (
          <button onClick={markAllRead} className="btn-outline text-sm"><CheckCheck size={16} /> Mark all read</button>
        )}
      </div>
      {rows.length ? (
        <Card className="!p-0">
          <div className="divide-y divide-slate-200 dark:divide-slate-800">
            {rows.map((n) => (
              <div key={n.id} className={`flex items-start gap-3 px-4 py-3 ${!n.read ? 'bg-sky-50/50 dark:bg-sky-950/20' : ''}`}>
                <div className={`mt-1 h-2 w-2 rounded-full shrink-0 ${n.read ? 'bg-slate-300 dark:bg-slate-700' : 'bg-sky-500'}`} />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-slate-900 dark:text-white">{n.title}</p>
                    {!n.read && <Tag color="sky">new</Tag>}
                  </div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{n.message}</p>
                  <p className="text-xs text-slate-400 mt-1">{formatDate(n.created_at)}</p>
                </div>
                <button onClick={() => handleDelete(n.id)} className="p-2 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30"><Trash2 size={16} /></button>
              </div>
            ))}
          </div>
        </Card>
      ) : (
        <Card><EmptyState icon={<Bell size={48} />} title="No notifications" message="You'll be notified here when experiments complete or system events occur." /></Card>
      )}
    </div>
  );
}
