import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  History, FileDown, Download, Trash2, Search, Filter, Stethoscope,
  FlaskConical, Bug, ScanLine, CheckCircle2, ShieldCheck, Sparkles,
  Atom, RefreshCw, UserCheck, AlertTriangle
} from 'lucide-react';
import { Card, PageHeader, Tag, ConfidenceBar, EmptyState } from '@/components/ui';
import { exportPDFReport, exportJSON, formatDate } from '@/utils/reports';
import { realtimeTracker, type LiveProjectRun } from '@/lib/realtimeTracker';
import { useAuth } from '@/context/AuthContext';

export default function HistoryPage() {
  const { profile } = useAuth();
  const currentUserRole = profile?.role || 'researcher';
  const [projects, setProjects] = useState<LiveProjectRun[]>([]);
  const [selectedModule, setSelectedModule] = useState<string>('all');
  const [selectedRole, setSelectedRole] = useState<string>(currentUserRole);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [confirmClearModal, setConfirmClearModal] = useState<boolean>(false);

  useEffect(() => {
    if (profile?.role) {
      setSelectedRole(profile.role);
    }
  }, [profile?.role]);

  useEffect(() => {
    const syncProjects = () => {
      setProjects(realtimeTracker.getLiveProjects());
    };
    syncProjects();
    const unsub = realtimeTracker.subscribe(syncProjects);
    return unsub;
  }, []);

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    realtimeTracker.deleteProjectRun(id);
  };

  const handleClearAll = () => {
    realtimeTracker.clearAllProjectRuns();
    setConfirmClearModal(false);
  };

  const handleDownloadPDF = (p: LiveProjectRun, e: React.MouseEvent) => {
    e.stopPropagation();
    exportPDFReport(`Q-MedLab History Report — ${p.title}`, [
      { heading: 'Execution Metadata', body: `Run ID: ${p.id}<br>User: ${p.userName}<br>Role: ${p.userRole.toUpperCase()}<br>Institution: ${p.institution}<br>Timestamp: ${p.timestamp}` },
      { heading: 'Module & Algorithm', body: `<b>${p.moduleLabel}</b><br>Algorithm: ${p.algorithm}<br>Qubits Allocated: ${p.qubits || 6}` },
      { heading: 'Diagnostic Result / Output', body: `<b>Title:</b> ${p.title}<br><b>Confidence / Fidelity:</b> ${p.confidence}%<br><b>Metrics:</b> ${p.metrics}` },
      { heading: 'Audit Disclaimer', body: 'This live activity record is automatically verified by Q-MedLab real-time session tracker.' },
    ]);
  };

  const handleDownloadJSON = (p: LiveProjectRun, e: React.MouseEvent) => {
    e.stopPropagation();
    exportJSON(`${p.id}-history.json`, p);
  };

  const filteredProjects = projects.filter((p) => {
    const matchesRole = p.userRole === currentUserRole;
    const matchesModule = selectedModule === 'all' || p.module === selectedModule;
    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.algorithm.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.institution.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesRole && matchesModule && matchesSearch;
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title={`${currentUserRole.charAt(0).toUpperCase() + currentUserRole.slice(1)} Activity History`}
        subtitle={`Real-time log of all practical tests, simulations, and laboratory calculations performed under your ${currentUserRole} role`}
        icon={<History size={24} />}
      />

      {/* Control Toolbar */}
      <Card>
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3.5 top-3 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search history by title, user, algorithm, or institution..."
              className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* Clear All Button */}
            {filteredProjects.length > 0 && (
              <button
                onClick={() => setConfirmClearModal(true)}
                className="px-3 py-2 rounded-xl text-xs font-semibold text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900/50 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition flex items-center gap-1.5"
              >
                <Trash2 size={14} /> Clear History
              </button>
            )}
          </div>
        </div>

        {/* Module Filter Tabs */}
        <div className="flex flex-wrap gap-2 mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80">
          {[
            { id: 'all', label: 'All Modules' },
            { id: 'diagnosis', label: 'Disease Diagnosis', icon: Stethoscope },
            { id: 'drug_discovery', label: 'Drug Discovery', icon: FlaskConical },
            { id: 'antibiotic', label: 'Antibiotic Resistance', icon: Bug },
            { id: 'imaging', label: 'Medical Imaging', icon: ScanLine },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedModule(tab.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition flex items-center gap-1.5 ${
                selectedModule === tab.id
                  ? 'bg-sky-500/20 text-sky-700 dark:text-sky-300 border border-sky-500/40 font-bold'
                  : 'bg-slate-100 dark:bg-slate-900/60 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
              }`}
            >
              {tab.icon && <tab.icon size={14} />}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </Card>

      {/* History Activity Stream */}
      <div className="space-y-3">
        <AnimatePresence>
          {filteredProjects.map((p) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm hover:shadow-md transition space-y-3"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-2 flex-wrap">
                  <Tag color={
                    p.module === 'diagnosis' ? 'sky' :
                    p.module === 'drug_discovery' ? 'purple' :
                    p.module === 'antibiotic' ? 'amber' : 'emerald'
                  }>
                    {p.moduleLabel}
                  </Tag>

                  <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase ${
                    p.userRole === 'student' ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/30' :
                    p.userRole === 'clinician' ? 'bg-cyan-500/10 text-cyan-600 border border-cyan-500/30' :
                    'bg-purple-500/10 text-purple-600 border border-purple-500/30'
                  }`}>
                    {p.userRole}
                  </span>

                  <span className="text-xs text-slate-400 font-mono flex items-center gap-1">
                    <UserCheck size={13} className="text-slate-400" />
                    <b>{p.userName}</b> ({p.institution})
                  </span>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-xs text-slate-400 font-mono mr-2">{p.timeAgo || formatDate(p.timestamp)}</span>

                  <button
                    onClick={(e) => handleDownloadPDF(p, e)}
                    className="px-3 py-1.5 rounded-xl text-xs font-bold bg-sky-600 hover:bg-sky-700 text-white transition flex items-center gap-1.5 shadow-sm"
                  >
                    <FileDown size={14} /> PDF Report
                  </button>

                  <button
                    onClick={(e) => handleDownloadJSON(p, e)}
                    className="px-2.5 py-1.5 rounded-xl text-xs font-semibold border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition flex items-center gap-1"
                  >
                    <Download size={13} /> JSON
                  </button>

                  <button
                    onClick={(e) => handleDelete(p.id, e)}
                    className="p-1.5 rounded-xl text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition"
                    title="Delete history item"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              <div>
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                  <Atom size={18} className="text-sky-500 shrink-0" />
                  {p.title}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 font-mono">
                  {p.metrics}
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2 pt-2 text-xs">
                <div className="flex items-center gap-3 font-mono text-slate-500">
                  <span>Algorithm: <b>{p.algorithm}</b></span>
                  <span>Qubits: <b>{p.qubits || 6}</b></span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Confidence:</span>
                  <div className="w-28 sm:w-36">
                    <ConfidenceBar value={p.confidence} />
                  </div>
                  <span className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400">{p.confidence}%</span>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {filteredProjects.length === 0 && (
          <Card>
            <EmptyState
              icon={<History size={48} />}
              title="No history records found"
              message="Run simulations in Disease Diagnosis, Drug Discovery, Antibiotic Resistance, or Medical Imaging to log your real-time practical tests here."
            />
          </Card>
        )}
      </div>

      {/* Clear Confirmation Modal */}
      {confirmClearModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl"
          >
            <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400">
              <AlertTriangle size={22} />
              <h3 className="font-extrabold text-lg text-slate-900 dark:text-white">Clear All Activity History?</h3>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              This will remove all real-time logged practical tests and experiment runs from your active browser session. This action cannot be undone.
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button onClick={() => setConfirmClearModal(false)} className="btn-ghost text-xs">
                Cancel
              </button>
              <button onClick={handleClearAll} className="btn-primary !bg-rose-600 text-xs">
                Yes, Clear All History
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
