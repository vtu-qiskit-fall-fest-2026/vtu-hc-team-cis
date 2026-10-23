import { useState } from 'react';
import { Settings, User, Mail, Building2, Award, Save, Loader2, Shield } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import { Card, PageHeader, Spinner, Tag } from '@/components/ui';

export default function ProfilePage() {
  const { profile, refreshProfile } = useAuth();
  const [fullName, setFullName] = useState(profile?.full_name ?? '');
  const [institution, setInstitution] = useState(profile?.institution ?? '');
  const [bio, setBio] = useState(profile?.bio ?? '');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  if (!profile) return <div className="flex justify-center py-20"><Spinner className="h-8 w-8 text-sky-500" /></div>;

  const handleSave = async () => {
    setSaving(true);
    await supabase.from('profiles').update({ full_name: fullName, institution, bio }).eq('id', profile.id);
    await refreshProfile();
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const stats = [
    { label: 'Points', value: profile.points, icon: Award, color: 'text-amber-600' },
    { label: 'Role', value: profile.role, icon: Shield, color: 'text-sky-600' },
  ];

  return (
    <div>
      <PageHeader title="Profile & Settings" subtitle="Manage your account and preferences" icon={<Settings size={24} />} />

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Profile card */}
        <Card>
          <div className="flex flex-col items-center text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-sky-500 to-cyan-400 text-white text-2xl font-bold shadow-lg shadow-sky-500/30">
              {profile.full_name?.[0]?.toUpperCase() ?? 'U'}
            </div>
            <p className="mt-3 text-lg font-bold text-slate-900 dark:text-white">{profile.full_name ?? 'User'}</p>
            <p className="text-sm text-slate-500 dark:text-slate-400">{profile.email}</p>
            <div className="mt-2"><Tag color="sky">{profile.role}</Tag></div>
          </div>
          <div className="mt-6 grid grid-cols-2 gap-3">
            {stats.map((s) => (
              <div key={s.label} className="rounded-xl bg-slate-50 dark:bg-slate-900/40 p-3 text-center">
                <s.icon size={18} className={`mx-auto ${s.color}`} />
                <p className="mt-1 text-lg font-bold text-slate-900 dark:text-white capitalize">{s.value}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">{s.label}</p>
              </div>
            ))}
          </div>
        </Card>

        {/* Edit form */}
        <Card className="lg:col-span-2">
          <p className="section-title mb-4">Edit Profile</p>
          <div className="space-y-4">
            <div>
              <label className="label">Full Name</label>
              <div className="relative">
                <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input value={fullName} onChange={(e) => setFullName(e.target.value)} className="input-field pl-10" />
              </div>
            </div>
            <div>
              <label className="label">Email (read-only)</label>
              <div className="relative">
                <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input value={profile.email} disabled className="input-field pl-10 opacity-60 cursor-not-allowed" />
              </div>
            </div>
            <div>
              <label className="label">Institution</label>
              <div className="relative">
                <Building2 size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input value={institution} onChange={(e) => setInstitution(e.target.value)} className="input-field pl-10" placeholder="University / Hospital" />
              </div>
            </div>
            <div>
              <label className="label">Bio</label>
              <textarea value={bio} onChange={(e) => setBio(e.target.value)} rows={3} className="input-field resize-none" placeholder="Short research bio..." />
            </div>
            <div className="flex items-center gap-3">
              <button onClick={handleSave} disabled={saving} className="btn-primary">
                {saving ? <><Loader2 size={18} className="animate-spin" /> Saving...</> : <><Save size={18} /> Save Changes</>}
              </button>
              {saved && <span className="text-sm text-emerald-600 dark:text-emerald-400">Saved!</span>}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
