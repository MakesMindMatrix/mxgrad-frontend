import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { gccApi, ApiError } from '@/lib/api';
import type { GccProfile } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

const INDUSTRY_OPTIONS = ['FinTech', 'Healthcare', 'Automotive', 'Retail', 'AI', 'Manufacturing', 'Logistics', 'EdTech', 'Other'];

const emptyProfile: Partial<GccProfile> = {
  company_name: '',
  industry: '',
  location: '',
  size: '',
  description: '',
  website: '',
  contact_person: '',
  phone: '',
  linkedin: '',
  parent_company: '',
  headquarters_location: '',
  gcc_locations: '',
  year_established: undefined,
  contact_designation: '',
  contact_email: '',
};

type StandardDraft = {
  company_name: string;
  parent_company: string;
  year_established: string;
  industry: string;
  headquarters_location: string;
  website: string;
};

const emptyStandardDraft: StandardDraft = {
  company_name: '',
  parent_company: '',
  year_established: '',
  industry: '',
  headquarters_location: '',
  website: '',
};

type EditableFields = {
  gcc_locations: string;
  size: string;
  linkedin: string;
  description: string;
  additional_email: string;
  mobile_secondary: string;
  contact_person: string;
  contact_designation: string;
  contact_email: string;
  phone: string;
  alternate_contact_person: string;
  alternate_contact_designation: string;
  alternate_contact_email: string;
  alternate_contact_phone: string;
};

const emptyEditable: EditableFields = {
  gcc_locations: '',
  size: '',
  linkedin: '',
  description: '',
  additional_email: '',
  mobile_secondary: '',
  contact_person: '',
  contact_designation: '',
  contact_email: '',
  phone: '',
  alternate_contact_person: '',
  alternate_contact_designation: '',
  alternate_contact_email: '',
  alternate_contact_phone: '',
};

export default function GccProfile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Partial<GccProfile>>(emptyProfile);
  const [standardDraft, setStandardDraft] = useState<StandardDraft>(emptyStandardDraft);
  const [editable, setEditable] = useState<EditableFields>(emptyEditable);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    gccApi
      .getProfile()
      .then((p) => {
        const full = { ...emptyProfile, ...p };
        setProfile(full);
        setStandardDraft({
          company_name: full.company_name || '',
          parent_company: full.parent_company || '',
          year_established: full.year_established != null ? String(full.year_established) : '',
          industry: full.industry || '',
          headquarters_location: full.headquarters_location || '',
          website: full.website || '',
        });
        setEditable({
          gcc_locations: full.gcc_locations || '',
          size: full.size || '',
          linkedin: full.linkedin || '',
          description: full.description || '',
          additional_email: full.additional_email || '',
          mobile_secondary: full.mobile_secondary || '',
          contact_person: full.contact_person || '',
          contact_designation: full.contact_designation || '',
          contact_email: full.contact_email || '',
          phone: full.phone || '',
          alternate_contact_person: full.alternate_contact_person || '',
          alternate_contact_designation: full.alternate_contact_designation || '',
          alternate_contact_email: full.alternate_contact_email || '',
          alternate_contact_phone: full.alternate_contact_phone || '',
        });
      })
      .catch(() => {
        setProfile(emptyProfile);
        setEditable(emptyEditable);
      })
      .finally(() => setLoading(false));
  }, []);

  const saveProfile = async () => {
    setSaving(true);
    setMessage('');
    setError('');

    if (editable.contact_email && !editable.contact_email.includes('@')) {
      setSaving(false);
      setError('Please enter a valid work email.');
      return;
    }
    if (editable.alternate_contact_email && !editable.alternate_contact_email.includes('@')) {
      setSaving(false);
      setError('Please enter a valid work email for alternate contact.');
      return;
    }
    const digitsOnly = (s: string) => /^\d+$/.test(s.replace(/\s/g, '').replace(/^\+/, '').replace(/-/g, ''));
    if (editable.mobile_secondary && !digitsOnly(editable.mobile_secondary)) {
      setSaving(false);
      setError('Mobile should contain only digits (and optional + or spaces).');
      return;
    }
    if (editable.phone && !digitsOnly(editable.phone)) {
      setSaving(false);
      setError('Phone should contain only digits (and optional + or spaces).');
      return;
    }

    try {
      const payload: Partial<GccProfile> = {
        company_name: (profile.company_name || standardDraft.company_name) || undefined,
        parent_company: (profile.parent_company || standardDraft.parent_company) || undefined,
        year_established: (profile.year_established != null ? profile.year_established : (standardDraft.year_established ? parseInt(standardDraft.year_established, 10) : undefined)) as number | undefined,
        industry: (profile.industry || standardDraft.industry) || undefined,
        headquarters_location: (profile.headquarters_location || standardDraft.headquarters_location) || undefined,
        website: (profile.website || standardDraft.website) || undefined,
        gcc_locations: editable.gcc_locations || undefined,
        size: editable.size || undefined,
        linkedin: editable.linkedin || undefined,
        description: editable.description || undefined,
        additional_email: editable.additional_email || undefined,
        mobile_secondary: editable.mobile_secondary || undefined,
        contact_person: editable.contact_person || undefined,
        contact_designation: editable.contact_designation || undefined,
        contact_email: editable.contact_email || undefined,
        phone: editable.phone || undefined,
        alternate_contact_person: editable.alternate_contact_person || undefined,
        alternate_contact_designation: editable.alternate_contact_designation || undefined,
        alternate_contact_email: editable.alternate_contact_email || undefined,
        alternate_contact_phone: editable.alternate_contact_phone || undefined,
      };
      if (payload.year_established !== undefined && Number.isNaN(payload.year_established)) delete payload.year_established;

      const updated = await gccApi.updateProfile(payload);
      const full = { ...profile, ...updated };
      setProfile(full);
      setStandardDraft({
        company_name: full.company_name || '',
        parent_company: full.parent_company || '',
        year_established: full.year_established != null ? String(full.year_established) : '',
        industry: full.industry || '',
        headquarters_location: full.headquarters_location || '',
        website: full.website || '',
      });
      setEditable({
        gcc_locations: full.gcc_locations || '',
        size: full.size || '',
        linkedin: full.linkedin || '',
        description: full.description || '',
        additional_email: full.additional_email || '',
        mobile_secondary: full.mobile_secondary || '',
        contact_person: full.contact_person || '',
        contact_designation: full.contact_designation || '',
        contact_email: full.contact_email || '',
        phone: full.phone || '',
        alternate_contact_person: full.alternate_contact_person || '',
        alternate_contact_designation: full.alternate_contact_designation || '',
        alternate_contact_email: full.alternate_contact_email || '',
        alternate_contact_phone: full.alternate_contact_phone || '',
      });
      setMessage('Profile updated.');
      setEditMode(false);
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Failed to save profile.');
    } finally {
      setSaving(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveProfile();
  };

  const handleCancel = () => {
    const full = profile;
    setStandardDraft({
      company_name: full.company_name || '',
      parent_company: full.parent_company || '',
      year_established: full.year_established != null ? String(full.year_established) : '',
      industry: full.industry || '',
      headquarters_location: full.headquarters_location || '',
      website: full.website || '',
    });
    setEditable({
      gcc_locations: full.gcc_locations || '',
      size: full.size || '',
      linkedin: full.linkedin || '',
      description: full.description || '',
      additional_email: full.additional_email || '',
      mobile_secondary: full.mobile_secondary || '',
      contact_person: full.contact_person || '',
      contact_designation: full.contact_designation || '',
      contact_email: full.contact_email || '',
      phone: full.phone || '',
      alternate_contact_person: full.alternate_contact_person || '',
      alternate_contact_designation: full.alternate_contact_designation || '',
      alternate_contact_email: full.alternate_contact_email || '',
      alternate_contact_phone: full.alternate_contact_phone || '',
    });
    setEditMode(false);
    setError('');
  };

  if (loading) return <div className="min-h-screen pt-6 flex items-center justify-center">Loading...</div>;

  return (
    <div className="min-h-screen pt-6 pb-16">
      <div className="container mx-auto px-4 max-w-3xl space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">GCC Profile</h1>
          <p className="text-muted-foreground">Manage your organization&apos;s profile information.</p>
        </div>

        {/* Standard information – only empty details can be edited */}
        <div className="page-card p-6 space-y-4">
          <div>
            <h2 className="text-lg font-semibold">Standard information</h2>
            <p className="text-xs text-muted-foreground mt-1">
              Filled during signup or onboarding. Empty fields can be edited below and saved with &quot;Save changes&quot; in Operational section.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-xs font-medium text-muted-foreground">GCC Name</Label>
              {profile.company_name ? (
                <Input value={profile.company_name} readOnly className="mt-1 bg-muted/40 border-dashed border-border/60 text-foreground" />
              ) : (
                <Input
                  value={standardDraft.company_name}
                  onChange={(e) => setStandardDraft((s) => ({ ...s, company_name: e.target.value }))}
                  placeholder="Your GCC / company name"
                  className="mt-1"
                />
              )}
            </div>
            <div>
              <Label className="text-xs font-medium text-muted-foreground">Parent Company</Label>
              {profile.parent_company ? (
                <Input value={profile.parent_company} readOnly className="mt-1 bg-muted/40 border-dashed border-border/60 text-foreground" />
              ) : (
                <Input
                  value={standardDraft.parent_company}
                  onChange={(e) => setStandardDraft((s) => ({ ...s, parent_company: e.target.value }))}
                  placeholder="Parent organization name"
                  className="mt-1"
                />
              )}
            </div>
            <div>
              <Label className="text-xs font-medium text-muted-foreground">Year Established</Label>
              {profile.year_established != null ? (
                <Input value={String(profile.year_established)} readOnly className="mt-1 bg-muted/40 border-dashed border-border/60 text-foreground" />
              ) : (
                <Input
                  type="number"
                  min={1900}
                  max={2100}
                  value={standardDraft.year_established}
                  onChange={(e) => setStandardDraft((s) => ({ ...s, year_established: e.target.value }))}
                  placeholder="e.g. 2015"
                  className="mt-1"
                />
              )}
            </div>
            <div>
              <Label className="text-xs font-medium text-muted-foreground">Industry Domain</Label>
              {profile.industry ? (
                <Input value={profile.industry} readOnly className="mt-1 bg-muted/40 border-dashed border-border/60 text-foreground" />
              ) : (
                <select
                  value={standardDraft.industry}
                  onChange={(e) => setStandardDraft((s) => ({ ...s, industry: e.target.value }))}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm mt-1"
                >
                  <option value="">Select...</option>
                  {INDUSTRY_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              )}
            </div>
            <div>
              <Label className="text-xs font-medium text-muted-foreground">Headquarters Location</Label>
              {profile.headquarters_location ? (
                <Input value={profile.headquarters_location} readOnly className="mt-1 bg-muted/40 border-dashed border-border/60 text-foreground" />
              ) : (
                <Input
                  value={standardDraft.headquarters_location}
                  onChange={(e) => setStandardDraft((s) => ({ ...s, headquarters_location: e.target.value }))}
                  placeholder="City, Country"
                  className="mt-1"
                />
              )}
            </div>
            <div>
              <Label className="text-xs font-medium text-muted-foreground">Official Website</Label>
              {profile.website ? (
                <Input type="url" value={profile.website} readOnly className="mt-1 bg-muted/40 border-dashed border-border/60 text-foreground" />
              ) : (
                <Input
                  type="url"
                  value={standardDraft.website}
                  onChange={(e) => setStandardDraft((s) => ({ ...s, website: e.target.value }))}
                  placeholder="https://www.example.com"
                  className="mt-1"
                />
              )}
            </div>
          </div>

          {/* Registration details (managed by platform) – email, GSTN, Mobile from signup */}
          <div className="mt-4 pt-4 border-t border-border/60">
            <h3 className="text-sm font-semibold mb-3">Registration details (managed by platform)</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-xs font-medium text-muted-foreground">Email (login)</Label>
                <Input value={user?.email ?? ''} readOnly className="mt-1 bg-muted/40 border-dashed border-border/60 text-foreground" />
              </div>
              <div>
                <Label className="text-xs font-medium text-muted-foreground">Company GSTN</Label>
                <Input value={profile.gst_number || ''} readOnly placeholder="e.g. 27AABCU9603R1ZM" className="mt-1 bg-muted/40 border-dashed border-border/60 text-foreground" />
              </div>
              <div>
                <Label className="text-xs font-medium text-muted-foreground">Mobile</Label>
                <Input value={profile.mobile_primary || ''} readOnly placeholder="+91 98765 43210" className="mt-1 bg-muted/40 border-dashed border-border/60 text-foreground" />
              </div>
            </div>
          </div>

          {/* Primary Contact Person – inside Standard information, below Registration details */}
          <div className="mt-4 pt-4 border-t border-border/60">
            <div className="flex items-center justify-between gap-4 mb-3">
              <h3 className="text-sm font-semibold">Primary Contact Person</h3>
              {!editMode ? (
                <Button type="button" variant="outline" size="sm" onClick={() => setEditMode(true)}>
                  Edit profile
                </Button>
              ) : null}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-xs font-medium text-muted-foreground" htmlFor="profile_contact_person">Name</Label>
                <Input
                  id="profile_contact_person"
                  value={editable.contact_person}
                  onChange={(e) => setEditable((p) => ({ ...p, contact_person: e.target.value }))}
                  readOnly={!editMode}
                  className={`mt-1 ${!editMode ? 'bg-muted/40 border-border/60' : ''}`}
                />
              </div>
              <div>
                <Label className="text-xs font-medium text-muted-foreground" htmlFor="profile_contact_designation">Designation</Label>
                <Input
                  id="profile_contact_designation"
                  value={editable.contact_designation}
                  onChange={(e) => setEditable((p) => ({ ...p, contact_designation: e.target.value }))}
                  readOnly={!editMode}
                  className={`mt-1 ${!editMode ? 'bg-muted/40 border-border/60' : ''}`}
                />
              </div>
              <div>
                <Label className="text-xs font-medium text-muted-foreground" htmlFor="profile_contact_email">Work Email</Label>
                <Input
                  id="profile_contact_email"
                  type="email"
                  value={editable.contact_email}
                  onChange={(e) => setEditable((p) => ({ ...p, contact_email: e.target.value }))}
                  readOnly={!editMode}
                  className={`mt-1 ${!editMode ? 'bg-muted/40 border-border/60' : ''}`}
                />
              </div>
              <div>
                <Label className="text-xs font-medium text-muted-foreground" htmlFor="profile_phone">Phone (optional)</Label>
                <Input
                  id="profile_phone"
                  type="tel"
                  value={editable.phone}
                  onChange={(e) => setEditable((p) => ({ ...p, phone: e.target.value }))}
                  readOnly={!editMode}
                  className={`mt-1 ${!editMode ? 'bg-muted/40 border-border/60' : ''}`}
                />
              </div>
            </div>
            {editMode && (
              <div className="flex gap-3 pt-2">
                <Button type="button" onClick={saveProfile} disabled={saving}>
                  {saving ? 'Saving...' : 'Save changes'}
                </Button>
                <Button type="button" variant="outline" disabled={saving} onClick={handleCancel}>
                  Cancel
                </Button>
              </div>
            )}
          </div>

          {/* Update details – only when any standard information field is empty */}
          {(() => {
            const hasCompanyName = !!(profile.company_name || standardDraft.company_name);
            const hasParentCompany = !!(profile.parent_company || standardDraft.parent_company);
            const hasYearEst = profile.year_established != null || !!(standardDraft.year_established && String(standardDraft.year_established).trim());
            const hasIndustry = !!(profile.industry || standardDraft.industry);
            const hasHeadquarters = !!(profile.headquarters_location || standardDraft.headquarters_location);
            const hasWebsite = !!(profile.website || standardDraft.website);
            const hasEmptyStandardInfo = !hasCompanyName || !hasParentCompany || !hasYearEst || !hasIndustry || !hasHeadquarters || !hasWebsite;
            if (!hasEmptyStandardInfo) return null;
            return (
              <div className="flex justify-end pt-4 mt-4 border-t border-border/60">
                <Button type="button" variant="destructive" onClick={saveProfile} disabled={saving}>
                  {saving ? 'Saving...' : 'Update details'}
                </Button>
              </div>
            );
          })()}
        </div>

        {/* Editable information */}
        <form onSubmit={handleSubmit} className="page-card p-6 space-y-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold">Operational & contact information</h2>
              <p className="text-xs text-muted-foreground">
                Keep your locations, size, and contact details up to date.
              </p>
            </div>
            {!editMode && (
              <Button type="button" variant="outline" size="sm" onClick={() => setEditMode(true)}>
                Edit profile
              </Button>
            )}
          </div>

          {(message || error) && (
            <div
              className={`rounded-md text-sm p-3 ${
                error
                  ? 'bg-destructive/10 text-destructive'
                  : 'bg-green-500/10 text-green-700 dark:text-green-400'
              }`}
            >
              {error || message}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="gcc_locations">GCC Location(s)</Label>
              <Input
                id="gcc_locations"
                value={editable.gcc_locations}
                onChange={(e) => setEditable((p) => ({ ...p, gcc_locations: e.target.value }))}
                placeholder="e.g. Bangalore, Hyderabad"
                readOnly={!editMode}
                className={!editMode ? 'bg-muted/40 border-border/60' : ''}
              />
            </div>
            <div>
              <Label htmlFor="size">Company Size (GCC Team Size)</Label>
              <Input
                id="size"
                value={editable.size}
                onChange={(e) => setEditable((p) => ({ ...p, size: e.target.value }))}
                placeholder="e.g. 500-1000"
                readOnly={!editMode}
                className={!editMode ? 'bg-muted/40 border-border/60' : ''}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="additional_email">Additional email (optional)</Label>
              <Input
                id="additional_email"
                type="email"
                value={editable.additional_email}
                onChange={(e) => setEditable((p) => ({ ...p, additional_email: e.target.value }))}
                placeholder="another@company.com"
                readOnly={!editMode}
                className={!editMode ? 'bg-muted/40 border-border/60' : ''}
              />
            </div>
            <div>
              <Label htmlFor="mobile_secondary">Mobile 2 (optional)</Label>
              <Input
                id="mobile_secondary"
                type="tel"
                value={editable.mobile_secondary}
                onChange={(e) => setEditable((p) => ({ ...p, mobile_secondary: e.target.value }))}
                placeholder="Optional"
                readOnly={!editMode}
                className={!editMode ? 'bg-muted/40 border-border/60' : ''}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="linkedin">LinkedIn / Corporate Page</Label>
            <Input
              id="linkedin"
              type="url"
              value={editable.linkedin}
              onChange={(e) => setEditable((p) => ({ ...p, linkedin: e.target.value }))}
              placeholder="https://linkedin.com/company/..."
              readOnly={!editMode}
              className={!editMode ? 'bg-muted/40 border-border/60' : ''}
            />
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={editable.description}
              onChange={(e) => setEditable((p) => ({ ...p, description: e.target.value }))}
              rows={4}
              readOnly={!editMode}
              className={!editMode ? 'bg-muted/40 border-border/60' : ''}
            />
          </div>

          <div className="border-t border-border pt-4">
            <h3 className="font-semibold text-foreground mb-3">Alternate contact person</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="alternate_contact_person">Name</Label>
                <Input
                  id="alternate_contact_person"
                  value={editable.alternate_contact_person}
                  onChange={(e) => setEditable((p) => ({ ...p, alternate_contact_person: e.target.value }))}
                  placeholder="Alternate contact name"
                  readOnly={!editMode}
                  className={!editMode ? 'bg-muted/40 border-border/60' : ''}
                />
              </div>
              <div>
                <Label htmlFor="alternate_contact_designation">Designation</Label>
                <Input
                  id="alternate_contact_designation"
                  value={editable.alternate_contact_designation}
                  onChange={(e) => setEditable((p) => ({ ...p, alternate_contact_designation: e.target.value }))}
                  placeholder="Designation"
                  readOnly={!editMode}
                  className={!editMode ? 'bg-muted/40 border-border/60' : ''}
                />
              </div>
              <div>
                <Label htmlFor="alternate_contact_email">Work Email</Label>
                <Input
                  id="alternate_contact_email"
                  type="email"
                  value={editable.alternate_contact_email}
                  onChange={(e) => setEditable((p) => ({ ...p, alternate_contact_email: e.target.value }))}
                  placeholder="email@company.com"
                  readOnly={!editMode}
                  className={!editMode ? 'bg-muted/40 border-border/60' : ''}
                />
              </div>
              <div>
                <Label htmlFor="alternate_contact_phone">Phone (optional)</Label>
                <Input
                  id="alternate_contact_phone"
                  type="tel"
                  value={editable.alternate_contact_phone}
                  onChange={(e) => setEditable((p) => ({ ...p, alternate_contact_phone: e.target.value }))}
                  placeholder="Optional"
                  readOnly={!editMode}
                  className={!editMode ? 'bg-muted/40 border-border/60' : ''}
                />
              </div>
            </div>
          </div>

          {editMode && (
            <div className="flex gap-3 pt-2">
              <Button type="submit" disabled={saving}>
                {saving ? 'Saving...' : 'Save changes'}
              </Button>
              <Button type="button" variant="outline" disabled={saving} onClick={handleCancel}>
                Cancel
              </Button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
