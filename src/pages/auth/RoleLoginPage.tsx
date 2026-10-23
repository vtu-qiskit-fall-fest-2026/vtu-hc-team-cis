import { useState } from 'react';
import { Link, useNavigate, useParams, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Mail, Lock, AlertCircle, Loader2, ArrowRight, CheckCircle2,
  FlaskConical, GraduationCap, Stethoscope, ShieldCheck, Atom, Sparkles
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import type { Role } from '@/lib/supabase';

interface RoleConfig {
  role: Role;
  name: string;
  title: string;
  subtitle: string;
  badge: string;
  demoEmail: string;
  demoName: string;
  demoInstitution: string;
  icon: typeof FlaskConical;
  gradientBg: string;
  borderGlow: string;
  accentColor: string;
  btnGradient: string;
  features: string[];
}

const ROLES_MAP: Record<Role, RoleConfig> = {
  researcher: {
    role: 'researcher',
    name: 'Researcher',
    title: 'Lead Quantum Researcher Portal',
    subtitle: 'Access VQE molecular docking, Hamiltonian Pauli strings, and active space simulators.',
    badge: 'Deep Cyber Cyan & Indigo Theme',
    demoEmail: 'researcher@qmedlab.io',
    demoName: 'Quantum Researcher',
    demoInstitution: 'Quantum Bio-Simulation Institute',
    icon: FlaskConical,
    gradientBg: 'from-cyan-950 via-sky-950 to-slate-950',
    borderGlow: 'border-cyan-500/40 ring-1 ring-cyan-500/20 shadow-cyan-500/10',
    accentColor: 'text-cyan-400',
    btnGradient: 'from-cyan-500 via-sky-600 to-blue-600 hover:shadow-cyan-500/30',
    features: [
      'VQE Ground State Molecular Minimization',
      'PubChem SMILES & PDB Protein Ingestion',
      'Quantum State Tomography & Bloch Vectors',
      'Active Space Hamiltonian Mapping',
    ],
  },
  student: {
    role: 'student',
    name: 'Student',
    title: 'Quantum Academy & Student Portal',
    subtitle: 'Step-by-step quantum computing tutorials, circuit playgrounds, and lab achievements.',
    badge: 'Violet & Emerald Nebula Theme',
    demoEmail: 'student@qmedlab.io',
    demoName: 'Quantum Scholar',
    demoInstitution: 'National Institute of Quantum Medicine',
    icon: GraduationCap,
    gradientBg: 'from-purple-950 via-indigo-950 to-slate-950',
    borderGlow: 'border-purple-500/40 ring-1 ring-purple-500/20 shadow-purple-500/10',
    accentColor: 'text-purple-400',
    btnGradient: 'from-purple-600 via-indigo-600 to-violet-600 hover:shadow-purple-500/30',
    features: [
      'Interactive Circuit Gate Sandbox (H, X, Z, CNOT)',
      'Grover & VQE Algorithmic Walkthroughs',
      'Gamified Research XP & Lab Leaderboard',
      'Guided Final-Year Project Templates',
    ],
  },
  clinician: {
    role: 'clinician',
    name: 'Clinician',
    title: 'Chief Clinician & Diagnostic Portal',
    subtitle: 'Evidence-based multi-symptom triage, WHO ICD-11 validation, and clinical summaries.',
    badge: 'Medical Emerald & Teal Theme',
    demoEmail: 'clinician@qmedlab.io',
    demoName: 'Chief Clinician / MD',
    demoInstitution: 'Memorial Quantum Clinical Hospital',
    icon: Stethoscope,
    gradientBg: 'from-emerald-950 via-teal-950 to-slate-950',
    borderGlow: 'border-emerald-500/40 ring-1 ring-emerald-500/20 shadow-emerald-500/10',
    accentColor: 'text-emerald-400',
    btnGradient: 'from-emerald-600 via-teal-600 to-cyan-600 hover:shadow-emerald-500/30',
    features: [
      'Grover-Powered Multi-Symptom Oracle',
      'WHO ICD-11 Differential Diagnostics',
      'Bacterial Antibiotic Resistance Classification',
      'Automated Physician Clinical Summaries',
    ],
  },
  admin: {
    role: 'admin',
    name: 'Admin',
    title: 'Hardware & System Administrator Portal',
    subtitle: 'Monitor IBM Quantum runtime backends, cluster calibrations, and user permissions.',
    badge: 'Cyber Amber & Obsidian Theme',
    demoEmail: 'admin@qmedlab.io',
    demoName: 'System Administrator',
    demoInstitution: 'Q-MedLab Cloud Operations',
    icon: ShieldCheck,
    gradientBg: 'from-amber-950 via-orange-950 to-slate-950',
    borderGlow: 'border-amber-500/40 ring-1 ring-amber-500/20 shadow-amber-500/10',
    accentColor: 'text-amber-400',
    btnGradient: 'from-amber-600 via-orange-600 to-red-600 hover:shadow-amber-500/30',
    features: [
      'IBM Quantum Falcon/Eagle Bridge Telemetry',
      'Qubit Coherence & Calibration Logs (T1/T2)',
      'Role & Permission Governance Matrix',
      'Zero-Trust Security & Audit Trails',
    ],
  },
};

export default function RoleLoginPage() {
  const { role: routeRole } = useParams<{ role?: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { signIn } = useAuth();

  const stateData = location.state as { registeredEmail?: string; message?: string } | null;

  // Selected role config
  const validRole = (routeRole && routeRole in ROLES_MAP ? routeRole : 'researcher') as Role;
  const config = ROLES_MAP[validRole];

  const [email, setEmail] = useState(stateData?.registeredEmail || '');
  const [password, setPassword] = useState('');
  const [successMessage, setSuccessMessage] = useState<string | null>(stateData?.message || null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleRoleSwitch = (newRole: Role) => {
    navigate(`/login/${newRole}`, { state: location.state });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);
    setLoading(true);
    const { error } = await signIn(email, password, validRole);
    setLoading(false);
    if (error) setError(error);
    else navigate('/app');
  };



  const RoleIcon = config.icon;

  return (
    <div className={`min-h-screen bg-gradient-to-br ${config.gradientBg} text-slate-100 flex flex-col justify-between relative overflow-hidden`}>
      {/* Background Quantum Mesh Accent */}
      <div
        className="absolute inset-0 pointer-events-none opacity-20 z-0"
        style={{
          backgroundImage:
            'radial-gradient(circle at 20% 20%, rgba(255,255,255,0.15) 1px, transparent 1px), radial-gradient(circle at 80% 80%, rgba(255,255,255,0.1) 1px, transparent 1px)',
          backgroundSize: '36px 36px',
        }}
      />

      {/* Top Illuminated Ambient Halo to eliminate top scroll gaps */}
      <div className={`absolute top-0 inset-x-0 h-64 bg-gradient-to-b ${
        validRole === 'researcher' ? 'from-cyan-500/25 via-sky-600/15' :
        validRole === 'student' ? 'from-purple-500/25 via-indigo-600/15' :
        validRole === 'clinician' ? 'from-emerald-500/25 via-teal-600/15' :
        'from-amber-500/25 via-orange-600/15'
      } to-transparent pointer-events-none z-0`} />

      {/* Top Header & Role Switcher */}
      <header className="pt-6 px-6 pb-4 max-w-7xl w-full mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 z-10">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 border border-slate-700 text-white shadow-md group-hover:scale-105 transition">
            <Atom size={22} className="text-sky-400" />
          </div>
          <div>
            <span className="font-bold text-lg text-white">Q-MedLab</span>
            <span className="text-xs text-slate-400 block -mt-1">Quantum Medical Laboratory</span>
          </div>
        </Link>

        {/* Role Selector Tabs */}
        <div className="flex items-center bg-slate-950/80 p-1.5 rounded-2xl border border-slate-800 shadow-lg">
          {(['researcher', 'student', 'clinician', 'admin'] as Role[]).map((r) => {
            const item = ROLES_MAP[r];
            const active = validRole === r;
            return (
              <button
                key={r}
                onClick={() => handleRoleSwitch(r)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  active
                    ? 'bg-white text-slate-950 shadow-md font-extrabold'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900'
                }`}
              >
                {item.name}
              </button>
            );
          })}
        </div>
      </header>

      {/* Main Login Content */}
      <main className="max-w-5xl w-full mx-auto px-4 py-8 z-10">
        <div className="grid lg:grid-cols-12 gap-8 items-center">
          {/* Left Role Information & Highlights */}
          <div className="lg:col-span-6 space-y-6">
            <motion.div
              key={validRole}
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-4"
            >
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-slate-900/80 border border-slate-800 text-xs font-semibold">
                <Sparkles size={14} className={config.accentColor} />
                <span className={config.accentColor}>{config.badge}</span>
              </div>

              <div className="flex items-center gap-4">
                <div className={`flex h-16 w-16 items-center justify-center rounded-3xl bg-slate-900/90 border ${config.borderGlow} ${config.accentColor}`}>
                  <RoleIcon size={32} />
                </div>
                <div>
                  <h1 className="text-3xl font-black text-white">{config.title}</h1>
                  <p className="text-xs text-slate-300">Dedicated Category Authentication</p>
                </div>
              </div>

              <p className="text-sm text-slate-300 leading-relaxed max-w-lg">
                {config.subtitle}
              </p>

              {/* Feature Highlights */}
              <div className="space-y-2.5 pt-2">
                {config.features.map((feat, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs text-slate-300">
                    <CheckCircle2 size={16} className={`${config.accentColor} shrink-0`} />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>

              {/* Role Portal Info Box */}
              <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 text-xs space-y-1">
                <p className="text-slate-400 font-semibold uppercase tracking-wider text-[10px]">Verified Portal Pathway</p>
                <p className="text-white font-bold text-sm">{config.title}</p>
                <p className="text-slate-400">{config.demoInstitution}</p>
              </div>
            </motion.div>
          </div>

          {/* Right Form Card */}
          <div className="lg:col-span-6">
            <motion.div
              key={validRole + '-form'}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-8 rounded-3xl bg-slate-950/90 border ${config.borderGlow} shadow-2xl backdrop-blur-2xl space-y-6`}
            >
              <div>
                <h2 className="text-xl font-bold text-white">Sign In as {config.name}</h2>
                <p className="text-xs text-slate-400 mt-1">Enter your registered email and password to access this portal</p>
              </div>

              {/* Registration Success Message */}
              {successMessage && (
                <div className="flex items-start gap-2.5 rounded-2xl bg-emerald-950/70 p-3.5 text-xs text-emerald-300 border border-emerald-500/50 shadow-lg">
                  <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-emerald-400" />
                  <span>{successMessage}</span>
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="flex items-start gap-2 rounded-xl bg-rose-950/50 p-3 text-xs text-rose-300 border border-rose-900">
                    <AlertCircle size={16} className="mt-0.5 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Email Address</label>
                  <div className="relative">
                    <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-sky-500 transition"
                      placeholder="your-email@institution.edu"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Password</label>
                  <div className="relative">
                    <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-sky-500 transition"
                      placeholder="••••••••"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-400">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" defaultChecked className="rounded border-slate-700 bg-slate-900 text-sky-500 focus:ring-0" />
                    Remember session
                  </label>
                  <Link to="/forgot-password" className="hover:text-white transition">
                    Forgot password?
                  </Link>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full py-3 px-4 rounded-xl bg-gradient-to-r ${config.btnGradient} text-white font-bold text-sm shadow-lg flex items-center justify-center gap-2 hover:brightness-110 active:scale-[0.98] transition disabled:opacity-50`}
                >
                  {loading ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Authenticating...
                    </>
                  ) : (
                    'Authenticate Credential'
                  )}
                </button>
              </form>

              <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800/80">
                <span>Need a new account?</span>
                <Link to="/register" className={`${config.accentColor} font-bold hover:underline`}>
                  Create Account
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="p-6 max-w-7xl w-full mx-auto flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-2 border-t border-slate-800/60 z-10">
        <Link to="/" className="hover:text-white transition">
          ← Back to 3D Landing Page
        </Link>
        <span>Secured with Quantum Key Distribution (QKD) & Supabase JWT</span>
      </footer>
    </div>
  );
}
