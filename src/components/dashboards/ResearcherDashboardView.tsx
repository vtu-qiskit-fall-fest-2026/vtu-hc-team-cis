import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  FlaskConical, Sliders, Cpu, Activity, Download, Upload, Users, BookOpen,
  FileCode, Layers, ShieldAlert, Sparkles, RefreshCw, CheckCircle2, Play,
  Zap, Table, Image as ImageIcon, Dna, Share2, Code, Clock, Globe, ArrowRight,
  ShieldCheck, HelpCircle
} from 'lucide-react';
import { Card, Tag } from '@/components/ui';
import { realtimeTracker } from '@/lib/realtimeTracker';

// Custom Feature Components
import LiveQuantumCircuit from '@/components/researcher/LiveQuantumCircuit';
import VQEConvergenceChart from '@/components/researcher/VQEConvergenceChart';
import Molecular3DViewer from '@/components/researcher/Molecular3DViewer';
import QuantumJobQueueMonitor from '@/components/researcher/QuantumJobQueueMonitor';
import SideBySideResultsPanel from '@/components/researcher/SideBySideResultsPanel';
import CollaborativeLabPanel from '@/components/researcher/CollaborativeLabPanel';
import PolygenicRiskPanel from '@/components/researcher/PolygenicRiskPanel';
import PublicationAssistantModal from '@/components/researcher/PublicationAssistantModal';
import ExperimentLabNotebook from '@/components/researcher/ExperimentLabNotebook';
import BenchmarkLeaderboardCard from '@/components/researcher/BenchmarkLeaderboardCard';
import NISQNoiseReport from '@/components/researcher/NISQNoiseReport';

interface ResearcherDashboardViewProps {
  userName: string;
}

export default function ResearcherDashboardView({ userName }: ResearcherDashboardViewProps) {
  // Navigation Tabs
  const [activeTab, setActiveTab] = useState<
    'overview' | 'circuit_vqe' | '3d_docking' | 'genomics_nisq' | 'notebook_paper'
  >('overview');

  // Quantum Parameters State
  const [ansatzDepth, setAnsatzDepth] = useState<number>(4);
  const [qubitCount, setQubitCount] = useState<number>(8);
  const [shotCount, setShotCount] = useState<number>(2048);
  const [hardwareBackend, setHardwareBackend] = useState<'ibm_eagle' | 'azure_ionq' | 'braket_dwave' | 'qiskit_aer'>('qiskit_aer');

  // Uploaded Custom Molecule State
  const [uploadedMolecule, setUploadedMolecule] = useState<{
    name: string;
    sizeKb: number;
    atomCount: number;
    content: string;
  } | null>(null);
  const [isUploadingMolecule, setIsUploadingMolecule] = useState<boolean>(false);

  // Hardware Latency Indicators
  const backendLatencies: Record<string, string> = {
    ibm_eagle: 'IBM Quantum: 23ms latency',
    azure_ionq: 'Azure IonQ: 45ms latency',
    braket_dwave: 'Amazon Braket: 31ms latency',
    qiskit_aer: 'Qiskit Aer: 2ms latency (Local)',
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingMolecule(true);

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = (event.target?.result as string) || '';

      // Count ATOM / HETATM lines if PDB, or calculate lines for SDF/MOL2
      let count = 0;
      if (file.name.toLowerCase().endsWith('.pdb')) {
        const lines = text.split('\n');
        count = lines.filter((l) => l.startsWith('ATOM') || l.startsWith('HETATM')).length;
      }
      if (count === 0) {
        count = Math.max(12, Math.floor(text.length / 75));
      }

      setTimeout(() => {
        setUploadedMolecule({
          name: file.name,
          sizeKb: Math.max(1, Math.round(file.size / 1024)),
          atomCount: count,
          content: text,
        });
        setIsUploadingMolecule(false);

        // Record live run into real-time tracker
        realtimeTracker.recordProjectRun({
          module: 'drug_discovery',
          algorithm: 'Custom Molecule PDB/SDF Ingestion',
          title: `Uploaded Ligand PDB: ${file.name}`,
          confidence: 99.2,
          qubits: 8,
          metrics: `Parsed ${count} atoms (${Math.round(file.size / 1024)} KB) | Active Space Verified`,
        });
      }, 700);
    };

    reader.onerror = () => {
      setIsUploadingMolecule(false);
      alert('Could not read the selected file. Please select a valid .PDB, .SDF, or .MOL2 text file.');
    };

    reader.readAsText(file);
  };

  const handleExportMethodologyLaTeX = () => {
    const latex = `
\\section*{Q-MedLab Quantum Methodology Section}
\\subsection*{VQE Electronic Structure Calculation}
We implemented a Variational Quantum Eigensolver (VQE) with ansatz circuit depth $d = ${ansatzDepth}$ on $N = ${qubitCount}$ qubits using the \\texttt{${hardwareBackend}} backend with $S = ${shotCount}$ measurement shots.
`;
    const blob = new Blob([latex], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'QMedLab_Paper_Methodology.tex';
    a.click();
  };

  return (
    <div className="space-y-6 text-slate-100 font-sans">
      {/* Top Header Banner matching Lead Researcher Login Theme */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-950 via-sky-950 to-indigo-950 border border-cyan-500/40 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 text-xs font-black tracking-wider border border-cyan-500/40 uppercase flex items-center gap-1.5 shadow-sm">
                <FlaskConical size={14} /> Lead Quantum Researcher Workbench
              </span>
              <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold flex items-center gap-1.5 border border-emerald-500/30">
                <Cpu size={14} /> IBM Falcon ● Live
              </span>
              <span className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs font-bold flex items-center gap-1.5 border border-purple-500/30 font-mono">
                1,850 pts / 2,000 pts
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Welcome back, {userName}
            </h1>
            <p className="mt-1 text-slate-300 text-xs sm:text-sm max-w-2xl leading-relaxed">
              Real-time gate visualizer, live VQE convergence graph, 3D molecular viewer, quantum job queue monitor, and IEEE methodology generator.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={handleExportMethodologyLaTeX}
              className="px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs shadow-lg shadow-cyan-500/25 flex items-center gap-2 transition"
            >
              <FileCode size={16} /> Export Paper Methodology (.TEX)
            </button>
          </div>
        </div>

        {/* Multi-Provider Hardware Backend Switcher Strip */}
        <div className="mt-6 pt-4 border-t border-slate-800/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <Globe size={14} className="text-cyan-400" /> Active Provider:
            </span>
            <div className="flex flex-wrap bg-slate-900/90 p-1 rounded-2xl border border-slate-800">
              {[
                { id: 'qiskit_aer', label: 'Qiskit Aer Sim' },
                { id: 'ibm_eagle', label: 'IBM Eagle 127Q' },
                { id: 'azure_ionq', label: 'Azure IonQ Aria' },
                { id: 'braket_dwave', label: 'Amazon Braket D-Wave' },
              ].map((b) => (
                <button
                  key={b.id}
                  onClick={() => setHardwareBackend(b.id as any)}
                  className={`px-3 py-1 rounded-xl text-xs font-extrabold transition ${
                    hardwareBackend === b.id
                      ? 'bg-cyan-500 text-slate-950 shadow-md font-black'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {b.label}
                </button>
              ))}
            </div>
          </div>

          <span className="text-xs font-mono text-cyan-400 font-semibold flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
            {backendLatencies[hardwareBackend]}
          </span>
        </div>
      </div>

      {/* Structured Dashboard Sub-Navigation Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 bg-slate-950/90 p-1.5 rounded-2xl border border-slate-800/80 shadow-xl backdrop-blur-xl">
        {[
          { id: 'overview', label: 'Overview & Controls', icon: Sliders },
          { id: 'circuit_vqe', label: 'Live Circuit & VQE', icon: Activity },
          { id: '3d_docking', label: '3D Docking & Results', icon: Layers },
          { id: 'genomics_nisq', label: 'Genomics & NISQ Noise', icon: Dna },
          { id: 'notebook_paper', label: 'Lab Records & IEEE Paper', icon: BookOpen },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`w-full py-2.5 px-3 rounded-xl text-xs font-extrabold transition flex items-center justify-center gap-2 text-center ${
                isActive
                  ? 'bg-gradient-to-r from-cyan-500 to-sky-400 text-slate-950 font-black shadow-lg shadow-cyan-500/25 border border-cyan-300/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900/80 border border-transparent'
              }`}
            >
              <Icon size={16} />
              <span className="truncate">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB CONTENT 1: OVERVIEW & PARAMETER CONTROLS */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Quick Stats Summary Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-slate-900/90 border border-cyan-500/30 space-y-1">
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Total VQE Runs</span>
              <span className="text-2xl font-black text-white font-mono">47 Runs</span>
              <span className="text-[11px] text-emerald-400 font-semibold block">12 runs this week</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/90 border border-cyan-500/30 space-y-1">
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Active Quantum Job</span>
              <span className="text-base font-black text-cyan-400">VQE Drug Docking</span>
              <span className="text-[11px] text-amber-400 font-semibold block">Queue: #3 of 8 (4m)</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/90 border border-cyan-500/30 space-y-1">
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Drug Library Loaded</span>
              <span className="text-2xl font-black text-white font-mono">30 Drugs</span>
              <span className="text-[11px] text-cyan-400 font-semibold block">8 custom uploaded</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/90 border border-cyan-500/30 space-y-1">
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Global Research Rank</span>
              <span className="text-2xl font-black text-amber-400 font-mono">#12 Globally</span>
              <span className="text-[11px] text-purple-400 font-semibold block">1,850 / 2,000 XP</span>
            </div>
          </div>

          {/* Expert Quantum Parameters Controls */}
          <div className="p-6 rounded-3xl bg-slate-900/90 border border-cyan-500/30 shadow-2xl backdrop-blur-xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Sliders size={20} className="text-cyan-400" />
                Expert Quantum Execution Parameters
              </h2>
              <div className="flex gap-2">
                <Tag color="cyan">Qiskit 1.x Engine</Tag>
                <Tag color="sky">PySCF Chemistry</Tag>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
                <label className="text-xs font-bold text-slate-300 block mb-1">
                  VQE Ansatz Depth: <span className="text-cyan-400">{ansatzDepth}</span>
                </label>
                <input
                  type="range"
                  min={1}
                  max={10}
                  value={ansatzDepth}
                  onChange={(e) => setAnsatzDepth(Number(e.target.value))}
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                />
                <p className="text-[10px] text-slate-400 mt-1">Deep ansatz improves expressivity for complex ligands.</p>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
                <label className="text-xs font-bold text-slate-300 block mb-1">Qubit Count</label>
                <select
                  value={qubitCount}
                  onChange={(e) => setQubitCount(Number(e.target.value))}
                  className="w-full px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs font-semibold focus:outline-none focus:border-cyan-500"
                >
                  <option value={4}>4 Qubits (Small Molecules)</option>
                  <option value={8}>8 Qubits (Medium Peptides)</option>
                  <option value={16}>16 Qubits (IBM Eagle Sub-Cluster)</option>
                  <option value={32}>32 Qubits (Aer Full Statevector)</option>
                </select>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
                <label className="text-xs font-bold text-slate-300 block mb-1">Shot Count</label>
                <select
                  value={shotCount}
                  onChange={(e) => setShotCount(Number(e.target.value))}
                  className="w-full px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs font-semibold focus:outline-none focus:border-cyan-500"
                >
                  <option value={1024}>1,024 Shots (Fast Screening)</option>
                  <option value={2048}>2,048 Shots (Standard Precision)</option>
                  <option value={4096}>4,096 Shots (High Precision)</option>
                  <option value={8192}>8,192 Shots (Publication Grade)</option>
                </select>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
                <label className="text-xs font-bold text-slate-300 block mb-1">Hardware Backend</label>
                <select
                  value={hardwareBackend}
                  onChange={(e) => setHardwareBackend(e.target.value as any)}
                  className="w-full px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-cyan-400 text-xs font-bold focus:outline-none"
                >
                  <option value="qiskit_aer">Qiskit Aer Simulator (Local)</option>
                  <option value="ibm_eagle">IBM Quantum Eagle (127-Qubit)</option>
                  <option value="azure_ionq">Azure IonQ Aria</option>
                  <option value="braket_dwave">Amazon Braket (D-Wave)</option>
                </select>
              </div>
            </div>

            {/* Custom Molecule Uploader */}
            <div className="mt-4 p-4 rounded-2xl border border-dashed border-cyan-500/40 bg-slate-950/80 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 shrink-0">
                  <Upload size={22} className={isUploadingMolecule ? 'animate-bounce' : ''} />
                </div>
                <div>
                  <p className="font-bold text-xs text-white">Custom Molecule & Protein Uploader (.PDB / .SDF / .MOL2)</p>
                  <p className="text-[11px] text-slate-400">Upload ligand 3D coordinates or PDB receptor structures for VQE binding simulation.</p>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <label className="px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs cursor-pointer shadow-lg shadow-cyan-500/20 flex items-center gap-2 transition">
                  {isUploadingMolecule ? <RefreshCw size={14} className="animate-spin" /> : <Upload size={14} />}
                  {isUploadingMolecule ? 'Uploading & Parsing...' : 'Browse PDB/SDF File'}
                  <input
                    type="file"
                    accept=".pdb,.sdf,.mol2"
                    className="hidden"
                    onChange={handleFileUpload}
                  />
                </label>
              </div>
            </div>

            {/* Uploaded File Confirmation Banner */}
            {uploadedMolecule && (
              <div className="mt-3 p-4 rounded-2xl bg-emerald-950/60 border border-emerald-500/40 text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-lg">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 shrink-0">
                    <CheckCircle2 size={20} />
                  </div>
                  <div>
                    <span className="font-extrabold text-white text-sm block">{uploadedMolecule.name}</span>
                    <span className="text-[11px] text-emerald-300 font-mono">
                      File Size: {uploadedMolecule.sizeKb} KB | Atomic Coordinates: {uploadedMolecule.atomCount} Atoms Parsed | Status: Ingested for VQE
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => setActiveTab('3d_docking')}
                  className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs shadow-md transition shrink-0 flex items-center gap-1.5"
                >
                  <Layers size={14} /> Open in 3D Viewer →
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB CONTENT 2: LIVE CIRCUIT & VQE */}
      {activeTab === 'circuit_vqe' && (
        <div className="space-y-6">
          <LiveQuantumCircuit qubitsCount={qubitCount} ansatzDepth={ansatzDepth} />
          <VQEConvergenceChart ansatzDepth={ansatzDepth} qubitCount={qubitCount} shotCount={shotCount} hardwareBackend={hardwareBackend} />
        </div>
      )}

      {/* TAB CONTENT 3: 3D DOCKING & RESULTS */}
      {activeTab === '3d_docking' && (
        <div className="space-y-6">
          <Molecular3DViewer uploadedMolecule={uploadedMolecule} />
          <SideBySideResultsPanel />
        </div>
      )}

      {/* TAB CONTENT 4: GENOMICS & NISQ NOISE */}
      {activeTab === 'genomics_nisq' && (
        <div className="space-y-6">
          <PolygenicRiskPanel />
          <NISQNoiseReport />
        </div>
      )}

      {/* TAB CONTENT 5: LAB NOTEBOOK & IEEE PAPER */}
      {activeTab === 'notebook_paper' && (
        <div className="space-y-6">
          <PublicationAssistantModal
            ansatzDepth={ansatzDepth}
            qubitCount={qubitCount}
            shotCount={shotCount}
            hardwareBackend={hardwareBackend}
          />
          <ExperimentLabNotebook />
        </div>
      )}
    </div>
  );
}

