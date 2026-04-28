import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { adminApi } from '@/lib/api';
import { Users, Shield, FileText, Send, ArrowRight } from 'lucide-react';

export default function AdminDashboard() {
  const [stats, setStats] = useState<{
    totalUsers: number;
    pendingApprovals: number;
    openRequirements: number;
    pendingInterests: number;
  } | null>(null);

  useEffect(() => {
    adminApi.getStats().then(setStats).catch(() => setStats(null));
  }, []);

  return (
    <div className="min-h-screen pt-6 pb-16">
      <div className="container mx-auto px-4">
        <h1 className="text-2xl font-bold mb-2">Admin Dashboard</h1>
        <p className="text-muted-foreground text-sm mb-8">
          Overview and quick links to manage the portal.
        </p>

        {stats && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="page-card p-5">
              <div className="flex items-center gap-3 mb-2">
                <Users className="h-8 w-8 text-primary" />
                <span className="text-2xl font-bold">{stats.totalUsers}</span>
              </div>
              <p className="text-sm text-muted-foreground">Total users (GCC + Startup + Incubation)</p>
            </div>
            <div className="page-card p-5">
              <div className="flex items-center gap-3 mb-2">
                <Shield className="h-8 w-8 text-amber-600" />
                <span className="text-2xl font-bold">{stats.pendingApprovals}</span>
              </div>
              <p className="text-sm text-muted-foreground">Pending approvals</p>
            </div>
            <div className="page-card p-5">
              <div className="flex items-center gap-3 mb-2">
                <FileText className="h-8 w-8 text-blue-600" />
                <span className="text-2xl font-bold">{stats.openRequirements}</span>
              </div>
              <p className="text-sm text-muted-foreground">Open requirements</p>
            </div>
            <div className="page-card p-5">
              <div className="flex items-center gap-3 mb-2">
                <Send className="h-8 w-8 text-green-600" />
                <span className="text-2xl font-bold">{stats.pendingInterests}</span>
              </div>
              <p className="text-sm text-muted-foreground">Pending interests</p>
            </div>
          </div>
        )}

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Link to="/admin/approvals" className="page-card p-5 block hover:border-primary/50 transition">
            <div className="flex items-center justify-between">
              <span className="font-medium">Pending Approvals</span>
              <ArrowRight className="h-4 w-4 text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground mt-1">Approve or reject new GCC, Startup, and Incubation Center registrations.</p>
          </Link>
          <Link to="/admin/users" className="page-card p-5 block hover:border-primary/50 transition">
            <div className="flex items-center justify-between">
              <span className="font-medium">All Users</span>
              <ArrowRight className="h-4 w-4 text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground mt-1">View all users and status. Filter by GCC, Startup, or Incubation Center.</p>
          </Link>
          <Link to="/admin/activities" className="page-card p-5 block hover:border-primary/50 transition">
            <div className="flex items-center justify-between">
              <span className="font-medium">Activities</span>
              <ArrowRight className="h-4 w-4 text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground mt-1">Recent requirements and expressions of interest.</p>
          </Link>
          <Link to="/admin/projects" className="page-card p-5 block hover:border-primary/50 transition">
            <div className="flex items-center justify-between">
              <span className="font-medium">Active Projects</span>
              <ArrowRight className="h-4 w-4 text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground mt-1">Open and in-progress requirements.</p>
          </Link>
        </div>
      </div>
    </div>
  );
}
