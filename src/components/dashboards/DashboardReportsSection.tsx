import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  FileText, FileDown, Search, Filter, Stethoscope, FlaskConical, Bug, ScanLine,
  CheckCircle2, Download, ShieldCheck, Sparkles, Activity, Layers, Atom, Trash2
} from 'lucide-react';
import { Card, Tag, ConfidenceBar } from '@/components/ui';
import { exportPDFReport, exportJSON } from '@/utils/reports';
import { realtimeTracker, type LiveProjectRun } from '@/lib/realtimeTracker';

interface DashboardReportsSectionProps {
  role: 'student' | 'researcher' | 'clinician';
  userName: string;
}

const ROLE_THEMES = {
  student: {
    accentBg: 'bg-emerald-500/10 border-emerald-500/30',
    titleColor: 'text-emerald-700 dark:text-emerald-300',
    badgeBg: 'bg-emerald-500 text-white',
    buttonBg: 'bg-emerald-600 hover:bg-emerald-700 text-white',
    tabActive: 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border-emerald-500/40 font-bold',
    label: 'Student Learning & Lab Reports',
  },
  researcher: {
    accentBg: 'bg-purple-500/10 border-purple-500/30',
    titleColor: 'text-purple-700 dark:text-purple-300',
    badgeBg: 'bg-purple-600 text-white',
    buttonBg: 'bg-purple-600 hover:bg-purple-700 text-white',
    tabActive: 'bg-purple-500/20 text-purple-700 dark:text-purple-300 border-purple-500/40 font-bold',
    label: 'Quantum Research Publications & Experiment Logs',
  },
  clinician: {
    accentBg: 'bg-cyan-500/10 border-cyan-500/30',
    titleColor: 'text-cyan-700 dark:text-cyan-300',
    badgeBg: 'bg-cyan-600 text-white',
    buttonBg: 'bg-cyan-600 hover:bg-cyan-700 text-white',
    tabActive: 'bg-cyan-500/20 text-cyan-700 dark:text-cyan-300 border-cyan-500/40 font-bold',
    label: 'Clinical Case Files & Doctor Decision Support Reports',
  },
};

const DEFAULT_ROLE_REPORTS: Record<string, Array<{
  id: string;
  title: string;
  module: 'diagnosis' | 'drug_discovery' | 'antibiotic' | 'imaging';
  category: string;
  timestamp: string;
  confidence: number;
  qubits: number;
  algorithm: string;
  summary: string;
  details: string[];
}>> = {
  student: [
    {
      id: 'stu-rep-1',
      title: 'Grover 4-Qubit Autoimmune Symptom Search Lab',
      module: 'diagnosis',
      category: 'Academic Practice Lab',
      timestamp: 'Today, 10:15 AM',
      confidence: 96.4,
      qubits: 4,
      algorithm: "Grover's Search Algorithm",
      summary: 'Student completed 4-qubit Grover search simulation over N=16 disease states for Lupus presentation.',
      details: ['Grover iterations: 2', 'Matched ICD-11: Systemic Lupus Erythematosus', 'Academic accuracy score: 96.4%'],
    },
    {
      id: 'stu-rep-2',
      title: 'QCNN Brain Tumor Classification Workshop (y702.jpg)',
      module: 'imaging',
      category: 'Medical Imaging Workshop',
      timestamp: 'Yesterday, 03:40 PM',
      confidence: 97.4,
      qubits: 8,
      algorithm: 'Quantum Convolutional Neural Net',
      summary: 'Classified Brain MRI scan y702.jpg using 8-qubit variational circuit with 4 parametrized layers.',
      details: ['Target: Glioma Tumor (Grade III/IV)', 'Quantum Accuracy: 97.4%', 'Classical Baseline: 90.1%'],
    },
    {
      id: 'stu-rep-3',
      title: 'QSVM E. Coli Antibiotic Susceptibility Practice AST',
      module: 'antibiotic',
      category: 'Microbiology Practice AST',
      timestamp: '2 days ago',
      confidence: 98.1,
      qubits: 6,
      algorithm: 'Quantum Support Vector Machine',
      summary: 'Supervised quantum kernel mapping for Ampicillin phenotypic resistance in E. coli.',
      details: ['Phenotype: Resistant', 'Kernel Evaluations: 256', 'Support Vectors: 24'],
    },
  ],
  researcher: [
    {
      id: 'res-rep-1',
      title: 'VQE Ground Energy Minimization: Remdesivir vs RdRp',
      module: 'drug_discovery',
      category: 'Quantum Molecular Docking',
      timestamp: 'Today, 11:05 AM',
      confidence: 97.8,
      qubits: 8,
      algorithm: 'VQE UCCSD Ansatz',
      summary: 'Variational Quantum Eigensolver minimized electronic energy of Remdesivir bound to RdRp catalytic site.',
      details: ['Ground State Energy: -38.452 Ha', 'Binding Energy: -9.82 kcal/mol', 'Affinity Score: 92/100'],
    },
    {
      id: 'res-rep-2',
      title: 'Imatinib BCR-ABL Tyrosine Kinase Docking VQE',
      module: 'drug_discovery',
      category: 'Oncology Drug Discovery',
      timestamp: 'Yesterday, 04:20 PM',
      confidence: 98.5,
      qubits: 8,
      algorithm: 'VQE Hardware-Efficient Ansatz',
      summary: 'Computed binding affinity for Imatinib targeted against BCR-ABL kinase mutation in CML.',
      details: ['Ground State Energy: -42.108 Ha', 'Binding Energy: -10.45 kcal/mol', 'Affinity Score: 95/100'],
    },
    {
      id: 'res-rep-3',
      title: 'Glioblastoma Brain MRI QCNN Benchmark Run',
      module: 'imaging',
      category: 'Quantum Image Classification',
      timestamp: '2 days ago',
      confidence: 97.4,
      qubits: 8,
      algorithm: 'QCNN Quantum Feature Mapping',
      summary: 'Quantum Convolutional Neural Net outperformed classical ResNet baseline by 2.6x speedup.',
      details: ['Prediction: Glioma Tumor', 'Quantum Fidelity: 97.4%', 'Training Speedup: 2.6x'],
    },
  ],
  clinician: [
    {
      id: 'cli-rep-1',
      title: 'Patient Case #903: Brain MRI Glioma Diagnostic Support',
      module: 'imaging',
      category: 'Clinical Case File',
      timestamp: 'Today, 09:30 AM',
      confidence: 97.4,
      qubits: 8,
      algorithm: 'QCNN Medical Imaging',
      summary: 'Attending doctor decision support output for axial brain MRI slice showing left parieto-occipital lesion.',
      details: ['Diagnosis: Glioma Tumor (Grade III/IV)', 'Urgency: Emergency (Red)', 'QKD Session: BB84 Active'],
    },
    {
      id: 'cli-rep-2',
      title: 'Patient Case #842: Multidrug-Resistant MRSA AMR Screen',
      module: 'antibiotic',
      category: 'Antimicrobial Stewardship',
      timestamp: 'Yesterday, 02:15 PM',
      confidence: 98.4,
      qubits: 6,
      algorithm: 'QSVM Genomic Resistance',
      summary: 'Phenotypic resistance screening flag for Staphylococcus aureus against Methicillin.',
      details: ['Verdict: HIGH RESISTANCE RISK', 'Prescribed Alt: Vancomycin + Linezolid', 'Probability: 88.5%'],
    },
    {
      id: 'cli-rep-3',
      title: 'Cardiovascular Arrhythmia Grover Symptom Triage',
      module: 'diagnosis',
      category: 'Clinical Decision Support',
      timestamp: '3 days ago',
      confidence: 94.8,
      qubits: 6,
      algorithm: "Grover's Oracle Search",
      summary: 'Multi-symptom triage for 62yo patient presenting with palpitations, chest tightness, and dyspnea.',
      details: ['Primary Flag: Atrial Fibrillation (1B80.0)', 'Urgency: High', 'Doctor Summary Verified'],
    },
  ],
};

export default function DashboardReportsSection({ role, userName }: DashboardReportsSectionProps) {
  const theme = ROLE_THEMES[role] || ROLE_THEMES.researcher;
  const [selectedModule, setSelectedModule] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [liveProjects, setLiveProjects] = useState<LiveProjectRun[]>([]);

  useEffect(() => {
    const fetchProjects = () => {
      setLiveProjects(realtimeTracker.getLiveProjectsByRole ? realtimeTracker.getLiveProjectsByRole(role) : realtimeTracker.getLiveProjects());
    };
    fetchProjects();
    const unsub = realtimeTracker.subscribe(fetchProjects);
    return unsub;
  }, [role]);

  const defaultReports = DEFAULT_ROLE_REPORTS[role] || DEFAULT_ROLE_REPORTS.researcher;

  const combinedReports = [
    ...liveProjects.map((p) => ({
      id: p.id,
      title: p.title,
      module: p.module,
      category: `${p.moduleLabel} Run`,
      timestamp: p.timeAgo || 'Recent',
      confidence: p.confidence,
      qubits: p.qubits || 6,
      algorithm: p.algorithm,
      summary: `Automated ${p.moduleLabel} calculation executed by ${p.userName} (${p.institution}).`,
      details: [p.metrics, `Confidence: ${p.confidence}%`, `Status: ${p.status}`],
    })),
    ...defaultReports,
  ];

  const [deletedIds, setDeletedIds] = useState<string[]>([]);

  const handleDeleteReport = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    realtimeTracker.deleteProjectRun(id);
    setDeletedIds((prev) => [...prev, id]);
  };

  const filteredReports = combinedReports
    .filter((r) => !deletedIds.includes(r.id))
    .filter((r) => {
      const matchesModule = selectedModule === 'all' || r.module === selectedModule;
      const matchesQuery =
        r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.algorithm.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesModule && matchesQuery;
    });

  const handleDownloadPDF = (report: typeof combinedReports[0]) => {
    exportPDFReport(`Q-MedLab Official Report — ${report.title}`, [
      { heading: 'Report Metadata', body: `Document ID: ${report.id}<br>User: ${userName}<br>Role: ${role.toUpperCase()}<br>Timestamp: ${report.timestamp}` },
      { heading: 'Test Title & Category', body: `<b>${report.title}</b><br>Category: ${report.category}<br>Module: ${report.module.toUpperCase()}` },
      { heading: 'Quantum Algorithm Execution', body: `Algorithm: ${report.algorithm}<br>Qubits Used: ${report.qubits}<br>Confidence Score: ${report.confidence}%` },
      { heading: 'Executive Summary', body: report.summary },
      { heading: 'Technical Parameters', body: report.details.map((d) => `• ${d}`).join('<br>') },
      { heading: 'Institutional Verification', body: 'Generated by Q-MedLab Quantum Medical Simulator. Verified for educational & research evaluation.' },
    ]);
  };

  const handleDownloadJSON = (report: typeof combinedReports[0], e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    exportJSON(`${report.id}-report.json`, report);
  };

  return (
    <Card className={`border-t-4 ${theme.accentBg}`}>
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${theme.badgeBg}`}>
              {role.toUpperCase()} DOCUMENTS
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 font-mono">
              <ShieldCheck size={13} className="text-emerald-500" /> {filteredReports.length} Downloadable Files Available
            </span>
          </div>
          <h2 className={`text-lg font-extrabold ${theme.titleColor} flex items-center gap-2`}>
            <FileText size={20} />
            Completed Test Reports & Downloadable Documents
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
            Access and download all test history, PDF medical reports, and JSON datasets generated for your role.
          </p>
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-64">
          <Search size={14} className="absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search documents..."
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-sky-500"
          />
        </div>
      </div>

      {/* Module Filter Tabs */}
      <div className="flex flex-wrap gap-2 mb-4 border-b border-slate-200/60 dark:border-slate-800/60 pb-3">
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
                ? theme.tabActive
                : 'bg-slate-100 dark:bg-slate-900/60 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
            }`}
          >
            {tab.icon && <tab.icon size={14} />}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Reports List */}
      <div className="space-y-3">
        {filteredReports.map((report) => (
          <motion.div
            key={report.id}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/70 dark:bg-slate-900/50 hover:shadow-md transition space-y-2"
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Tag color={
                  report.module === 'diagnosis' ? 'sky' :
                  report.module === 'drug_discovery' ? 'purple' :
                  report.module === 'antibiotic' ? 'amber' : 'emerald'
                }>
                  {report.category}
                </Tag>
                <span className="text-[11px] text-slate-400 font-mono">{report.timestamp}</span>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => handleDownloadPDF(report)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-sm ${theme.buttonBg}`}
                >
                  <FileDown size={14} />
                  Download PDF Report
                </button>
                <button
                  onClick={(e) => handleDownloadJSON(report, e)}
                  className="px-2.5 py-1.5 rounded-xl text-xs font-medium border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition flex items-center gap-1"
                >
                  <Download size={13} />
                  JSON
                </button>
                <button
                  onClick={(e) => handleDeleteReport(report.id, e)}
                  className="p-1.5 rounded-xl text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition"
                  title="Delete report entry"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                {report.title}
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                {report.summary}
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100 dark:border-slate-800/60 text-[11px] text-slate-500">
              <div className="flex items-center gap-3">
                <span className="font-mono text-slate-700 dark:text-slate-300">Algorithm: <b>{report.algorithm}</b></span>
                <span className="font-mono">Qubits: <b>{report.qubits}</b></span>
              </div>
              <div className="flex items-center gap-1.5 font-bold text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 size={13} />
                <span>Confidence: {report.confidence}%</span>
              </div>
            </div>
          </motion.div>
        ))}

        {filteredReports.length === 0 && (
          <div className="text-center py-8 text-slate-400 text-xs">
            No downloadable documents match your current filter criteria.
          </div>
        )}
      </div>
    </Card>
  );
}
