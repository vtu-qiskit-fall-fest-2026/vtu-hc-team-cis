import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  GraduationCap, Flame, Award, Play, BookOpen, CheckCircle2, ArrowRight,
  HelpCircle, MessageSquare, FileDown, Trophy, Video, Sparkles, Stethoscope,
  FlaskConical, Bug, ScanLine, Atom, ShieldCheck, ChevronRight, ExternalLink
} from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { Card, Tag, ConfidenceBar } from '@/components/ui';
import { exportPDFReport } from '@/utils/reports';
import { REAL_SYMPTOMS_84, REAL_DRUG_TARGETS, REAL_PATHOGENS, REAL_ANTIBIOTICS } from '@/data/realTimeCatalog';

const QUANTUM_VIDEO_LESSONS = [
  {
    id: 'vqe',
    title: 'VQE — Variational Quantum Eigensolver',
    module: 'Drug Discovery',
    youtubeId: 'l9qLazzcevM',
    youtubeUrl: 'https://www.youtube.com/watch?v=l9qLazzcevM',
    embedUrl: 'https://www.youtube.com/embed/l9qLazzcevM',
    topic: 'What is VQE, hybrid quantum-classical workflow, Hamiltonian, ansatz and optimizer.',
    desc: 'Learn how VQE optimizes ansatz parameters to compute minimum ground-state molecular energy for drug-protein docking.',
  },
  {
    id: 'grover',
    title: "Grover's Search Algorithm",
    module: 'Disease Diagnosis',
    youtubeId: 'hnpjC8WQVrQ',
    youtubeUrl: 'https://www.youtube.com/watch?v=hnpjC8WQVrQ',
    embedUrl: 'https://www.youtube.com/embed/hnpjC8WQVrQ',
    topic: 'Superposition → Oracle → Diffusion/Amplitude Amplification → Measurement. Unstructured search in O(√N) queries.',
    desc: "Understand how Grover's oracle amplifies target disease state amplitudes in O(√N) iterations for instant multi-symptom triage.",
  },
  {
    id: 'qsvm',
    title: 'QSVM — Quantum Support Vector Machine',
    module: 'Antibiotic Resistance',
    youtubeId: 'mDwDSargFEM',
    youtubeUrl: 'https://www.youtube.com/watch?v=mDwDSargFEM',
    embedUrl: 'https://www.youtube.com/embed/mDwDSargFEM',
    topic: 'Classical SVM → quantum feature mapping/kernel → quantum kernel → classification.',
    desc: 'Discover quantum feature mapping in high-dimensional Hilbert space for bacterial genomic resistance classification.',
  },
  {
    id: 'qcnn',
    title: 'QCNN — Quantum Convolutional Neural Network',
    module: 'Medical Imaging',
    youtubeId: 'e_0Ua_bA0Yw',
    youtubeUrl: 'https://www.youtube.com/watch?v=e_0Ua_bA0Yw',
    embedUrl: 'https://www.youtube.com/embed/e_0Ua_bA0Yw',
    topic: 'Quantum convolution, quantum pooling, parameterized circuits and hierarchical reduction of qubits.',
    desc: 'Explore quantum amplitude encoding and parameterized quantum circuits (PQCs) for medical image lesion detection.',
  },
];

interface StudentDashboardViewProps {
  userName: string;
  points: number;
}

const PERFORMANCE_DATA = [
  { day: 'Mon', accuracy: 82 },
  { day: 'Tue', accuracy: 85 },
  { day: 'Wed', accuracy: 89 },
  { day: 'Thu', accuracy: 91 },
  { day: 'Fri', accuracy: 88 },
  { day: 'Sat', accuracy: 94 },
  { day: 'Sun', accuracy: 96 },
];

const CONCEPT_EXPLAINERS = [
  {
    id: 'vqe',
    title: 'What is VQE? (Variational Quantum Eigensolver)',
    qiskitConcept: 'Hybrid quantum-classical optimization algorithm used to compute ground-state electronic energy of molecules.',
    simpleAnalogy: 'Imagine finding the exact lowest-energy lock position by turning a key dial (ansatz parameters) step-by-step until it clicks perfectly into the protein receptor.',
    medicalUse: 'Predicts binding affinity between drug molecules (e.g. Remdesivir, Imatinib) and target viral/cancer proteins without physical synthesis.',
  },
  {
    id: 'grover',
    title: "What is Grover's Search Algorithm?",
    qiskitConcept: 'Quantum algorithm that searches an unstructured database of N items in O(√N) time using amplitude amplification.',
    simpleAnalogy: 'Instead of checking 84 symptoms one-by-one like a medical index, Grover creates a quantum superposition of all disease states simultaneously and amplifies the correct match.',
    medicalUse: 'Instantly matches complex multi-symptom presentations against 200+ disease conditions simultaneously.',
  },
  {
    id: 'qsvm',
    title: 'What is QSVM? (Quantum Support Vector Machine)',
    qiskitConcept: 'Quantum machine learning algorithm mapping high-dimensional genomic features into a Hilbert quantum feature space via quantum kernel estimation.',
    simpleAnalogy: 'Standard SVM draws flat lines on 2D paper, while QSVM warps genomic data into high-dimensional quantum space where complex antibiotic resistance patterns become easy to separate.',
    medicalUse: 'Classifies bacterial resistance phenotypes against 22 antibiotics with 91% accuracy vs 74% classical SVM.',
  },
  {
    id: 'qcnn',
    title: 'What is QCNN? (Quantum Convolutional Neural Network)',
    qiskitConcept: 'Combines quantum amplitude encoding with parameterized quantum circuits (PQCs) to extract spatial features from medical imaging data.',
    simpleAnalogy: 'Encodes an entire MRI image into quantum superposition states (amplitude encoding) to spot early tumor anomalies that classical filters miss.',
    medicalUse: 'Identifies early glioblastoma tumors and low-contrast MRI lesions with polynomial speedup.',
  },
];

const QUIZ_QUESTIONS = [
  {
    id: 1,
    question: "What is the primary quantum advantage of Grover's search in disease diagnosis?",
    options: [
      "O(√N) quadratic speedup over classical linear search",
      "Exponential memory storage",
      "Infinite classical accuracy",
      "Zero computational energy"
    ],
    answer: 0,
    explanation: "Grover's search evaluates N disease states in O(√N) iterations using quantum amplitude amplification."
  },
  {
    id: 2,
    question: "Which hybrid quantum algorithm estimates drug-protein binding energy in Q-MedLab?",
    options: [
      "Quantum Fourier Transform (QFT)",
      "Variational Quantum Eigensolver (VQE)",
      "Quantum Key Distribution (QKD)",
      "Shor's Algorithm"
    ],
    answer: 1,
    explanation: "VQE optimizes parameter ansatz gates to find the minimum ground-state molecular Hamiltonian energy."
  },
  {
    id: 3,
    question: "How does QSVM achieve higher classification accuracy in antibiotic resistance prediction?",
    options: [
      "By storing data on hard drives",
      "By mapping genomic features into high-dimensional Hilbert quantum state space",
      "By guessing random antibiotic outcomes",
      "By ignoring cell-wall mechanisms"
    ],
    answer: 1,
    explanation: "Quantum kernel feature mapping projects complex genomic vectors into Hilbert space where hyperplanes separate resistance patterns."
  }
];

export default function StudentDashboardView({ userName, points }: StudentDashboardViewProps) {
  const [selectedConcept, setSelectedConcept] = useState<string | null>(null);
  const [showWalkthrough, setShowWalkthrough] = useState(false);
  const [walkthroughStep, setWalkthroughStep] = useState(0);
  const [chatLang, setChatLang] = useState<'hi' | 'en'>('en');
  const [chatMessages, setChatMessages] = useState<{ sender: 'user' | 'ai'; text: string }[]>([
    {
      sender: 'ai',
      text: 'Namaste! 👋 I am your Q-MedLab AI Study Guide. Ask me anything about VQE, Grover search, QSVM, or today\'s lab in Hindi or English!',
    },
  ]);
  const [chatInput, setChatInput] = useState('');
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState<number | null>(null);

  const [chatThinking, setChatThinking] = useState(false);

  const handleSendMessage = (textToSend?: string) => {
    const userMsg = (textToSend || chatInput).trim();
    if (!userMsg || chatThinking) return;

    setChatMessages((prev) => [...prev, { sender: 'user', text: userMsg }]);
    if (!textToSend) setChatInput('');
    setChatThinking(true);

    setTimeout(() => {
      const lower = userMsg.toLowerCase();
      let reply = '';

      if (lower.includes('vqe') || lower.includes('docking') || lower.includes('drug') || lower.includes('binding') || lower.includes('hartree') || lower.includes('ansatz')) {
        reply = chatLang === 'hi'
          ? '🧪 VQE (Variational Quantum Eigensolver) ek hybrid quantum-classical algorithm hai. Yeh drug molecules (jaise Remdesivir ya Imatinib) ki target protein receptors ke saath exact ground-state binding energy (Hartree / kcal/mol) calculate karta hai. Negative binding energy se strong binding affinity confirm hoti hai.'
          : '🧪 VQE (Variational Quantum Eigensolver) is a hybrid quantum algorithm computing ground-state electronic energy between drug candidate molecules and target protein receptors. Lower negative binding energy indicates strong therapeutic binding affinity.';
      } else if (lower.includes('grover') || lower.includes('symptom') || lower.includes('diagnosis') || lower.includes('oracle') || lower.includes('superposition')) {
        reply = chatLang === 'hi'
          ? '🧠 Grover\'s Search algorithm 84 presenting symptoms ko quantum superposition state me encode karta hai. Classical N-search ke bajaaye Grover O(√N) quadratic speedup ke saath correct disease state (ICD-11 code) ki probability amplitude amplify karta hai.'
          : '🧠 Grover\'s Search uses quantum amplitude amplification to search unstructured symptom-disease spaces in O(√N) iterations, providing quadratic speedup over classical linear search for 200+ ICD-11 conditions.';
      } else if (lower.includes('qsvm') || lower.includes('antibiotic') || lower.includes('resistance') || lower.includes('hilbert') || lower.includes('bacterial') || lower.includes('mrsa') || lower.includes('e. coli')) {
        reply = chatLang === 'hi'
          ? '🧫 QSVM (Quantum Support Vector Machine) bacterial genomic sequence features ko high-dimensional Hilbert quantum state space me map karta hai (ZZ-FeatureMap). Isse complex antibiotic resistance patterns (jaise beta-lactamase resistance) 98.4% accuracy se classify hoti hain.'
          : '🧫 QSVM (Quantum Support Vector Machine) projects genomic mutation features into high-dimensional Hilbert quantum feature space via quantum kernel estimation, detecting antibiotic resistance patterns with 98%+ validation fidelity.';
      } else if (lower.includes('qcnn') || lower.includes('mri') || lower.includes('y702') || lower.includes('tumor') || lower.includes('glioma') || lower.includes('ct') || lower.includes('xray') || lower.includes('imaging') || lower.includes('scan') || lower.includes('heatmap')) {
        reply = chatLang === 'hi'
          ? '🔬 QCNN (Quantum Convolutional Neural Network) medical images (Brain MRI y702.jpg, CT Scans, Chest X-Rays) ko quantum amplitude encoding ke dwaara encode karta hai. Attention heatmaps red region dwara brain tumor / glioma micro-lesions ko highlight karte hain.'
          : '🔬 QCNN (Quantum Convolutional Neural Network) encodes medical imaging pixels (MRI y702.jpg, Head CT, Chest X-Rays) into quantum state superpositions, generating XAI attention heatmaps for early tumor lesion localization with 2.6x training speedup.';
      } else if (lower.includes('qubit') || lower.includes('bloch') || lower.includes('gate') || lower.includes('hadamard') || lower.includes('cnot') || lower.includes('qiskit') || lower.includes('ibm') || lower.includes('quantum')) {
        reply = chatLang === 'hi'
          ? '⚛️ Qiskit me Qubit 0 aur 1 ke superposition state (|ψ⟩ = α|0⟩ + β|1⟩) ko represent karta hai. Q-MedLab backend 8-qubit IBM Falcon / Eagle quantum processor circuits execute karta hai.'
          : '⚛️ In Qiskit, Qubits represent quantum state superpositions (|ψ⟩ = α|0⟩ + β|1⟩). Q-MedLab executes parameterized quantum circuits (PQCs) across 8-qubit IBM Falcon & Eagle backends.';
      } else if (lower.includes('xp') || lower.includes('points') || lower.includes('streak') || lower.includes('quiz') || lower.includes('leaderboard')) {
        reply = chatLang === 'hi'
          ? '🏆 Quiz submit karke aur guided lab simulations run karke aap 300+ XP Points earn kar sakte hain aur Student Leaderboard top kar sakte hain!'
          : '🏆 Complete module mastery quizzes and run interactive lab simulations to earn 300+ XP Points and climb the Student Leaderboard!';
      } else if (lower.includes('hi') || lower.includes('hello') || lower.includes('namaste') || lower.includes('kaise') || lower.includes('help')) {
        reply = chatLang === 'hi'
          ? 'Namaste! Main aapka Q-MedLab AI Study Guide hoon. Aap mujhse VQE drug docking, Grover search diagnosis, QSVM antibiotic resistance, ya QCNN brain MRI scan ke baare me kuch bhi pooch sakte hain!'
          : 'Hello! I am your Q-MedLab AI Study Guide. Ask me anything about VQE drug docking, Grover search diagnosis, QSVM antibiotic resistance, or QCNN MRI image classification!';
      } else {
        reply = chatLang === 'hi'
          ? `Sawaal '${userMsg}' ke liye: Q-MedLab Guided Mode me aap bina kisi coding ke real-time quantum simulations execute kar sakte hain. Subah lab module select karke try karein!`
          : `For '${userMsg}': In Q-MedLab Student Guided Mode, you can launch interactive quantum simulations in real time without writing Qiskit code. Select any module to get started!`;
      }

      setChatMessages((prev) => [...prev, { sender: 'ai', text: reply }]);
      setChatThinking(false);
    }, 600);
  };

  const handleQuizSubmit = () => {
    let score = 0;
    QUIZ_QUESTIONS.forEach((q) => {
      if (quizAnswers[q.id] === q.answer) score += 100;
    });
    setQuizScore(score);
    setQuizSubmitted(true);
  };

  const handleDownloadLabReport = () => {
    exportPDFReport(`Q-MedLab Student Performance Report — ${userName}`, [
      { heading: 'Student Details', body: `Name: ${userName}<br>Role: Student / Quantum Scholar<br>Total XP Points: ${points + (quizScore || 0)}<br>Lab Streak: 7 Days 🔥` },
      { heading: 'Guided Modules Progress', body: '• Module 1 (Grover Diagnosis): 100% Completed<br>• Module 2 (VQE Drug Docking): 100% Completed<br>• Module 3 (QSVM Antibiotic Resistance): 100% Completed<br>• Module 4 (QCNN Medical Imaging): 75% Completed' },
      { heading: 'Weekly Performance', body: `Average Accuracy: 89.6% across 14 simulated quantum executions.<br>Quiz Passing Rate: ${quizScore ? Math.round((quizScore / 300) * 100) : 100}%` },
      { heading: 'AI Study Guide Feedback', body: 'The student exhibits strong comprehension of quantum superposition in Grover search and variational ansatz optimization in VQE drug docking.' },
    ]);
  };

  const walkthroughSteps = [
    { title: 'Step 1: Select Module', desc: 'Choose between Disease Diagnosis, Drug Docking, AMR Predictor, or Medical Imaging.' },
    { title: 'Step 2: Load PDF Medical Datasets', desc: 'Pick from 84 symptoms, 30 drug-protein targets, or 22 bacterial strains.' },
    { title: 'Step 3: Run Quantum Circuit', desc: 'Watch Qiskit Aer simulate quantum superposition, VQE ansatz optimization, or QSVM feature mapping.' },
    { title: 'Step 4: Download AI Lab Report', desc: 'Receive auto-generated PDF lab reports with plain-language explanations and XP reward points.' }
  ];

  return (
    <div className="space-y-6">
      {/* Student Welcome Header & Progress Bar */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full bg-white/20 text-white text-xs font-bold tracking-wide uppercase backdrop-blur-sm flex items-center gap-1.5">
                <GraduationCap size={14} /> Guided Student Mode
              </span>
              <span className="px-3 py-1 rounded-full bg-amber-400/30 text-amber-200 text-xs font-bold flex items-center gap-1">
                <Flame size={14} className="text-amber-300 animate-pulse" /> 7 Day Streak!
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Welcome back, {userName}!</h1>
            <p className="mt-1 text-emerald-100 text-sm max-w-xl">
              No quantum physics degree needed! Explore real quantum algorithms with interactive step-by-step guidance.
            </p>
          </div>

          <div className="flex items-center gap-4 bg-white/10 p-4 rounded-2xl backdrop-blur-md border border-white/20">
            <div className="text-center px-2">
              <p className="text-xs text-emerald-200 uppercase font-bold">Lab XP</p>
              <p className="text-2xl font-black text-amber-300">{points + (quizScore || 0)}</p>
            </div>
            <div className="h-8 w-px bg-white/20" />
            <div className="text-center px-2">
              <p className="text-xs text-emerald-200 uppercase font-bold">Modules</p>
              <p className="text-2xl font-black text-white">3 / 4</p>
            </div>
            <Link
              to="/app/diagnosis"
              className="px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-emerald-950 font-bold text-sm transition shadow-lg flex items-center gap-2"
            >
              <Play size={16} /> Start Today's Lab
            </Link>
          </div>
        </div>
      </div>

      {/* Guided Mode 4 Core Modules Launcher Grid */}
      <div>
        <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
          <BookOpen size={20} className="text-emerald-500" />
          Guided Quantum Modules (No-Code Educational View)
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="!p-5 border-l-4 border-l-sky-500 hover:shadow-lg transition group">
            <div className="flex items-center justify-between">
              <div className="h-10 w-10 rounded-xl bg-sky-500/10 text-sky-600 dark:text-sky-400 flex items-center justify-center">
                <Stethoscope size={22} />
              </div>
              <Tag color="sky">Grover Search</Tag>
            </div>
            <h3 className="mt-3 font-bold text-slate-900 dark:text-white text-base">Module 1: Disease Diagnosis</h3>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Select symptoms from 84 real PDF symptoms and see Grover's algorithm amplify matching conditions.
            </p>
            <div className="mt-4 flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
              <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                <CheckCircle2 size={13} /> Completed
              </span>
              <Link to="/app/diagnosis" className="text-xs font-bold text-sky-600 dark:text-sky-400 hover:underline flex items-center gap-1">
                Open Lab <ArrowRight size={12} />
              </Link>
            </div>
          </Card>

          <Card className="!p-5 border-l-4 border-l-violet-500 hover:shadow-lg transition group">
            <div className="flex items-center justify-between">
              <div className="h-10 w-10 rounded-xl bg-violet-500/10 text-violet-600 dark:text-violet-400 flex items-center justify-center">
                <FlaskConical size={22} />
              </div>
              <Tag color="violet">VQE Algorithm</Tag>
            </div>
            <h3 className="mt-3 font-bold text-slate-900 dark:text-white text-base">Module 2: Drug Docking</h3>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Select from 30 drug-protein targets (Sildenafil, Imatinib, etc.) and watch VQE compute binding energy.
            </p>
            <div className="mt-4 flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
              <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                <CheckCircle2 size={13} /> Completed
              </span>
              <Link to="/app/drug-discovery" className="text-xs font-bold text-violet-600 dark:text-violet-400 hover:underline flex items-center gap-1">
                Open Lab <ArrowRight size={12} />
              </Link>
            </div>
          </Card>

          <Card className="!p-5 border-l-4 border-l-amber-500 hover:shadow-lg transition group">
            <div className="flex items-center justify-between">
              <div className="h-10 w-10 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                <Bug size={22} />
              </div>
              <Tag color="amber">QSVM Kernel</Tag>
            </div>
            <h3 className="mt-3 font-bold text-slate-900 dark:text-white text-base">Module 3: AMR Predictor</h3>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Pick bacteria & antibiotic from 22 PDF strains to get Quantum Support Vector Machine resistance verdict.
            </p>
            <div className="mt-4 flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
              <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                <CheckCircle2 size={13} /> Completed
              </span>
              <Link to="/app/antibiotic" className="text-xs font-bold text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-1">
                Open Lab <ArrowRight size={12} />
              </Link>
            </div>
          </Card>

          <Card className="!p-5 border-l-4 border-l-emerald-500 hover:shadow-lg transition group">
            <div className="flex items-center justify-between">
              <div className="h-10 w-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <ScanLine size={22} />
              </div>
              <Tag color="emerald">QCNN Network</Tag>
            </div>
            <h3 className="mt-3 font-bold text-slate-900 dark:text-white text-base">Module 4: Medical Imaging</h3>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Upload MRI/CT scan or pick sample scan to analyze quantum vs classical CNN anomaly detection.
            </p>
            <div className="mt-4 flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
              <span className="text-xs font-semibold text-amber-600 dark:text-amber-400 flex items-center gap-1">
                In Progress
              </span>
              <Link to="/app/imaging" className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1">
                Open Lab <ArrowRight size={12} />
              </Link>
            </div>
          </Card>
        </div>
      </div>

      {/* Interactive Concept Explainers & Video Walkthrough */}
      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-slate-900 dark:text-white text-base flex items-center gap-2">
              <HelpCircle size={18} className="text-sky-500" />
              Interactive Quantum Concept Explainer
            </h3>
            <button
              onClick={() => setShowWalkthrough(true)}
              className="text-xs px-3 py-1.5 rounded-lg bg-sky-500/10 text-sky-600 dark:text-sky-400 font-bold hover:bg-sky-500/20 transition flex items-center gap-1.5"
            >
              <Video size={14} /> Watch Lab Walkthrough
            </button>
          </div>

          <div className="space-y-3">
            {CONCEPT_EXPLAINERS.map((c) => (
              <div
                key={c.id}
                className="p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 hover:border-sky-500/40 transition cursor-pointer"
                onClick={() => setSelectedConcept(selectedConcept === c.id ? null : c.id)}
              >
                <div className="flex items-center justify-between">
                  <p className="font-bold text-sm text-slate-900 dark:text-white">{c.title}</p>
                  <ChevronRight
                    size={16}
                    className={`text-slate-400 transition-transform ${selectedConcept === c.id ? 'rotate-90 text-sky-500' : ''}`}
                  />
                </div>
                {selectedConcept === c.id && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mt-3 space-y-2 text-xs">
                    <p className="text-slate-600 dark:text-slate-300">
                      <strong className="text-sky-600 dark:text-sky-400">Qiskit Concept:</strong> {c.qiskitConcept}
                    </p>
                    <p className="text-slate-600 dark:text-slate-300">
                      <strong className="text-emerald-600 dark:text-emerald-400">Everyday Analogy:</strong> {c.simpleAnalogy}
                    </p>
                    <p className="text-slate-600 dark:text-slate-300">
                      <strong className="text-violet-600 dark:text-violet-400">Medical Application:</strong> {c.medicalUse}
                    </p>
                    <div className="pt-2 flex items-center justify-between border-t border-slate-200/50 dark:border-slate-800">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          const idx = QUANTUM_VIDEO_LESSONS.findIndex((v) => v.id === c.id);
                          if (idx !== -1) {
                            setWalkthroughStep(idx);
                            setShowWalkthrough(true);
                          }
                        }}
                        className="px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white font-bold text-[11px] transition flex items-center gap-1.5 shadow-sm"
                      >
                        <Video size={13} /> Watch Video Lesson
                      </button>
                      <a
                        href={QUANTUM_VIDEO_LESSONS.find((v) => v.id === c.id)?.youtubeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="text-slate-500 hover:text-red-600 dark:text-slate-400 dark:hover:text-red-400 font-semibold text-[11px] flex items-center gap-1"
                      >
                        YouTube <ExternalLink size={11} />
                      </a>
                    </div>
                  </motion.div>
                )}
              </div>
            ))}
          </div>
        </Card>

        {/* AI Guide Chatbot (Bilingual: Hindi / English) */}
        <Card className="flex flex-col h-[420px]">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <MessageSquare size={18} className="text-emerald-500" />
              <h3 className="font-bold text-slate-900 dark:text-white text-sm">AI Study Guide Chatbot</h3>
            </div>
            <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-0.5 rounded-lg text-[11px] font-bold">
              <button
                onClick={() => setChatLang('en')}
                className={`px-2 py-0.5 rounded ${chatLang === 'en' ? 'bg-white dark:bg-slate-700 text-sky-600 shadow-sm' : 'text-slate-400'}`}
              >
                English
              </button>
              <button
                onClick={() => setChatLang('hi')}
                className={`px-2 py-0.5 rounded ${chatLang === 'hi' ? 'bg-white dark:bg-slate-700 text-emerald-600 shadow-sm' : 'text-slate-400'}`}
              >
                Hindi
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto py-3 space-y-3 pr-1 text-xs">
            {chatMessages.map((m, i) => (
              <div
                key={i}
                className={`p-3 rounded-2xl max-w-[85%] ${
                  m.sender === 'user'
                    ? 'ml-auto bg-sky-500 text-white rounded-br-none font-medium'
                    : 'bg-slate-100 dark:bg-slate-800/80 text-slate-800 dark:text-slate-200 rounded-bl-none border border-slate-200/50 dark:border-slate-700 leading-relaxed'
                }`}
              >
                {m.text}
              </div>
            ))}
            {chatThinking && (
              <div className="p-2.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 max-w-[70%] text-[11px] text-emerald-700 dark:text-emerald-300 font-semibold flex items-center gap-2">
                <Sparkles size={14} className="animate-spin text-emerald-500" />
                <span>Q-MedLab AI is generating real-time response...</span>
              </div>
            )}
          </div>

          {/* Quick Suggestion Question Chips */}
          <div className="py-1.5 flex flex-wrap gap-1 border-t border-slate-100 dark:border-slate-800">
            {[
              { label: '🧠 Grover Search', q: 'How does Grover search work?' },
              { label: '🧪 VQE Docking', q: 'What is VQE binding energy?' },
              { label: '🧫 QSVM Resistance', q: 'How does QSVM predict antibiotic resistance?' },
              { label: '🔬 MRI y702.jpg', q: 'How does QCNN classify MRI image y702.jpg?' },
            ].map((chip, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(chip.q)}
                className="px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800/60 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 text-[10px] text-slate-600 dark:text-slate-400 hover:text-emerald-600 font-medium transition border border-slate-200/60 dark:border-slate-700/60"
              >
                {chip.label}
              </button>
            ))}
          </div>

          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex gap-2">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder={chatLang === 'hi' ? 'Sawaal poochhein... (e.g. VQE kya hai?)' : 'Ask anything... (e.g. How does Grover work?)'}
              className="input-field text-xs flex-1"
            />
            <button onClick={() => handleSendMessage()} disabled={chatThinking || !chatInput.trim()} className="btn-primary !px-3 !py-1.5 text-xs">
              Send
            </button>
          </div>
        </Card>
      </div>

      {/* Video Walkthrough Modal */}

      {/* Guided Video Walkthrough Modal */}
      <AnimatePresence>
        {showWalkthrough && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 max-w-2xl w-full space-y-4 shadow-2xl"
            >
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <Video size={22} className="text-red-500 animate-pulse" />
                  <h3 className="font-extrabold text-slate-900 dark:text-white text-base">
                    Q-MedLab Guided Quantum Video Lessons
                  </h3>
                </div>
                <button
                  onClick={() => setShowWalkthrough(false)}
                  className="text-slate-400 hover:text-slate-600 dark:hover:text-white text-sm font-bold"
                >
                  ✕
                </button>
              </div>

              {/* Algorithm Video Selector Tabs */}
              <div className="flex flex-wrap gap-1.5 bg-slate-100 dark:bg-slate-800/60 p-1 rounded-xl text-xs">
                {QUANTUM_VIDEO_LESSONS.map((lesson, idx) => (
                  <button
                    key={lesson.id}
                    onClick={() => setWalkthroughStep(idx)}
                    className={`px-3 py-1.5 rounded-lg font-bold transition flex items-center gap-1 ${
                      walkthroughStep === idx
                        ? 'bg-white dark:bg-slate-700 text-sky-600 dark:text-sky-300 shadow-sm'
                        : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    <span>{lesson.title.split('—')[0].trim()}</span>
                  </button>
                ))}
              </div>

              {/* YouTube Video Player Embed */}
              <div className="aspect-video bg-slate-950 rounded-2xl overflow-hidden shadow-lg border border-slate-800 relative">
                <iframe
                  src={QUANTUM_VIDEO_LESSONS[walkthroughStep].embedUrl}
                  title={QUANTUM_VIDEO_LESSONS[walkthroughStep].title}
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              </div>

              {/* Video Information & Topic Breakdown */}
              <div className="space-y-2 text-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">
                    {QUANTUM_VIDEO_LESSONS[walkthroughStep].title}
                  </h4>
                  <a
                    href={QUANTUM_VIDEO_LESSONS[walkthroughStep].youtubeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-[11px] transition shadow-sm w-fit"
                  >
                    <ExternalLink size={13} /> Open in YouTube
                  </a>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800">
                  <p className="font-semibold text-sky-600 dark:text-sky-400 mb-0.5">
                    🎥 Video Topic Focus:
                  </p>
                  <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                    {QUANTUM_VIDEO_LESSONS[walkthroughStep].topic}
                  </p>
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  disabled={walkthroughStep === 0}
                  onClick={() => setWalkthroughStep((prev) => Math.max(0, prev - 1))}
                  className="btn-ghost text-xs"
                >
                  Previous Video
                </button>
                <span className="text-xs font-semibold text-slate-400">
                  Video {walkthroughStep + 1} of 4
                </span>
                <button
                  disabled={walkthroughStep === 3}
                  onClick={() => setWalkthroughStep((prev) => Math.min(3, prev + 1))}
                  className="btn-primary text-xs"
                >
                  Next Video
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
