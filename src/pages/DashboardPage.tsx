import React from 'react';
import { useAuth } from '@/context/AuthContext';
import StudentDashboardView from '@/components/dashboards/StudentDashboardView';
import ResearcherDashboardView from '@/components/dashboards/ResearcherDashboardView';
import ClinicianDashboardView from '@/components/dashboards/ClinicianDashboardView';
import AdminDashboardView from '@/components/dashboards/AdminDashboardView';

export default function DashboardPage() {
  const { profile } = useAuth();
  
  const userRole = profile?.role || 'researcher';
  const userName = profile?.full_name || 'Q-MedLab Member';
  const points = profile?.points || 1250;

  return (
    <div className="w-full max-w-full overflow-x-hidden space-y-6">
      {/* Strictly render ONLY the logged-in user's role dashboard */}
      {userRole === 'student' && <StudentDashboardView userName={userName} points={points} />}
      {userRole === 'researcher' && <ResearcherDashboardView userName={userName} />}
      {userRole === 'clinician' && <ClinicianDashboardView userName={userName} />}
      {userRole === 'admin' && <AdminDashboardView userName={userName} />}
    </div>
  );
}
