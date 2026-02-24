import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import AuthPageBackground from '@/components/AuthPageBackground';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [companyWebsite, setCompanyWebsite] = useState('');
  const [description, setDescription] = useState('');
  const [gstNumber, setGstNumber] = useState('');
  const [additionalEmail, setAdditionalEmail] = useState('');
  const [mobilePrimary, setMobilePrimary] = useState('');
  const [mobileSecondary, setMobileSecondary] = useState('');
  const [role, setRole] = useState<'GCC' | 'STARTUP'>('GCC');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

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
        name,
        email,
        password,
        role,
        company_website: companyWebsite.trim() || undefined,
        description: description.trim(),
        gst_number: gstNumber.trim() || undefined,
        additional_email: additionalEmail.trim() || undefined,
        mobile_primary: mobilePrimary.trim() || undefined,
        mobile_secondary: mobileSecondary.trim() || undefined,
      });
      setSuccess(true);
      setTimeout(() => navigate('/login'), 2000);
    } catch (err: unknown) {
      setError(err && typeof err === 'object' && 'message' in err ? String((err as { message: string }).message) : 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 pt-16 bg-page relative">
        <AuthPageBackground />
        <div className="w-full max-w-md page-card p-8 text-center relative z-0 shadow-xl">
          <h2 className="text-xl font-semibold text-foreground mb-2">Registration successful</h2>
          <p className="text-muted-foreground text-sm">
            Your account is pending admin approval. You’ll be able to log in once an administrator approves your registration.
          </p>
          <p className="text-sm text-muted-foreground mt-4">Redirecting to login...</p>
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
          <p className="text-muted-foreground text-sm mt-1 mb-4">Select your registration category.</p>

          <div className="space-y-3 mb-4">
            <button
              type="button"
              onClick={() => setRole('STARTUP')}
              className={`w-full flex items-center justify-between rounded-lg border px-4 py-3 text-left transition-colors ${
                role === 'STARTUP'
                  ? 'border-primary bg-primary/5 text-foreground'
                  : 'border-border bg-card hover:border-primary/50'
              }`}
            >
              <span className="font-medium text-sm">Startup Entity</span>
              <span className="text-muted-foreground text-xs">Emerging technology companies and scale-ups</span>
            </button>
            <button
              type="button"
              onClick={() => setRole('GCC')}
              className={`w-full flex items-center justify-between rounded-lg border px-4 py-3 text-left transition-colors ${
                role === 'GCC'
                  ? 'border-primary bg-primary/5 text-foreground'
                  : 'border-border bg-card hover:border-primary/50'
              }`}
            >
              <span className="font-medium text-sm">GCC Entity</span>
              <span className="text-muted-foreground text-xs">Global Capability Centers and corporate innovation units.</span>
            </button>
          </div>
          <p className="text-sm text-muted-foreground mb-6 text-center">
            {role === 'GCC' ? (
              <>Not a GCC Entity? <button type="button" onClick={() => setRole('STARTUP')} className="text-primary hover:underline font-medium">Go to Startup Entity</button></>
            ) : (
              <>Not a Startup Entity? <button type="button" onClick={() => setRole('GCC')} className="text-primary hover:underline font-medium">Go to GCC Entity</button></>
            )}
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
                {error && (
                  <div className="rounded-lg bg-destructive/10 text-destructive text-sm p-3 border border-destructive/20">{error}</div>
                )}
                <div className="space-y-2">
                  <Label htmlFor="name">Full name</Label>
                  <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required className="rounded-lg" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email (login) *</Label>
                  <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="rounded-lg" />
                </div>
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
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="mobile_primary">Mobile 1</Label>
                    <Input
                      id="mobile_primary"
                      type="tel"
                      placeholder="+91 98765 43210"
                      value={mobilePrimary}
                      onChange={(e) => setMobilePrimary(e.target.value)}
                      className="rounded-lg"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="mobile_secondary">Mobile 2</Label>
                    <Input
                      id="mobile_secondary"
                      type="tel"
                      placeholder="Optional"
                      value={mobileSecondary}
                      onChange={(e) => setMobileSecondary(e.target.value)}
                      className="rounded-lg"
                    />
                  </div>
                </div>
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
