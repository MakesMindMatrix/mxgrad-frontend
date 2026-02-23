import { useEffect, useState } from 'react';
import { adminApi } from '@/lib/api';
import type { User } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Users, Building2, Rocket, Check, X, Pencil, Trash2, RefreshCw } from 'lucide-react';

type RoleFilter = 'ALL' | 'GCC' | 'STARTUP';

export default function AdminUsers() {
  const [filter, setFilter] = useState<RoleFilter>('ALL');
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [detailUserId, setDetailUserId] = useState<string | null>(null);
  const [detail, setDetail] = useState<{ user: User; profile: Record<string, unknown> | null } | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editForm, setEditForm] = useState<{ name: string; email: string; profile: Record<string, unknown> }>({ name: '', email: '', profile: {} });
  const [saving, setSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [actionError, setActionError] = useState('');

  const loadUsers = () => {
    setLoading(true);
    const role = filter === 'ALL' ? undefined : filter;
    adminApi.getUsers(role).then(setUsers).catch(() => setUsers([])).finally(() => setLoading(false));
  };

  useEffect(() => {
    loadUsers();
  }, [filter]);

  useEffect(() => {
    if (!detailUserId) {
      setDetail(null);
      return;
    }
    setDetailLoading(true);
    adminApi.getUser(detailUserId).then(setDetail).catch(() => setDetail(null)).finally(() => setDetailLoading(false));
  }, [detailUserId]);

  const handleApprove = async (userId: string) => {
    try {
      setActionError('');
      await adminApi.approve(userId);
      loadUsers();
      if (detailUserId === userId) {
        setDetailUserId(null);
      } else {
        adminApi.getUser(userId).then(setDetail).catch(() => setDetail(null));
      }
    } catch (e: unknown) {
      setActionError(e && typeof e === 'object' && 'message' in e ? String((e as { message: string }).message) : 'Failed');
    }
  };

  const openEdit = () => {
    if (!detail) return;
    setEditForm({
      name: detail.user.name,
      email: detail.user.email,
      profile: (detail.profile && typeof detail.profile === 'object' ? { ...detail.profile } : {}) as Record<string, unknown>,
    });
    setEditMode(true);
    setActionError('');
  };

  const handleSaveEdit = async () => {
    if (!detailUserId) return;
    setSaving(true);
    setActionError('');
    try {
      await adminApi.updateUser(detailUserId, {
        name: editForm.name,
        email: editForm.email,
        profile: Object.keys(editForm.profile).length ? editForm.profile : undefined,
      });
      setEditMode(false);
      loadUsers();
      adminApi.getUser(detailUserId).then(setDetail).catch(() => setDetail(null));
    } catch (e: unknown) {
      setActionError(e && typeof e === 'object' && 'message' in e ? String((e as { message: string }).message) : 'Update failed');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (userId: string) => {
    setActionError('');
    try {
      await adminApi.deleteUser(userId);
      setDeleteConfirm(null);
      setDetailUserId(null);
      loadUsers();
    } catch (e: unknown) {
      setActionError(e && typeof e === 'object' && 'message' in e ? String((e as { message: string }).message) : 'Delete failed');
    }
  };

  const handleRequestReverification = async (userId: string) => {
    setActionError('');
    try {
      await adminApi.requestReverification(userId);
      if (detailUserId === userId) adminApi.getUser(userId).then(setDetail).catch(() => setDetail(null));
    } catch (e: unknown) {
      setActionError(e && typeof e === 'object' && 'message' in e ? String((e as { message: string }).message) : 'Failed');
    }
  };

  return (
    <div className="min-h-screen pt-6 pb-16">
      <div className="container mx-auto px-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <h1 className="text-2xl font-bold">All Users</h1>
          <div className="flex rounded-lg border border-border p-1 bg-muted/30">
            <Button
              variant={filter === 'ALL' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setFilter('ALL')}
              className="gap-1.5"
            >
              <Users className="h-4 w-4" />
              All
            </Button>
            <Button
              variant={filter === 'GCC' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setFilter('GCC')}
              className="gap-1.5"
            >
              <Building2 className="h-4 w-4" />
              GCCs
            </Button>
            <Button
              variant={filter === 'STARTUP' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setFilter('STARTUP')}
              className="gap-1.5"
            >
              <Rocket className="h-4 w-4" />
              Startups
            </Button>
          </div>
        </div>

        <p className="text-muted-foreground text-sm mb-6">
          View all registered users and their approval status. Click a card to see full details.
        </p>

        {loading ? (
          <p className="text-muted-foreground">Loading...</p>
        ) : users.length === 0 ? (
          <div className="page-card p-12 text-center text-muted-foreground">
            No users found.
          </div>
        ) : (
          <div className="space-y-3">
            {users.map((u) => {
              const status = (u.approvalStatus ?? u.approval_status) as string | undefined;
              return (
              <div
                key={u.id}
                role="button"
                tabIndex={0}
                onClick={() => setDetailUserId(u.id)}
                onKeyDown={(e) => e.key === 'Enter' && setDetailUserId(u.id)}
                className="page-card p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer hover:border-primary/30 transition"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-medium">{u.name}</span>
                    <span className={`chip ${u.role === 'GCC' ? 'chip-default' : 'chip-ai'}`}>{u.role}</span>
                    {status === 'APPROVED' && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-green-500/15 text-green-700 border border-green-200">
                        <Check className="h-3 w-3" /> Approved
                      </span>
                    )}
                    {status === 'PENDING' && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-amber-500/15 text-amber-700 border border-amber-200">
                        Pending
                      </span>
                    )}
                    {status === 'REJECTED' && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-red-500/15 text-red-700 border border-red-200">
                        <X className="h-3 w-3" /> Rejected
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">{u.email}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Registered {(u.createdAt ?? u.created_at) ? new Date((u.createdAt ?? u.created_at) as string).toLocaleDateString() : '—'}
                  </p>
                </div>
                {status === 'PENDING' && (
                  <Button
                    size="sm"
                    variant="destructive"
                    className="shrink-0"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleApprove(u.id);
                    }}
                  >
                    Approve
                  </Button>
                )}
              </div>
            );})}
          </div>
        )}
      </div>

      {/* Full user detail modal */}
      {detailUserId && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
          onClick={() => setDetailUserId(null)}
          role="dialog"
          aria-modal="true"
          aria-label="User details"
        >
          <div
            className="bg-page border border-border rounded-xl shadow-xl max-w-lg w-full max-h-[85vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 border-b border-border flex items-center justify-between sticky top-0 bg-page">
              <h2 className="text-lg font-semibold">User details</h2>
              <div className="flex items-center gap-1">
                {detail && !editMode && (
                  <>
                    <Button variant="ghost" size="sm" onClick={openEdit} className="gap-1">
                      <Pencil className="h-4 w-4" /> Edit
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => setDeleteConfirm(detail.user.id)} className="text-destructive hover:text-destructive">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </>
                )}
                <Button variant="ghost" size="sm" onClick={() => { setDetailUserId(null); setEditMode(false); setDeleteConfirm(null); setActionError(''); }}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="p-4 space-y-4">
              {actionError && (
                <div className="rounded-md bg-destructive/10 text-destructive text-sm p-2">{actionError}</div>
              )}
              {detailLoading ? (
                <p className="text-muted-foreground">Loading...</p>
              ) : detail ? editMode ? (
                <div className="space-y-4">
                  <div className="grid gap-2">
                    <Label>Name</Label>
                    <Input value={editForm.name} onChange={(e) => setEditForm((f) => ({ ...f, name: e.target.value }))} />
                  </div>
                  <div className="grid gap-2">
                    <Label>Email</Label>
                    <Input type="email" value={editForm.email} onChange={(e) => setEditForm((f) => ({ ...f, email: e.target.value }))} />
                  </div>
                  {(detail.user.role === 'GCC' || detail.user.role === 'STARTUP') && (
                    <div className="border-t border-border pt-4 space-y-2">
                      <Label>Company / profile</Label>
                      <div className="grid gap-2">
                        <Input
                          placeholder="Company name"
                          value={String(editForm.profile?.company_name ?? '')}
                          onChange={(e) => setEditForm((f) => ({ ...f, profile: { ...f.profile, company_name: e.target.value } }))}
                        />
                        <Input
                          placeholder="Website"
                          value={String(editForm.profile?.website ?? '')}
                          onChange={(e) => setEditForm((f) => ({ ...f, profile: { ...f.profile, website: e.target.value } }))}
                        />
                        {detail.user.role === 'STARTUP' && (
                          <Input
                            placeholder="Solution description"
                            value={String(editForm.profile?.solution_description ?? '')}
                            onChange={(e) => setEditForm((f) => ({ ...f, profile: { ...f.profile, solution_description: e.target.value } }))}
                          />
                        )}
                        {detail.user.role === 'GCC' && (
                          <Input
                            placeholder="Description"
                            value={String(editForm.profile?.description ?? '')}
                            onChange={(e) => setEditForm((f) => ({ ...f, profile: { ...f.profile, description: e.target.value } }))}
                          />
                        )}
                      </div>
                    </div>
                  )}
                  <div className="flex gap-2">
                    <Button onClick={handleSaveEdit} disabled={saving}>{saving ? 'Saving...' : 'Save'}</Button>
                    <Button variant="outline" onClick={() => setEditMode(false)}>Cancel</Button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="grid gap-2">
                    <div className="text-sm text-muted-foreground">Name</div>
                    <div className="font-medium text-foreground">{detail.user.name}</div>
                  </div>
                  <div className="grid gap-2">
                    <div className="text-sm text-muted-foreground">Email</div>
                    <div className="text-foreground">{detail.user.email}</div>
                  </div>
                  <div className="grid gap-2">
                    <div className="text-sm text-muted-foreground">Role</div>
                    <div className="text-foreground">{detail.user.role}</div>
                  </div>
                  <div className="grid gap-2">
                    <div className="text-sm text-muted-foreground">Approval status</div>
                    <div className="text-foreground">{(detail.user.approvalStatus ?? detail.user.approval_status) ?? '—'}</div>
                  </div>
                  <div className="grid gap-2">
                    <div className="text-sm text-muted-foreground">Registered</div>
                    <div className="text-foreground">
                      {(detail.user.createdAt ?? detail.user.created_at)
                        ? new Date((detail.user.createdAt ?? detail.user.created_at) as string).toLocaleString()
                        : '—'}
                    </div>
                  </div>
                  {detail.user.updated_at && (
                    <div className="grid gap-2">
                      <div className="text-sm text-muted-foreground">Last updated</div>
                      <div className="text-foreground">{new Date(detail.user.updated_at as string).toLocaleString()}</div>
                    </div>
                  )}
                  {detail.profile && Object.keys(detail.profile).length > 0 && (
                    <div className="border-t border-border pt-4 mt-4">
                      <div className="text-sm font-medium text-muted-foreground mb-2">Profile data</div>
                      <pre className="text-xs bg-muted/50 text-foreground p-3 rounded-lg overflow-x-auto max-h-48 overflow-y-auto">
                        {JSON.stringify(detail.profile, null, 2)}
                      </pre>
                    </div>
                  )}
                  <div className="flex flex-wrap gap-2 pt-4 border-t border-border">
                    {((detail.user.approvalStatus ?? detail.user.approval_status) === 'PENDING') && (
                      <Button variant="default" onClick={() => handleApprove(detail.user.id)}>
                        Approve user
                      </Button>
                    )}
                    {detail.user.role === 'STARTUP' && (
                      <Button variant="outline" onClick={() => handleRequestReverification(detail.user.id)} className="gap-1">
                        <RefreshCw className="h-4 w-4" /> Request reverification
                      </Button>
                    )}
                  </div>
                  {deleteConfirm === detail.user.id && (
                    <div className="rounded-lg border border-destructive/50 bg-destructive/5 p-4 flex flex-col gap-2">
                      <p className="text-sm font-medium">Delete this user and their profile? This cannot be undone.</p>
                      <div className="flex gap-2">
                        <Button variant="destructive" size="sm" onClick={() => handleDelete(detail.user.id)}>Delete</Button>
                        <Button variant="outline" size="sm" onClick={() => setDeleteConfirm(null)}>Cancel</Button>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <p className="text-muted-foreground">Could not load user.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
