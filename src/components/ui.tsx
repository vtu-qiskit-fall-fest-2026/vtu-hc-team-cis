import { type ReactNode } from 'react';
import { Loader2 } from 'lucide-react';

export function Spinner({ className = '' }: { className?: string }) {
  return <Loader2 className={`animate-spin ${className}`} />;
}

export function Card({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`glass-card p-6 ${className}`}>{children}</div>;
}

export function PageHeader({ title, subtitle, icon }: { title: string; subtitle?: string; icon?: ReactNode }) {
  return (
    <div className="mb-6 flex items-start gap-4">
      {icon && (
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-50 dark:bg-sky-950/40 text-sky-600 dark:text-sky-400 ring-1 ring-sky-200 dark:ring-sky-900">
          {icon}
        </div>
      )}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{subtitle}</p>}
      </div>
    </div>
  );
}

export function EmptyState({ title, message, icon }: { title: string; message: string; icon?: ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      {icon && <div className="mb-4 text-slate-300 dark:text-slate-700">{icon}</div>}
      <p className="section-title">{title}</p>
      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400 max-w-sm">{message}</p>
    </div>
  );
}

export function ConfidenceBar({ value }: { value: number }) {
  const color = value >= 80 ? 'bg-emerald-500' : value >= 60 ? 'bg-amber-500' : 'bg-rose-500';
  return (
    <div className="flex items-center gap-3">
      <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
        <div className={`h-full rounded-full ${color} transition-all`} style={{ width: `${value}%` }} />
      </div>
      <span className="text-sm font-semibold text-slate-700 dark:text-slate-300 tabular-nums w-12 text-right">{value}%</span>
    </div>
  );
}

export function Tag({ children, color = 'sky' }: { children: ReactNode; color?: 'sky' | 'emerald' | 'amber' | 'rose' | 'violet' | 'purple' | 'slate' | 'cyan' | 'gray' }) {
  const colors: Record<string, string> = {
    sky: 'bg-sky-50 text-sky-700 dark:bg-sky-950/40 dark:text-sky-300 ring-sky-200/60 dark:ring-sky-900 font-semibold',
    cyan: 'bg-cyan-50 text-cyan-700 dark:bg-cyan-950/40 dark:text-cyan-300 ring-cyan-200/60 dark:ring-cyan-900 font-semibold',
    emerald: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 ring-emerald-200/60 dark:ring-emerald-900 font-semibold',
    amber: 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 ring-amber-200/60 dark:ring-amber-900 font-semibold',
    rose: 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 ring-rose-200/60 dark:ring-rose-900 font-semibold',
    violet: 'bg-violet-50 text-violet-700 dark:bg-violet-950/40 dark:text-violet-300 ring-violet-200/60 dark:ring-violet-900 font-semibold',
    purple: 'bg-purple-100 text-purple-800 dark:bg-purple-950/60 dark:text-purple-300 ring-purple-300/80 dark:ring-purple-800 font-bold',
    slate: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 ring-slate-200/60 dark:ring-slate-700 font-semibold',
    gray: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 ring-slate-200/60 dark:ring-slate-700 font-semibold',
  };
  return <span className={`badge ring-1 ${colors[color] || colors.purple}`}>{children}</span>;
}
