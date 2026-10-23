import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Mail, Lock, AlertCircle, Loader2, CheckCircle2,
  FlaskConical, GraduationCap, Stethoscope, ShieldCheck, ExternalLink
} from 'lucide-react';
import AuthShell from '@/layouts/AuthShell';
import { useAuth } from '@/context/AuthContext';
import type { Role } from '@/lib/supabase';

const ROLES_INFO: Record<Role, { label: string; icon: typeof FlaskConical; path: string; color: string }> = {
  researcher: {
    label: 'Researcher',
    icon: FlaskConical,
    path: '/login/researcher',
    color: 'text-sky-500 border-sky-500/30 bg-sky-50 dark:bg-sky-950/40',
  },
  student: {
    label: 'Student',
    icon: GraduationCap,
    path: '/login/student',
    color: 'text-purple-500 border-purple-500/30 bg-purple-50 dark:bg-purple-950/40',
  },
  clinician: {
    label: 'Clinician',
    icon: Stethoscope,
    path: '/login/clinician',
    color: 'text-emerald-500 border-emerald-500/30 bg-emerald-50 dark:bg-emerald-950/40',
  },
  admin: {
    label: 'Admin',
    icon: ShieldCheck,
    path: '/login/admin',
    color: 'text-amber-500 border-amber-500/30 bg-amber-50 dark:bg-amber-950/40',
  },
};

export default function LoginPage() {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const stateData = location.state as { registeredEmail?: string; message?: string } | null;

  const [selectedRole, setSelectedRole] = useState<Role>('researcher');
  const [email, setEmail] = useState(stateData?.registeredEmail || '');
  const [password, setPassword] = useState('');
  const [successMessage, setSuccessMessage] = useState<string | null>(stateData?.message || null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleRoleSelect = (r: Role) => {
    setSelectedRole(r);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);
    setLoading(true);

    const { error } = await signIn(email, password, selectedRole);
    setLoading(false);

    if (error) {
      setError(error);
    } else {
      navigate('/app');
    }
  };

  const roleMeta = ROLES_INFO[selectedRole];

  return (
    <AuthShell title="Sign In to Q-MedLab" subtitle="Enter your registered credentials to access your quantum workspace">
      <div className="space-y-6">
        {/* Success Banner if redirected from Register */}
        {successMessage && (
          <div className="flex items-start gap-2.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 p-4 text-sm text-emerald-800 dark:text-emerald-300 ring-1 ring-emerald-300 dark:ring-emerald-800 shadow-sm">
            <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-emerald-600 dark:text-emerald-400" />
            <div className="space-y-0.5">
              <p className="font-bold text-xs uppercase tracking-wider text-emerald-700 dark:text-emerald-400">Account Created</p>
              <p className="text-xs">{successMessage}</p>
            </div>
          </div>
        )}

        {/* Role Selector Tabs */}
        <div>
          <label className="label">Select Access Role</label>
          <div className="grid grid-cols-4 gap-2">
            {(['researcher', 'student', 'clinician', 'admin'] as Role[]).map((r) => {
              const meta = ROLES_INFO[r];
              const Icon = meta.icon;
              const isActive = selectedRole === r;
              return (
                <button
                  key={r}
                  type="button"
                  onClick={() => handleRoleSelect(r)}
                  className={`p-2.5 rounded-xl border text-center transition flex flex-col items-center gap-1.5 ${
                    isActive
                      ? 'bg-sky-50 dark:bg-sky-950/60 border-sky-500 text-sky-700 dark:text-sky-300 font-bold shadow-sm'
                      : 'border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900'
                  }`}
                >
                  <Icon size={18} className={isActive ? 'text-sky-500' : 'text-slate-400'} />
                  <span className="text-xs">{meta.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Dedicated Role Page Link */}
        <div className="flex justify-end">
          <Link
            to={roleMeta.path}
            className="text-xs text-sky-600 dark:text-sky-400 hover:underline inline-flex items-center gap-1 font-medium"
          >
            Open Dedicated {roleMeta.label} Themed Page
            <ExternalLink size={12} />
          </Link>
        </div>

        {/* Standard Credentials Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="flex items-start gap-2 rounded-xl bg-rose-50 dark:bg-rose-950/40 p-3 text-sm text-rose-700 dark:text-rose-300 ring-1 ring-rose-200 dark:ring-rose-900">
              <AlertCircle size={16} className="mt-0.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}
          <div>
            <label className="label">Email Address</label>
            <div className="relative">
              <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field pl-10 text-sm"
                placeholder="you@university.edu"
              />
            </div>
          </div>
          <div>
            <label className="label">Password</label>
            <div className="relative">
              <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field pl-10 text-sm"
                placeholder="••••••••"
              />
            </div>
          </div>
          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
              <input type="checkbox" defaultChecked className="rounded border-slate-300 dark:border-slate-700 text-sky-600 focus:ring-sky-500" />
              Remember me
            </label>
            <Link to="/forgot-password" className="text-sky-600 dark:text-sky-400 hover:underline">Forgot password?</Link>
          </div>
          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? <><Loader2 size={18} className="animate-spin" /> Signing in...</> : `Sign In as ${roleMeta.label}`}
          </button>
          <div className="flex items-center justify-between text-sm text-slate-500 dark:text-slate-400 pt-2">
            <Link to="/" className="text-sky-600 dark:text-sky-400 hover:underline">
              ← 3D Landing Page
            </Link>
            <span>
              New user?{' '}
              <Link to="/register" className="text-sky-600 dark:text-sky-400 font-medium hover:underline">
                Create account
              </Link>
            </span>
          </div>
        </form>
      </div>
    </AuthShell>
  );
}
