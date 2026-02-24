import { useEffect, useState } from 'react';
import { adminApi } from '@/lib/api';
import type { AdminRequirementListItem, AdminRequirementDetail, AdminRequirementUpdate, AdminRequirementCreate } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { FileText, Pencil, Trash2, RefreshCw, Users, X, Plus } from 'lucide-react';

const STATUS_OPTIONS = ['OPEN', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'];
const APPROVAL_OPTIONS = ['PENDING_APPROVAL', 'APPROVED', 'SENT_BACK', 'REJECTED'];
const PRIORITY_OPTIONS = ['LOW', 'MEDIUM', 'HIGH', 'URGENT'];

export default function AdminRequirements() {
  const [list, setList] = useState<AdminRequirementListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<{ category?: string; status?: string; approval_status?: string; search?: string }>({});
  const [searchInput, setSearchInput] = useState('');
  const [detailId, setDetailId] = useState<string | null>(null);
  const [detail, setDetail] = useState<AdminRequirementDetail | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editForm, setEditForm] = useState<AdminRequirementUpdate>({});
  const [saving, setSaving] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [actionError, setActionError] = useState('');
  const [createOpen, setCreateOpen] = useState(false);
  const [createForm, setCreateForm] = useState<Partial<AdminRequirementCreate>>({ priority: 'MEDIUM' });
  const [createSaving, setCreateSaving] = useState(false);
  const [gccUsers, setGccUsers] = useState<{ id: string; name: string; email: string }[]>([]);

  const loadList = () => {
    setLoading(true);
    adminApi
      .getRequirements(filters)
      .then(setList)
      .catch(() => setList([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadList();
  }, [filters]);

  useEffect(() => {
    if (createOpen) {
      adminApi.getUsers('GCC').then((list) => setGccUsers(list)).catch(() => setGccUsers([]));
    }
  }, [createOpen]);

  useEffect(() => {
    const t = setTimeout(() => setFilters((f) => ({ ...f, search: searchInput.trim() || undefined })), 300);
    return () => clearTimeout(t);
  }, [searchInput]);

  useEffect(() => {
    if (!detailId) {
      setDetail(null);
      return;
    }
    setDetailLoading(true);
    adminApi.getRequirement(detailId).then(setDetail).catch(() => setDetail(null)).finally(() => setDetailLoading(false));
  }, [detailId]);

  const openEdit = () => {
    if (!detail) return;
    setEditForm({
      title: detail.title,
      description: detail.description,
      category: detail.category,
      priority: detail.priority,
      status: detail.status,
      approval_status: detail.approval_status,
      budget_min: detail.budget_min,
      budget_max: detail.budget_max,
      budget_currency: detail.budget_currency,
      timeline_start: detail.timeline_start,
      timeline_end: detail.timeline_end,
      tech_stack: detail.tech_stack?.length ? [...detail.tech_stack] : undefined,
      skills: detail.skills?.length ? [...detail.skills] : undefined,
      industry_type: detail.industry_type,
      nda_required: detail.nda_required,
    });
    setEditMode(true);
    setActionError('');
  };

  const handleSave = async () => {
    if (!detailId) return;
    setSaving(true);
    setActionError('');
    try {
      await adminApi.updateRequirement(detailId, editForm);
      setEditMode(false);
      loadList();
      adminApi.getRequirement(detailId).then(setDetail).catch(() => setDetail(null));
    } catch (e: unknown) {
      setActionError(e && typeof e === 'object' && 'message' in e ? String((e as Error).message) : 'Update failed');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    setActionError('');
    try {
      await adminApi.deleteRequirement(id);
      setDeleteConfirmId(null);
      if (detailId === id) setDetailId(null);
      loadList();
    } catch (e: unknown) {
      setActionError(e && typeof e === 'object' && 'message' in e ? String((e as Error).message) : 'Delete failed');
    }
  };

  const handleCreate = async () => {
    const { gcc_user_id, title, description, category } = createForm;
    if (!gcc_user_id || !title?.trim() || !description?.trim() || !category?.trim()) {
      setActionError('GCC user, title, description and category are required.');
      return;
    }
    setCreateSaving(true);
    setActionError('');
    try {
      await adminApi.createRequirement(createForm as AdminRequirementCreate);
      setCreateOpen(false);
      setCreateForm({ priority: 'MEDIUM' });
      loadList();
    } catch (e: unknown) {
      setActionError(e && typeof e === 'object' && 'message' in e ? String((e as Error).message) : 'Create failed');
    } finally {
      setCreateSaving(false);
    }
  };

  return (
    <div className="min-h-screen pt-6 pb-16">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between gap-4 mb-6">
          <h1 className="text-2xl font-bold">All Requirements</h1>
          <div className="flex gap-2">
            <Button size="sm" onClick={() => { setCreateOpen(true); setActionError(''); }} className="gap-1">
              <Plus className="h-4 w-4" /> Create
            </Button>
            <Button variant="outline" size="sm" onClick={loadList} disabled={loading} className="gap-2">
              <RefreshCw className="h-4 w-4" />
              Refresh
            </Button>
          </div>
        </div>
        <p className="text-muted-foreground text-sm mb-6">
          View and manage all GCC requirements. Click a row to view details; edit or delete from the detail panel.
        </p>

        <div className="flex flex-wrap gap-2 mb-6">
          <Input
            placeholder="Search title/description..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="max-w-xs"
          />
          <select
            className="rounded-lg border border-input bg-background px-3 py-2 text-sm"
            value={filters.status ?? ''}
            onChange={(e) => setFilters((f) => ({ ...f, status: e.target.value || undefined }))}
          >
            <option value="">All statuses</option>
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>{s.replace('_', ' ')}</option>
            ))}
          </select>
          <select
            className="rounded-lg border border-input bg-background px-3 py-2 text-sm"
            value={filters.approval_status ?? ''}
            onChange={(e) => setFilters((f) => ({ ...f, approval_status: e.target.value || undefined }))}
          >
            <option value="">All approval</option>
            {APPROVAL_OPTIONS.map((a) => (
              <option key={a} value={a}>{a.replace('_', ' ')}</option>
            ))}
          </select>
        </div>

        {actionError && (
          <div className="mb-4 rounded-lg border border-destructive/50 bg-destructive/10 px-4 py-2 text-sm text-destructive">
            {actionError}
          </div>
        )}

        <div className="grid lg:grid-cols-2 gap-6">
          <div>
            {loading ? (
              <p className="text-muted-foreground">Loading...</p>
            ) : list.length === 0 ? (
              <div className="page-card p-12 text-center text-muted-foreground">
                No requirements found.
              </div>
            ) : (
              <div className="space-y-2">
                {list.map((r) => (
                  <div
                    key={r.id}
                    role="button"
                    tabIndex={0}
                    onClick={() => setDetailId(r.id)}
                    onKeyDown={(e) => e.key === 'Enter' && setDetailId(r.id)}
                    className={`page-card p-4 cursor-pointer hover:border-primary/30 transition ${detailId === r.id ? 'ring-2 ring-primary' : ''}`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-medium truncate">{r.title}</span>
                          <span className="chip chip-default text-xs">{r.category}</span>
                          <span className="text-xs text-muted-foreground">{r.status}</span>
                          <span className="text-xs text-muted-foreground">{r.approval_status}</span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">by {r.gcc_name}</p>
                        <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                          <Users className="h-3 w-3" />
                          {Number(r.interest_count) ?? 0} interested
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            {detailId && (
              <div className="page-card p-6 sticky top-4">
                {detailLoading ? (
                  <p className="text-muted-foreground">Loading...</p>
                ) : detail ? (
                  <>
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-lg font-semibold">{detail.title}</h2>
                      <Button variant="ghost" size="sm" onClick={() => setDetailId(null)}>
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    {!editMode ? (
                      <>
                        <div className="space-y-2 text-sm">
                          <p><span className="text-muted-foreground">Category:</span> {detail.category}</p>
                          <p><span className="text-muted-foreground">Status:</span> {detail.status}</p>
                          <p><span className="text-muted-foreground">Approval:</span> {detail.approval_status}</p>
                          <p><span className="text-muted-foreground">GCC:</span> {detail.gcc_name} ({detail.gcc_email})</p>
                          <p><span className="text-muted-foreground">Interests:</span> {Number(detail.interest_count) ?? 0}</p>
                          <p className="whitespace-pre-wrap mt-2">{detail.description}</p>
                          {detail.budget_min != null || detail.budget_max != null ? (
                            <p>Budget: {detail.budget_min ?? '?'} - {detail.budget_max ?? '?'} {detail.budget_currency ?? 'USD'}</p>
                          ) : null}
                          {detail.timeline_start && <p>Timeline: {detail.timeline_start} to {detail.timeline_end ?? '—'}</p>}
                        </div>
                        <div className="flex gap-2 mt-6">
                          <Button size="sm" variant="outline" onClick={openEdit} className="gap-1">
                            <Pencil className="h-4 w-4" /> Edit
                          </Button>
                          <Button size="sm" variant="outline" className="text-destructive gap-1" onClick={() => setDeleteConfirmId(detail.id)}>
                            <Trash2 className="h-4 w-4" /> Delete
                          </Button>
                        </div>
                      </>
                    ) : (
                      <div className="space-y-4">
                        <div>
                          <Label>Title</Label>
                          <Input value={editForm.title ?? ''} onChange={(e) => setEditForm((f) => ({ ...f, title: e.target.value }))} className="mt-1" />
                        </div>
                        <div>
                          <Label>Description</Label>
                          <textarea
                            className="w-full min-h-[100px] rounded-lg border border-input bg-background px-3 py-2 text-sm mt-1"
                            value={editForm.description ?? ''}
                            onChange={(e) => setEditForm((f) => ({ ...f, description: e.target.value }))}
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <Label>Category</Label>
                            <Input value={editForm.category ?? ''} onChange={(e) => setEditForm((f) => ({ ...f, category: e.target.value }))} className="mt-1" />
                          </div>
                          <div>
                            <Label>Priority</Label>
                            <select
                              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm mt-1"
                              value={editForm.priority ?? ''}
                              onChange={(e) => setEditForm((f) => ({ ...f, priority: e.target.value }))}
                            >
                              {PRIORITY_OPTIONS.map((p) => (
                                <option key={p} value={p}>{p}</option>
                              ))}
                            </select>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <Label>Status</Label>
                            <select
                              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm mt-1"
                              value={editForm.status ?? ''}
                              onChange={(e) => setEditForm((f) => ({ ...f, status: e.target.value }))}
                            >
                              {STATUS_OPTIONS.map((s) => (
                                <option key={s} value={s}>{s}</option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <Label>Approval status</Label>
                            <select
                              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm mt-1"
                              value={editForm.approval_status ?? ''}
                              onChange={(e) => setEditForm((f) => ({ ...f, approval_status: e.target.value }))}
                            >
                              {APPROVAL_OPTIONS.map((a) => (
                                <option key={a} value={a}>{a}</option>
                              ))}
                            </select>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" onClick={handleSave} disabled={saving}>{saving ? 'Saving...' : 'Save'}</Button>
                          <Button size="sm" variant="outline" onClick={() => setEditMode(false)}>Cancel</Button>
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <p className="text-muted-foreground">Could not load requirement.</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {deleteConfirmId && (
        <ConfirmDialog
          open
          onClose={() => setDeleteConfirmId(null)}
          title="Delete requirement?"
          message="This will permanently delete the requirement and all expressions of interest linked to it. This cannot be undone."
          confirmLabel="Yes, delete"
          cancelLabel="No"
          variant="destructive"
          onConfirm={() => handleDelete(deleteConfirmId)}
        />
      )}

      {createOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-page border border-border rounded-xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6">
            <h2 className="text-lg font-semibold mb-4">Create requirement</h2>
            <div className="space-y-4">
              <div>
                <Label>GCC owner *</Label>
                <select
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm mt-1"
                  value={createForm.gcc_user_id ?? ''}
                  onChange={(e) => setCreateForm((f) => ({ ...f, gcc_user_id: e.target.value }))}
                >
                  <option value="">Select GCC user</option>
                  {gccUsers.map((u) => (
                    <option key={u.id} value={u.id}>{u.name} ({u.email})</option>
                  ))}
                </select>
              </div>
              <div>
                <Label>Title *</Label>
                <Input value={createForm.title ?? ''} onChange={(e) => setCreateForm((f) => ({ ...f, title: e.target.value }))} className="mt-1" />
              </div>
              <div>
                <Label>Description *</Label>
                <textarea
                  className="w-full min-h-[80px] rounded-lg border border-input bg-background px-3 py-2 text-sm mt-1"
                  value={createForm.description ?? ''}
                  onChange={(e) => setCreateForm((f) => ({ ...f, description: e.target.value }))}
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label>Category *</Label>
                  <Input value={createForm.category ?? ''} onChange={(e) => setCreateForm((f) => ({ ...f, category: e.target.value }))} className="mt-1" />
                </div>
                <div>
                  <Label>Priority</Label>
                  <select
                    className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm mt-1"
                    value={createForm.priority ?? 'MEDIUM'}
                    onChange={(e) => setCreateForm((f) => ({ ...f, priority: e.target.value }))}
                  >
                    {PRIORITY_OPTIONS.map((p) => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            <div className="flex gap-2 mt-6">
              <Button size="sm" onClick={handleCreate} disabled={createSaving}>{createSaving ? 'Creating...' : 'Create'}</Button>
              <Button size="sm" variant="outline" onClick={() => { setCreateOpen(false); setActionError(''); }}>Cancel</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
