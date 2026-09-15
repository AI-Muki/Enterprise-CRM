import { useState, type FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, User, Building2, Eye, EyeOff, ArrowRight, Check, AlertCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input, Field } from '@/components/ui/input';
import { LogoFull } from '@/components/layout/logo';

const benefits = [
  'Free 14-day trial — no credit card required',
  'Unlimited contacts, deals, and pipelines',
  'AI assistant included on every plan',
];

function slugify(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 40);
}

export function SignupPage() {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    // Step 1: Sign up with Supabase Auth
    const { data: authData, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName } },
    });

    if (signUpError) {
      setError(signUpError.message);
      setLoading(false);
      return;
    }

    const userId = authData.user?.id;
    if (!userId) {
      setError('Sign-up failed — no user returned.');
      setLoading(false);
      return;
    }

    // Step 2: Create the organization
    const { data: orgData, error: orgError } = await supabase
      .from('organizations')
      .insert({
        name: companyName,
        slug: slugify(companyName),
        owner_id: userId,
        plan: 'free',
      })
      .select('id')
      .single();

    if (orgError) {
      setError(`Account created but organization setup failed: ${orgError.message}. Please contact support.`);
      setLoading(false);
      return;
    }

    // Step 3: Add the owner as an organization member
    const { error: memberError } = await supabase.from('organization_members').insert({
      organization_id: orgData.id,
      user_id: userId,
      role: 'owner',
    });

    if (memberError) {
      setError(`Organization created but membership assignment failed: ${memberError.message}.`);
      setLoading(false);
      return;
    }

    navigate('/dashboard');
  };

  return (
    <div className="flex min-h-screen">
      {/* Left panel — showcase */}
      <div className="hidden lg:flex flex-1 items-center justify-center bg-gradient-to-br from-primary-700 via-primary-600 to-primary-800 p-12 relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              'linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />
        <div className="absolute top-1/4 -right-20 h-72 w-72 rounded-full bg-primary-300/30 blur-3xl" />
        <div className="absolute bottom-1/4 -left-20 h-96 w-96 rounded-full bg-primary-400/20 blur-3xl" />

        <div className="relative max-w-md text-white animate-fade-in-up">
          <h2 className="text-3xl font-bold leading-tight">
            Start closing more deals today
          </h2>
          <p className="mt-4 text-primary-100">
            Join thousands of teams using Nexus CRM to streamline their sales process and grow revenue.
          </p>
          <ul className="mt-8 space-y-4">
            {benefits.map((b, i) => (
              <li key={i} className="flex items-start gap-3 animate-fade-in-up" style={{ animationDelay: `${200 + i * 100}ms` }}>
                <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white/20">
                  <Check className="h-3 w-3" />
                </div>
                <span className="text-sm text-primary-50">{b}</span>
              </li>
            ))}
          </ul>

          <div className="mt-10 rounded-2xl border border-white/20 bg-white/10 p-5 backdrop-blur-sm">
            <div className="flex gap-1 text-amber-300">
              {'★★★★★'.split('').map((s, i) => (
                <span key={i}>{s}</span>
              ))}
            </div>
            <p className="mt-3 text-sm text-primary-50">
              "We switched from Salesforce to Nexus and our team's productivity doubled. The AI assistant alone saves us 10 hours a week."
            </p>
            <div className="mt-4 flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20 text-xs font-semibold">
                SK
              </div>
              <div>
                <p className="text-sm font-semibold">Sarah Kim</p>
                <p className="text-xs text-primary-100">VP Sales, TechFlow Inc.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex w-full flex-col px-6 py-8 sm:px-12 lg:w-[480px] lg:px-10">
        <div className="flex items-center justify-between">
          <LogoFull />
        </div>

        <div className="flex flex-1 flex-col justify-center max-w-sm mx-auto w-full">
          <div className="mb-6 animate-fade-in-up">
            <h1 className="text-2xl font-bold tracking-tight">Create your account</h1>
            <p className="mt-1.5 text-sm text-muted-foreground">
              Get started with your free Nexus CRM workspace
            </p>
          </div>

          {error && (
            <div className="mb-4 flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive animate-fade-in">
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 animate-fade-in-up animate-delay-100">
            <Field label="Full name" required>
              <div className="relative">
                <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="John Smith"
                  className="pl-9"
                  required
                />
              </div>
            </Field>

            <Field label="Company name" required>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="Acme Corp"
                  className="pl-9"
                  required
                />
              </div>
            </Field>

            <Field label="Work email" required>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@company.com"
                  className="pl-9"
                  required
                />
              </div>
            </Field>

            <Field label="Password" hint="At least 8 characters" required>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create a password"
                  className="pl-9 pr-9"
                  minLength={8}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </Field>

            <label className="flex items-start gap-2 text-sm text-muted-foreground cursor-pointer">
              <input type="checkbox" className="mt-0.5 h-4 w-4 rounded border-input accent-primary" required />
              <span>
                I agree to the{' '}
                <a className="text-primary hover:underline">Terms of Service</a> and{' '}
                <a className="text-primary hover:underline">Privacy Policy</a>
              </span>
            </label>

            <Button type="submit" loading={loading} className="w-full" size="lg">
              {!loading && (
                <>
                  Create account
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-primary hover:underline">
              Sign in
            </Link>
          </p>
        </div>

        <p className="text-center text-xs text-muted-foreground/70">
          © 2026 Nexus CRM. All rights reserved.
        </p>
      </div>
    </div>
  );
}
