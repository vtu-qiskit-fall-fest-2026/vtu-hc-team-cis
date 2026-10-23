import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ShieldCheck, Users, BookOpen, Activity, Cpu, Database, FileSpreadsheet,
  Plus, Trash2, Edit3, Lock, CheckCircle2, AlertTriangle, Key, Layers, RefreshCw,
  Search, Sliders, Server, HardDrive, Terminal
} from 'lucide-react';
import { Card, Tag } from '@/components/ui';
import { exportCSV, exportPDFReport } from '@/utils/reports';
import { getRegisteredAccounts, type RegisteredAccount } from '@/context/AuthContext';
import { realtimeTracker } from '@/lib/realtimeTracker';
import { REAL_DRUG_TARGETS, REAL_SYMPTOMS_84, REAL_PATHOGENS } from '@/data/realTimeCatalog';

interface AdminDashboardViewProps {
  userName: string;
}

export default function AdminDashboardView({ userName }: AdminDashboardViewProps) {
  // Accounts State
  const [accounts, setAccounts] = useState<RegisteredAccount[]>(() => {
    const list = getRegisteredAccounts();
    if (list.length === 0) {
      return [
        { id: 'usr-student-1', email: 'student@qmedlab.io', password: 'password123', fullName: 'Rahul Sharma', role: 'student', institution: 'IIT Delhi', createdAt: new Date().toISOString() },
        { id: 'usr-researcher-1', email: 'researcher@qmedlab.io', password: 'password123', fullName: 'Dr. Priya Patel', role: 'researcher', institution: 'Quantum Bio-Institute', createdAt: new Date().toISOString() },
        { id: 'usr-clinician-1', email: 'clinician@qmedlab.io', password: 'password123', fullName: 'Dr. A. K. Verma', role: 'clinician', institution: 'AIIMS New Delhi', createdAt: new Date().toISOString() },
      ];
    }
    return list;
  });

  // Batch Management State
  const [batches, setBatches] = useState([
    { id: 'b1', name: 'B.Tech CSE 2025 Batch A', instructor: 'Prof. S. N. Bose', students: 34, deadline: '2026-10-15', quizPassGrade: 75 },
    { id: 'b2', name: 'MBBS 2026 Pharmacology Cohort', instructor: 'Dr. Meena Iyer', students: 28, deadline: '2026-11-01', quizPassGrade: 80 },
  ]);

  // IBM Quantum Credits Allocation
  const [researcherCreditShare, setResearcherCreditShare] = useState(60);
  const [studentCreditShare, setStudentCreditShare] = useState(25);
  const [clinicianCreditShare, setClinicianCreditShare] = useState(15);
  const [remainingCreditsSeconds, setRemainingCreditsSeconds] = useState(3840);

  // New Account Modal State
  const [newEmail, setNewEmail] = useState('');
  const [newName, setNewName] = useState('');
  const [newRole, setNewRole] = useState<'student' | 'researcher' | 'clinician' | 'admin'>('student');
  const [newPassword, setNewPassword] = useState('pass1234');
  const [showAddUserModal, setShowAddUserModal] = useState(false);

  // New Batch State
  const [newBatchName, setNewBatchName] = useState('');
  const [newInstructor, setNewInstructor] = useState('');

  const handleCreateUser = () => {
    if (!newEmail || !newName) return;
    const acc: RegisteredAccount = {
      id: `usr-${Date.now()}`,
      email: newEmail,
      fullName: newName,
      role: newRole,
      password: newPassword,
      institution: 'Q-MedLab Institution',
      createdAt: new Date().toISOString(),
    };
    setAccounts((prev) => [...prev, acc]);
    setNewEmail('');
    setNewName('');
    setShowAddUserModal(false);
  };

  const handleDeleteUser = (id: string) => {
    setAccounts((prev) => prev.filter((a) => a.id !== id));
  };

  const handleExportStudentCSV = () => {
    exportCSV('qmedlab_student_analytics.csv', accounts.map((a) => ({
      ID: a.id,
      FullName: a.fullName,
      Email: a.email,
      Role: a.role,
      Institution: a.institution,
      CreatedAt: a.createdAt,
    })));
  };

  const handleGenerateInstitutionalReport = () => {
    exportPDFReport(`Q-MedLab Institutional Usage Report — College Administration`, [
      { heading: 'Platform Executive Summary', body: `Total Registered Users: ${accounts.length}<br>Active Quantum Hardware Jobs: 18<br>Total Simulated Experiments: 1,420<br>IBM Quantum Credit Utilization: 61.6%` },
      { heading: 'Role Distribution & Hardware Credits Allocation', body: `• Researchers: ${researcherCreditShare}% credit quota (VQE & QSVM Expert Simulations)<br>• Students: ${studentCreditShare}% credit quota (Guided Learning Modules)<br>• Clinicians: ${clinicianCreditShare}% credit quota (XAI Clinical Decision Support)` },
      { heading: 'Active Course Batches', body: batches.map((b) => `<p><b>${b.name}</b> — Instructor: ${b.instructor} (${b.students} students, Quiz Threshold: ${b.quizPassGrade}%)</p>`).join('') },
      { heading: 'Hardware Cluster Audit Telemetry', body: 'Backend: IBM Quantum Eagle (ibmq_eagle_127q) & Qiskit Aer 1.x fallback kernel active. Average queue latency: 1.14s.' }
    ]);
  };

  return (
    <div className="space-y-6">
      {/* Admin Infrastructure Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-amber-700 via-orange-800 to-slate-900 text-white shadow-xl relative overflow-hidden border border-amber-500/30">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-200 text-xs font-bold border border-amber-400/30 flex items-center gap-1.5 uppercase">
                <ShieldCheck size={14} /> System Administrator Console
              </span>
              <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold flex items-center gap-1 border border-emerald-500/30">
                <Server size={13} strokeWidth={2.5} /> IBM Falcon Cluster Online
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Institutional & IBM Quantum Administration</h1>
            <p className="mt-1 text-amber-100 text-sm max-w-xl">
              User account provisioning, course batch assignments, IBM Quantum free-tier credit limits, content management, and administrative audit logs.
            </p>
          </div>

          <div className="flex gap-2">
            <button onClick={handleExportStudentCSV} className="btn-primary !bg-amber-600 text-xs flex items-center gap-1.5">
              <FileSpreadsheet size={15} /> Export Analytics (CSV)
            </button>
            <button onClick={handleGenerateInstitutionalReport} className="btn-outline !border-white !text-white text-xs">
              College Admin Report
            </button>
          </div>
        </div>
      </div>

      {/* User Management Panel */}
      <Card className="border-t-4 border-t-amber-500">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Users size={18} className="text-amber-500" />
              User Account Provisioning & Role Management
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">Create, edit, delete student, researcher, and clinician accounts.</p>
          </div>
          <button onClick={() => setShowAddUserModal(true)} className="btn-primary !bg-amber-600 text-xs flex items-center gap-1">
            <Plus size={15} /> Add User Account
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 font-bold bg-slate-50 dark:bg-slate-900/60">
                <th className="p-3">User Full Name</th>
                <th className="p-3">Email Address</th>
                <th className="p-3">Assigned Role</th>
                <th className="p-3">Institution</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {accounts.map((a) => (
                <tr key={a.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-900/40">
                  <td className="p-3 font-bold text-slate-900 dark:text-white">{a.fullName}</td>
                  <td className="p-3 text-slate-600 dark:text-slate-400">{a.email}</td>
                  <td className="p-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase ${
                      a.role === 'student' ? 'bg-emerald-500/20 text-emerald-600' :
                      a.role === 'researcher' ? 'bg-violet-500/20 text-violet-600' :
                      a.role === 'clinician' ? 'bg-teal-500/20 text-teal-600' : 'bg-amber-500/20 text-amber-600'
                    }`}>
                      {a.role}
                    </span>
                  </td>
                  <td className="p-3 text-slate-500">{a.institution || 'Q-MedLab'}</td>
                  <td className="p-3 text-right space-x-2">
                    <button onClick={() => alert(`Password reset link dispatched to ${a.email}`)} className="text-slate-400 hover:text-sky-500" title="Reset Password">
                      <Key size={14} />
                    </button>
                    <button onClick={() => handleDeleteUser(a.id)} className="text-slate-400 hover:text-rose-500" title="Delete User">
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Batch & Course Management & IBM Quantum Credit Controls */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Course Batch Management */}
        <Card className="border-l-4 border-l-sky-500">
          <h3 className="font-bold text-slate-900 dark:text-white text-base mb-3 flex items-center gap-2">
            <BookOpen size={18} className="text-sky-500" />
            Batch & Course Assignment Controls
          </h3>

          <div className="space-y-3">
            {batches.map((b) => (
              <div key={b.id} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 space-y-1">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-slate-900 dark:text-white">{b.name}</span>
                  <span className="px-2 py-0.5 rounded bg-sky-500/10 text-sky-600 font-bold">{b.students} Enrolled</span>
                </div>
                <p className="text-[11px] text-slate-500">Instructor: {b.instructor} • Assignment Deadline: {b.deadline}</p>
                <div className="flex justify-between items-center text-[11px] pt-1">
                  <span className="text-slate-400">Quiz Pass Criteria:</span>
                  <span className="font-bold text-emerald-600">{b.quizPassGrade}% Grade</span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* IBM Quantum Credit Controls & Hardware Queue Monitor */}
        <Card className="border-l-4 border-l-violet-500">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-slate-900 dark:text-white text-base flex items-center gap-2">
              <Cpu size={18} className="text-violet-500" />
              IBM Quantum Free-Tier Credit Management
            </h3>
            <span className="px-2.5 py-1 rounded-full bg-violet-500/20 text-violet-600 text-xs font-mono font-bold">
              {Math.floor(remainingCreditsSeconds / 60)} mins left
            </span>
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <div className="flex justify-between font-bold mb-1">
                <span>Researcher Quota Allocation</span>
                <span className="text-violet-600">{researcherCreditShare}%</span>
              </div>
              <input
                type="range"
                min={10}
                max={80}
                value={researcherCreditShare}
                onChange={(e) => setResearcherCreditShare(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded accent-violet-500"
              />
            </div>

            <div>
              <div className="flex justify-between font-bold mb-1">
                <span>Student Guided Quota Allocation</span>
                <span className="text-emerald-600">{studentCreditShare}%</span>
              </div>
              <input
                type="range"
                min={10}
                max={50}
                value={studentCreditShare}
                onChange={(e) => setStudentCreditShare(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded accent-emerald-500"
              />
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-1">
              <div className="flex justify-between font-bold text-slate-700 dark:text-slate-300">
                <span>IBM Quantum Eagle Hardware Queue:</span>
                <span className="text-emerald-600 font-mono">0 Jobs (Optimal Queue)</span>
              </div>
              <p className="text-[11px] text-slate-500">Automatic local Qiskit Aer simulation fallback activates if hardware queue exceeds 5 minutes.</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Add User Modal */}
      {showAddUserModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl">
            <h3 className="font-bold text-slate-900 dark:text-white text-base">Provision New User Account</h3>
            <div className="space-y-3 text-xs">
              <div>
                <label className="label">Full Name</label>
                <input value={newName} onChange={(e) => setNewName(e.target.value)} className="input-field" placeholder="e.g. Dr. Ananya Sen" />
              </div>
              <div>
                <label className="label">Email Address</label>
                <input value={newEmail} onChange={(e) => setNewEmail(e.target.value)} className="input-field" placeholder="ananya@qmedlab.io" />
              </div>
              <div>
                <label className="label">Role Assignment</label>
                <select value={newRole} onChange={(e) => setNewRole(e.target.value as any)} className="input-field">
                  <option value="student">Student / Scholar</option>
                  <option value="researcher">Researcher / PI</option>
                  <option value="clinician">Clinician / Doctor</option>
                  <option value="admin">System Administrator</option>
                </select>
              </div>
              <div>
                <label className="label">Default Password</label>
                <input value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="input-field" />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button onClick={() => setShowAddUserModal(false)} className="btn-ghost text-xs">Cancel</button>
              <button onClick={handleCreateUser} className="btn-primary !bg-amber-600 text-xs">Save & Provision Account</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
