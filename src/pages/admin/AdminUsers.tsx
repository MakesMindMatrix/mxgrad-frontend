import { useEffect, useState } from 'react';
import { adminApi } from '@/lib/api';
import type { AdminManagedStartupItem, AdminUserDetailResponse, User } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { Users, Building2, Rocket, Check, X, Pencil, Trash2, RefreshCw, BriefcaseBusiness } from 'lucide-react';

type RoleFilter = 'ALL' | 'GCC' | 'STARTUP' | 'INCUBATION';

function profileKeyToLabel(key: string): string {
  return key
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

function formatProfileValue(value: unknown): string {
  if (value == null || value === '') return '-';
  if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}T/.test(value)) {
    try {
      return new Date(value).toLocaleString();
    } catch {
      return value;
    }
  }
  if (Array.isArray(value)) return value.length ? value.join(', ') : '-';
  if (typeof value === 'object') return JSON.stringify(value);
  return String(value);
}

function ProfileDataFields({ profile }: { profile: Record<string, unknown> }) {
  const skipKeys = new Set(['id', 'user_id']);
  const entries = Object.entries(profile)
    .filter(([key]) => !skipKeys.has(key))
    .sort(([a], [b]) => a.localeCompare(b));

  return (
    <>
      {entries.map(([key, value]) => (
        <div key={key} className="grid gap-1">
          <div className="text-sm text-muted-foreground">{profileKeyToLabel(key)}</div>
          <div className="text-foreground text-sm break-words">{formatProfileValue(value)}</div>
        </div>
      ))}
    </>
  );
}

function StatusChip({ status }: { status?: string }) {
  if (status === 'APPROVED') {
    return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-green-500/15 text-green-700 border border-green-200"><Check className="h-3 w-3" /> Approved</span>;
  }
  if (status === 'PENDING') {
    return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-amber-500/15 text-amber-700 border border-amber-200">Pending</span>;
  }
  if (status === 'REJECTED') {
    return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-red-500/15 text-red-700 border border-red-200"><X className="h-3 w-3" /> Rejected</span>;
  }
  return null;
}

function RoleChip({ user }: { user: User }) {
  const className = user.role === 'GCC' ? 'chip-default' : user.role === 'INCUBATION' ? 'chip-cloud' : 'chip-ai';
  return <span className={`chip ${className}`}>{user.role}</span>;
}

function ManagedStartupCard({
  startup,
  onOpen,
  onApprove,
  onReject,
  onDelete,
}: {
  startup: AdminManagedStartupItem;
  onOpen: () => void;
  onApprove: () => void;
  onReject: () => void;
  onDelete: () => void;
}) {
  return (
    <div className="rounded-lg border border-border p-4">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-medium">{startup.company_name || startup.name}</span>
            <StatusChip status={startup.approval_status} />
          </div>
          <p className="text-sm text-muted-foreground mt-1">{startup.email}</p>
          {startup.solution_description && (
            <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{startup.solution_description}</p>
          )}
          <p className="text-xs text-muted-foreground mt-2">
            Added {startup.created_at ? new Date(startup.created_at).toLocaleDateString() : '-'}
          </p>
        </div>
        <div className="flex flex-wrap gap-2 shrink-0">
          <Button variant="outline" size="sm" onClick={onOpen}>Open</Button>
          {startup.approval_status === 'PENDING' && (
            <>
              <Button size="sm" onClick={onApprove}>Approve</Button>
              <Button variant="outline" size="sm" className="text-destructive" onClick={onReject}>Reject</Button>
            </>
          )}
          <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive hover:bg-destructive/10" onClick={onDelete}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function AdminUsers() {
  const [filter, setFilter] = useState<RoleFilter>('ALL');
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [detailUserId, setDetailUserId] = useState<string | null>(null);
  const [detail, setDetail] = useState<AdminUserDetailResponse | null>(null);
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

  const refreshDetail = (userId: string) => {
    setDetailLoading(true);
    adminApi.getUser(userId).then(setDetail).catch(() => setDetail(null)).finally(() => setDetailLoading(false));
  };

  useEffect(() => {
    loadUsers();
  }, [filter]);

  useEffect(() => {
    if (!detailUserId) {
      setDetail(null);
      return;
    }
    refreshDetail(detailUserId);
  }, [detailUserId]);

  const handleApprove = async (userId: string) => {
    try {
      setActionError('');
      await adminApi.approve(userId);
      loadUsers();
      if (detailUserId) refreshDetail(detailUserId);
    } catch (error: unknown) {
      setActionError(error && typeof error === 'object' && 'message' in error ? String((error as { message: string }).message) : 'Failed');
    }
  };

  const handleReject = async (userId: string) => {
    try {
      setActionError('');
      await adminApi.reject(userId);
      loadUsers();
      if (detailUserId) refreshDetail(detailUserId);
    } catch (error: unknown) {
      setActionError(error && typeof error === 'object' && 'message' in error ? String((error as { message: string }).message) : 'Failed');
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
      refreshDetail(detailUserId);
    } catch (error: unknown) {
      setActionError(error && typeof error === 'object' && 'message' in error ? String((error as { message: string }).message) : 'Update failed');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (userId: string) => {
    setActionError('');
    try {
      await adminApi.deleteUser(userId);
      setDeleteConfirm(null);
      if (detailUserId === userId) {
        setDetailUserId(null);
      } else if (detailUserId) {
        refreshDetail(detailUserId);
      }
      loadUsers();
    } catch (error: unknown) {
      setActionError(error && typeof error === 'object' && 'message' in error ? String((error as { message: string }).message) : 'Delete failed');
    }
  };

  const handleRequestReverification = async (userId: string) => {
    setActionError('');
    try {
      await adminApi.requestReverification(userId);
      if (detailUserId) refreshDetail(detailUserId);
    } catch (error: unknown) {
      setActionError(error && typeof error === 'object' && 'message' in error ? String((error as { message: string }).message) : 'Failed');
    }
  };

  return (
    <div className="min-h-screen pt-6 pb-16">
      <div className="container mx-auto px-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <h1 className="text-2xl font-bold">All Users</h1>
          <div className="flex rounded-lg border border-border p-1 bg-muted/30">
            <Button variant={filter === 'ALL' ? 'default' : 'ghost'} size="sm" onClick={() => setFilter('ALL')} className="gap-1.5">
              <Users className="h-4 w-4" />
              All
            </Button>
            <Button variant={filter === 'GCC' ? 'default' : 'ghost'} size="sm" onClick={() => setFilter('GCC')} className="gap-1.5">
              <Building2 className="h-4 w-4" />
              GCCs
            </Button>
            <Button variant={filter === 'STARTUP' ? 'default' : 'ghost'} size="sm" onClick={() => setFilter('STARTUP')} className="gap-1.5">
              <Rocket className="h-4 w-4" />
              Startups
            </Button>
            <Button variant={filter === 'INCUBATION' ? 'default' : 'ghost'} size="sm" onClick={() => setFilter('INCUBATION')} className="gap-1.5">
              <BriefcaseBusiness className="h-4 w-4" />
              Incubation
            </Button>
          </div>
        </div>

        <p className="text-muted-foreground text-sm mb-6">
          View all registered users and their approval status. Startups managed by incubation centers are tagged directly on the admin cards.
        </p>

        {loading ? (
          <p className="text-muted-foreground">Loading...</p>
        ) : users.length === 0 ? (
          <div className="page-card p-12 text-center text-muted-foreground">No users found.</div>
        ) : (
          <div className="space-y-3">
            {users.map((user) => {
              const status = (user.approvalStatus ?? user.approval_status) as string | undefined;
              const managedStartupCount = Number(user.managed_startup_count ?? 0);
              return (
                <div
                  key={user.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => setDetailUserId(user.id)}
                  onKeyDown={(event) => event.key === 'Enter' && setDetailUserId(user.id)}
                  className="page-card p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer hover:border-primary/30 transition"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-medium">{user.name}</span>
                      <RoleChip user={user} />
                      <StatusChip status={status} />
                      {user.role === 'STARTUP' && user.managed_by_name && (
                        <span className="chip bg-amber-500/15 text-amber-700">Incubation tagged</span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{user.email}</p>
                    {user.role === 'STARTUP' && user.managed_by_name && (
                      <p className="text-xs text-muted-foreground mt-1">
                        Managed by <span className="text-foreground font-medium">{user.managed_by_name}</span>
                      </p>
                    )}
                    {user.role === 'INCUBATION' && managedStartupCount > 0 && (
                      <p className="text-xs text-muted-foreground mt-1">
                        Managing {managedStartupCount} startup{managedStartupCount === 1 ? '' : 's'}
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Registered {(user.createdAt ?? user.created_at) ? new Date((user.createdAt ?? user.created_at) as string).toLocaleDateString() : '-'}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {status === 'PENDING' && (
                      <>
                        <Button
                          size="sm"
                          onClick={(event) => {
                            event.stopPropagation();
                            handleApprove(user.id);
                          }}
                        >
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-destructive"
                          onClick={(event) => {
                            event.stopPropagation();
                            handleReject(user.id);
                          }}
                        >
                          Reject
                        </Button>
                      </>
                    )}
                    {user.role !== 'ADMIN' && (
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                        onClick={(event) => {
                          event.stopPropagation();
                          setDetailUserId(user.id);
                          setDeleteConfirm(user.id);
                        }}
                        title="Delete user and all profile data"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {detailUserId && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
          onClick={() => setDetailUserId(null)}
          role="dialog"
          aria-modal="true"
          aria-label="User details"
        >
          <div
            className="bg-page border border-border rounded-xl shadow-xl max-w-5xl w-full max-h-[85vh] overflow-y-auto"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="p-4 border-b border-border flex items-center justify-between sticky top-0 bg-page">
              <h2 className="text-lg font-semibold">User details</h2>
              <div className="flex items-center gap-1">
                {detail && !editMode && (
                  <>
                    <Button variant="ghost" size="sm" onClick={openEdit} className="gap-1">
                      <Pencil className="h-4 w-4" /> Edit
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => setDeleteConfirm(detail.user.id)} className="gap-1 text-destructive hover:text-destructive hover:bg-destructive/10">
                      <Trash2 className="h-4 w-4" /> Delete user
                    </Button>
                  </>
                )}
                <Button variant="ghost" size="sm" onClick={() => { setDetailUserId(null); setEditMode(false); setDeleteConfirm(null); setActionError(''); }}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="p-4 space-y-4">
              {actionError && <div className="rounded-md bg-destructive/10 text-destructive text-sm p-2">{actionError}</div>}

              {detailLoading ? (
                <p className="text-muted-foreground">Loading...</p>
              ) : detail ? editMode ? (
                <div className="space-y-4">
                  <div className="grid gap-2">
                    <Label>Name</Label>
                    <Input value={editForm.name} onChange={(event) => setEditForm((current) => ({ ...current, name: event.target.value }))} />
                  </div>
                  <div className="grid gap-2">
                    <Label>Email</Label>
                    <Input type="email" value={editForm.email} onChange={(event) => setEditForm((current) => ({ ...current, email: event.target.value }))} />
                  </div>
                  {(detail.user.role === 'GCC' || detail.user.role === 'STARTUP' || detail.user.role === 'INCUBATION') && (
                    <div className="border-t border-border pt-4 space-y-2">
                      <Label>Company / profile</Label>
                      <div className="grid gap-2">
                        <Input
                          placeholder="Company name"
                          value={String(editForm.profile?.company_name ?? '')}
                          onChange={(event) => setEditForm((current) => ({ ...current, profile: { ...current.profile, company_name: event.target.value } }))}
                        />
                        <Input
                          placeholder="Website"
                          value={String(editForm.profile?.website ?? '')}
                          onChange={(event) => setEditForm((current) => ({ ...current, profile: { ...current.profile, website: event.target.value } }))}
                        />
                        {detail.user.role === 'STARTUP' && (
                          <Input
                            placeholder="Solution description"
                            value={String(editForm.profile?.solution_description ?? '')}
                            onChange={(event) => setEditForm((current) => ({ ...current, profile: { ...current.profile, solution_description: event.target.value } }))}
                          />
                        )}
                        {(detail.user.role === 'GCC' || detail.user.role === 'INCUBATION') && (
                          <Input
                            placeholder="Description"
                            value={String(editForm.profile?.description ?? '')}
                            onChange={(event) => setEditForm((current) => ({ ...current, profile: { ...current.profile, description: event.target.value } }))}
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
                  <div className="grid md:grid-cols-2 gap-4">
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
                      <div className="text-foreground flex items-center gap-2"><RoleChip user={detail.user} /></div>
                    </div>
                    <div className="grid gap-2">
                      <div className="text-sm text-muted-foreground">Approval status</div>
                      <div className="text-foreground">{(detail.user.approvalStatus ?? detail.user.approval_status) ?? '-'}</div>
                    </div>
                    <div className="grid gap-2">
                      <div className="text-sm text-muted-foreground">Registered</div>
                      <div className="text-foreground">
                        {(detail.user.createdAt ?? detail.user.created_at)
                          ? new Date((detail.user.createdAt ?? detail.user.created_at) as string).toLocaleString()
                          : '-'}
                      </div>
                    </div>
                    {detail.user.updated_at && (
                      <div className="grid gap-2">
                        <div className="text-sm text-muted-foreground">Last updated</div>
                        <div className="text-foreground">{new Date(detail.user.updated_at as string).toLocaleString()}</div>
                      </div>
                    )}
                  </div>

                  {detail.user.role === 'STARTUP' && detail.user.managed_by_name && (
                    <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 p-4">
                      <p className="text-sm font-medium text-foreground">Incubation association</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        This startup is managed by <span className="text-foreground font-medium">{detail.user.managed_by_name}</span>
                        {detail.user.managed_by_email ? <> ({detail.user.managed_by_email})</> : null}.
                      </p>
                    </div>
                  )}

                  {detail.profile && Object.keys(detail.profile).length > 0 && (
                    <div className="border-t border-border pt-4 mt-4">
                      <div className="text-sm font-medium text-muted-foreground mb-3">Profile data</div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 max-h-64 overflow-y-auto pr-2">
                        <ProfileDataFields profile={detail.profile as Record<string, unknown>} />
                      </div>
                    </div>
                  )}

                  {detail.user.role === 'INCUBATION' && (detail.managedStartups?.length ?? 0) > 0 && (
                    <div className="border-t border-border pt-4 mt-4 space-y-3">
                      <div>
                        <div className="text-sm font-medium text-muted-foreground mb-1">Managed startups</div>
                        <p className="text-xs text-muted-foreground">Approve, reject, delete, or open startup records directly from under this incubation center.</p>
                      </div>
                      <div className="space-y-3">
                        {detail.managedStartups?.map((startup) => (
                          <ManagedStartupCard
                            key={startup.id}
                            startup={startup}
                            onOpen={() => setDetailUserId(startup.id)}
                            onApprove={() => handleApprove(startup.id)}
                            onReject={() => handleReject(startup.id)}
                            onDelete={() => setDeleteConfirm(startup.id)}
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex flex-wrap gap-2 pt-4 border-t border-border">
                    {(detail.user.approvalStatus ?? detail.user.approval_status) === 'PENDING' && (
                      <>
                        <Button variant="default" onClick={() => handleApprove(detail.user.id)}>Approve user</Button>
                        <Button variant="outline" className="text-destructive" onClick={() => handleReject(detail.user.id)}>Reject user</Button>
                      </>
                    )}
                    {detail.user.role === 'STARTUP' && (
                      <Button variant="outline" onClick={() => handleRequestReverification(detail.user.id)} className="gap-1">
                        <RefreshCw className="h-4 w-4" /> Request reverification
                      </Button>
                    )}
                  </div>
                </>
              ) : (
                <p className="text-muted-foreground">Could not load user.</p>
              )}
            </div>
          </div>
        </div>
      )}

      {deleteConfirm && (
        <ConfirmDialog
          open
          onClose={() => setDeleteConfirm(null)}
          title="Delete user?"
          message={`Permanently delete ${users.find((user) => user.id === deleteConfirm)?.name ?? detail?.managedStartups?.find((startup) => startup.id === deleteConfirm)?.name ?? 'this user'}? This will erase the user account and all related profile data. This cannot be undone.`}
          confirmLabel="Yes, delete user"
          cancelLabel="No"
          variant="destructive"
          onConfirm={async () => {
            await handleDelete(deleteConfirm);
            setDeleteConfirm(null);
          }}
        />
      )}
    </div>
  );
}
