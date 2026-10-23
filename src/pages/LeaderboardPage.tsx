import { useEffect, useState } from 'react';
import { Trophy, Medal, Award, Crown } from 'lucide-react';
import { supabase, type Profile } from '@/lib/supabase';
import { Card, PageHeader, Spinner, EmptyState, Tag } from '@/components/ui';

export default function LeaderboardPage() {
  const [rows, setRows] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Leaderboard is read via service role bypass not available to anon;
    // we expose only the current user's row by RLS. So we show the current user
    // plus a curated set of seeded "researchers" stored in profiles.
    supabase.from('profiles').select('full_name, role, institution, points, created_at').order('points', { ascending: false }).limit(50).then(({ data, error }) => {
      if (error) {
        // RLS restricts to own row only — show a friendly message
        setLoading(false);
        return;
      }
      setRows((data as Profile[]) ?? []);
      setLoading(false);
    });
  }, []);

  if (loading) return <div className="flex justify-center py-20"><Spinner className="h-8 w-8 text-sky-500" /></div>;

  const podium = rows.slice(0, 3);
  const rest = rows.slice(3);

  return (
    <div>
      <PageHeader title="Leaderboard" subtitle="Top researchers by accumulated experiment points" icon={<Trophy size={24} />} />

      {rows.length < 2 ? (
        <Card>
          <EmptyState
            icon={<Trophy size={48} />}
            title="Leaderboard is private"
            message="Due to data isolation, you can only see your own profile. Run more experiments to climb the ranks — each completed experiment awards 10 points."
          />
        </Card>
      ) : (
        <>
          {/* Podium */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            {podium.map((p, i) => {
              const icons = [Crown, Medal, Award];
              const Icon = icons[i];
              const heights = ['h-40', 'h-32', 'h-28'];
              const colors = ['from-amber-400 to-yellow-300', 'from-slate-400 to-slate-300', 'from-orange-400 to-amber-300'];
              return (
                <div key={p.id} className="flex flex-col items-center justify-end">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-sky-500 to-cyan-400 text-white font-bold mb-2">
                    {p.full_name?.[0]?.toUpperCase() ?? 'U'}
                  </div>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white text-center truncate max-w-full">{p.full_name ?? 'User'}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{p.points} pts</p>
                  <div className={`mt-2 w-full ${heights[i]} rounded-t-xl bg-gradient-to-b ${colors[i]} flex items-start justify-center pt-3`}>
                    <Icon size={24} className="text-white" />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Rest of leaderboard */}
          {rest.length > 0 && (
            <Card className="!p-0">
              <div className="divide-y divide-slate-200 dark:divide-slate-800">
                {rest.map((p, i) => (
                  <div key={p.id} className="flex items-center gap-3 px-4 py-3">
                    <span className="w-6 text-center text-sm font-bold text-slate-400 tabular-nums">{i + 4}</span>
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-sm font-semibold">
                      {p.full_name?.[0]?.toUpperCase() ?? 'U'}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-slate-900 dark:text-white">{p.full_name ?? 'User'}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 capitalize">{p.role} · {p.institution ?? 'Independent'}</p>
                    </div>
                    <Tag color="amber">{p.points} pts</Tag>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </>
      )}
    </div>
  );
}
