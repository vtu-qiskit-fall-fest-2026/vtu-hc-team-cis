import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Send, UserPlus, CheckSquare, MessageSquare, Copy, Check, Shield, Activity } from 'lucide-react';
import { Tag } from '@/components/ui';
import { realtimeTracker, type ActiveUserSession } from '@/lib/realtimeTracker';

interface ChatMessage {
  id: string;
  sender: string;
  role: 'PI' | 'Collaborator';
  text: string;
  time: string;
}

interface Task {
  id: string;
  title: string;
  assignedTo: string;
  completed: boolean;
}

const CHAT_STORAGE_KEY = 'qmedlab_live_chat_v1';

export default function CollaborativeLabPanel() {
  const [sessionCode] = useState<string>('QML-LAB-8924');
  const [copiedCode, setCopiedCode] = useState<boolean>(false);
  const [inviteEmail, setInviteEmail] = useState<string>('');
  const [inviteSent, setInviteSent] = useState<boolean>(false);
  const [activeUsers, setActiveUsers] = useState<ActiveUserSession[]>(realtimeTracker.getActiveUsers());

  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    try {
      const saved = localStorage.getItem(CHAT_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch {}
    return [
      { id: '1', sender: 'Dr. A. Sharma', role: 'PI', text: 'Welcome team! Let’s optimize the VQE ansatz depth for COVID-19 Mpro inhibitor.', time: '14:30' },
      { id: '2', sender: 'PhD Scholar R. Verma', role: 'Collaborator', text: 'I updated the active space Hamiltonian to 8 qubits. Chemical accuracy looks solid!', time: '14:32' },
      { id: '3', sender: 'Postdoc E. Vance', role: 'Collaborator', text: 'Injecting depolarizing noise model now to check hardware fidelity.', time: '14:35' },
    ];
  });

  const [inputMsg, setInputMsg] = useState<string>('');

  const [tasks, setTasks] = useState<Task[]>([
    { id: 't1', title: 'Prepare 8-qubit PySCF molecular Hamiltonian', assignedTo: 'PhD Scholar R. Verma', completed: true },
    { id: 't2', title: 'Run NISQ depolarizing noise simulation (p = 0.02)', assignedTo: 'Postdoc E. Vance', completed: true },
    { id: 't3', title: 'Export IEEE methodology .TEX section for journal', assignedTo: 'Dr. A. Sharma (PI)', completed: false },
  ]);

  // Subscribe to real-time user tracker updates
  useEffect(() => {
    const unsubscribe = realtimeTracker.subscribe(() => {
      setActiveUsers(realtimeTracker.getActiveUsers());
    });
    return () => unsubscribe();
  }, []);

  // Save chat to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(messages));
    } catch {}
  }, [messages]);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(sessionCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleSendMsg = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMsg.trim()) return;
    const newMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'Lead Researcher (You)',
      role: 'PI',
      text: inputMsg,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, newMsg]);
    setInputMsg('');
  };

  const handleToggleTask = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail) return;
    setInviteSent(true);
    setTimeout(() => setInviteSent(false), 3000);
    setInviteEmail('');
  };

  return (
    <div className="p-6 rounded-3xl bg-slate-900/90 border border-cyan-500/30 shadow-2xl backdrop-blur-xl space-y-6">
      {/* Top Session Bar */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[11px] font-mono font-bold uppercase tracking-wider border border-emerald-500/30 flex items-center gap-1">
              <Users size={12} /> Live Session Active ({activeUsers.length} Online)
            </span>
            <Tag color="cyan">PI Permission</Tag>
          </div>
          <h2 className="text-xl font-black text-white flex items-center gap-2">
            Collaborative Multi-User Research Lab
          </h2>
        </div>

        {/* Join Code & Invite Button */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 p-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono">
            <span className="text-slate-400 pl-2">CODE:</span>
            <span className="font-extrabold text-cyan-400">{sessionCode}</span>
            <button onClick={handleCopyCode} className="p-1 rounded bg-slate-800 text-slate-300 hover:text-white transition">
              {copiedCode ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
            </button>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-6">
        {/* Left: Real-Time Chat Panel */}
        <div className="lg:col-span-7 p-4 rounded-2xl bg-slate-950/90 border border-slate-800 flex flex-col justify-between h-96">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
              <MessageSquare size={14} className="text-cyan-400" /> Lab Live Chat Room
            </span>
            <span className="text-[10px] text-slate-500 font-mono">Encrypted via QKD</span>
          </div>

          {/* Messages Feed */}
          <div className="space-y-3 overflow-y-auto py-3 pr-2 flex-1 font-sans text-xs">
            {messages.map((m) => (
              <div key={m.id} className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-bold text-cyan-400 flex items-center gap-1">
                    {m.sender} <span className="text-[9px] px-1.5 py-0.2 rounded bg-cyan-950 text-cyan-300 font-mono border border-cyan-800">{m.role}</span>
                  </span>
                  <span className="text-slate-500 font-mono text-[10px]">{m.time}</span>
                </div>
                <p className="text-slate-200">{m.text}</p>
              </div>
            ))}
          </div>

          {/* Input Bar */}
          <form onSubmit={handleSendMsg} className="flex gap-2 pt-2 border-t border-slate-800">
            <input
              type="text"
              value={inputMsg}
              onChange={(e) => setInputMsg(e.target.value)}
              placeholder="Type message to co-researchers in real-time..."
              className="flex-1 px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-cyan-500 transition"
            />
            <button type="submit" className="px-3 py-2 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs hover:bg-cyan-400 transition">
              <Send size={14} />
            </button>
          </form>
        </div>

        {/* Right: Active Users & PI Task Assignments */}
        <div className="lg:col-span-5 space-y-4">
          {/* Active Co-Researchers List */}
          <div className="p-4 rounded-2xl bg-slate-950/90 border border-slate-800 space-y-3">
            <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
              <Activity size={14} className="text-emerald-400" /> Active Online Researchers ({activeUsers.length})
            </h4>
            <div className="space-y-1.5 max-h-32 overflow-y-auto pr-1">
              {activeUsers.slice(0, 4).map((u) => (
                <div key={u.id} className="p-2 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping shrink-0" />
                    <div>
                      <p className="font-bold text-white text-[11px]">{u.name}</p>
                      <p className="text-[10px] text-slate-400">{u.institution}</p>
                    </div>
                  </div>
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-slate-800 text-cyan-300 font-mono">
                    {u.status}
                  </span>
                </div>
              ))}
            </div>

            {/* Invite Form */}
            <form onSubmit={handleInvite} className="flex gap-2 pt-2 border-t border-slate-800">
              <input
                type="email"
                required
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                placeholder="co-researcher@institution.edu"
                className="flex-1 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-cyan-500"
              />
              <button type="submit" className="px-3 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold transition">
                Invite
              </button>
            </form>
            {inviteSent && (
              <p className="text-[11px] text-emerald-400 font-semibold">
                ✓ Invite dispatched to {inviteEmail}
              </p>
            )}
          </div>

          {/* PI Task Delegation List */}
          <div className="p-4 rounded-2xl bg-slate-950/90 border border-slate-800 space-y-3">
            <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
              <CheckSquare size={14} className="text-cyan-400" /> PI Task Delegation
            </h4>

            <div className="space-y-2 text-xs">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  onClick={() => handleToggleTask(task.id)}
                  className={`p-2.5 rounded-xl border transition cursor-pointer flex items-start gap-2.5 ${
                    task.completed
                      ? 'bg-slate-900/40 border-slate-800 opacity-60'
                      : 'bg-slate-900 border-cyan-500/30'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => {}}
                    className="mt-0.5 rounded border-slate-700 bg-slate-950 text-cyan-500 focus:ring-0"
                  />
                  <div>
                    <p className={`font-semibold ${task.completed ? 'line-through text-slate-400' : 'text-white'}`}>
                      {task.title}
                    </p>
                    <span className="text-[10px] text-cyan-400 block mt-0.5">Assigned: {task.assignedTo}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

