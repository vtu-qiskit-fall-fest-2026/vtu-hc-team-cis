import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Atom, Stethoscope, FlaskConical, Bug, ScanLine, ShieldCheck,
  ChevronRight, ArrowRight, Sparkles, CheckCircle2, Play,
  Zap, Database, Cpu, GraduationCap, UserCheck, Lock, Activity,
  Moon, Sun, ExternalLink, HelpCircle, Layers, FileText, Share2, Award,
  Search, Info, Terminal
} from 'lucide-react';
import QuantumBlochCanvas from '@/components/3d/QuantumBlochCanvas';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import {
  PROJECT_9_NOVEL_FEATURES,
  REAL_DRUG_TARGETS,
  REAL_PATHOGENS,
  REAL_ANTIBIOTICS,
  REAL_CLINICAL_CASES_40,
  REAL_SYMPTOMS_84
} from '@/data/realTimeCatalog';

export default function LandingPage() {
  const { session, loginAsRole } = useAuth();
  const { theme, toggle } = useTheme();
  const navigate = useNavigate();

  // Active dataset tab for Reference Explorer
  const [catalogTab, setCatalogTab] = useState<'drugs' | 'pathogens' | 'symptoms'>('drugs');
  const [searchQuery, setSearchQuery] = useState('');



  const handleRoleDirectLogin = (role: 'researcher' | 'student' | 'clinician' | 'admin') => {
    loginAsRole(role);
    navigate('/app');
  };

  const handleEnterLab = () => {
    if (!session) {
      loginAsRole('researcher');
    }
    navigate('/app');
  };

  // Filtered dataset for Reference Explorer
  const filteredDrugs = REAL_DRUG_TARGETS.filter(
    (d) =>
      d.drug.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.geneSymbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.medicalArea.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredPathogens = REAL_PATHOGENS.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.infections.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredCases = REAL_CLINICAL_CASES_40.filter(
    (c) =>
      c.prediction.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.symptoms.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200 font-sans">
      {/* Background Ambient Glow */}
      <div
        className="fixed inset-0 pointer-events-none opacity-30 dark:opacity-20"
        style={{
          backgroundImage:
            'radial-gradient(circle at 15% 15%, rgba(14, 165, 233, 0.25) 0%, transparent 35%), radial-gradient(circle at 85% 65%, rgba(168, 85, 247, 0.2) 0%, transparent 35%), radial-gradient(circle at 50% 90%, rgba(6, 182, 212, 0.2) 0%, transparent 30%)',
        }}
      />

      {/* --- TOP NAVBAR --- */}
      <header className="relative z-50 backdrop-blur-xl bg-white/90 dark:bg-slate-950/90 border-b border-slate-200/80 dark:border-slate-800/80 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-tr from-sky-500 via-cyan-400 to-indigo-600 text-white shadow-lg shadow-sky-500/25">
              <Atom size={24} className="animate-spin-slow" />
            </div>
            <div>
              <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-sky-600 via-cyan-500 to-indigo-600 dark:from-white dark:via-slate-100 dark:to-sky-300 bg-clip-text text-transparent">
                Q-MedLab
              </span>
              <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 block -mt-1">
                Virtual Medical Laboratory
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-7 text-sm font-semibold text-slate-600 dark:text-slate-300">
            <a href="#four-modules" className="hover:text-sky-600 dark:hover:text-sky-400 transition">4 Quantum Modules</a>
            <a href="#3d-bloch" className="hover:text-sky-600 dark:hover:text-sky-400 transition">3D Simulator</a>
            <a href="#reference-catalog" className="hover:text-sky-600 dark:hover:text-sky-400 transition">Clinical Datasets</a>
            <a href="#role-portals" className="hover:text-sky-600 dark:hover:text-sky-400 transition">Role Portals</a>
            <a href="#project-team" className="hover:text-sky-600 dark:hover:text-sky-400 transition">Project Team</a>
          </nav>

          {/* Right Controls */}
          <div className="flex items-center gap-3">
            <button
              onClick={toggle}
              className="p-2.5 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900 border border-slate-200 dark:border-slate-800 transition shadow-sm"
              title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {theme === 'dark' ? <Sun size={18} className="text-amber-400" /> : <Moon size={18} className="text-slate-700" />}
            </button>

            <Link
              to="/login"
              className="px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-900 border border-slate-200 dark:border-slate-800 transition whitespace-nowrap"
            >
              Sign In
            </Link>

            <Link
              to="/register"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-sky-600 to-cyan-500 hover:from-sky-500 hover:to-cyan-400 text-white font-bold text-xs sm:text-sm shadow-md shadow-sky-600/25 transition whitespace-nowrap active:scale-95"
            >
              Create Account
              <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </header>

      {/* --- HERO SECTION (MATCHING EXACT PROJECT REPORT COVER & SPEC) --- */}
      <section className="relative pt-12 pb-16 lg:pt-16 lg:pb-24 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Official Report Spec */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-100 dark:bg-sky-950/80 border border-sky-300 dark:border-sky-800 text-xs font-bold text-sky-800 dark:text-sky-300 shadow-sm">
                <Sparkles size={14} className="text-sky-600 dark:text-cyan-400 animate-pulse" />
                <span>Department of Computer Science & Engineering | 2026–2027</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1] text-slate-900 dark:text-white">
                Quantum-Powered Virtual Medical Laboratory for{' '}
                <span className="bg-gradient-to-r from-sky-600 via-cyan-500 to-emerald-500 dark:from-sky-400 dark:via-cyan-300 dark:to-emerald-400 bg-clip-text text-transparent">
                  Healthcare Simulation & Drug Discovery Education.
                </span>
              </h1>

              <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl font-normal">
                World&apos;s first interactive quantum computing platform for medical education integrating{' '}
                <strong className="text-slate-900 dark:text-white font-bold">VQE</strong>,{' '}
                <strong className="text-slate-900 dark:text-white font-bold">QSVM</strong>,{' '}
                <strong className="text-slate-900 dark:text-white font-bold">Grover&apos;s Search</strong>,{' '}
                <strong className="text-slate-900 dark:text-white font-bold">QCNN</strong>,{' '}
                <strong className="text-slate-900 dark:text-white font-bold">XAI</strong>,{' '}
                <strong className="text-slate-900 dark:text-white font-bold">QKD</strong>, and{' '}
                <strong className="text-slate-900 dark:text-white font-bold">QGAN</strong>.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <a
                  href="#four-modules"
                  className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-sky-600 to-cyan-500 hover:from-sky-500 hover:to-cyan-400 text-white font-bold text-sm shadow-lg shadow-sky-600/30 transition hover:scale-[1.02] active:scale-[0.98]"
                >
                  <Play size={16} className="fill-white" />
                  Explore Quantum Modules
                </a>
                <a
                  href="#role-portals"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700 font-bold text-sm transition shadow-sm"
                >
                  <UserCheck size={16} className="text-sky-500" />
                  Role Login Portals
                </a>
              </div>

              {/* Verified Features Badges */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-4 border-t border-slate-200 dark:border-slate-800 text-xs font-medium text-slate-600 dark:text-slate-400">
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
                  <span>30 Drug-Protein Targets</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
                  <span>22 Pathogens & Antibiotics</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
                  <span>84 WHO Symptoms (Grover)</span>
                </div>
              </div>
            </div>

            {/* Right Column: 3D Interactive Bloch Sphere Canvas */}
            <div id="3d-bloch" className="lg:col-span-5">
              <QuantumBlochCanvas />
            </div>
          </div>
        </div>
      </section>

      {/* --- TELEMETRY BENCHMARK BAR --- */}
      <section className="border-y border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/40 py-8 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="space-y-1">
              <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Quantum Hardware</p>
              <p className="text-3xl font-extrabold text-slate-900 dark:text-white">IBM Eagle <span className="text-lg text-sky-600 dark:text-sky-400 font-bold">127q</span></p>
              <p className="text-xs text-slate-500 dark:text-slate-400">Qiskit Aer Fallback Simulator</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Drug Docking (VQE)</p>
              <p className="text-3xl font-extrabold text-slate-900 dark:text-white">±0.05 <span className="text-lg text-cyan-600 dark:text-cyan-400 font-bold">Hartree</span></p>
              <p className="text-xs text-slate-500 dark:text-slate-400">Exact Electron Ground State</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">AMR Accuracy (QSVM)</p>
              <p className="text-3xl font-extrabold text-slate-900 dark:text-white">91% <span className="text-lg text-emerald-600 dark:text-emerald-400 font-bold">vs 74% SVM</span></p>
              <p className="text-xs text-slate-500 dark:text-slate-400">npj Digital Medicine 2025</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Genomics Speedup</p>
              <p className="text-3xl font-extrabold text-slate-900 dark:text-white">4.6x <span className="text-lg text-amber-600 dark:text-amber-400 font-bold">Fast</span></p>
              <p className="text-xs text-slate-500 dark:text-slate-400">88.7s reduced to 19.3s</p>
            </div>
          </div>
        </div>
      </section>

      {/* --- SECTION 7 OF REPORT: THE FOUR CORE QUANTUM MODULES --- */}
      <section id="four-modules" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
            Four Core Quantum Medical Modules
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-base leading-relaxed">
            Each purpose-built module pairs a specific medical education challenge with its theoretically proven quantum algorithm.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Module 1: Disease Diagnosis */}
          <div className="p-8 rounded-3xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 hover:border-sky-500/50 transition duration-300 shadow-sm dark:shadow-none flex flex-col justify-between">
            <div>
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-sky-100 dark:bg-sky-950 border border-sky-300 dark:border-sky-800 text-sky-600 dark:text-sky-400 mb-6">
                <Stethoscope size={28} />
              </div>
              <span className="text-xs font-mono font-bold text-sky-600 dark:text-sky-400 uppercase tracking-wider">Module 1 · Clinical Diagnosis</span>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-1 mb-3">
                Quantum Disease Diagnosis Simulator
              </h3>
              <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed mb-6">
                Utilizes <strong>Grover&apos;s Search + Quantum Amplitude Estimation</strong> across 200+ disease states. Classical diagnostic tools evaluate diseases sequentially (O(N)); Grover&apos;s algorithm places all candidates into superposition simultaneously for quadratic speedup O(√N).
              </p>
            </div>
            <div className="space-y-2 text-xs font-mono bg-slate-50 dark:bg-slate-950/80 p-4 rounded-2xl border border-slate-200 dark:border-slate-800">
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-slate-400">Algorithm:</span>
                <span className="text-sky-700 dark:text-sky-300 font-bold">Grover&apos;s Search + Amplitude Amplification</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-slate-400">Input Data:</span>
                <span className="text-slate-800 dark:text-white font-bold">84 Symptoms · WHO ICD-11 Codes</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-slate-400">Target Accuracy:</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-bold">Top-3 Hit Rate &gt; 80%</span>
              </div>
            </div>
          </div>

          {/* Module 2: Drug-Protein Docking */}
          <div className="p-8 rounded-3xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 hover:border-cyan-500/50 transition duration-300 shadow-sm dark:shadow-none flex flex-col justify-between">
            <div>
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-100 dark:bg-cyan-950 border border-cyan-300 dark:border-cyan-800 text-cyan-600 dark:text-cyan-400 mb-6">
                <FlaskConical size={28} />
              </div>
              <span className="text-xs font-mono font-bold text-cyan-600 dark:text-cyan-400 uppercase tracking-wider">Module 2 · Molecular Simulation</span>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-1 mb-3">
                Drug-Protein Docking Lab (VQE)
              </h3>
              <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed mb-6">
                Simulates binding free energy between small molecules and target viral/cancer proteins using the <strong>Variational Quantum Eigensolver (VQE)</strong>. Eliminates empirical force-field approximations by calculating exact electronic ground-state energies.
              </p>
            </div>
            <div className="space-y-2 text-xs font-mono bg-slate-50 dark:bg-slate-950/80 p-4 rounded-2xl border border-slate-200 dark:border-slate-800">
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-slate-400">Algorithm:</span>
                <span className="text-cyan-700 dark:text-cyan-300 font-bold">Hybrid VQE with UCCSD Ansatz (Depth 1–5)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-slate-400">Catalog Library:</span>
                <span className="text-slate-800 dark:text-white font-bold">30 Drugs (Sildenafil, Imatinib, Erlotinib)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-slate-400">Energy Accuracy:</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-bold">±0.05 Hartree of Reference</span>
              </div>
            </div>
          </div>

          {/* Module 3: Antibiotic Resistance */}
          <div className="p-8 rounded-3xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 hover:border-purple-500/50 transition duration-300 shadow-sm dark:shadow-none flex flex-col justify-between">
            <div>
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-100 dark:bg-purple-950 border border-purple-300 dark:border-purple-800 text-purple-600 dark:text-purple-400 mb-6">
                <Bug size={28} />
              </div>
              <span className="text-xs font-mono font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider">Module 3 · Antimicrobial Resistance</span>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-1 mb-3">
                Antibiotic Resistance Predictor (QSVM)
              </h3>
              <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed mb-6">
                <strong>Quantum Support Vector Machine (QSVM)</strong> with quantum kernel estimation maps high-dimensional bacterial genomic data (blaTEM, mecA, vanA) into Hilbert space, achieving 91% resistance classification accuracy compared to 74% for classical SVM.
              </p>
            </div>
            <div className="space-y-2 text-xs font-mono bg-slate-50 dark:bg-slate-950/80 p-4 rounded-2xl border border-slate-200 dark:border-slate-800">
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-slate-400">Algorithm:</span>
                <span className="text-purple-700 dark:text-purple-300 font-bold">QSVM Quantum Kernel Trick</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-slate-400">Pathogens:</span>
                <span className="text-slate-800 dark:text-white font-bold">22 Bacteria (Enterobacter, Serratia, MRSA)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-slate-400">Benchmark Study:</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-bold">npj Digital Medicine 2025</span>
              </div>
            </div>
          </div>

          {/* Module 4: Medical Imaging */}
          <div className="p-8 rounded-3xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 hover:border-amber-500/50 transition duration-300 shadow-sm dark:shadow-none flex flex-col justify-between">
            <div>
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-100 dark:bg-amber-950 border border-amber-300 dark:border-amber-800 text-amber-600 dark:text-amber-400 mb-6">
                <ScanLine size={28} />
              </div>
              <span className="text-xs font-mono font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">Module 4 · High-Dim Imaging</span>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-1 mb-3">
                Quantum Medical Imaging Lab (QCNN)
              </h3>
              <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed mb-6">
                <strong>Quantum Amplitude Encoding + QCNN</strong> enables exponential data compression and high-dimensional feature separation, detecting subtle low-contrast tumor margins on brain MRI and chest CT scans that classical CNNs miss.
              </p>
            </div>
            <div className="space-y-2 text-xs font-mono bg-slate-50 dark:bg-slate-950/80 p-4 rounded-2xl border border-slate-200 dark:border-slate-800">
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-slate-400">Algorithm:</span>
                <span className="text-amber-700 dark:text-amber-300 font-bold">QCNN with Parameterized Circuits</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-slate-400">Hilbert Dimension:</span>
                <span className="text-slate-800 dark:text-white font-bold">2^16 = 65,536 Quantum Features</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-slate-400">Research Basis:</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-bold">Narendran 2025 (Low-contrast tumors)</span>
              </div>
            </div>
          </div>
        </div>
      </section>





      {/* --- REAL-TIME CLINICAL REFERENCE DATASET EXPLORER --- */}
      <section id="reference-catalog" className="py-20 bg-slate-100/70 dark:bg-slate-900/30 border-y border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto space-y-3 mb-10">
            <h2 className="text-3xl font-black text-slate-900 dark:text-white">
              Clinical Reference Catalog
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-sm">
              Search the 30 Drug-Protein Targets, 22 Pathogens & Antibiotics, and 84 WHO-Indexed Symptoms straight from the project report.
            </p>
          </div>

          {/* Search & Tabs */}
          <div className="bg-white dark:bg-slate-950 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-lg">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 w-full sm:w-auto">
                <button
                  onClick={() => setCatalogTab('drugs')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                    catalogTab === 'drugs'
                      ? 'bg-sky-600 text-white shadow'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  30 Drugs & Targets
                </button>
                <button
                  onClick={() => setCatalogTab('pathogens')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                    catalogTab === 'pathogens'
                      ? 'bg-purple-600 text-white shadow'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  22 Bacteria & Antibiotics
                </button>
                <button
                  onClick={() => setCatalogTab('symptoms')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                    catalogTab === 'symptoms'
                      ? 'bg-emerald-600 text-white shadow'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  84 Symptoms · 40 Cases
                </button>
              </div>

              <div className="relative w-full sm:w-72">
                <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={`Search ${catalogTab}...`}
                  className="w-full pl-10 pr-4 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-sky-500"
                />
              </div>
            </div>

            {/* Tab 1: 30 Drugs Table */}
            {catalogTab === 'drugs' && (
              <div className="overflow-x-auto max-h-96 overflow-y-auto rounded-2xl border border-slate-200 dark:border-slate-800">
                <table className="w-full text-left text-xs">
                  <thead className="sticky top-0 bg-slate-100 dark:bg-slate-900 font-bold text-slate-600 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800 uppercase text-[10px]">
                    <tr>
                      <th className="py-3 px-4">No.</th>
                      <th className="py-3 px-4">Drug Name</th>
                      <th className="py-3 px-4">Complete Protein Target</th>
                      <th className="py-3 px-4">Gene Symbol</th>
                      <th className="py-3 px-4">Medical Area</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                    {filteredDrugs.map((d) => (
                      <tr key={d.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/60 transition">
                        <td className="py-2.5 px-4 font-mono">{d.id}</td>
                        <td className="py-2.5 px-4 font-bold text-slate-900 dark:text-white">{d.drug}</td>
                        <td className="py-2.5 px-4">{d.targetName}</td>
                        <td className="py-2.5 px-4 font-mono font-bold text-sky-600 dark:text-sky-400">{d.geneSymbol}</td>
                        <td className="py-2.5 px-4 text-slate-500 dark:text-slate-400">{d.medicalArea}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Tab 2: 22 Pathogens Table */}
            {catalogTab === 'pathogens' && (
              <div className="overflow-x-auto max-h-96 overflow-y-auto rounded-2xl border border-slate-200 dark:border-slate-800">
                <table className="w-full text-left text-xs">
                  <thead className="sticky top-0 bg-slate-100 dark:bg-slate-900 font-bold text-slate-600 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800 uppercase text-[10px]">
                    <tr>
                      <th className="py-3 px-4">Bacterial Pathogen</th>
                      <th className="py-3 px-4">Gram Type</th>
                      <th className="py-3 px-4">Typical Infections</th>
                      <th className="py-3 px-4">WHO Priority</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                    {filteredPathogens.map((p, i) => (
                      <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-900/60 transition">
                        <td className="py-2.5 px-4 font-bold text-slate-900 dark:text-white">{p.name}</td>
                        <td className="py-2.5 px-4 font-mono">{p.gramType}</td>
                        <td className="py-2.5 px-4">{p.infections}</td>
                        <td className="py-2.5 px-4">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              p.whoPriority === 'Critical'
                                ? 'bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300'
                                : p.whoPriority === 'High'
                                ? 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300'
                                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                            }`}
                          >
                            {p.whoPriority}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Tab 3: 40 Clinical Cases */}
            {catalogTab === 'symptoms' && (
              <div className="overflow-x-auto max-h-96 overflow-y-auto rounded-2xl border border-slate-200 dark:border-slate-800">
                <table className="w-full text-left text-xs">
                  <thead className="sticky top-0 bg-slate-100 dark:bg-slate-900 font-bold text-slate-600 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800 uppercase text-[10px]">
                    <tr>
                      <th className="py-3 px-4">Case #</th>
                      <th className="py-3 px-4">Reported Symptoms</th>
                      <th className="py-3 px-4">Quantum Grover Prediction</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                    {filteredCases.map((c) => (
                      <tr key={c.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/60 transition">
                        <td className="py-2.5 px-4 font-mono font-bold text-slate-500">Case {c.id}</td>
                        <td className="py-2.5 px-4 font-medium text-slate-900 dark:text-white">{c.symptoms.join(', ')}</td>
                        <td className="py-2.5 px-4 font-bold text-emerald-600 dark:text-emerald-400">{c.prediction}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* --- ROLE-BASED LOGIN PORTALS (4 CATEGORIES) --- */}
      <section id="role-portals" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <span className="px-3.5 py-1.5 rounded-full bg-cyan-100 dark:bg-cyan-950/80 border border-cyan-300 dark:border-cyan-800 text-xs font-bold uppercase tracking-wider text-cyan-800 dark:text-cyan-400">
            Real-Time Multi-Tenant Portals
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
            Role-Specific Research & Clinical Workspaces
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-base leading-relaxed">
            Real-time portals for Researchers, Students, Clinicians, and Administrators. Run quantum medical simulations, compute molecular ground states, and track live multi-user telemetry.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* 1. Researcher */}
          <div className="flex flex-col justify-between p-6 rounded-3xl bg-white dark:bg-gradient-to-b dark:from-sky-950/40 dark:to-slate-950 border border-sky-300 dark:border-sky-500/30 hover:border-sky-500 transition-all shadow-sm group">
            <div>
              <div className="flex items-center justify-between mb-5">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-100 dark:bg-sky-900/60 border border-sky-300 dark:border-sky-500/50 text-sky-700 dark:text-cyan-300">
                  <FlaskConical size={24} />
                </div>
                <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-sky-100 dark:bg-sky-950 text-sky-800 dark:text-sky-300 border border-sky-200 dark:border-sky-800">
                  Cyber Cyan Theme
                </span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 group-hover:text-sky-600 dark:group-hover:text-sky-300 transition">
                Quantum Researcher
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-6">
                VQE molecular docking, Hamiltonian Pauli string export, state tomography, and PubChem 3D structures.
              </p>
            </div>
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
              <Link
                to="/login/researcher"
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs shadow transition"
              >
                Enter Researcher Portal
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>

          {/* 2. Student */}
          <div className="flex flex-col justify-between p-6 rounded-3xl bg-white dark:bg-gradient-to-b dark:from-purple-950/40 dark:to-slate-950 border border-purple-300 dark:border-purple-500/30 hover:border-purple-500 transition-all shadow-sm group">
            <div>
              <div className="flex items-center justify-between mb-5">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-100 dark:bg-purple-900/60 border border-purple-300 dark:border-purple-500/50 text-purple-700 dark:text-purple-300">
                  <GraduationCap size={24} />
                </div>
                <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-purple-100 dark:bg-purple-950 text-purple-800 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
                  Violet Nebula Theme
                </span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 group-hover:text-purple-600 dark:group-hover:text-purple-300 transition">
                Quantum Student
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-6">
                Interactive quantum circuit simulator, guided tutorials, gamified research XP, and lab leaderboard.
              </p>
            </div>
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
              <Link
                to="/login/student"
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow transition"
              >
                Enter Student Lab
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>

          {/* 3. Clinician */}
          <div className="flex flex-col justify-between p-6 rounded-3xl bg-white dark:bg-gradient-to-b dark:from-emerald-950/40 dark:to-slate-950 border border-emerald-300 dark:border-emerald-500/30 hover:border-emerald-500 transition-all shadow-sm group">
            <div>
              <div className="flex items-center justify-between mb-5">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 dark:bg-emerald-900/60 border border-emerald-300 dark:border-emerald-500/50 text-emerald-700 dark:text-emerald-300">
                  <Stethoscope size={24} />
                </div>
                <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                  Clinical Emerald Theme
                </span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 group-hover:text-emerald-600 dark:group-hover:text-emerald-300 transition">
                Chief Clinician / MD
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-6">
                Multi-symptom Grover triage, WHO ICD-11 validation, clinical auto-report generation, and antibiotic guidance.
              </p>
            </div>
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
              <Link
                to="/login/clinician"
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow transition"
              >
                Enter Clinical Suite
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>

          {/* 4. Administrator */}
          <div className="flex flex-col justify-between p-6 rounded-3xl bg-white dark:bg-gradient-to-b dark:from-amber-950/40 dark:to-slate-950 border border-amber-300 dark:border-amber-500/30 hover:border-amber-500 transition-all shadow-sm group">
            <div>
              <div className="flex items-center justify-between mb-5">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-100 dark:bg-amber-900/60 border border-amber-300 dark:border-amber-500/50 text-amber-700 dark:text-amber-300">
                  <ShieldCheck size={24} />
                </div>
                <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                  Cyber Amber Theme
                </span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 group-hover:text-amber-600 dark:group-hover:text-amber-300 transition">
                System Administrator
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-6">
                IBM Quantum runtime cloud bridge monitoring, cluster hardware telemetry, role provisioning, and audit logs.
              </p>
            </div>
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
              <Link
                to="/login/admin"
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs shadow transition"
              >
                Enter Admin Console
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* --- PROJECT DEVELOPMENT TEAM SECTION --- */}
      <section id="project-team" className="py-20 bg-gradient-to-b from-slate-50 via-white to-slate-50 dark:from-slate-900/40 dark:via-slate-950 dark:to-slate-900/40 border-t border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
            <span className="px-3.5 py-1.5 rounded-full bg-sky-100 dark:bg-sky-950/80 text-sky-800 dark:text-sky-300 border border-sky-300 dark:border-sky-800 text-xs font-bold uppercase tracking-wider">
              Project Research & Engineering Team
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">
              Project Creators & Developers
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Department of Computer Science & Engineering | Minor Research Project (2026–2027)
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5 max-w-6xl mx-auto">
            {[
              { name: 'Sirikonda Srija', initials: 'SS', role: 'Team Member', sub: 'Research & AI Framework' },
              { name: 'Sindhuja lollati', initials: 'SL', role: 'Team Member', sub: 'Quantum Algorithms Core' },
              { name: 'Shaik Saniya', initials: 'SS', role: 'Team Member', sub: 'UI/UX & Clinical Workflows' },
              { name: 'Shaik Abdul Razak', initials: 'AR', role: 'Team Member', sub: 'Lead Architecture & Engine' },
              { name: 'Nirmal Kumar', initials: 'NK', role: 'Team Member', sub: 'Telemetry & Cloud Systems' },
            ].map((member, i) => (
              <div
                key={i}
                className="p-5 rounded-3xl bg-white dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 hover:border-sky-500/50 hover:shadow-xl dark:hover:shadow-sky-500/5 transition-all duration-300 text-center flex flex-col items-center justify-between group"
              >
                <div className="h-14 w-14 rounded-2xl bg-gradient-to-tr from-sky-500 via-cyan-400 to-indigo-600 text-white font-black text-base flex items-center justify-center mb-3.5 shadow-lg shadow-sky-500/25 group-hover:scale-110 transition duration-300">
                  {member.initials}
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-slate-900 dark:text-white group-hover:text-sky-600 dark:group-hover:text-sky-400 transition leading-snug">
                    {member.name}
                  </h3>
                  <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 text-[10px] font-bold border border-sky-200 dark:border-sky-900">
                    {member.role}
                  </span>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 font-medium">
                    {member.sub}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="border-t border-slate-200 dark:border-slate-800/80 bg-white dark:bg-slate-950 py-12 text-slate-600 dark:text-slate-400 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-tr from-sky-500 to-cyan-400 text-white shadow-md shadow-sky-500/20">
                <Atom size={22} />
              </div>
              <div>
                <p className="font-bold text-slate-900 dark:text-white text-base">Q-MedLab</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Department of Computer Science & Engineering | 2026–2027
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-6 font-medium text-xs">
              <a href="#four-modules" className="hover:text-slate-900 dark:hover:text-white transition">4 Modules</a>
              <a href="#reference-catalog" className="hover:text-slate-900 dark:hover:text-white transition">Catalog</a>
              <a href="#project-team" className="text-sky-600 dark:text-sky-400 font-bold hover:underline transition">Project Team</a>
              <Link to="/login" className="hover:text-slate-900 dark:hover:text-white transition">Sign In</Link>
              <Link to="/register" className="hover:text-slate-900 dark:hover:text-white transition">Create Account</Link>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-200/80 dark:border-slate-800/80 flex flex-col md:flex-row items-center justify-between gap-3 text-center md:text-left">
            <p className="text-slate-700 dark:text-slate-300 font-medium">
              <span className="font-bold text-slate-900 dark:text-white">Project Developed By:</span>{' '}
              Sirikonda Srija • Sindhuja lollati • Shaik Saniya • Shaik Abdul Razak • Nirmal Kumar
            </p>
            <p className="text-slate-500 dark:text-slate-400">
              © 2026–2027 Q-MedLab. All Rights Reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
