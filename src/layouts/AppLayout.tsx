import { NavLink, useNavigate } from 'react-router-dom';
import { type ReactNode, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Stethoscope, FlaskConical, Bug, ScanLine, Bell, Bookmark,
  History, Trophy, Search, Settings, LogOut, Menu, X, Moon, Sun, Atom,
  FileText, ChevronRight, ShieldCheck,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';

const nav = [
  { to: '/app', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/app/admin', label: 'Live Admin Monitor', icon: ShieldCheck, badge: 'LIVE' },
  { to: '/app/diagnosis', label: 'Disease Diagnosis', icon: Stethoscope },
  { to: '/app/drug-discovery', label: 'Drug Discovery', icon: FlaskConical },
  { to: '/app/antibiotic', label: 'Antibiotic Resistance', icon: Bug },
  { to: '/app/imaging', label: 'Medical Imaging', icon: ScanLine },
  { to: '/app/quantum-jobs', label: 'Quantum Jobs', icon: Atom },
  { to: '/app/bookmarks', label: 'Bookmarks', icon: Bookmark },
  { to: '/app/history', label: 'History', icon: History },
  { to: '/app/leaderboard', label: 'Leaderboard', icon: Trophy },
  { to: '/app/search', label: 'Search', icon: Search },
  { to: '/app/profile', label: 'Profile & Settings', icon: Settings },
];

const roleThemeStyles: Record<string, { activeNav: string; logoGradient: string; avatarGradient: string; roleBadge: string; roleLabel: string }> = {
  student: {
    activeNav: 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 ring-1 ring-emerald-200/60 dark:ring-emerald-900 font-bold',
    logoGradient: 'from-emerald-500 to-teal-400 shadow-emerald-500/30',
    avatarGradient: 'from-emerald-500 to-teal-400',
    roleBadge: 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border-emerald-500/30',
    roleLabel: 'Guided Student',
  },
  clinician: {
    activeNav: 'bg-cyan-50 dark:bg-cyan-950/60 text-cyan-700 dark:text-cyan-300 ring-1 ring-cyan-200/60 dark:ring-cyan-900 font-bold',
    logoGradient: 'from-cyan-500 to-teal-500 shadow-cyan-500/30',
    avatarGradient: 'from-cyan-500 to-teal-500',
    roleBadge: 'bg-cyan-500/20 text-cyan-700 dark:text-cyan-300 border-cyan-500/30',
    roleLabel: 'Chief Clinician',
  },
  researcher: {
    activeNav: 'bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 ring-1 ring-purple-200/60 dark:ring-purple-900 font-bold',
    logoGradient: 'from-purple-600 to-indigo-500 shadow-purple-500/30',
    avatarGradient: 'from-purple-600 to-indigo-500',
    roleBadge: 'bg-purple-500/20 text-purple-700 dark:text-purple-300 border-purple-500/30',
    roleLabel: 'Lead Researcher',
  },
  admin: {
    activeNav: 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 ring-1 ring-amber-200/60 dark:ring-amber-900 font-bold',
    logoGradient: 'from-amber-500 to-orange-500 shadow-amber-500/30',
    avatarGradient: 'from-amber-500 to-orange-500',
    roleBadge: 'bg-amber-500/20 text-amber-700 dark:text-amber-300 border-amber-500/30',
    roleLabel: 'System Administrator',
  },
};

export default function AppLayout({ children }: { children: ReactNode }) {
  const { profile, signOut } = useAuth();
  const { theme, toggle } = useTheme();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  const roleStyle = roleThemeStyles[profile?.role ?? 'researcher'] || roleThemeStyles.researcher;

  const filteredNav = nav.filter((item) => {
    const userRole = profile?.role ?? 'researcher';

    if (item.to === '/app/admin') {
      return userRole === 'admin';
    }

    // For Admin role: remove the 4 medical lab modules, Bookmarks, History, and Search
    if (userRole === 'admin') {
      if (
        [
          '/app/diagnosis',
          '/app/drug-discovery',
          '/app/antibiotic',
          '/app/imaging',
          '/app/bookmarks',
          '/app/history',
          '/app/search',
        ].includes(item.to)
      ) {
        return false;
      }
    }

    // Remove Bookmarks, Leaderboard, Search for Student, Researcher, and Clinician roles
    if (['student', 'researcher', 'clinician'].includes(userRole)) {
      if (['/app/bookmarks', '/app/leaderboard', '/app/search'].includes(item.to)) {
        return false;
      }
    }
    return true;
  });

  const SidebarContent = () => (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-3 px-6 py-5 border-b border-slate-200/60 dark:border-slate-800/60">
        <div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${roleStyle.logoGradient} text-white shadow-lg`}>
          <Atom size={22} />
        </div>
        <div>
          <p className="font-bold text-slate-900 dark:text-white leading-tight">Q-MedLab</p>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1">
            <span>Quantum Medical Lab</span>
          </p>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        {filteredNav.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            onClick={() => setMobileOpen(false)}
            className={({ isActive }) =>
              `flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? roleStyle.activeNav
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60'
              }`
            }
          >
            <span className="flex items-center gap-3">
              <item.icon size={18} />
              {item.label}
            </span>
            {'badge' in item && item.badge && (
              <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-600 dark:text-amber-400 text-[10px] font-extrabold tracking-wider border border-amber-500/30 animate-pulse">
                {item.badge}
              </span>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-slate-200/60 dark:border-slate-800/60 p-3">
        <div className="flex items-center gap-3 px-3 py-2 rounded-xl">
          <div className={`flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br ${roleStyle.avatarGradient} text-white text-sm font-semibold`}>
            {profile?.full_name?.[0]?.toUpperCase() ?? 'U'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-slate-900 dark:text-white truncate">{profile?.full_name ?? 'User'}</p>
            <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-extrabold border ${roleStyle.roleBadge}`}>
              {roleStyle.roleLabel}
            </span>
          </div>
          <button onClick={handleSignOut} className="text-slate-400 hover:text-rose-500 transition" title="Sign out">
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Desktop sidebar */}
      <aside className="hidden lg:fixed lg:inset-y-0 lg:w-64 lg:flex glass border-r border-slate-200/60 dark:border-slate-800/60">
        <SidebarContent />
      </aside>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.aside
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: 'spring', damping: 25, stiffness: 250 }}
              className="fixed inset-y-0 left-0 z-50 w-64 glass border-r border-slate-200/60 dark:border-slate-800/60 lg:hidden"
            >
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <div className="lg:pl-64 flex flex-col min-h-screen">
        {/* Top bar */}
        <header className="sticky top-0 z-30 glass border-b border-slate-200/60 dark:border-slate-800/60 w-full">
          <div className="flex items-center justify-between px-4 sm:px-6 py-3 max-w-7xl mx-auto">
            <button
              onClick={() => setMobileOpen(true)}
              className="lg:hidden p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <Menu size={20} />
            </button>
            <div className="hidden sm:flex items-center gap-3 text-sm text-slate-500 dark:text-slate-400">
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs">
                <Atom size={14} className="text-sky-500" />
                <span className="font-semibold text-slate-700 dark:text-slate-300">IBM Falcon</span>
                <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-bold">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Live
                </span>
              </div>
              {profile?.role === 'admin' && (
                <NavLink
                  to="/app/admin"
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30 text-xs font-semibold hover:bg-amber-500/20 transition"
                >
                  <ShieldCheck size={13} />
                  <span>Admin Live Monitor</span>
                </NavLink>
              )}
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={toggle}
                className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                title="Toggle theme"
              >
                {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
              </button>
              <NavLink
                to="/app/notifications"
                className="relative p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              >
                <Bell size={18} />
                <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-rose-500" />
              </NavLink>
              <NavLink to="/app/profile" className="hidden sm:block">
                <span className="flex items-center gap-1 text-sm text-slate-500 dark:text-slate-400 hover:text-sky-600 dark:hover:text-sky-400 transition">
                  {profile?.points ?? 0} pts
                  <ChevronRight size={14} />
                </span>
              </NavLink>
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">{children}</main>
      </div>
    </div>
  );
}
