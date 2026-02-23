import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/lib/auth-context';
import {
  LayoutDashboard,
  FileText,
  User,
  Users,
  Compass,
  Shield,
  PanelLeftClose,
  ChevronRight,
  Activity,
  FolderKanban,
  MessageSquare,
  Briefcase,
  Bell,
  FilePen,
  ClipboardList,
} from 'lucide-react';
import { clsx } from 'clsx';
import { useState } from 'react';

interface NavItem {
  to: string;
  label: string;
  icon: React.ElementType;
}

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const navItems: NavItem[] = [];
  if (user?.role === 'GCC') {
    navItems.push({ to: '/gcc/dashboard', label: 'Dashboard', icon: LayoutDashboard });
    navItems.push({ to: '/gcc/requirements', label: 'My Requirements', icon: FileText });
    navItems.push({ to: '/gcc/interests', label: 'Received Interests', icon: MessageSquare });
    navItems.push({ to: '/gcc/deals', label: 'Active Deals', icon: Briefcase });
    navItems.push({ to: '/gcc/notifications', label: 'Notifications', icon: Bell });
    navItems.push({ to: '/gcc/profile', label: 'Profile', icon: User });
    navItems.push({ to: '/gcc/explore', label: 'Explore', icon: Compass });
  } else if (user?.role === 'STARTUP') {
    navItems.push({ to: '/startup/dashboard', label: 'Dashboard', icon: LayoutDashboard });
    navItems.push({ to: '/startup/explore', label: 'Explore', icon: Compass });
    navItems.push({ to: '/startup/proposals', label: 'My Proposals', icon: FilePen });
    navItems.push({ to: '/startup/proposal-status', label: 'Proposal Status', icon: ClipboardList });
    navItems.push({ to: '/startup/notifications', label: 'Notifications', icon: Bell });
    navItems.push({ to: '/startup/profile', label: 'Profile', icon: User });
  } else if (user?.role === 'ADMIN') {
    navItems.push({ to: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard });
    navItems.push({ to: '/admin/approvals', label: 'Approvals', icon: Shield });
    navItems.push({ to: '/admin/users', label: 'All Users', icon: Users });
    navItems.push({ to: '/admin/activities', label: 'Activities', icon: Activity });
    navItems.push({ to: '/admin/projects', label: 'Active Projects', icon: FolderKanban });
    navItems.push({ to: '/explore', label: 'Explore', icon: Compass });
  }

  return (
    <div className="flex h-full overflow-hidden bg-page">
      {/* Navy sidebar - fixed, below navbar */}
      <aside
        className={clsx(
          'fixed left-0 top-14 z-40 h-[calc(100vh-3.5rem)] bg-sidebar text-sidebar flex flex-col border-r border-white/10 transition-[width] duration-200',
          sidebarOpen ? 'w-56' : 'w-16'
        )}
      >
        <div className="flex h-14 items-center justify-between px-3 border-b border-white/10">
          {sidebarOpen && (
            <Link
              to={
                user?.role === 'ADMIN'
                  ? '/admin/dashboard'
                  : user?.role === 'GCC'
                    ? '/gcc/dashboard'
                    : '/startup/dashboard'
              }
              className="font-bold text-white text-lg truncate"
            >
              GCC Connect
            </Link>
          )}
          <button
            type="button"
            onClick={() => setSidebarOpen((o) => !o)}
            className="rounded-md text-white/80 hover:bg-white/10 hover:text-white flex items-center gap-2 p-2"
            aria-label={sidebarOpen ? 'Close sidebar' : 'Open sidebar'}
            title={sidebarOpen ? 'Close sidebar' : 'Open sidebar'}
          >
            {sidebarOpen ? (
              <>
                <PanelLeftClose className="h-5 w-5" />
                <span className="text-sm font-medium">Close</span>
              </>
            ) : (
              <ChevronRight className="h-5 w-5" />
            )}
          </button>
        </div>
        <nav className="flex-1 p-2 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
              const isActive = location.pathname === item.to || (item.to !== '/explore' && item.to !== '/gcc/explore' && item.to !== '/startup/explore' && location.pathname.startsWith(item.to));
              return (
                <Link
                  key={item.to + item.label}
                  to={item.to}
                  className={clsx(
                    'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition',
                    isActive
                      ? 'bg-white/15 text-white'
                      : 'text-white/80 hover:bg-white/10 hover:text-white'
                  )}
                >
                  <item.icon className="h-5 w-5 flex-shrink-0" />
                  {sidebarOpen && <span className="truncate">{item.label}</span>}
                </Link>
              );
            })}
        </nav>
      </aside>

      {/* Main content - fixed height; only inner content scrolls */}
      <main className={clsx('flex-1 flex flex-col min-h-0 overflow-hidden bg-page pt-14 relative', sidebarOpen ? 'ml-56' : 'ml-16')}>
        {!sidebarOpen && (
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="fixed left-16 top-20 z-30 flex items-center gap-1.5 rounded-r-md border border-white/10 bg-sidebar px-2 py-2 text-white/90 shadow-md hover:bg-white/10 hover:text-white transition"
            aria-label="Open sidebar"
            title="Open sidebar"
          >
            <ChevronRight className="h-5 w-5" />
            <span className="text-sm font-medium">Open sidebar</span>
          </button>
        )}
        <div className="flex-1 min-h-0 overflow-y-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
