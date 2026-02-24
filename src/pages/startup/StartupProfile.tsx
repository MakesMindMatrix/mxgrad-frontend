import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { startupApi } from '@/lib/api';
import type { StartupProfile } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

const TABS = [
  { id: 'basic', label: 'Basic' },
  { id: 'team', label: 'Team' },
  { id: 'product', label: 'Product' },
  { id: 'engagement', label: 'Engagement' },
  { id: 'funding', label: 'Funding' },
];

export default function StartupProfile() {
  const { user } = useAuth();
  const [tab, setTab] = useState('basic');
  const [profile, setProfile] = useState<Partial<StartupProfile>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    startupApi.getProfile()
      .then((p) => setProfile(p || {}))
      .catch(() => setProfile({}))
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setMessage('');
    try {
      await startupApi.updateProfile(profile);
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
      <div className="container mx-auto px-4 max-w-3xl">
        <h1 className="text-3xl font-bold mb-2">Startup profile</h1>
        <p className="text-muted-foreground mb-8">Complete your profile in sections. Edits are saved together when you click Save.</p>

        {message && (
          <div className={`mb-6 rounded-md text-sm p-3 ${message.includes('saved') ? 'bg-green-500/10 text-green-400' : 'bg-destructive/10 text-destructive'}`}>
            {message}
          </div>
        )}

        {(profile as { reverification_required?: boolean })?.reverification_required && (
          <div className="mb-6 rounded-lg border border-amber-300 bg-amber-50 dark:bg-amber-950/30 dark:border-amber-700 p-4 text-amber-900 dark:text-amber-200">
            <p className="font-medium">Reverification requested</p>
            <p className="text-sm mt-1">Please update your profile information and save. Admin has requested reverification of your startup details.</p>
          </div>
        )}

        <Tabs value={tab} onValueChange={setTab}>
          <TabsList className="flex flex-wrap gap-1 mb-6 bg-muted text-muted-foreground">
            {TABS.map((t) => (
              <TabsTrigger key={t.id} value={t.id} className="data-[state=active]:bg-background data-[state=active]:text-foreground">{t.label}</TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="basic" className="page-card p-6 space-y-4">
            <h3 className="font-semibold text-foreground">Basic information</h3>
            <div>
              <Label>Company name</Label>
              <Input value={profile.company_name || ''} onChange={(e) => setProfile((p) => ({ ...p, company_name: e.target.value }))} />
            </div>
            <div>
              <Label>Legal entity name</Label>
              <Input value={profile.legal_entity_name || ''} onChange={(e) => setProfile((p) => ({ ...p, legal_entity_name: e.target.value }))} />
            </div>
            <div>
              <Label>Founding year</Label>
              <Input type="number" value={profile.founding_year ?? ''} onChange={(e) => setProfile((p) => ({ ...p, founding_year: e.target.value ? Number(e.target.value) : undefined }))} />
            </div>
            <div>
              <Label>Location</Label>
              <Input value={profile.location || ''} onChange={(e) => setProfile((p) => ({ ...p, location: e.target.value }))} />
            </div>
            <div>
              <Label>Website</Label>
              <Input type="url" value={profile.website || ''} onChange={(e) => setProfile((p) => ({ ...p, website: e.target.value }))} />
            </div>
            <div>
              <Label>Contact phone</Label>
              <Input value={profile.contact_phone || ''} onChange={(e) => setProfile((p) => ({ ...p, contact_phone: e.target.value }))} />
            </div>

            <div className="border-t border-border pt-4 mt-2">
              <h4 className="font-semibold text-foreground mb-3 text-sm">Registration details (managed by platform)</h4>
              <p className="text-xs text-muted-foreground mb-3">All information provided during signup is shown below.</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground text-xs">Email (login)</Label>
                  <Input value={user?.email ?? ''} readOnly className="bg-muted/50 mt-1" />
                </div>
                <div>
                  <Label className="text-muted-foreground text-xs">Entity name</Label>
                  <Input value={profile.company_name || user?.name ?? ''} readOnly className="bg-muted/50 mt-1" />
                </div>
                <div>
                  <Label className="text-muted-foreground text-xs">Company website</Label>
                  <Input type="url" value={profile.website || ''} readOnly className="bg-muted/50 mt-1" placeholder="https://www.example.com" />
                </div>
                <div>
                  <Label className="text-muted-foreground text-xs">Company GSTN</Label>
                  <Input value={profile.gst_number || ''} readOnly className="bg-muted/50 mt-1" placeholder="e.g. 27AABCU9603R1ZM" />
                </div>
                <div>
                  <Label className="text-muted-foreground text-xs">Additional email (optional)</Label>
                  <Input type="email" value={profile.additional_email || ''} readOnly className="bg-muted/50 mt-1" placeholder="another@company.com" />
                </div>
                <div>
                  <Label className="text-muted-foreground text-xs">Mobile 1</Label>
                  <Input value={profile.mobile_primary || ''} readOnly className="bg-muted/50 mt-1" placeholder="+91 98765 43210" />
                </div>
                <div>
                  <Label className="text-muted-foreground text-xs">Mobile 2 (optional)</Label>
                  <Input value={profile.mobile_secondary || ''} readOnly className="bg-muted/50 mt-1" placeholder="Optional" />
                </div>
              </div>
              <div className="mt-4">
                <Label className="text-muted-foreground text-xs">Short description (from signup)</Label>
                <Textarea value={profile.solution_description || ''} readOnly rows={3} className="bg-muted/50 mt-1 resize-none" placeholder="Brief description from account creation" />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="team" className="page-card p-6 space-y-4">
            <h3 className="font-semibold text-foreground">Founder & team</h3>
            <div>
              <Label>Team size</Label>
              <Input type="number" value={profile.team_size ?? ''} onChange={(e) => setProfile((p) => ({ ...p, team_size: e.target.value ? Number(e.target.value) : undefined }))} />
            </div>
            <div>
              <Label>Founder names (comma-separated)</Label>
              <Input
                value={(profile.founder_names || []).join(', ')}
                onChange={(e) => setProfile((p) => ({ ...p, founder_names: e.target.value.split(',').map((s) => s.trim()).filter(Boolean) }))}
                placeholder="Name1, Name2"
              />
            </div>
          </TabsContent>

          <TabsContent value="product" className="page-card p-6 space-y-4">
            <h3 className="font-semibold text-foreground">Product & technology</h3>
            <div>
              <Label>Industry</Label>
              <Input value={profile.industry || ''} onChange={(e) => setProfile((p) => ({ ...p, industry: e.target.value }))} />
            </div>
            <div>
              <Label>Solution description</Label>
              <Textarea value={profile.solution_description || ''} onChange={(e) => setProfile((p) => ({ ...p, solution_description: e.target.value }))} rows={4} />
            </div>
            <div>
              <Label>Primary offering type</Label>
              <Input value={profile.primary_offering_type || ''} onChange={(e) => setProfile((p) => ({ ...p, primary_offering_type: e.target.value }))} placeholder="Product, Platform, Service, IP" />
            </div>
            <div>
              <Label>Deployment stage</Label>
              <Input value={profile.deployment_stage || ''} onChange={(e) => setProfile((p) => ({ ...p, deployment_stage: e.target.value }))} placeholder="Idea, MVP, Live, Scaling" />
            </div>
            <div>
              <Label>Tech stack (comma-separated)</Label>
              <Input
                value={(profile.tech_stack || []).join(', ')}
                onChange={(e) => setProfile((p) => ({ ...p, tech_stack: e.target.value.split(',').map((s) => s.trim()).filter(Boolean) }))}
                placeholder="Python, React, AWS"
              />
            </div>
          </TabsContent>

          <TabsContent value="engagement" className="page-card p-6 space-y-4">
            <h3 className="font-semibold text-foreground">Engagement interests</h3>
            <div>
              <Label>Why GCC co-creation?</Label>
              <Textarea value={profile.gcc_co_creation_interest || ''} onChange={(e) => setProfile((p) => ({ ...p, gcc_co_creation_interest: e.target.value }))} rows={4} />
            </div>
            <div>
              <Label>Past collaborations</Label>
              <Textarea value={profile.past_collaborations || ''} onChange={(e) => setProfile((p) => ({ ...p, past_collaborations: e.target.value }))} rows={2} />
            </div>
            <div>
              <Label>Co-creation interests (comma-separated)</Label>
              <Input
                value={(profile.co_creation_interests || []).join(', ')}
                onChange={(e) => setProfile((p) => ({ ...p, co_creation_interests: e.target.value.split(',').map((s) => s.trim()).filter(Boolean) }))}
              />
            </div>
            <div>
              <Label>What you seek from GCCs (comma-separated)</Label>
              <Input
                value={(profile.gcc_seeking || []).join(', ')}
                onChange={(e) => setProfile((p) => ({ ...p, gcc_seeking: e.target.value.split(',').map((s) => s.trim()).filter(Boolean) }))}
              />
            </div>
          </TabsContent>

          <TabsContent value="funding" className="page-card p-6 space-y-4">
            <h3 className="font-semibold text-foreground">Funding</h3>
            <div>
              <Label>Funding stage</Label>
              <Input value={profile.funding || ''} onChange={(e) => setProfile((p) => ({ ...p, funding: e.target.value }))} placeholder="Seed, Series A, etc." />
            </div>
            <div>
              <Label>Total funds raised</Label>
              <Input value={profile.total_funds_raised || ''} onChange={(e) => setProfile((p) => ({ ...p, total_funds_raised: e.target.value }))} />
            </div>
            <div>
              <Label>Investors (comma-separated)</Label>
              <Input
                value={(profile.investors || []).join(', ')}
                onChange={(e) => setProfile((p) => ({ ...p, investors: e.target.value.split(',').map((s) => s.trim()).filter(Boolean) }))}
              />
            </div>
            <div>
              <Label>Pitch deck URL</Label>
              <Input type="url" value={profile.pitch_deck_url || ''} onChange={(e) => setProfile((p) => ({ ...p, pitch_deck_url: e.target.value }))} />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="consent"
                checked={profile.data_sharing_consent ?? false}
                onChange={(e) => setProfile((p) => ({ ...p, data_sharing_consent: e.target.checked }))}
                className="rounded border-input"
              />
              <Label htmlFor="consent">I consent to sharing my startup data with verified GCC partners</Label>
            </div>
          </TabsContent>
        </Tabs>

        <div className="mt-6">
          <Button onClick={handleSave} disabled={saving}>
            {saving ? 'Saving...' : 'Save profile'}
          </Button>
        </div>
      </div>
    </div>
  );
}
