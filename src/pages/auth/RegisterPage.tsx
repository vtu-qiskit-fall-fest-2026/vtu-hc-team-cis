import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Mail, Lock, User, AlertCircle, Loader2, GraduationCap,
  FlaskConical, Stethoscope, ShieldCheck, Atom, Sparkles, CheckCircle2, ArrowRight, Building2
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import type { Role } from '@/lib/supabase';

interface RoleConfig {
  role: Role;
  label: string;
  badge: string;
  icon: typeof FlaskConical;
  gradientBg: string;
  borderGlow: string;
  accentColor: string;
  btnGradient: string;
  subtitle: string;
  features: string[];
}

const ROLES_MAP: Record<Role, RoleConfig> = {
  researcher: {
    role: 'researcher',
    label: 'Researcher',
    badge: 'Deep Cyber Cyan & Indigo Theme',
    icon: FlaskConical,
    gradientBg: 'from-slate-950 via-slate-900 to-sky-950',
    borderGlow: 'border-sky-500/30 shadow-sky-500/10',
    accentColor: 'text-sky-400',
    btnGradient: 'from-sky-600 via-cyan-500 to-teal-500 hover:shadow-sky-500/30',
    subtitle: 'Access VQE molecular docking, Hamiltonian Pauli strings, and active space simulators.',
    features: [
      'VQE Ground State Molecular Minimization',
      'PubChem SMILES & PDB Protein Ingestion',
      'Quantum State Tomography & Bloch Vectors',
      'Active Space Hamiltonian Mapping',
    ],
  },
  student: {
    role: 'student',
    label: 'Student',
    badge: 'Violet & Emerald Nebula Theme',
    icon: GraduationCap,
    gradientBg: 'from-slate-950 via-slate-900 to-purple-950',
    borderGlow: 'border-purple-500/30 shadow-purple-500/10',
    accentColor: 'text-purple-400',
    btnGradient: 'from-purple-600 via-violet-500 to-indigo-500 hover:shadow-purple-500/30',
    subtitle: 'Interactive quantum computing tutorials, circuit playgrounds, and lab achievements.',
    features: [
      'Interactive Circuit Gate Sandbox (H, X, Z, CNOT)',
      'Grover & VQE Algorithmic Walkthroughs',
      'Gamified Research XP & Lab Leaderboard',
      'Guided Final-Year Project Templates',
    ],
  },
  clinician: {
    role: 'clinician',
    label: 'Clinician',
    badge: 'Medical Emerald & Teal Theme',
    icon: Stethoscope,
    gradientBg: 'from-slate-950 via-slate-900 to-emerald-950',
    borderGlow: 'border-emerald-500/30 shadow-emerald-500/10',
    accentColor: 'text-emerald-400',
    btnGradient: 'from-emerald-600 via-teal-500 to-cyan-500 hover:shadow-emerald-500/30',
    subtitle: 'Evidence-based multi-symptom triage, WHO ICD-11 validation, and clinical summaries.',
    features: [
      'Grover-Powered Multi-Symptom Oracle',
      'WHO ICD-11 Differential Diagnostics',
      'Bacterial Antibiotic Resistance Classification',
      'Automated Physician Clinical Summaries',
    ],
  },
  admin: {
    role: 'admin',
    label: 'Admin',
    badge: 'Cyber Amber & Obsidian Theme',
    icon: ShieldCheck,
    gradientBg: 'from-slate-950 via-slate-900 to-amber-950',
    borderGlow: 'border-amber-500/30 shadow-amber-500/10',
    accentColor: 'text-amber-400',
    btnGradient: 'from-amber-600 via-orange-600 to-red-600 hover:shadow-amber-500/30',
    subtitle: 'Monitor IBM Quantum runtime backends, cluster calibrations, and user permissions.',
    features: [
      'IBM Quantum Falcon/Eagle Bridge Telemetry',
      'Qubit Coherence & Calibration Logs (T1/T2)',
      'Role & Permission Governance Matrix',
      'Zero-Trust Security & Audit Trails',
    ],
  },
};

export default function RegisterPage() {
  const { signUp } = useAuth();
  const navigate = useNavigate();

  const [selectedRole, setSelectedRole] = useState<Role>('researcher');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [institution, setInstitution] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const config = ROLES_MAP[selectedRole];
  const RoleIcon = config.icon;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    setLoading(true);
    const { error } = await signUp(email, password, fullName, selectedRole, institution);
    setLoading(false);
    if (error) {
      setError(error);
    } else {
      navigate(`/login/${selectedRole}`, {
        state: {
          registeredEmail: email,
          message: 'Account created successfully! Please enter your password to sign in.',
        },
      });
    }
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br ${config.gradientBg} text-slate-100 flex flex-col justify-between relative overflow-hidden transition-all duration-500`}>
      {/* Background Mesh Accent */}
      <div
        className="absolute inset-0 pointer-events-none opacity-20 z-0"
        style={{
          backgroundImage:
            'radial-gradient(circle at 20% 20%, rgba(255,255,255,0.15) 1px, transparent 1px), radial-gradient(circle at 80% 80%, rgba(255,255,255,0.1) 1px, transparent 1px)',
          backgroundSize: '36px 36px',
        }}
      />

      {/* Top Illuminated Ambient Halo */}
      <div className={`absolute top-0 inset-x-0 h-64 bg-gradient-to-b ${
        selectedRole === 'researcher' ? 'from-cyan-500/25 via-sky-600/15' :
        selectedRole === 'student' ? 'from-purple-500/25 via-indigo-600/15' :
        selectedRole === 'clinician' ? 'from-emerald-500/25 via-teal-600/15' :
        'from-amber-500/25 via-orange-600/15'
      } to-transparent pointer-events-none z-0`} />

      {/* Top Header & Role Switcher */}
      <header className="pt-6 px-6 pb-4 max-w-7xl w-full mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 z-10">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-tr from-sky-500 to-cyan-400 text-white shadow-lg shadow-sky-500/20 group-hover:scale-105 transition">
            <Atom size={22} />
          </div>
          <div>
            <span className="font-extrabold text-lg text-white tracking-tight">Q-MedLab</span>
            <span className="text-xs text-slate-400 block -mt-1 font-medium">Quantum Medical Laboratory</span>
          </div>
        </Link>

        {/* Role Pills */}
        <div className="flex items-center gap-1.5 bg-slate-950/80 p-1.5 rounded-2xl border border-slate-800 backdrop-blur-xl">
          {(['researcher', 'student', 'clinician', 'admin'] as Role[]).map((r) => {
            const roleMeta = ROLES_MAP[r];
            const isActive = selectedRole === r;
            return (
              <button
                key={r}
                type="button"
                onClick={() => setSelectedRole(r)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-white text-slate-900 shadow-md'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900'
                }`}
              >
                <span>{roleMeta.label}</span>
              </button>
            );
          })}
        </div>
      </header>

      {/* Main Form Content */}
      <main className="max-w-7xl w-full mx-auto px-6 py-8 z-10">
        <div className="grid lg:grid-cols-12 gap-10 items-center">
          {/* Left Column: Role Details */}
          <div className="lg:col-span-6 space-y-6">
            <motion.div
              key={selectedRole + '-info'}
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-4"
            >
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900/80 border border-slate-800 text-[11px] font-semibold text-slate-300 backdrop-blur-md">
                <Sparkles size={12} className={config.accentColor} />
                {config.badge}
              </span>

              <div className="flex items-center gap-4 pt-2">
                <div className={`p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 ${config.accentColor}`}>
                  <RoleIcon size={32} />
                </div>
                <div>
                  <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                    Join Q-MedLab Portal
                  </h1>
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mt-0.5">
                    Registration for {config.label} Access
                  </p>
                </div>
              </div>

              <p className="text-sm text-slate-300 leading-relaxed pt-2 font-normal">
                {config.subtitle}
              </p>

              <div className="space-y-2.5 pt-3">
                {config.features.map((feat, idx) => (
                  <div key={idx} className="flex items-center gap-2.5 text-xs text-slate-300 font-medium">
                    <CheckCircle2 size={16} className={`shrink-0 ${config.accentColor}`} />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>

              <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 mt-6 space-y-1">
                <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Verified Portal Pathway</p>
                <p className="text-xs font-bold text-white">{config.label} Access Account</p>
                <p className="text-[11px] text-slate-400">Zero-License Academic & Research Standard</p>
              </div>
            </motion.div>
          </div>

          {/* Right Column: Registration Form Card */}
          <div className="lg:col-span-6">
            <motion.div
              key={selectedRole + '-form'}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-8 rounded-3xl bg-slate-950/90 border ${config.borderGlow} shadow-2xl backdrop-blur-2xl space-y-6`}
            >
              <div>
                <h2 className="text-xl font-bold text-white">Create Your Account</h2>
                <p className="text-xs text-slate-400 mt-1">Register to access your dedicated {config.label} workspace</p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="flex items-start gap-2 rounded-xl bg-rose-950/50 p-3 text-xs text-rose-300 border border-rose-900">
                    <AlertCircle size={16} className="mt-0.5 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Full Name</label>
                  <div className="relative">
                    <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-sky-500 transition"
                      placeholder="Dr. Jane Doe"
                    />
                  </div>
                </div>

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
                      placeholder="you@university.edu"
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
                      placeholder="Min 6 characters"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">Selected Role</label>
                    <div className="relative">
                      <select
                        value={selectedRole}
                        onChange={(e) => setSelectedRole(e.target.value as Role)}
                        className="w-full pl-3 pr-8 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-sky-500 transition appearance-none cursor-pointer"
                      >
                        <option value="researcher">Researcher</option>
                        <option value="student">Student</option>
                        <option value="clinician">Clinician</option>
                        <option value="admin">Admin</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">Institution / University</label>
                    <div className="relative">
                      <Building2 size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="text"
                        value={institution}
                        onChange={(e) => setInstitution(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-sky-500 transition"
                        placeholder="e.g. Stanford University"
                      />
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full mt-2 py-3 px-4 rounded-xl bg-gradient-to-r ${config.btnGradient} text-white font-bold text-sm shadow-lg flex items-center justify-center gap-2 hover:brightness-110 active:scale-[0.98] transition disabled:opacity-50`}
                >
                  {loading ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Creating Account...
                    </>
                  ) : (
                    <>
                      <span>Create {config.label} Account</span>
                      <ArrowRight size={16} />
                    </>
                  )}
                </button>
              </form>

              <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800/80">
                <span>Already have an account?</span>
                <Link to={`/login/${selectedRole}`} className={`${config.accentColor} font-bold hover:underline`}>
                  Sign In
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
