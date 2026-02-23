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

export default function GccProfile() {
  const [profile, setProfile] = useState<Partial<GccProfile>>(emptyProfile);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    gccApi.getProfile()
      .then((p) => setProfile({ ...emptyProfile, ...p }))
      .catch(() => setProfile(emptyProfile))
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    try {
      await gccApi.updateProfile(profile);
      setMessage('Profile saved.');
    } catch {
      setMessage('Failed to save.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="min-h-screen pt-6 flex items-center justify-center">Loading...</div>;

  return (
    <div className="min-h-screen pt-6 pb-16">
      <div className="container mx-auto px-4 max-w-2xl">
        <h1 className="text-3xl font-bold mb-2">GCC Profile</h1>
        <p className="text-muted-foreground mb-8">Company and primary contact details (GCC only).</p>

        <form onSubmit={handleSubmit} className="space-y-6 page-card p-6">
          {message && (
            <div className={`rounded-md text-sm p-3 ${message.includes('saved') ? 'bg-green-500/10 text-green-700 dark:text-green-400' : 'bg-destructive/10 text-destructive'}`}>
              {message}
            </div>
          )}

          <div>
            <Label htmlFor="company_name">GCC Name</Label>
            <Input id="company_name" value={profile.company_name || ''} onChange={(e) => setProfile((p) => ({ ...p, company_name: e.target.value }))} />
          </div>
          <div>
            <Label htmlFor="parent_company">Parent Company</Label>
            <Input id="parent_company" value={profile.parent_company || ''} onChange={(e) => setProfile((p) => ({ ...p, parent_company: e.target.value }))} />
          </div>
          <div>
            <Label htmlFor="industry">Industry Domain</Label>
            <select
              id="industry"
              value={profile.industry || ''}
              onChange={(e) => setProfile((p) => ({ ...p, industry: e.target.value }))}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <option value="">Select...</option>
              {INDUSTRY_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>
          <div>
            <Label htmlFor="headquarters_location">Headquarters Location</Label>
            <Input id="headquarters_location" value={profile.headquarters_location || ''} onChange={(e) => setProfile((p) => ({ ...p, headquarters_location: e.target.value }))} />
          </div>
          <div>
            <Label htmlFor="gcc_locations">GCC Location(s)</Label>
            <Input id="gcc_locations" value={profile.gcc_locations || ''} onChange={(e) => setProfile((p) => ({ ...p, gcc_locations: e.target.value }))} placeholder="e.g. Bangalore, Hyderabad" />
          </div>
          <div>
            <Label htmlFor="year_established">Year Established</Label>
            <Input id="year_established" type="number" min={1900} max={2100} value={profile.year_established ?? ''} onChange={(e) => setProfile((p) => ({ ...p, year_established: e.target.value ? Number(e.target.value) : undefined }))} />
          </div>
          <div>
            <Label htmlFor="size">Company Size (GCC Team Size)</Label>
            <Input id="size" value={profile.size || ''} onChange={(e) => setProfile((p) => ({ ...p, size: e.target.value }))} placeholder="e.g. 500-1000" />
          </div>
          <div>
            <Label htmlFor="website">Official Website</Label>
            <Input id="website" type="url" value={profile.website || ''} onChange={(e) => setProfile((p) => ({ ...p, website: e.target.value }))} />
          </div>
          <div>
            <Label htmlFor="linkedin">LinkedIn / Corporate Page</Label>
            <Input id="linkedin" type="url" value={profile.linkedin || ''} onChange={(e) => setProfile((p) => ({ ...p, linkedin: e.target.value }))} />
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" value={profile.description || ''} onChange={(e) => setProfile((p) => ({ ...p, description: e.target.value }))} rows={4} />
          </div>

          <div className="border-t border-border pt-6">
            <h3 className="font-semibold text-foreground mb-4">Primary Contact Person</h3>
            <div className="space-y-4">
              <div>
                <Label htmlFor="contact_person">Name</Label>
                <Input id="contact_person" value={profile.contact_person || ''} onChange={(e) => setProfile((p) => ({ ...p, contact_person: e.target.value }))} />
              </div>
              <div>
                <Label htmlFor="contact_designation">Designation</Label>
                <Input id="contact_designation" value={profile.contact_designation || ''} onChange={(e) => setProfile((p) => ({ ...p, contact_designation: e.target.value }))} />
              </div>
              <div>
                <Label htmlFor="contact_email">Work Email</Label>
                <Input id="contact_email" type="email" value={profile.contact_email || ''} onChange={(e) => setProfile((p) => ({ ...p, contact_email: e.target.value }))} />
              </div>
              <div>
                <Label htmlFor="phone">Phone (optional)</Label>
                <Input id="phone" type="tel" value={profile.phone || ''} onChange={(e) => setProfile((p) => ({ ...p, phone: e.target.value }))} />
              </div>
            </div>
          </div>

          <Button type="submit" disabled={saving}>{saving ? 'Saving...' : 'Save profile'}</Button>
        </form>
      </div>
    </div>
  );
}
