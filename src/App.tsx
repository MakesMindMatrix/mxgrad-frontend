import { Routes, Route, Navigate, useParams } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import AppLayout from '@/components/AppLayout';
import ProtectedRoute from '@/components/ProtectedRoute';
import Home from '@/pages/Home';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import RegisterForm from '@/pages/RegisterForm';
import PendingApproval from '@/pages/PendingApproval';
import Explore from '@/pages/Explore';
import GccExplore from '@/pages/gcc/GccExplore';
import StartupExplore from '@/pages/startup/StartupExplore';
import GccDashboard from '@/pages/gcc/GccDashboard';
import GccRequirements from '@/pages/gcc/GccRequirements';
import GccRequirementNew from '@/pages/gcc/GccRequirementNew';
import GccRequirementDetail from '@/pages/gcc/GccRequirementDetail';
import GccInterests from '@/pages/gcc/GccInterests';
import GccInterestDetail from '@/pages/gcc/GccInterestDetail';
import GccDeals from '@/pages/gcc/GccDeals';
import GccNotifications from '@/pages/gcc/GccNotifications';
import GccProfile from '@/pages/gcc/GccProfile';
import StartupDashboard from '@/pages/startup/StartupDashboard';
import StartupProfile from '@/pages/startup/StartupProfile';
import StartupNotifications from '@/pages/startup/StartupNotifications';
import StartupMyProposals from '@/pages/startup/StartupMyProposals';
import StartupProposalStatus from '@/pages/startup/StartupProposalStatus';
import AdminApprovals from '@/pages/admin/AdminApprovals';
import AdminDashboard from '@/pages/admin/AdminDashboard';
import AdminUsers from '@/pages/admin/AdminUsers';
import AdminActivities from '@/pages/admin/AdminActivities';
import AdminActiveProjects from '@/pages/admin/AdminActiveProjects';
import AdminRequirementApprovals from '@/pages/admin/AdminRequirementApprovals';

function DashboardRoute({ children, allowedRoles, requireAdmin }: { children: React.ReactNode; allowedRoles?: ('ADMIN' | 'GCC' | 'STARTUP')[]; requireAdmin?: boolean }) {
  return (
    <ProtectedRoute allowedRoles={allowedRoles} requireAdmin={requireAdmin}>
      <AppLayout>{children}</AppLayout>
    </ProtectedRoute>
  );
}

function RedirectRequirementEditToView() {
  const { id } = useParams<{ id: string }>();
  return <Navigate to={id ? `/gcc/requirements/${id}` : '/gcc/requirements'} replace />;
}

export default function App() {
  return (
    <div className="h-screen overflow-hidden flex flex-col">
      <Navbar />
      <div className="flex-1 min-h-0 overflow-y-auto">
        <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/register/form" element={<RegisterForm />} />
        <Route path="/pending-approval" element={<PendingApproval />} />
        <Route path="/explore" element={<Explore />} />

        <Route path="/gcc/dashboard" element={<DashboardRoute allowedRoles={['GCC']}><GccDashboard /></DashboardRoute>} />
        <Route path="/gcc/explore" element={<DashboardRoute allowedRoles={['GCC']}><GccExplore /></DashboardRoute>} />
        <Route path="/gcc/requirements" element={<DashboardRoute allowedRoles={['GCC']}><GccRequirements /></DashboardRoute>} />
        <Route path="/gcc/requirements/new" element={<DashboardRoute allowedRoles={['GCC']}><GccRequirementNew /></DashboardRoute>} />
        <Route path="/gcc/requirements/:id" element={<DashboardRoute allowedRoles={['GCC']}><GccRequirementDetail /></DashboardRoute>} />
        <Route path="/gcc/requirements/:id/edit" element={<DashboardRoute allowedRoles={['GCC']}><RedirectRequirementEditToView /></DashboardRoute>} />
        <Route path="/gcc/interests" element={<DashboardRoute allowedRoles={['GCC']}><GccInterests /></DashboardRoute>} />
        <Route path="/gcc/interests/:id" element={<DashboardRoute allowedRoles={['GCC']}><GccInterestDetail /></DashboardRoute>} />
        <Route path="/gcc/deals" element={<DashboardRoute allowedRoles={['GCC']}><GccDeals /></DashboardRoute>} />
        <Route path="/gcc/notifications" element={<DashboardRoute allowedRoles={['GCC']}><GccNotifications /></DashboardRoute>} />
        <Route path="/gcc/profile" element={<DashboardRoute allowedRoles={['GCC']}><GccProfile /></DashboardRoute>} />

        <Route path="/startup/dashboard" element={<DashboardRoute allowedRoles={['STARTUP']}><StartupDashboard /></DashboardRoute>} />
        <Route path="/startup/explore" element={<DashboardRoute allowedRoles={['STARTUP']}><StartupExplore /></DashboardRoute>} />
        <Route path="/startup/proposals" element={<DashboardRoute allowedRoles={['STARTUP']}><StartupMyProposals /></DashboardRoute>} />
        <Route path="/startup/proposal-status" element={<DashboardRoute allowedRoles={['STARTUP']}><StartupProposalStatus /></DashboardRoute>} />
        <Route path="/startup/notifications" element={<DashboardRoute allowedRoles={['STARTUP']}><StartupNotifications /></DashboardRoute>} />
        <Route path="/startup/profile" element={<DashboardRoute allowedRoles={['STARTUP']}><StartupProfile /></DashboardRoute>} />

        <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="/admin/dashboard" element={<DashboardRoute requireAdmin><AdminDashboard /></DashboardRoute>} />
        <Route path="/admin/explore" element={<DashboardRoute requireAdmin><Explore /></DashboardRoute>} />
        <Route path="/admin/approvals" element={<DashboardRoute requireAdmin><AdminApprovals /></DashboardRoute>} />
        <Route path="/admin/requirement-approvals" element={<DashboardRoute requireAdmin><AdminRequirementApprovals /></DashboardRoute>} />
        <Route path="/admin/users" element={<DashboardRoute requireAdmin><AdminUsers /></DashboardRoute>} />
        <Route path="/admin/activities" element={<DashboardRoute requireAdmin><AdminActivities /></DashboardRoute>} />
        <Route path="/admin/projects" element={<DashboardRoute requireAdmin><AdminActiveProjects /></DashboardRoute>} />

        <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </div>
  );
}
