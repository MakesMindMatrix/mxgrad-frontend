import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/lib/auth-context';
import { useTheme } from '@/lib/theme-context';
import { adminApi } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { User, LogOut, LayoutDashboard, Compass, Shield, Sun, Moon, Bell, Home } from 'lucide-react';

function AdminNotifications() {
  const [open, setOpen] = useState(false);
  const [pendingCount, setPendingCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    adminApi.getStats().then((s) => setPendingCount(s.pendingApprovals ?? 0)).catch(() => setPendingCount(0));
  }, []);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="relative p-2 rounded-lg text-white/80 hover:bg-white/10 hover:text-white transition"
        title="Notifications"
      >
        <Bell className="h-5 w-5" />
        {pendingCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
            {pendingCount > 99 ? '99+' : pendingCount}
          </span>
        )}
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-1 w-56 rounded-lg border border-white/10 bg-nav shadow-lg py-2 z-50">
          <div className="px-3 py-2 text-sm font-medium text-white border-b border-white/10">Notifications</div>
          {pendingCount > 0 ? (
            <Link
              to="/admin/approvals"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2 px-3 py-2 text-sm text-white/90 hover:bg-white/10"
            >
              <Shield className="h-4 w-4" />
              {pendingCount} pending approval{pendingCount !== 1 ? 's' : ''}
            </Link>
          ) : (
            <div className="px-3 py-2 text-sm text-white/60">No pending notifications</div>
          )}
        </div>
      )}
    </div>
  );
}

export default function Navbar() {
  const { user, logout, isAuthenticated } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const isHome = location.pathname === '/';
  const isRegister = location.pathname === '/register' || location.pathname.startsWith('/register/');
  const isLogin = location.pathname === '/login';

  // On home we use the entrance header; don't render this navbar
  if (isHome) return null;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-nav text-nav border-b border-white/10 shadow-sm">
      <div className="container mx-auto flex items-center justify-between h-14 px-4">
        <div className="flex items-center gap-3">
          {(isLogin || isRegister) && (
            <Link
              to="/"
              className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-white/90 hover:bg-white/10 hover:text-white transition"
            >
              <Home className="h-4 w-4" />
              Home
            </Link>
          )}
          <Link
            to={
              isAuthenticated && user
                ? user.role === 'ADMIN'
                  ? '/admin/dashboard'
                  : user.role === 'GCC'
                    ? '/gcc/dashboard'
                    : '/startup/dashboard'
                : '/'
            }
            className="flex items-center gap-2 font-bold text-white"
          >
            <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
              <span className="text-white font-bold text-sm">G</span>
            </div>
            <span>GCC-Startup Connect</span>
          </Link>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={toggleTheme}
            className="p-2 rounded-lg text-white/80 hover:bg-white/10 hover:text-white transition"
            title={theme === 'light' ? 'Switch to dark' : 'Switch to light'}
          >
            {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
          </button>

          {!isRegister && !isLogin && !isAuthenticated && (
            <Link to="/explore">
              <Button variant="ghost" size="sm" className="gap-2 text-white hover:bg-white/10 hover:text-white">
                <Compass className="h-4 w-4" />
                Explore
              </Button>
            </Link>
          )}

          {isAuthenticated ? (
            <>
              {user?.role === 'ADMIN' && <AdminNotifications />}
              {(user?.role === 'GCC' || user?.role === 'STARTUP') && (
                <Link
                  to={user.role === 'GCC' ? '/gcc/notifications' : '/startup/notifications'}
                  className="p-2 rounded-lg text-white/80 hover:bg-white/10 hover:text-white transition"
                  title="Notifications"
                >
                  <Bell className="h-5 w-5" />
                </Link>
              )}
              {user?.role === 'ADMIN' && (
                <Link
                  to="/admin/dashboard"
                >
                  <Button variant="ghost" size="sm" className="gap-2 text-white hover:bg-white/10 hover:text-white">
                    <LayoutDashboard className="h-4 w-4" />
                    Dashboard
                  </Button>
                </Link>
              )}
              {user?.role === 'ADMIN' && (
                <Link to="/admin/approvals">
                  <Button variant="ghost" size="sm" className="gap-2 text-white hover:bg-white/10 hover:text-white">
                    <Shield className="h-4 w-4" />
                    Approvals
                  </Button>
                </Link>
              )}
              <div className="h-6 w-px bg-white/20 mx-1" />
              <div className="flex items-center gap-2 text-sm text-white/90">
                <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center">
                  <User className="h-3.5 w-3.5 text-white" />
                </div>
                <span>{user?.name}</span>
                <span className="text-white/60 text-xs">({user?.role})</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="gap-2 text-red-200 hover:bg-red-500/20 hover:text-red-100"
                onClick={() => {
                  logout();
                  navigate('/');
                }}
              >
                <LogOut className="h-4 w-4" />
                Log out
              </Button>
            </>
          ) : (
            <>
              <Link to="/login">
                <Button variant="ghost" size="sm" className="text-white hover:bg-white/10">
                  Log in
                </Button>
              </Link>
              <Link
                to="/register"
                className="inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-semibold bg-white text-home-navy hover:bg-white/90 transition"
              >
                Get Started
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
