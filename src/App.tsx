import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { type ReactNode } from 'react';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { ThemeProvider } from '@/context/ThemeContext';
import AppLayout from '@/layouts/AppLayout';
import LandingPage from '@/pages/LandingPage';
import LoginPage from '@/pages/auth/LoginPage';
import RoleLoginPage from '@/pages/auth/RoleLoginPage';
import RegisterPage from '@/pages/auth/RegisterPage';
import ForgotPasswordPage from '@/pages/auth/ForgotPasswordPage';
import DashboardPage from '@/pages/DashboardPage';
import DiagnosisPage from '@/pages/modules/DiagnosisPage';
import DrugDiscoveryPage from '@/pages/modules/DrugDiscoveryPage';
import AntibioticPage from '@/pages/modules/AntibioticPage';
import ImagingPage from '@/pages/modules/ImagingPage';
import ReportsPage from '@/pages/ReportsPage';
import BookmarksPage from '@/pages/BookmarksPage';
import HistoryPage from '@/pages/HistoryPage';
import SearchPage from '@/pages/SearchPage';
import NotificationsPage from '@/pages/NotificationsPage';
import QuantumJobsPage from '@/pages/QuantumJobsPage';
import LeaderboardPage from '@/pages/LeaderboardPage';
import ProfilePage from '@/pages/ProfilePage';
import AdminLiveMonitorPage from '@/pages/AdminLiveMonitorPage';
import { Spinner } from '@/components/ui';

function ProtectedRoute({ children }: { children: ReactNode }) {
  const { session, loading } = useAuth();
  if (loading) return <div className="flex justify-center py-20"><Spinner className="h-8 w-8 text-sky-500" /></div>;
  const hasAuth = session || (typeof window !== 'undefined' && localStorage.getItem('qmedlab_auth_session'));
  if (!hasAuth) return <Navigate to="/login" replace />;
  return <AppLayout>{children}</AppLayout>;
}

function PublicOnly({ children }: { children: ReactNode }) {
  const { session, loading } = useAuth();
  if (loading) return <div className="flex justify-center py-20"><Spinner className="h-8 w-8 text-sky-500" /></div>;
  if (session) return <Navigate to="/app" replace />;
  return <>{children}</>;
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* 3D Landing Page accessible to all visitors */}
            <Route path="/" element={<LandingPage />} />

            {/* Role-Specific and Universal Login Portals */}
            <Route path="/login" element={<RoleLoginPage />} />
            <Route path="/login/:role" element={<RoleLoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />

            {/* Protected Application Workspace Routes */}
            <Route path="/app" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
            <Route path="/app/diagnosis" element={<ProtectedRoute><DiagnosisPage /></ProtectedRoute>} />
            <Route path="/app/drug-discovery" element={<ProtectedRoute><DrugDiscoveryPage /></ProtectedRoute>} />
            <Route path="/app/antibiotic" element={<ProtectedRoute><AntibioticPage /></ProtectedRoute>} />
            <Route path="/app/imaging" element={<ProtectedRoute><ImagingPage /></ProtectedRoute>} />
            <Route path="/app/quantum-jobs" element={<ProtectedRoute><QuantumJobsPage /></ProtectedRoute>} />
            <Route path="/app/reports" element={<ProtectedRoute><ReportsPage /></ProtectedRoute>} />
            <Route path="/app/bookmarks" element={<ProtectedRoute><BookmarksPage /></ProtectedRoute>} />
            <Route path="/app/history" element={<ProtectedRoute><HistoryPage /></ProtectedRoute>} />
            <Route path="/app/search" element={<ProtectedRoute><SearchPage /></ProtectedRoute>} />
            <Route path="/app/notifications" element={<ProtectedRoute><NotificationsPage /></ProtectedRoute>} />
            <Route path="/app/leaderboard" element={<ProtectedRoute><LeaderboardPage /></ProtectedRoute>} />
            <Route path="/app/admin" element={<ProtectedRoute><AdminLiveMonitorPage /></ProtectedRoute>} />
            <Route path="/app/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}
