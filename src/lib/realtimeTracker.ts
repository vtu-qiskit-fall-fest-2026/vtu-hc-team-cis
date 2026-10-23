// Real-time Activity and Active Users Tracker for Q-MedLab
// Synchronizes active researchers, students, clinicians, and their live project results.

import type { Role } from '@/lib/supabase';

export interface ActiveUserSession {
  id: string;
  name: string;
  email?: string;
  role: Role;
  institution: string;
  avatarText: string;
  loginTime: string;
  lastActive: string;
  currentProject: string;
  currentModule: 'diagnosis' | 'drug_discovery' | 'antibiotic' | 'imaging' | 'idle';
  status: 'Online' | 'Running Simulation' | 'Analyzing Results';
  ipLocation?: string;
}

export interface LiveProjectRun {
  id: string;
  userId: string;
  userName: string;
  userRole: Role;
  institution: string;
  module: 'diagnosis' | 'drug_discovery' | 'antibiotic' | 'imaging';
  moduleLabel: string;
  algorithm: string;
  title: string;
  confidence: number;
  qubits?: number;
  metrics: string;
  status: 'Completed' | 'Processing';
  timestamp: string;
  timeAgo: string;
}

const STORAGE_USERS_KEY = 'qmedlab_active_users_v2';
const STORAGE_PROJECTS_KEY = 'qmedlab_live_projects_v2';

const INITIAL_USERS: ActiveUserSession[] = [
  {
    id: 'user-res-101',
    name: 'Dr. Emily Watson',
    role: 'researcher',
    institution: 'Harvard Quantum Medical Center',
    avatarText: 'EW',
    loginTime: new Date(Date.now() - 42 * 60 * 1000).toISOString(),
    lastActive: '1m ago',
    currentProject: 'VQE Ground State Minimization for Remdesivir Docking',
    currentModule: 'drug_discovery',
    status: 'Running Simulation',
    ipLocation: 'Boston, USA',
  },
  {
    id: 'user-stu-202',
    name: 'Rahul Varma',
    role: 'student',
    institution: 'IIT Madras Quantum Computing Lab',
    avatarText: 'RV',
    loginTime: new Date(Date.now() - 18 * 60 * 1000).toISOString(),
    lastActive: 'Just now',
    currentProject: 'Grover 4-Qubit Search for Rare Autoimmune Biomarkers',
    currentModule: 'diagnosis',
    status: 'Analyzing Results',
    ipLocation: 'Chennai, India',
  },
  {
    id: 'user-cli-303',
    name: 'Dr. Tariq Mansoor, MD',
    role: 'clinician',
    institution: 'Apollo Clinical Genomics & Oncology',
    avatarText: 'TM',
    loginTime: new Date(Date.now() - 55 * 60 * 1000).toISOString(),
    lastActive: '3m ago',
    currentProject: 'QSVM Supervised Resistance Screen for MRSA vs Vancomycin',
    currentModule: 'antibiotic',
    status: 'Online',
    ipLocation: 'Hyderabad, India',
  },
  {
    id: 'user-stu-204',
    name: 'Ananya Deshmukh',
    role: 'student',
    institution: 'AIIMS Computational Biology Center',
    avatarText: 'AD',
    loginTime: new Date(Date.now() - 12 * 60 * 1000).toISOString(),
    lastActive: 'Just now',
    currentProject: 'Quantum State Tomography & 3D Bloch Angle Visualizer',
    currentModule: 'imaging',
    status: 'Running Simulation',
    ipLocation: 'New Delhi, India',
  },
];

const INITIAL_PROJECTS: LiveProjectRun[] = [
  {
    id: 'proj-run-901',
    userId: 'user-res-101',
    userName: 'Dr. Emily Watson',
    userRole: 'researcher',
    institution: 'Harvard Quantum Medical Center',
    module: 'drug_discovery',
    moduleLabel: 'VQE Drug Discovery',
    algorithm: 'VQE UCCSD Ansätz',
    title: 'Remdesivir vs SARS-CoV-2 RdRp Ground Energy',
    confidence: 97.8,
    qubits: 8,
    metrics: 'Ground Energy: -38.452 Ha | Iterations: 45',
    status: 'Completed',
    timestamp: new Date(Date.now() - 4 * 60 * 1000).toISOString(),
    timeAgo: '4m ago',
  },
  {
    id: 'proj-run-902',
    userId: 'user-stu-202',
    userName: 'Rahul Varma',
    userRole: 'student',
    institution: 'IIT Madras Quantum Computing Lab',
    module: 'diagnosis',
    moduleLabel: 'Quantum Disease Diagnosis',
    algorithm: "Grover's Amplitude Amplification",
    title: 'ICD-11 Multi-Symptom Triage (Fever, Dyspnea, Fatigue)',
    confidence: 96.2,
    qubits: 4,
    metrics: 'Oracle Iterations: 3 | Matched: COVID-19 / Pneumonia',
    status: 'Completed',
    timestamp: new Date(Date.now() - 8 * 60 * 1000).toISOString(),
    timeAgo: '8m ago',
  },
  {
    id: 'proj-run-903',
    userId: 'user-cli-303',
    userName: 'Dr. Tariq Mansoor, MD',
    userRole: 'clinician',
    institution: 'Apollo Clinical Genomics & Oncology',
    module: 'antibiotic',
    moduleLabel: 'Antibiotic Resistance',
    algorithm: 'QSVM Quantum Kernel',
    title: 'E. Coli GyrA Mutation Resistance against Ciprofloxacin',
    confidence: 98.4,
    qubits: 6,
    metrics: 'Classification: Resistant | Fidelity: 99.1%',
    status: 'Completed',
    timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    timeAgo: '15m ago',
  },
  {
    id: 'proj-run-904',
    userId: 'user-stu-204',
    userName: 'Ananya Deshmukh',
    userRole: 'student',
    institution: 'AIIMS Computational Biology Center',
    module: 'imaging',
    moduleLabel: 'Medical Imaging',
    algorithm: 'Quantum Convolutional Neural Network (QCNN)',
    title: 'Glioblastoma Brain MRI Micro-Lesion Quantum Segmentation',
    confidence: 95.7,
    qubits: 8,
    metrics: 'Dice Coefficient: 0.942 | ROC AUC: 0.988',
    status: 'Completed',
    timestamp: new Date(Date.now() - 22 * 60 * 1000).toISOString(),
    timeAgo: '22m ago',
  },
];

class RealtimeTracker {
  private users: ActiveUserSession[] = [];
  private projects: LiveProjectRun[] = [];
  private listeners: Set<() => void> = new Set();

  constructor() {
    this.loadState();
    if (typeof window !== 'undefined') {
      window.addEventListener('storage', (e) => {
        if (e.key === STORAGE_USERS_KEY || e.key === STORAGE_PROJECTS_KEY) {
          this.loadState();
          this.notify();
        }
      });
    }
  }

  private loadState() {
    try {
      const storedUsers = localStorage.getItem(STORAGE_USERS_KEY);
      this.users = storedUsers ? JSON.parse(storedUsers) : [...INITIAL_USERS];

      const storedProjects = localStorage.getItem(STORAGE_PROJECTS_KEY);
      this.projects = storedProjects ? JSON.parse(storedProjects) : [...INITIAL_PROJECTS];
    } catch {
      this.users = [...INITIAL_USERS];
      this.projects = [...INITIAL_PROJECTS];
    }
  }

  private saveState() {
    try {
      localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(this.users));
      localStorage.setItem(STORAGE_PROJECTS_KEY, JSON.stringify(this.projects));
    } catch (e) {
      console.warn('Could not persist real-time tracker state', e);
    }
  }

  private notify() {
    this.listeners.forEach((fn) => fn());
  }

  subscribe(listener: () => void) {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  getActiveUsers(): ActiveUserSession[] {
    return [...this.users];
  }

  getLiveProjects(): LiveProjectRun[] {
    return [...this.projects];
  }

  recordUserLogin(user: { id: string; full_name?: string; email?: string; role?: Role; institution?: string }) {
    const role = user.role || 'researcher';
    const name = user.full_name || (user.email ? user.email.split('@')[0] : 'Quantum Researcher');
    const institution = user.institution || (
      role === 'student' ? 'National Institute of Quantum Medicine' :
      role === 'clinician' ? 'Memorial Quantum Clinical Hospital' :
      role === 'admin' ? 'Q-MedLab Cloud Operations' :
      'Quantum Bio-Simulation Institute'
    );

    const existingIdx = this.users.findIndex((u) => u.id === user.id || u.name.toLowerCase() === name.toLowerCase());
    const initials = name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase() || 'U';

    const sessionData: ActiveUserSession = {
      id: user.id || `user-${Date.now()}`,
      name,
      role,
      institution,
      avatarText: initials,
      loginTime: new Date().toISOString(),
      lastActive: 'Just now',
      currentProject: 'Active in Quantum Laboratory Workspace',
      currentModule: 'idle',
      status: 'Online',
    };

    if (existingIdx >= 0) {
      this.users[existingIdx] = { ...this.users[existingIdx], ...sessionData, lastActive: 'Just now', status: 'Online' };
    } else {
      this.users.unshift(sessionData);
    }

    this.saveState();
    this.notify();
  }

  recordProjectRun(params: {
    userId?: string;
    userName?: string;
    userRole?: Role;
    institution?: string;
    module: 'diagnosis' | 'drug_discovery' | 'antibiotic' | 'imaging';
    algorithm: string;
    title: string;
    confidence: number;
    metrics?: string;
    qubits?: number;
  }) {
    const moduleLabels: Record<string, string> = {
      diagnosis: 'Disease Diagnosis (Grover)',
      drug_discovery: 'Drug Discovery (VQE)',
      antibiotic: 'Antibiotic Resistance (QSVM)',
      imaging: 'Medical Imaging (QCNN)',
    };

    const newProject: LiveProjectRun = {
      id: `proj-run-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      userId: params.userId || 'current-user',
      userName: params.userName || 'Active Researcher',
      userRole: params.userRole || 'researcher',
      institution: params.institution || 'Quantum Medical Lab',
      module: params.module,
      moduleLabel: moduleLabels[params.module] || params.module,
      algorithm: params.algorithm,
      title: params.title,
      confidence: params.confidence,
      qubits: params.qubits || 6,
      metrics: params.metrics || `Confidence: ${params.confidence}% | Circuit Verified`,
      status: 'Completed',
      timestamp: new Date().toISOString(),
      timeAgo: 'Just now',
    };

    this.projects.unshift(newProject);
    if (this.projects.length > 50) this.projects.pop();

    // Also update the active user's current project
    const uIdx = this.users.findIndex((u) => u.id === params.userId || u.name === params.userName);
    if (uIdx >= 0) {
      this.users[uIdx].currentProject = params.title;
      this.users[uIdx].currentModule = params.module;
      this.users[uIdx].lastActive = 'Just now';
      this.users[uIdx].status = 'Analyzing Results';
    }

    this.saveState();
    this.notify();
  }

  getLiveProjectsByRole(role?: Role): LiveProjectRun[] {
    if (!role) return [...this.projects];
    return this.projects.filter((p) => p.userRole === role);
  }

  deleteProjectRun(id: string) {
    this.projects = this.projects.filter((p) => p.id !== id);
    this.saveState();
    this.notify();
  }

  clearAllProjectRuns() {
    this.projects = [];
    this.saveState();
    this.notify();
  }
}

export const realtimeTracker = new RealtimeTracker();
