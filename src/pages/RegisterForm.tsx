import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import AuthPageBackground from '@/components/AuthPageBackground';

type Role = 'GCC' | 'STARTUP' | 'INCUBATION';

export default function RegisterForm() {
  const [searchParams, setSearchParams] = useSearchParams();
  const roleParam = searchParams.get('role') as Role | null;
  const [role, setRole] = useState<Role>(roleParam === 'GCC' || roleParam === 'STARTUP' || roleParam === 'INCUBATION' ? roleParam : 'GCC');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [companyWebsite, setCompanyWebsite] = useState('');
  const [description, setDescription] = useState('');
  const [gstNumber, setGstNumber] = useState('');
  const [additionalEmail, setAdditionalEmail] = useState('');
  const [mobilePrimary, setMobilePrimary] = useState('');
  const [mobileSecondary, setMobileSecondary] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [companyName, setCompanyName] = useState(''); // GCC name or Entity name (first field, mapped to profile)
  const [parentCompany, setParentCompany] = useState('');
  const [yearEstablished, setYearEstablished] = useState('');
  const [industry, setIndustry] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  // Sync role from URL and redirect if invalid
  useEffect(() => {
    if (roleParam === 'GCC' || roleParam === 'STARTUP' || roleParam === 'INCUBATION') {
      setRole(roleParam);
    } else {
      navigate('/register', { replace: true });
    }
  }, [roleParam, navigate]);

  const handleSwitchEntity = (newRole: Role) => {
    setRole(newRole);
    setSearchParams({ role: newRole });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await register({
        name: companyName.trim(),
        email,
        password,
        role,
        company_website: companyWebsite.trim() || undefined,
        description: description.trim(),
        gst_number: gstNumber.trim() || undefined,
        additional_email: role !== 'GCC' ? additionalEmail.trim() || undefined : undefined,
        mobile_primary: mobilePrimary.trim() || undefined,
        mobile_secondary: role !== 'GCC' ? mobileSecondary.trim() || undefined : undefined,
        company_name: companyName.trim() || undefined,
        parent_company: role === 'GCC' ? parentCompany.trim() || undefined : undefined,
        year_established: role === 'GCC' && yearEstablished.trim() ? parseInt(yearEstablished, 10) : undefined,
        industry: role === 'GCC' ? industry.trim() || undefined : undefined,
      });
      setSuccess(true);
      setTimeout(() => navigate('/pending-approval', { replace: true }), 1200);
    } catch (err: unknown) {
      setError(err && typeof err === 'object' && 'message' in err ? String((err as { message: string }).message) : 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  if (roleParam !== 'GCC' && roleParam !== 'STARTUP' && roleParam !== 'INCUBATION') {
    return null; // redirecting in useEffect
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 pt-16 bg-page relative">
        <AuthPageBackground />
        <div className="w-full max-w-md page-card p-8 text-center relative z-0 shadow-xl">
          <h2 className="text-xl font-semibold text-foreground mb-2">Registration successful</h2>
          <p className="text-muted-foreground text-sm">
            Your account is pending admin approval. You'll be able to log in once an administrator approves your registration.
          </p>
          <p className="text-sm text-muted-foreground mt-4">Redirecting to approval status...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 pt-20 pb-16 bg-page relative">
      <AuthPageBackground />
      <div className="w-full max-w-lg relative z-0">
        <div className="page-card p-8 shadow-xl">
          <h1 className="text-xl font-bold text-foreground mb-2">Create account</h1>
          <div className="grid grid-cols-1 gap-2 mb-6">
            <button
              type="button"
              onClick={() => handleSwitchEntity('GCC')}
              className={`rounded-lg border px-3 py-2 text-sm text-left transition ${role === 'GCC' ? 'border-primary bg-primary/5 text-foreground' : 'border-border text-muted-foreground hover:border-primary/50'}`}
            >
              GCC Entity
            </button>
            <button
              type="button"
              onClick={() => handleSwitchEntity('STARTUP')}
              className={`rounded-lg border px-3 py-2 text-sm text-left transition ${role === 'STARTUP' ? 'border-primary bg-primary/5 text-foreground' : 'border-border text-muted-foreground hover:border-primary/50'}`}
            >
              Startup Entity
            </button>
            <button
              type="button"
              onClick={() => handleSwitchEntity('INCUBATION')}
              className={`rounded-lg border px-3 py-2 text-sm text-left transition ${role === 'INCUBATION' ? 'border-primary bg-primary/5 text-foreground' : 'border-border text-muted-foreground hover:border-primary/50'}`}
            >
              Incubation Center
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="rounded-lg bg-destructive/10 text-destructive text-sm p-3 border border-destructive/20">{error}</div>
            )}
            <div className="space-y-2">
              <Label htmlFor="entity_name">
                {role === 'GCC' ? 'GCC Name *' : role === 'INCUBATION' ? 'Incubation center name *' : 'Entity name *'}
              </Label>
              <Input
                id="entity_name"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                required
                className="rounded-lg"
                placeholder={
                  role === 'GCC'
                    ? 'Your GCC / company name'
                    : role === 'INCUBATION'
                      ? 'Your incubation center name'
                      : 'Your startup or entity name'
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email (login) *</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="rounded-lg" />
            </div>
            {role !== 'GCC' && (
              <div className="space-y-2">
                <Label htmlFor="additional_email">Additional email (optional)</Label>
                <Input
                  id="additional_email"
                  type="email"
                  placeholder="another@company.com"
                  value={additionalEmail}
                  onChange={(e) => setAdditionalEmail(e.target.value)}
                  className="rounded-lg"
                />
              </div>
            )}
            {role === 'GCC' && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="parent_company">Parent Company</Label>
                  <Input id="parent_company" value={parentCompany} onChange={(e) => setParentCompany(e.target.value)} className="rounded-lg" placeholder="Parent organization name" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="year_established">Year Established</Label>
                  <Input id="year_established" type="number" min={1900} max={2100} value={yearEstablished} onChange={(e) => setYearEstablished(e.target.value)} className="rounded-lg" placeholder="e.g. 2015" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="industry">Industry Domain</Label>
                  <select
                    id="industry"
                    value={industry}
                    onChange={(e) => setIndustry(e.target.value)}
                    className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
                  >
                    <option value="">Select...</option>
                    <option value="FinTech">FinTech</option>
                    <option value="Healthcare">Healthcare</option>
                    <option value="Automotive">Automotive</option>
                    <option value="Retail">Retail</option>
                    <option value="AI">AI</option>
                    <option value="Manufacturing">Manufacturing</option>
                    <option value="Logistics">Logistics</option>
                    <option value="EdTech">EdTech</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </>
            )}
            <div className="space-y-2">
              <Label htmlFor="password">Password (min 6 characters)</Label>
              <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} minLength={6} required className="rounded-lg" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm_password">Confirm password</Label>
              <Input id="confirm_password" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} minLength={6} required className="rounded-lg" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="gst_number">Company GSTN</Label>
              <Input
                id="gst_number"
                type="text"
                placeholder="e.g. 27AABCU9603R1ZM"
                value={gstNumber}
                onChange={(e) => setGstNumber(e.target.value)}
                className="rounded-lg"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="mobile_primary">{role === 'GCC' ? 'Mobile' : 'Primary mobile'}</Label>
              <Input
                id="mobile_primary"
                type="tel"
                placeholder="+91 98765 43210"
                value={mobilePrimary}
                onChange={(e) => setMobilePrimary(e.target.value)}
                className="rounded-lg"
              />
            </div>
            {role !== 'GCC' && (
              <div className="space-y-2">
                <Label htmlFor="mobile_secondary">Secondary mobile (optional)</Label>
                <Input
                  id="mobile_secondary"
                  type="tel"
                  placeholder="Optional"
                  value={mobileSecondary}
                  onChange={(e) => setMobileSecondary(e.target.value)}
                  className="rounded-lg"
                />
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="company_website">Company website</Label>
              <Input
                id="company_website"
                type="url"
                placeholder="https://www.example.com"
                value={companyWebsite}
                onChange={(e) => setCompanyWebsite(e.target.value)}
                className="rounded-lg"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Short description</Label>
              <Textarea
                id="description"
                placeholder="Brief description of your company or organization..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                required
                className="rounded-lg resize-none"
              />
            </div>
            <Button type="submit" className="w-full rounded-lg h-11 font-semibold" disabled={loading}>
              {loading ? 'Creating account...' : 'Create account'}
            </Button>
          </form>

          <div className="mt-8 pt-6 border-t border-border text-center">
            <p className="text-sm text-muted-foreground">
              Already have an account? <Link to="/login" className="text-primary hover:underline font-medium">Log in</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
