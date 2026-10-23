import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, AlertCircle, CheckCircle2, Loader2, ArrowLeft } from 'lucide-react';
import AuthShell from '@/layouts/AuthShell';
import { supabase } from '@/lib/supabase';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    setLoading(false);
    if (error) setError(error.message);
    else setSent(true);
  };

  return (
    <AuthShell title="Reset your password" subtitle="We'll send you a secure reset link">
      {sent ? (
        <div className="space-y-6">
          <div className="flex flex-col items-center text-center py-6">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 ring-1 ring-emerald-200 dark:ring-emerald-900">
              <CheckCircle2 size={28} />
            </div>
            <p className="mt-4 section-title">Check your inbox</p>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400 max-w-xs">
              We've sent a password reset link to <span className="font-medium text-slate-700 dark:text-slate-300">{email}</span>
            </p>
          </div>
          <Link to="/login" className="btn-outline w-full">
            <ArrowLeft size={18} /> Back to sign in
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="flex items-start gap-2 rounded-xl bg-rose-50 dark:bg-rose-950/40 p-3 text-sm text-rose-700 dark:text-rose-300 ring-1 ring-rose-200 dark:ring-rose-900">
              <AlertCircle size={16} className="mt-0.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}
          <div>
            <label className="label">Email</label>
            <div className="relative">
              <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="input-field pl-10" placeholder="you@university.edu" />
            </div>
          </div>
          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? <><Loader2 size={18} className="animate-spin" /> Sending...</> : 'Send reset link'}
          </button>
          <Link to="/login" className="flex items-center justify-center gap-2 text-sm text-slate-500 dark:text-slate-400 hover:text-sky-600 dark:hover:text-sky-400">
            <ArrowLeft size={16} /> Back to sign in
          </Link>
        </form>
      )}
    </AuthShell>
  );
}
