import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShieldCheck, Activity, Users, Atom, Cpu, CheckCircle2,
  Clock, Stethoscope, FlaskConical, GraduationCap, Play,
  Wifi, RefreshCw, BarChart2, Zap, ArrowUpRight, Trash2
} from 'lucide-react';
import { Card, PageHeader, Tag } from '@/components/ui';
import { realtimeTracker, type ActiveUserSession, type LiveProjectRun } from '@/lib/realtimeTracker';
import { useAuth, deleteRegisteredAccount } from '@/context/AuthContext';
import type { Role } from '@/lib/supabase';
import { Navigate } from 'react-router-dom';

const ROLE_ICONS: Record<Role, typeof FlaskConical> = {
  researcher: FlaskConical,
  student: GraduationCap,
  clinician: Stethoscope,
  admin: ShieldCheck,
};

const ROLE_COLORS: Record<Role, { bg: string; text: string; border: string }> = {
  researcher: { bg: 'bg-sky-50 dark:bg-sky-950/40', text: 'text-sky-600 dark:text-sky-400', border: 'border-sky-500/30' },
  student: { bg: 'bg-purple-50 dark:bg-purple-950/40', text: 'text-purple-600 dark:text-purple-400', border: 'border-purple-500/30' },
  clinician: { bg: 'bg-emerald-50 dark:bg-emerald-950/40', text: 'text-emerald-600 dark:text-emerald-400', border: 'border-emerald-500/30' },
  admin: { bg: 'bg-amber-50 dark:bg-amber-950/40', text: 'text-amber-600 dark:text-amber-400', border: 'border-amber-500/30' },
};

export default function AdminLiveMonitorPage() {
  const { profile } = useAuth();
  const [users, setUsers] = useState<ActiveUserSession[]>([]);
  const [projects, setProjects] = useState<LiveProjectRun[]>([]);
  const [filterRole, setFilterRole] = useState<'all' | Role>('all');
  const [deleteNotice, setDeleteNotice] = useState<string | null>(null);

  useEffect(() => {
    // Initial load
    setUsers(realtimeTracker.getActiveUsers());
    setProjects(realtimeTracker.getLiveProjects());

    // Subscribe to real-time updates
    const unsubscribe = realtimeTracker.subscribe(() => {
      setUsers(realtimeTracker.getActiveUsers());
      setProjects(realtimeTracker.getLiveProjects());
    });

    return unsubscribe;
  }, []);

  // Strict role check: ONLY Admin can access Live Admin Monitor!
  if (profile?.role !== 'admin') {
    return <Navigate to="/app" replace />;
  }

  const handleDeleteUserAccount = (user: ActiveUserSession) => {
    const emailToDelete = user.email || `${user.role}@qmedlab.io`;
    deleteRegisteredAccount(emailToDelete);
    setUsers((prev) => prev.filter((u) => u.id !== user.id));
    setDeleteNotice(`Account for ${user.name} (${emailToDelete}) deleted permanently! User must re-register to sign in again.`);
    setTimeout(() => setDeleteNotice(null), 5000);
  };

  // Filtered views
  const filteredUsers = filterRole === 'all' ? users : users.filter((u) => u.role === filterRole);
  const filteredProjects = filterRole === 'all' ? projects : projects.filter((p) => p.userRole === filterRole);

  const researcherCount = users.filter((u) => u.role === 'researcher').length;
  const studentCount = users.filter((u) => u.role === 'student').length;
  const clinicianCount = users.filter((u) => u.role === 'clinician').length;

  const handleSimulateNewProject = () => {
    const sampleSims = [
      {
        userName: 'Priya Nair',
        userRole: 'student' as Role,
        institution: 'Indian Institute of Science (IISc)',
        module: 'drug_discovery' as const,
        algorithm: 'VQE 6-Qubit Ansaetz',
        title: 'Dexamethasone Corticosteroid Docking Affinity',
        confidence: 98.1,
        metrics: 'Ground Energy: -42.18 Ha | Iterations: 38',
        qubits: 6,
      },
      {
        userName: 'Dr. Vikram Sethi',
        userRole: 'researcher' as Role,
        institution: 'Tata Memorial Cancer Center',
        module: 'imaging' as const,
        algorithm: 'QCNN Quantum Convolutional Network',
        title: 'Early Metastasis Lymph Node Quantum Texture Scan',
        confidence: 96.9,
        metrics: 'Specificity: 98.4% | Dice Loss: 0.041',
        qubits: 8,
      },
      {
        userName: 'Dr. Aisha Al-Hassan',
        userRole: 'clinician' as Role,
        institution: 'Global Health Quantum Hospital',
        module: 'diagnosis' as const,
        algorithm: "Grover's Oracle Search",
        title: 'Atypical Meningitis Differential Symptom Match',
        confidence: 97.4,
        metrics: 'ICD-11 1D01 Matched | Grover Iterations: 4',
        qubits: 5,
      },
    ];

    const pick = sampleSims[Math.floor(Math.random() * sampleSims.length)];
    realtimeTracker.recordProjectRun(pick);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Admin Live Activity & User Monitor"
        subtitle="Real-time multi-tenant monitoring of active researchers, students, and clinicians executing quantum medical workflows"
        icon={<ShieldCheck size={26} className="text-amber-500" />}
      />

      {/* Account Deletion Notice Banner */}
      {deleteNotice && (
        <div className="p-3.5 rounded-2xl bg-rose-500/20 text-rose-300 border border-rose-500/40 text-xs font-bold flex items-center justify-between shadow-lg">
          <span>{deleteNotice}</span>
          <button onClick={() => setDeleteNotice(null)} className="text-white hover:text-rose-200">✕</button>
        </div>
      )}

      {/* Top Telemetry Strip */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-950 to-slate-900 border border-slate-800 text-white flex flex-col md:flex-row items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500" />
          </span>
          <div>
            <p className="text-xs font-mono uppercase tracking-wider text-emerald-400 font-bold">
              Real-Time Telemetry Socket Active
            </p>
            <p className="text-xs text-slate-400">
              Live updates syncing across all active browser sessions & quantum modules
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleSimulateNewProject}
            className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition flex items-center gap-1.5 shadow"
          >
            <Play size={13} fill="currentColor" />
            Simulate Live User Activity
          </button>
          <div className="px-3 py-1.5 rounded-xl bg-slate-800/80 border border-slate-700 text-xs text-slate-300 flex items-center gap-2">
            <Wifi size={14} className="text-emerald-400" />
            <span>IBM Falcon Bridge: 0.8ms</span>
          </div>
        </div>
      </div>

      {/* KPI Counters */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="!p-5 border-l-4 border-l-sky-500">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Active Users</span>
            <Users size={20} className="text-sky-500" />
          </div>
          <p className="mt-3 text-3xl font-black text-slate-900 dark:text-white">{users.length}</p>
          <p className="text-xs text-emerald-600 font-semibold mt-1 flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            Live concurrent sessions
          </p>
        </Card>

        <Card className="!p-5 border-l-4 border-l-purple-500">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Quantum Scholars</span>
            <GraduationCap size={20} className="text-purple-500" />
          </div>
          <p className="mt-3 text-3xl font-black text-slate-900 dark:text-white">{studentCount}</p>
          <p className="text-xs text-slate-500 mt-1">Students in active labs</p>
        </Card>

        <Card className="!p-5 border-l-4 border-l-cyan-500">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Researchers</span>
            <FlaskConical size={20} className="text-cyan-500" />
          </div>
          <p className="mt-3 text-3xl font-black text-slate-900 dark:text-white">{researcherCount}</p>
          <p className="text-xs text-slate-500 mt-1">VQE & Tomography leads</p>
        </Card>

        <Card className="!p-5 border-l-4 border-l-emerald-500">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Clinicians</span>
            <Stethoscope size={20} className="text-emerald-500" />
          </div>
          <p className="mt-3 text-3xl font-black text-slate-900 dark:text-white">{clinicianCount}</p>
          <p className="text-xs text-slate-500 mt-1">Diagnostic triage & QSVM</p>
        </Card>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mr-2">Filter Role:</span>
        {(['all', 'researcher', 'student', 'clinician', 'admin'] as const).map((r) => (
          <button
            key={r}
            onClick={() => setFilterRole(r)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition capitalize ${
              filterRole === r
                ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-950 shadow-md'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            {r === 'all' ? 'All Roles' : r}
          </button>
        ))}
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid lg:grid-cols-12 gap-6">
        {/* Left: Active Logged In Users */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users size={18} className="text-sky-500" />
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Active Logged-In Users ({filteredUsers.length})
              </h2>
            </div>
            <span className="text-xs text-slate-500 font-mono">Live Session Status</span>
          </div>

          <div className="space-y-3">
            {filteredUsers.map((u) => {
              const Icon = ROLE_ICONS[u.role] || FlaskConical;
              const style = ROLE_COLORS[u.role] || ROLE_COLORS.researcher;
              return (
                <Card key={u.id} className="!p-4 hover:border-slate-400 dark:hover:border-slate-700 transition">
                  <div className="flex items-start gap-3">
                    <div className="relative">
                      <div className={`h-11 w-11 rounded-2xl flex items-center justify-center font-bold text-sm ${style.bg} ${style.text} border ${style.border}`}>
                        {u.avatarText}
                      </div>
                      <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-900" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-sm font-bold text-slate-900 dark:text-white truncate">
                          {u.name}
                        </p>
                        <div className="flex items-center gap-2">
                          <Tag color={u.role === 'researcher' ? 'sky' : u.role === 'student' ? 'violet' : u.role === 'clinician' ? 'emerald' : 'amber'}>
                            {u.role}
                          </Tag>
                          <button
                            onClick={() => handleDeleteUserAccount(u)}
                            className="p-1 rounded-lg bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white transition"
                            title="Delete Account permanently"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </div>

                      <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">
                        {u.institution}
                      </p>

                      <div className="mt-2.5 p-2 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800 text-[11px] text-slate-600 dark:text-slate-300">
                        <span className="font-semibold text-slate-500 dark:text-slate-400 block text-[10px] uppercase">
                          Current Project / Activity
                        </span>
                        <p className="truncate font-medium mt-0.5 text-slate-800 dark:text-slate-200">
                          {u.currentProject}
                        </p>
                      </div>

                      <div className="mt-2 flex items-center justify-between text-[10px] text-slate-500">
                        <span className="flex items-center gap-1">
                          <Clock size={11} />
                          Active {u.lastActive}
                        </span>
                        <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                          ● {u.status}
                        </span>
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Right: Live Project Execution Feed & Results Audit */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity size={18} className="text-emerald-500" />
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Live Project Execution Stream & Perfect Results
              </h2>
            </div>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-[10px] font-bold text-emerald-700 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800 flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Real-Time Feed
            </span>
          </div>

          <div className="space-y-3">
            <AnimatePresence initial={false}>
              {filteredProjects.map((p) => (
                <motion.div
                  key={p.id}
                  initial={{ opacity: 0, y: -10, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.2 }}
                >
                  <Card className="!p-4 border border-slate-200 dark:border-slate-800/80 hover:border-emerald-500/40 transition">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-extrabold text-slate-900 dark:text-white">
                            {p.userName}
                          </span>
                          <span className="text-[10px] text-slate-400">•</span>
                          <span className="text-xs text-slate-500 capitalize">{p.userRole}</span>
                          <span className="text-[10px] text-slate-400">•</span>
                          <span className="text-[11px] text-slate-400">{p.institution}</span>
                        </div>
                        <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 mt-1">
                          {p.title}
                        </h3>
                      </div>
                      <Tag color="emerald">
                        <CheckCircle2 size={12} className="inline mr-1" />
                        {p.confidence}%
                      </Tag>
                    </div>

                    <div className="mt-3 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800 grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                      <div>
                        <span className="text-[10px] text-slate-500 uppercase font-semibold block">Module</span>
                        <span className="font-semibold text-sky-600 dark:text-sky-400 truncate block">
                          {p.moduleLabel}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-500 uppercase font-semibold block">Algorithm</span>
                        <span className="font-semibold text-slate-800 dark:text-slate-200 truncate block">
                          {p.algorithm}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-500 uppercase font-semibold block">Metrics</span>
                        <span className="font-mono text-[11px] text-emerald-600 dark:text-emerald-400 truncate block">
                          {p.metrics}
                        </span>
                      </div>
                    </div>

                    <div className="mt-2.5 flex items-center justify-between text-[11px] text-slate-500">
                      <span className="flex items-center gap-1 font-mono text-[10px]">
                        <Cpu size={12} className="text-slate-400" />
                        {p.qubits ?? 6} Qubits Allocated
                      </span>
                      <span className="flex items-center gap-1 text-slate-400">
                        <Clock size={11} />
                        {p.timeAgo}
                      </span>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
