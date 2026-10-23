import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Tag as TagIcon, Plus, Share2, StickyNote, Trash2, Check } from 'lucide-react';
import { Tag } from '@/components/ui';

interface Note {
  id: string;
  title: string;
  tag: 'drug-docking' | 'VQE-test' | 'NISQ-noise' | 'final-results';
  noteText: string;
  date: string;
}

export default function ExperimentLabNotebook() {
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const [notes, setNotes] = useState<Note[]>([
    {
      id: 'NOTE-101',
      title: 'Mpro COVID Inhibitor VQE Convergence',
      tag: 'drug-docking',
      noteText: 'Increasing ansatz depth to 4 achieved -1.137 Hartree binding energy. Chemical accuracy threshold satisfied.',
      date: '2026-09-21 14:15',
    },
    {
      id: 'NOTE-102',
      title: 'Depolarizing Noise Benchmarking on IBM Eagle',
      tag: 'NISQ-noise',
      noteText: 'ZNE error mitigation restored state fidelity from 81.4% to 98.4% under 2% depolarizing rate.',
      date: '2026-09-20 18:40',
    },
    {
      id: 'NOTE-103',
      title: 'APOE4 Genomic Polygenic Risk Scoring',
      tag: 'final-results',
      noteText: 'Quantum kernel evaluated 100k variants in 19.3 seconds vs 88.7s classical CPU baseline.',
      date: '2026-09-19 11:20',
    },
  ]);

  const [newTitle, setNewTitle] = useState('');
  const [newTag, setNewTag] = useState<'drug-docking' | 'VQE-test' | 'NISQ-noise' | 'final-results'>('VQE-test');
  const [newText, setNewText] = useState('');

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    setNotes((prev) => [
      {
        id: `NOTE-${Date.now().toString().slice(-3)}`,
        title: newTitle,
        tag: newTag,
        noteText: newText,
        date: new Date().toISOString().slice(0, 16).replace('T', ' '),
      },
      ...prev,
    ]);
    setNewTitle('');
    setNewText('');
  };

  const handleDeleteNote = (id: string) => {
    setNotes((prev) => prev.filter((n) => n.id !== id));
  };

  const handleShareLink = (id: string) => {
    navigator.clipboard.writeText(`https://qmedlab.io/lab/notebook/${id}`);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredNotes = activeFilter === 'all' ? notes : notes.filter((n) => n.tag === activeFilter);

  return (
    <div className="p-6 rounded-3xl bg-slate-900/90 border border-cyan-500/30 shadow-2xl backdrop-blur-xl space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 text-[11px] font-mono font-bold uppercase tracking-wider border border-cyan-500/30 flex items-center gap-1">
              <BookOpen size={12} /> Auto-Saved Lab Records
            </span>
          </div>
          <h2 className="text-xl font-black text-white flex items-center gap-2">
            Experiment Lab Notebook & Sticky Notes
          </h2>
        </div>

        {/* Tag Filters */}
        <div className="flex flex-wrap gap-1.5 bg-slate-950 p-1.5 rounded-2xl border border-slate-800">
          {['all', 'drug-docking', 'VQE-test', 'NISQ-noise', 'final-results'].map((tag) => (
            <button
              key={tag}
              onClick={() => setActiveFilter(tag)}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition ${
                activeFilter === tag ? 'bg-cyan-500 text-slate-950 font-black' : 'text-slate-400 hover:text-white'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-6">
        {/* Left: Create Note Form */}
        <form onSubmit={handleAddNote} className="lg:col-span-4 p-4 rounded-2xl bg-slate-950/90 border border-slate-800 space-y-3">
          <h3 className="text-xs font-bold text-white flex items-center gap-1.5">
            <Plus size={14} className="text-cyan-400" /> Add Experiment Sticky Note
          </h3>

          <input
            type="text"
            required
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="Experiment Title..."
            className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-cyan-500"
          />

          <select
            value={newTag}
            onChange={(e) => setNewTag(e.target.value as any)}
            className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none"
          >
            <option value="drug-docking">drug-docking</option>
            <option value="VQE-test">VQE-test</option>
            <option value="NISQ-noise">NISQ-noise</option>
            <option value="final-results">final-results</option>
          </select>

          <textarea
            rows={3}
            value={newText}
            onChange={(e) => setNewText(e.target.value)}
            placeholder="Key observations, energy values, or notes..."
            className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-cyan-500"
          />

          <button type="submit" className="w-full py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs transition">
            Save Note to Notebook
          </button>
        </form>

        {/* Right: Notes List */}
        <div className="lg:col-span-8 space-y-3">
          {filteredNotes.map((note) => (
            <div key={note.id} className="p-4 rounded-2xl bg-slate-950/90 border border-slate-800 space-y-2 relative">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <StickyNote size={16} className="text-cyan-400" />
                  <h4 className="font-extrabold text-sm text-white">{note.title}</h4>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 text-[10px] font-mono border border-cyan-800">
                  #{note.tag}
                </span>
              </div>

              <p className="text-xs text-slate-300">{note.noteText}</p>

              <div className="flex items-center justify-between text-[10px] text-slate-500 pt-2 border-t border-slate-800/80 font-mono">
                <span>{note.date}</span>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleShareLink(note.id)}
                    className="text-cyan-400 hover:underline flex items-center gap-1 font-sans font-bold"
                  >
                    {copiedId === note.id ? <Check size={12} className="text-emerald-400" /> : <Share2 size={12} />}
                    {copiedId === note.id ? 'Copied' : 'Share Link'}
                  </button>
                  <button onClick={() => handleDeleteNote(note.id)} className="text-rose-400 hover:underline">
                    <Trash2 size={12} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
