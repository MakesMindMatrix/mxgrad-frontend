const API_BASE = import.meta.env.VITE_API_URL || '/api';

function getToken(): string | null {
  return localStorage.getItem('token');
}

export async function api<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });
  const data = res.status === 204 || res.headers.get('content-length') === '0'
    ? {}
    : await res.json().catch(() => ({}));

  if (!res.ok) {
    const err = new ApiError(res.status, (data && typeof data === 'object' && 'message' in data ? (data as { message: string }).message : null) || 'Request failed', (data as { code?: string })?.code);
    err.data = data as Record<string, unknown>;
    throw err;
  }
  return data as T;
}

export class ApiError extends Error {
  data?: Record<string, unknown>;
  constructor(
    public status: number,
    message: string,
    public code?: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export type ApprovalStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  role: 'GCC' | 'STARTUP' | 'INCUBATION';
  company_website?: string;
  description: string;
  gst_number?: string;
  additional_email?: string;
  mobile_primary?: string;
  mobile_secondary?: string;
  company_name?: string;
  parent_company?: string;
  year_established?: number;
  industry?: string;
}

// Auth
export const authApi = {
  register: (body: RegisterPayload) =>
    api<{ user: User; message: string }>('/auth/register', { method: 'POST', body: JSON.stringify(body) }),
  login: (email: string, password: string) =>
    api<{ token: string; user: User; expiresIn: string }>('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),
  me: () => api<User>('/auth/me'),
};

// Admin
export interface RequirementApprovalItem {
  id: string;
  gcc_user_id: string;
  title: string;
  description: string;
  category: string;
  priority: string;
  status: string;
  approval_status: string;
  admin_remarks?: string | null;
  admin_remarks_at?: string | null;
  created_at: string;
  gcc_name: string;
  gcc_email: string;
}

export interface EoiApprovalItem {
  id: string;
  requirement_id: string;
  message: string;
  status: string;
  created_at: string;
  updated_at?: string;
  requirement_title: string;
  startup_name: string;
  startup_email: string;
}

export interface AdminActivityRequirement {
  id: string;
  title: string;
  category: string;
  status: string;
  created_at: string;
  gcc_name: string;
  gcc_email: string;
}

export interface AdminActivityInterest {
  id: string;
  message: string;
  status: string;
  created_at: string;
  requirement_title: string;
  startup_name: string;
  startup_email: string;
}

export const adminApi = {
  getPendingApprovals: () => api<User[]>('/admin/approvals'),
  approve: (userId: string) => api<User>(`/admin/approvals/${userId}/approve`, { method: 'POST' }),
  reject: (userId: string) => api<User>(`/admin/approvals/${userId}/reject`, { method: 'POST' }),
  getUsers: (role?: 'GCC' | 'STARTUP' | 'INCUBATION') => api<User[]>(`/admin/users${role ? `?role=${role}` : ''}`),
  getUser: (userId: string) =>
    api<{ user: User; profile: Record<string, unknown> | null }>(`/admin/users/${userId}`),
  updateUser: (userId: string, data: { name?: string; email?: string; profile?: Record<string, unknown> }) =>
    api<User>(`/admin/users/${userId}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteUser: (userId: string) =>
    api<void>(`/admin/users/${userId}`, { method: 'DELETE' }),
  requestReverification: (userId: string) =>
    api<{ message: string }>(`/admin/users/${userId}/request-reverification`, { method: 'POST' }),
  getStats: () =>
    api<{
      totalUsers: number;
      pendingApprovals: number;
      pendingRequirementApprovals?: number;
      openRequirements: number;
      pendingInterests: number;
    }>('/admin/stats'),
  getActivities: () =>
    api<{ requirements: AdminActivityRequirement[]; expressionsOfInterest: AdminActivityInterest[] }>('/admin/activities'),
  getActiveProjects: () => api<unknown[]>('/admin/active-projects'),
  getPendingRequirementApprovals: () =>
    api<RequirementApprovalItem[]>('/admin/requirement-approvals'),
  approveRequirement: (requirementId: string) =>
    api<{ id: string; title: string; approval_status: string }>(
      `/admin/requirement-approvals/${requirementId}/approve`,
      { method: 'POST' }
    ),
  sendBackRequirement: (requirementId: string, remarks: string) =>
    api<{ id: string; title: string; approval_status: string; admin_remarks: string | null; admin_remarks_at: string | null }>(
      `/admin/requirement-approvals/${requirementId}/send-back`,
      { method: 'POST', body: JSON.stringify({ remarks }) }
    ),
  rejectRequirement: (requirementId: string, remarks: string) =>
    api<{ id: string; title: string; approval_status: string; admin_remarks: string | null; admin_remarks_at: string | null }>(
      `/admin/requirement-approvals/${requirementId}/reject`,
      { method: 'POST', body: JSON.stringify({ remarks }) }
    ),
  getExploreRequirements: (params?: { category?: string; search?: string }) => {
    const q = new URLSearchParams();
    if (params?.category && params.category !== 'All') q.set('category', params.category);
    if (params?.search?.trim()) q.set('search', params.search.trim());
    return api<Requirement[]>(`/admin/explore-requirements${q.toString() ? `?${q}` : ''}`);
  },
  getEoiApprovals: () => api<EoiApprovalItem[]>('/admin/eoi-approvals'),
  approveEoi: (eoiId: string) =>
    api<{ id: string; status: string }>(`/admin/eoi-approvals/${eoiId}/approve`, { method: 'POST' }),
  rejectEoi: (eoiId: string) =>
    api<{ id: string; status: string }>(`/admin/eoi-approvals/${eoiId}/reject`, { method: 'POST' }),
  deleteEoi: (eoiId: string) =>
    api<void>(`/admin/eoi-approvals/${eoiId}`, { method: 'DELETE' }),
  // Requirements CRUD
  getRequirements: (params?: { category?: string; status?: string; approval_status?: string; search?: string }) => {
    const q = new URLSearchParams();
    if (params?.category) q.set('category', params.category);
    if (params?.status) q.set('status', params.status);
    if (params?.approval_status) q.set('approval_status', params.approval_status);
    if (params?.search?.trim()) q.set('search', params.search.trim());
    return api<AdminRequirementListItem[]>(`/admin/requirements${q.toString() ? `?${q}` : ''}`);
  },
  getRequirement: (requirementId: string) =>
    api<AdminRequirementDetail>(`/admin/requirements/${requirementId}`),
  createRequirement: (data: AdminRequirementCreate) =>
    api<{ id: string; title: string; category: string; status: string; approval_status: string; created_at: string }>(
      '/admin/requirements',
      { method: 'POST', body: JSON.stringify(data) }
    ),
  updateRequirement: (requirementId: string, data: Partial<AdminRequirementUpdate>) =>
    api<{ id: string; title: string; category: string; status: string; approval_status: string; updated_at: string }>(
      `/admin/requirements/${requirementId}`,
      { method: 'PUT', body: JSON.stringify(data) }
    ),
  deleteRequirement: (requirementId: string) =>
    api<void>(`/admin/requirements/${requirementId}`, { method: 'DELETE' }),
};

export interface AdminRequirementListItem extends Requirement {
  gcc_user_id: string;
  gcc_name: string;
  gcc_email: string;
  interest_count?: number | string;
}

export interface AdminRequirementDetail extends AdminRequirementListItem {
  admin_remarks?: string | null;
  admin_remarks_at?: string | null;
}

export interface AdminRequirementUpdate {
  title?: string;
  description?: string;
  category?: string;
  priority?: string;
  status?: string;
  approval_status?: string;
  budget_min?: number;
  budget_max?: number;
  budget_currency?: string;
  timeline_start?: string;
  timeline_end?: string;
  tech_stack?: string[];
  skills?: string[];
  industry_type?: string;
  nda_required?: boolean;
}

export interface AdminRequirementCreate extends AdminRequirementUpdate {
  gcc_user_id: string;
  title: string;
  description: string;
  category: string;
}

// GCC
export interface StartupListItem {
  id: string;
  name: string;
  email: string;
  company_name?: string;
  industry?: string;
  solution_description?: string;
  website?: string;
  location?: string;
  team_size?: number;
  primary_offering_type?: string;
}

export interface RequirementApplication extends ExpressionOfInterest {
  startup_name: string;
  startup_email: string;
}

export const gccApi = {
  getProfile: () => api<GccProfile | null>('/gcc/profile'),
  updateProfile: (body: Partial<GccProfile>) => api<GccProfile>('/gcc/profile', { method: 'PUT', body: JSON.stringify(body) }),
  listStartups: (params?: { search?: string; industry?: string }) => {
    const q = new URLSearchParams();
    if (params?.search) q.set('search', params.search);
    if (params?.industry) q.set('industry', params.industry);
    return api<StartupListItem[]>(`/gcc/startups${q.toString() ? `?${q}` : ''}`);
  },
  getRequirements: () => api<Requirement[]>('/gcc/requirements'),
  getInterests: () =>
    api<{ id: string; requirement_id: string; requirement_title: string; startup_name: string; startup_company?: string; interest_status: string; created_at: string }[]>('/gcc/interests'),
  getActiveDeals: () =>
    api<{ id: string; title: string; category: string; status: string; updated_at: string; accepted_count: number }[]>('/gcc/active-deals'),
  createRequirement: (body: Partial<Requirement>) => api<Requirement>('/gcc/requirements', { method: 'POST', body: JSON.stringify(body) }),
  getRequirement: (id: string) => api<Requirement & { applications?: RequirementApplication[] }>(`/gcc/requirements/${id}`),
  updateRequirement: (id: string, body: Partial<Requirement>) => api<Requirement>(`/gcc/requirements/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  deleteRequirement: (id: string) => api<void>(`/gcc/requirements/${id}`, { method: 'DELETE' }),
  acceptInterest: (eoiId: string) =>
    api<{ id: string; gcc_response: string; gcc_responded_at: string }>(`/gcc/interests/${eoiId}/accept`, { method: 'POST' }),
  rejectInterest: (eoiId: string) =>
    api<{ id: string; status: string }>(`/gcc/interests/${eoiId}/reject`, { method: 'POST' }),
};

// Startup
export const startupApi = {
  getProfile: () => api<StartupProfile | null>('/startup/profile'),
  updateProfile: (body: Partial<StartupProfile>) => api<StartupProfile>('/startup/profile', { method: 'PUT', body: JSON.stringify(body) }),
};

// Incubation
export interface IncubationStartupListItem {
  id: string;
  name: string;
  email: string;
  approval_status: 'PENDING' | 'APPROVED' | 'REJECTED';
  created_at: string;
  company_name?: string;
  website?: string;
  industry?: string;
  solution_description?: string;
  location?: string;
}

export interface IncubationInterestItem extends ExpressionOfInterest {
  startup_name: string;
  startup_company?: string;
}

export const incubationApi = {
  getProfile: () => api<IncubationProfile | null>('/incubation/profile'),
  updateProfile: (body: Partial<IncubationProfile>) => api<IncubationProfile>('/incubation/profile', { method: 'PUT', body: JSON.stringify(body) }),
  listStartups: (params?: { approval_status?: 'PENDING' | 'APPROVED' | 'REJECTED' }) => {
    const q = new URLSearchParams();
    if (params?.approval_status) q.set('approval_status', params.approval_status);
    return api<IncubationStartupListItem[]>(`/incubation/startups${q.toString() ? `?${q}` : ''}`);
  },
  createStartup: (body: {
    name: string;
    email: string;
    password: string;
    company_name?: string;
    company_website?: string;
    description: string;
    gst_number?: string;
    additional_email?: string;
    mobile_primary?: string;
    mobile_secondary?: string;
  }) => api<{ user: User; message: string }>('/incubation/startups', { method: 'POST', body: JSON.stringify(body) }),
  getInterests: () => api<IncubationInterestItem[]>('/incubation/interests'),
};

// Requirements (public + express interest)
export const requirementsApi = {
  list: (params?: { category?: string; search?: string }) => {
    const q = new URLSearchParams(params as Record<string, string>).toString();
    return api<Requirement[]>(`/requirements${q ? `?${q}` : ''}`);
  },
  get: (id: string) => api<Requirement>(`/requirements/${id}`),
  expressInterest: (
    id: string,
    body: { message?: string; proposed_budget?: number; proposed_timeline_start?: string; proposed_timeline_end?: string; portfolio_link?: string; startup_user_id?: string },
    document?: File
  ) => {
    const form = new FormData();
    if (body.message != null) form.append('message', body.message);
    if (body.proposed_budget != null) form.append('proposed_budget', String(body.proposed_budget));
    if (body.proposed_timeline_start) form.append('proposed_timeline_start', body.proposed_timeline_start);
    if (body.proposed_timeline_end) form.append('proposed_timeline_end', body.proposed_timeline_end);
    if (body.portfolio_link) form.append('portfolio_link', body.portfolio_link);
    if (body.startup_user_id) form.append('startup_user_id', body.startup_user_id);
    if (document) form.append('document', document);
    const token = getToken();
    const headers: Record<string, string> = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;
    return fetch(`${API_BASE}/requirements/${id}/express-interest`, { method: 'POST', body: form, headers }).then(async (res) => {
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new ApiError(res.status, (data as { message?: string }).message || 'Request failed');
      return data as ExpressionOfInterest;
    });
  },
  myInterests: () => api<ExpressionOfInterest[]>('/requirements/my/interests'),
};

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'ADMIN' | 'GCC' | 'STARTUP' | 'INCUBATION';
  approvalStatus?: ApprovalStatus;
  approval_status?: ApprovalStatus;
  managed_by_user_id?: string | null;
  managed_by_name?: string | null;
  managed_by_email?: string | null;
  createdAt?: string;
  created_at?: string;
  updated_at?: string;
}

export interface GccProfile {
  id: string;
  user_id: string;
  company_name?: string;
  industry?: string;
  location?: string;
  size?: string;
  description?: string;
  website?: string;
  contact_person?: string;
  phone?: string;
  linkedin?: string;
  parent_company?: string;
  headquarters_location?: string;
  gcc_locations?: string;
  year_established?: number;
  contact_designation?: string;
  contact_email?: string;
  gst_number?: string;
  additional_email?: string;
  mobile_primary?: string;
  mobile_secondary?: string;
  alternate_contact_person?: string;
  alternate_contact_designation?: string;
  alternate_contact_email?: string;
  alternate_contact_phone?: string;
}

export interface StartupProfile {
  id: string;
  user_id: string;
  company_name?: string;
  legal_entity_name?: string;
  founding_year?: number;
  location?: string;
  website?: string;
  linkedin_page?: string;
  contact_phone?: string;
  gst_number?: string;
  additional_email?: string;
  mobile_primary?: string;
  mobile_secondary?: string;
  founder_names?: string[];
  team_size?: number;
  key_team_members?: { name: string; role: string; linkedin?: string }[];
  industry?: string;
  target_market?: string;
  revenue_stage?: string;
  customer_type?: string;
  solution_description?: string;
  primary_offering_type?: string;
  deployment_stage?: string;
  tech_stack?: string[];
  key_features?: string[];
  has_patents?: boolean;
  patents_description?: string;
  co_creation_interests?: string[];
  gcc_seeking?: string[];
  gcc_co_creation_interest?: string;
  past_collaborations?: string;
  funding?: string;
  total_funds_raised?: string;
  investors?: string[];
  accelerator_programs?: string[];
  pitch_deck_url?: string;
  executive_summary_url?: string;
  data_sharing_consent?: boolean;
  profile_completion_percentage?: number;
}

export interface IncubationProfile {
  id: string;
  user_id: string;
  company_name?: string;
  website?: string;
  description?: string;
  location?: string;
  contact_person?: string;
  phone?: string;
  gst_number?: string;
  additional_email?: string;
  mobile_primary?: string;
  mobile_secondary?: string;
}

export type RequirementApprovalStatus = 'PENDING_APPROVAL' | 'APPROVED' | 'SENT_BACK' | 'REJECTED';

export interface Requirement {
  id: string;
  title: string;
  description: string;
  category: string;
  priority: string;
  status: string;
  approval_status?: RequirementApprovalStatus;
  admin_remarks?: string | null;
  admin_remarks_at?: string | null;
  budget_min?: number;
  budget_max?: number;
  budget_currency?: string;
  timeline_start?: string;
  timeline_end?: string;
  tech_stack?: string[];
  skills?: string[];
  industry_type?: string;
  nda_required?: boolean;
  anonymous_id?: string;
  created_at?: string;
  interest_count?: number | string;
}

export interface ExpressionOfInterest {
  id: string;
  requirement_id: string;
  startup_user_id?: string;
  requirement_title?: string;
  category?: string;
  anonymous_id?: string;
  message?: string;
  status: string;
  gcc_response?: string | null;
  created_at?: string;
  updated_at?: string;
  startup_name?: string;
  startup_company?: string;
  startup_email?: string;
  attachment_path?: string | null;
  attachment_original_name?: string | null;
  proposed_budget?: number | null;
  proposed_timeline_start?: string | null;
  proposed_timeline_end?: string | null;
  portfolio_link?: string | null;
}
