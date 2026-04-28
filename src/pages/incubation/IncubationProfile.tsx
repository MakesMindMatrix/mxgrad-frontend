import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { incubationApi, ApiError, type IncubationProfile as IncubationProfileData } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

const emptyProfile: Partial<IncubationProfileData> = {
  company_name: '',
  website: '',
  description: '',
  location: '',
  contact_person: '',
  phone: '',
  gst_number: '',
  additional_email: '',
  mobile_primary: '',
  mobile_secondary: '',
};

export default function IncubationProfile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Partial<IncubationProfileData>>(emptyProfile);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    incubationApi
      .getProfile()
      .then((data) => setProfile({ ...emptyProfile, ...data }))
      .catch(() => setProfile(emptyProfile))
      .finally(() => setLoading(false));
  }, []);

  const updateField = (field: keyof IncubationProfileData, value: string) => {
    setProfile((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setMessage('');
    setError('');
    try {
      const updated = await incubationApi.updateProfile(profile);
      setProfile({ ...emptyProfile, ...updated });
      setMessage('Profile updated.');
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Failed to save profile.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="min-h-screen pt-6 flex items-center justify-center">Loading...</div>;

  return (
    <div className="min-h-screen pt-6 pb-16">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Incubation Profile</h1>
          <p className="text-muted-foreground">Manage your incubation center details and operational contacts.</p>
        </div>

        <form onSubmit={handleSubmit} className="page-card p-6 space-y-6">
          {(message || error) && (
            <div className={`rounded-md text-sm p-3 ${error ? 'bg-destructive/10 text-destructive' : 'bg-green-500/10 text-green-700 dark:text-green-300'}`}>
              {error || message}
            </div>
          )}

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label htmlFor="incubation_company_name">Incubation center name</Label>
              <Input
                id="incubation_company_name"
                value={profile.company_name || ''}
                onChange={(e) => updateField('company_name', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="incubation_email">Login email</Label>
              <Input id="incubation_email" value={user?.email || ''} readOnly className="bg-muted/40 border-border/60" />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label htmlFor="incubation_website">Website</Label>
              <Input
                id="incubation_website"
                type="url"
                value={profile.website || ''}
                onChange={(e) => updateField('website', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="incubation_location">Location</Label>
              <Input
                id="incubation_location"
                value={profile.location || ''}
                onChange={(e) => updateField('location', e.target.value)}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="incubation_description">Description</Label>
            <Textarea
              id="incubation_description"
              rows={4}
              value={profile.description || ''}
              onChange={(e) => updateField('description', e.target.value)}
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label htmlFor="incubation_contact_person">Contact person</Label>
              <Input
                id="incubation_contact_person"
                value={profile.contact_person || ''}
                onChange={(e) => updateField('contact_person', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="incubation_phone">Phone</Label>
              <Input
                id="incubation_phone"
                value={profile.phone || ''}
                onChange={(e) => updateField('phone', e.target.value)}
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <Label htmlFor="incubation_gst">GSTN</Label>
              <Input
                id="incubation_gst"
                value={profile.gst_number || ''}
                onChange={(e) => updateField('gst_number', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="incubation_additional_email">Additional email</Label>
              <Input
                id="incubation_additional_email"
                type="email"
                value={profile.additional_email || ''}
                onChange={(e) => updateField('additional_email', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="incubation_mobile_primary">Primary mobile</Label>
              <Input
                id="incubation_mobile_primary"
                value={profile.mobile_primary || ''}
                onChange={(e) => updateField('mobile_primary', e.target.value)}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="incubation_mobile_secondary">Secondary mobile</Label>
            <Input
              id="incubation_mobile_secondary"
              value={profile.mobile_secondary || ''}
              onChange={(e) => updateField('mobile_secondary', e.target.value)}
            />
          </div>

          <Button type="submit" disabled={saving}>
            {saving ? 'Saving...' : 'Save changes'}
          </Button>
        </form>
      </div>
    </div>
  );
}
