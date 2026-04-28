import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Building2, Lightbulb, FlaskConical, ArrowLeft, Check, Eye, EyeOff } from 'lucide-react';
import { motion } from 'framer-motion';

type Role = 'GCC' | 'STARTUP' | 'INCUBATION';

const ROLE_CONFIG: Record<Role, {
  label: string;
  icon: React.ElementType;
  color: string;
  gradient: string;
  namePlaceholder: string;
  nameLabel: string;
}> = {
  GCC: {
    label: 'Enterprise / GCC',
    icon: Building2,
    color: 'text-blue-600',
    gradient: 'from-blue-600 to-blue-800',
    nameLabel: 'GCC / Company Name',
    namePlaceholder: 'Your Global Capability Center name',
  },
  STARTUP: {
    label: 'Startup',
    icon: Lightbulb,
    color: 'text-violet-600',
    gradient: 'from-violet-600 to-purple-800',
    nameLabel: 'Startup / Entity Name',
    namePlaceholder: 'Your startup or entity name',
  },
  INCUBATION: {
    label: 'Incubation Center',
    icon: FlaskConical,
    color: 'text-emerald-600',
    gradient: 'from-emerald-600 to-teal-800',
    nameLabel: 'Incubation Center Name',
    namePlaceholder: 'Your incubation center name',
  },
};

export default function RegisterForm() {
  const [searchParams, setSearchParams] = useSearchParams();
  const roleParam = searchParams.get('role') as Role | null;
  const [role, setRole] = useState<Role>(roleParam === 'GCC' || roleParam === 'STARTUP' || roleParam === 'INCUBATION' ? roleParam : 'GCC');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [companyWebsite, setCompanyWebsite] = useState('');
  const [description, setDescription] = useState('');
  const [gstNumber, setGstNumber] = useState('');
  const [additionalEmail, setAdditionalEmail] = useState('');
  const [mobilePrimary, setMobilePrimary] = useState('');
  const [mobileSecondary, setMobileSecondary] = useState('');
  const [parentCompany, setParentCompany] = useState('');
  const [yearEstablished, setYearEstablished] = useState('');
  const [industry, setIndustry] = useState('');
  const [panNumber, setPanNumber] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (roleParam === 'GCC' || roleParam === 'STARTUP' || roleParam === 'INCUBATION') {
      setRole(roleParam);
    } else {
      navigate('/register', { replace: true });
    }
  }, [roleParam, navigate]);

  const cfg = ROLE_CONFIG[role];
  const RoleIcon = cfg.icon;

  const handleSwitchRole = (r: Role) => {
    setRole(r);
    setSearchParams({ role: r });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
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
        pan_number: panNumber.trim().toUpperCase(),
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
      setTimeout(() => navigate('/pending-approval', { replace: true }), 1500);
    } catch (err: unknown) {
      setError(err && typeof err === 'object' && 'message' in err ? String((err as { message: string }).message) : 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  if (roleParam !== 'GCC' && roleParam !== 'STARTUP' && roleParam !== 'INCUBATION') return null;

  if (success) {
    return (
      <div className="min-h-screen bg-home-navy flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md bg-white/[0.06] border border-white/10 rounded-2xl p-10 text-center shadow-2xl"
        >
          <div className="w-16 h-16 rounded-full bg-green-500/20 border border-green-500/30 flex items-center justify-center mx-auto mb-5">
            <Check className="w-8 h-8 text-green-400" />
          </div>
          <h2 className="text-xl font-bold text-white mb-3">Registration Submitted!</h2>
          <p className="text-white/60 text-sm leading-relaxed mb-6">
            Your account is pending admin approval. You'll receive access once our team reviews and approves your registration.
          </p>
          <p className="text-white/30 text-xs">Redirecting to approval status…</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-home-navy relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-1/4 w-[500px] h-[500px] rounded-full bg-home-accent/8 blur-[120px]" />
        <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] rounded-full bg-violet-600/8 blur-[100px]" />
      </div>

      {/* Back link */}
      <div className="absolute top-4 left-4 z-10">
        <Link to="/register" className="flex items-center gap-1.5 text-white/50 hover:text-white/90 text-sm font-medium transition">
          <ArrowLeft className="w-4 h-4" />
          Back
        </Link>
      </div>

      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-lg"
        >
          {/* Card */}
          <div className="bg-white/[0.05] backdrop-blur-md border border-white/10 rounded-2xl p-8 shadow-2xl">
            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
              <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${cfg.gradient} flex items-center justify-center shadow-lg flex-shrink-0`}>
                <RoleIcon className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-white/50 text-xs font-semibold tracking-wider uppercase">Register as</p>
                <h1 className="text-white text-lg font-bold">{cfg.label}</h1>
              </div>
            </div>

            {/* Role switcher */}
            <div className="grid grid-cols-3 gap-1.5 p-1 bg-white/5 rounded-xl mb-6">
              {(['GCC', 'STARTUP', 'INCUBATION'] as Role[]).map(r => {
                const Icon = ROLE_CONFIG[r].icon;
                return (
                  <button
                    key={r}
                    type="button"
                    onClick={() => handleSwitchRole(r)}
                    className={`flex items-center justify-center gap-1.5 py-2 px-2 rounded-lg text-xs font-medium transition-all ${
                      role === r ? 'bg-white/10 text-white shadow-sm' : 'text-white/40 hover:text-white/70'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5 flex-shrink-0" />
                    <span className="hidden sm:inline">
                      {r === 'GCC' ? 'Enterprise' : r === 'STARTUP' ? 'Startup' : 'Incubator'}
                    </span>
                  </button>
                );
              })}
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 text-sm p-3.5">
                  {error}
                </div>
              )}

              {/* Entity name */}
              <div className="space-y-1.5">
                <Label htmlFor="entity_name" className="text-white/70 text-sm">{cfg.nameLabel} *</Label>
                <Input
                  id="entity_name"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  required
                  placeholder={cfg.namePlaceholder}
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/25 focus:border-white/30 rounded-xl h-11"
                />
              </div>

              {/* Email */}
              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-white/70 text-sm">Login Email *</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="contact@yourorg.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/25 focus:border-white/30 rounded-xl h-11"
                />
              </div>

              {/* Additional email (not for GCC) */}
              {role !== 'GCC' && (
                <div className="space-y-1.5">
                  <Label htmlFor="additional_email" className="text-white/70 text-sm">Additional Email <span className="text-white/30">(optional)</span></Label>
                  <Input
                    id="additional_email"
                    type="email"
                    placeholder="another@org.com"
                    value={additionalEmail}
                    onChange={(e) => setAdditionalEmail(e.target.value)}
                    className="bg-white/5 border-white/10 text-white placeholder:text-white/25 focus:border-white/30 rounded-xl h-11"
                  />
                </div>
              )}

              {/* GCC-specific fields */}
              {role === 'GCC' && (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label htmlFor="parent_company" className="text-white/70 text-sm">Parent Company</Label>
                      <Input
                        id="parent_company"
                        value={parentCompany}
                        onChange={(e) => setParentCompany(e.target.value)}
                        placeholder="Parent org name"
                        className="bg-white/5 border-white/10 text-white placeholder:text-white/25 focus:border-white/30 rounded-xl h-11"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="year_established" className="text-white/70 text-sm">Year Founded</Label>
                      <Input
                        id="year_established"
                        type="number"
                        min={1900}
                        max={2100}
                        value={yearEstablished}
                        onChange={(e) => setYearEstablished(e.target.value)}
                        placeholder="e.g. 2010"
                        className="bg-white/5 border-white/10 text-white placeholder:text-white/25 focus:border-white/30 rounded-xl h-11"
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="industry" className="text-white/70 text-sm">Industry Domain</Label>
                    <select
                      id="industry"
                      value={industry}
                      onChange={(e) => setIndustry(e.target.value)}
                      className="flex h-11 w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:border-white/30 focus:outline-none"
                    >
                      <option value="" className="bg-slate-800">Select domain…</option>
                      <option value="FinTech" className="bg-slate-800">FinTech</option>
                      <option value="Healthcare" className="bg-slate-800">Healthcare</option>
                      <option value="Automotive" className="bg-slate-800">Automotive</option>
                      <option value="Retail" className="bg-slate-800">Retail</option>
                      <option value="AI" className="bg-slate-800">AI / Machine Learning</option>
                      <option value="Manufacturing" className="bg-slate-800">Manufacturing</option>
                      <option value="Logistics" className="bg-slate-800">Logistics & Supply Chain</option>
                      <option value="EdTech" className="bg-slate-800">EdTech</option>
                      <option value="Cybersecurity" className="bg-slate-800">Cybersecurity</option>
                      <option value="Other" className="bg-slate-800">Other</option>
                    </select>
                  </div>
                </>
              )}

              {/* PAN Number */}
              <div className="space-y-1.5">
                <Label htmlFor="pan_number" className="text-white/70 text-sm">Company PAN Number *</Label>
                <Input
                  id="pan_number"
                  value={panNumber}
                  onChange={(e) => setPanNumber(e.target.value.toUpperCase())}
                  required
                  maxLength={10}
                  placeholder="e.g. AABCE1234F"
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/25 focus:border-white/30 rounded-xl h-11 tracking-widest uppercase"
                />
                <p className="text-white/30 text-xs">Format: 5 letters + 4 digits + 1 letter (e.g. AABCE1234F)</p>
              </div>

              {/* Password */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="password" className="text-white/70 text-sm">Password *</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Min 6 characters"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      minLength={6}
                      required
                      className="bg-white/5 border-white/10 text-white placeholder:text-white/25 focus:border-white/30 rounded-xl h-11 pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70 transition"
                      tabIndex={-1}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="confirm_password" className="text-white/70 text-sm">Confirm *</Label>
                  <div className="relative">
                    <Input
                      id="confirm_password"
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="Re-enter password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      minLength={6}
                      required
                      className="bg-white/5 border-white/10 text-white placeholder:text-white/25 focus:border-white/30 rounded-xl h-11 pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword((v) => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70 transition"
                      tabIndex={-1}
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* GST + Mobile */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="gst_number" className="text-white/70 text-sm">GSTN <span className="text-white/30">(optional)</span></Label>
                  <Input
                    id="gst_number"
                    placeholder="22AAAAA0000A1Z5"
                    value={gstNumber}
                    onChange={(e) => setGstNumber(e.target.value)}
                    className="bg-white/5 border-white/10 text-white placeholder:text-white/25 focus:border-white/30 rounded-xl h-11"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="mobile_primary" className="text-white/70 text-sm">Mobile</Label>
                  <Input
                    id="mobile_primary"
                    type="tel"
                    placeholder="+91 98765 43210"
                    value={mobilePrimary}
                    onChange={(e) => setMobilePrimary(e.target.value)}
                    className="bg-white/5 border-white/10 text-white placeholder:text-white/25 focus:border-white/30 rounded-xl h-11"
                  />
                </div>
              </div>

              {/* Secondary mobile (not for GCC) */}
              {role !== 'GCC' && (
                <div className="space-y-1.5">
                  <Label htmlFor="mobile_secondary" className="text-white/70 text-sm">Secondary Mobile <span className="text-white/30">(optional)</span></Label>
                  <Input
                    id="mobile_secondary"
                    type="tel"
                    placeholder="+91 98765 43210"
                    value={mobileSecondary}
                    onChange={(e) => setMobileSecondary(e.target.value)}
                    className="bg-white/5 border-white/10 text-white placeholder:text-white/25 focus:border-white/30 rounded-xl h-11"
                  />
                </div>
              )}

              {/* Website */}
              <div className="space-y-1.5">
                <Label htmlFor="company_website" className="text-white/70 text-sm">Website <span className="text-white/30">(optional)</span></Label>
                <Input
                  id="company_website"
                  type="url"
                  placeholder="https://www.yourcompany.com"
                  value={companyWebsite}
                  onChange={(e) => setCompanyWebsite(e.target.value)}
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/25 focus:border-white/30 rounded-xl h-11"
                />
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <Label htmlFor="description" className="text-white/70 text-sm">About Your Organization *</Label>
                <Textarea
                  id="description"
                  placeholder="Brief description of what your organization does, your focus area, and what you're looking for on TechCovate…"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  required
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/25 focus:border-white/30 rounded-xl resize-none"
                />
              </div>

              <Button
                type="submit"
                disabled={loading}
                className={`w-full h-11 rounded-xl bg-gradient-to-r ${cfg.gradient} hover:opacity-90 text-white font-semibold text-sm shadow-lg`}
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                    Creating account…
                  </span>
                ) : `Register as ${cfg.label}`}
              </Button>
            </form>

            <div className="mt-6 pt-5 border-t border-white/10 text-center">
              <p className="text-white/40 text-sm">
                Already have an account?{' '}
                <Link to="/login" className="text-white/70 hover:text-white font-medium transition">
                  Sign in
                </Link>
              </p>
            </div>
          </div>

          <p className="text-center text-white/20 text-xs mt-5">
            All registrations require admin approval before you can access the platform.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
