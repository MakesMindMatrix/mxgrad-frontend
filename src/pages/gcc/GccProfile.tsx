import { useEffect, useState } from 'react';
import { gccApi } from '@/lib/api';
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

type EditableFields = {
  headquarters_location: string;
  gcc_locations: string;
  size: string;
  website: string;
  linkedin: string;
  description: string;
  contact_person: string;
  contact_designation: string;
  contact_email: string;
  phone: string;
};

const emptyEditable: EditableFields = {
  headquarters_location: '',
  gcc_locations: '',
  size: '',
  website: '',
  linkedin: '',
  description: '',
  contact_person: '',
  contact_designation: '',
  contact_email: '',
  phone: '',
};

export default function GccProfile() {
  const [profile, setProfile] = useState<Partial<GccProfile>>(emptyProfile);
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
        setEditable({
          headquarters_location: full.headquarters_location || '',
          gcc_locations: full.gcc_locations || '',
          size: full.size || '',
          website: full.website || '',
          linkedin: full.linkedin || '',
          description: full.description || '',
          contact_person: full.contact_person || '',
          contact_designation: full.contact_designation || '',
          contact_email: full.contact_email || '',
          phone: full.phone || '',
        });
      })
      .catch(() => {
        setProfile(emptyProfile);
        setEditable(emptyEditable);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    setError('');

    if (editable.contact_email && !editable.contact_email.includes('@')) {
      setSaving(false);
      setError('Please enter a valid work email.');
      return;
    }

    try {
      const payload: Partial<GccProfile> = {
        headquarters_location: editable.headquarters_location || undefined,
        gcc_locations: editable.gcc_locations || undefined,
        size: editable.size || undefined,
        website: editable.website || undefined,
        linkedin: editable.linkedin || undefined,
        description: editable.description || undefined,
        contact_person: editable.contact_person || undefined,
        contact_designation: editable.contact_designation || undefined,
        contact_email: editable.contact_email || undefined,
        phone: editable.phone || undefined,
      };

      const updated = await gccApi.updateProfile(payload);
      const full = { ...profile, ...updated };
      setProfile(full);
      setEditable({
        headquarters_location: full.headquarters_location || '',
        gcc_locations: full.gcc_locations || '',
        size: full.size || '',
        website: full.website || '',
        linkedin: full.linkedin || '',
        description: full.description || '',
        contact_person: full.contact_person || '',
        contact_designation: full.contact_designation || '',
        contact_email: full.contact_email || '',
        phone: full.phone || '',
      });
      setMessage('Profile updated.');
      setEditMode(false);
    } catch {
      setError('Failed to save profile.');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    const full = profile;
    setEditable({
      headquarters_location: full.headquarters_location || '',
      gcc_locations: full.gcc_locations || '',
      size: full.size || '',
      website: full.website || '',
      linkedin: full.linkedin || '',
      description: full.description || '',
      contact_person: full.contact_person || '',
      contact_designation: full.contact_designation || '',
      contact_email: full.contact_email || '',
      phone: full.phone || '',
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

        {/* Standard information - platform-managed (not from registration) */}
        <div className="page-card p-6 space-y-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold">Standard information</h2>
              <p className="text-xs text-muted-foreground">
                Managed by platform. Set during onboarding. Contact support to request changes.
              </p>
            </div>
            <span className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground border border-dashed border-muted-foreground/40 rounded-full px-3 py-1">
              Read-only
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-xs font-medium text-muted-foreground">GCC Name</Label>
              <Input
                value={profile.company_name || ''}
                readOnly
                placeholder="—"
                className="mt-1 bg-muted/40 border-dashed border-border/60 text-foreground"
              />
            </div>
            <div>
              <Label className="text-xs font-medium text-muted-foreground">Parent Company</Label>
              <Input
                value={profile.parent_company || ''}
                readOnly
                placeholder="—"
                className="mt-1 bg-muted/40 border-dashed border-border/60 text-foreground"
              />
            </div>
            <div>
              <Label className="text-xs font-medium text-muted-foreground">Year Established</Label>
              <Input
                value={profile.year_established != null ? String(profile.year_established) : ''}
                readOnly
                placeholder="—"
                className="mt-1 bg-muted/40 border-dashed border-border/60 text-foreground"
              />
            </div>
            <div>
              <Label className="text-xs font-medium text-muted-foreground">Industry Domain</Label>
              <Input
                value={profile.industry || ''}
                readOnly
                placeholder="—"
                className="mt-1 bg-muted/40 border-dashed border-border/60 text-foreground"
              />
            </div>
          </div>

          {/* Registration details – same fields and labels as Create account (signup) */}
          <div className="mt-4 pt-4 border-t border-border/60">
            <h3 className="text-sm font-semibold mb-3">Registration details (managed by platform)</h3>
            <p className="text-xs text-muted-foreground mb-3">
              Values provided during account creation. Labels match the registration form.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-xs font-medium text-muted-foreground">Company GSTN</Label>
                <Input
                  value={profile.gst_number || ''}
                  readOnly
                  placeholder="e.g. 27AABCU9603R1ZM"
                  className="mt-1 bg-muted/40 border-dashed border-border/60 text-foreground"
                />
              </div>
              <div>
                <Label className="text-xs font-medium text-muted-foreground">Additional email (optional)</Label>
                <Input
                  type="email"
                  value={profile.additional_email || ''}
                  readOnly
                  placeholder="another@company.com"
                  className="mt-1 bg-muted/40 border-dashed border-border/60 text-foreground"
                />
              </div>
              <div>
                <Label className="text-xs font-medium text-muted-foreground">Mobile 1</Label>
                <Input
                  value={profile.mobile_primary || ''}
                  readOnly
                  placeholder="+91 98765 43210"
                  className="mt-1 bg-muted/40 border-dashed border-border/60 text-foreground"
                />
              </div>
              <div>
                <Label className="text-xs font-medium text-muted-foreground">Mobile 2 (optional)</Label>
                <Input
                  value={profile.mobile_secondary || ''}
                  readOnly
                  placeholder="Optional"
                  className="mt-1 bg-muted/40 border-dashed border-border/60 text-foreground"
                />
              </div>
              <div className="md:col-span-2">
                <Label className="text-xs font-medium text-muted-foreground">Company website</Label>
                <Input
                  type="url"
                  value={profile.website || ''}
                  readOnly
                  placeholder="https://www.example.com"
                  className="mt-1 bg-muted/40 border-dashed border-border/60 text-foreground"
                />
              </div>
              <div className="md:col-span-2">
                <Label className="text-xs font-medium text-muted-foreground">Short description</Label>
                <Textarea
                  value={profile.description || ''}
                  readOnly
                  rows={3}
                  placeholder="Brief description of your company or organization..."
                  className="mt-1 bg-muted/40 border-dashed border-border/60 text-foreground resize-none"
                />
              </div>
            </div>
          </div>
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
              <Label htmlFor="headquarters_location">Headquarters Location</Label>
              <Input
                id="headquarters_location"
                value={editable.headquarters_location}
                onChange={(e) => setEditable((p) => ({ ...p, headquarters_location: e.target.value }))}
                readOnly={!editMode}
                className={!editMode ? 'bg-muted/40 border-border/60' : ''}
              />
            </div>
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
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            <div>
              <Label htmlFor="website">Official Website</Label>
              <Input
                id="website"
                type="url"
                value={editable.website}
                onChange={(e) => setEditable((p) => ({ ...p, website: e.target.value }))}
                placeholder="https://example.com"
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
            <h3 className="font-semibold text-foreground mb-3">Primary Contact Person</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="contact_person">Name</Label>
                <Input
                  id="contact_person"
                  value={editable.contact_person}
                  onChange={(e) => setEditable((p) => ({ ...p, contact_person: e.target.value }))}
                  readOnly={!editMode}
                  className={!editMode ? 'bg-muted/40 border-border/60' : ''}
                />
              </div>
              <div>
                <Label htmlFor="contact_designation">Designation</Label>
                <Input
                  id="contact_designation"
                  value={editable.contact_designation}
                  onChange={(e) => setEditable((p) => ({ ...p, contact_designation: e.target.value }))}
                  readOnly={!editMode}
                  className={!editMode ? 'bg-muted/40 border-border/60' : ''}
                />
              </div>
              <div>
                <Label htmlFor="contact_email">Work Email</Label>
                <Input
                  id="contact_email"
                  type="email"
                  value={editable.contact_email}
                  onChange={(e) => setEditable((p) => ({ ...p, contact_email: e.target.value }))}
                  readOnly={!editMode}
                  className={!editMode ? 'bg-muted/40 border-border/60' : ''}
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone (optional)</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={editable.phone}
                  onChange={(e) => setEditable((p) => ({ ...p, phone: e.target.value }))}
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

