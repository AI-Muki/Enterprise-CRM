import { useState, type FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, ArrowRight, Check, AlertCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input, Field } from '@/components/ui/input';
import { LogoFull } from '@/components/layout/logo';

const highlights = [
  'Unified pipeline, contacts, and deals in one workspace',
  'AI-powered insights and next-step recommendations',
  'Real-time collaboration across your entire revenue team',
];

export function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    navigate('/dashboard');
  };

  return (
    <div className="flex min-h-screen">
      {/* Left panel — form */}
      <div className="flex w-full flex-col px-6 py-8 sm:px-12 lg:w-[480px] lg:px-10">
        <div className="flex items-center justify-between">
          <LogoFull />
        </div>

        <div className="flex flex-1 flex-col justify-center max-w-sm mx-auto w-full">
          <div className="mb-8 animate-fade-in-up">
            <h1 className="text-2xl font-bold tracking-tight">Welcome back</h1>
            <p className="mt-1.5 text-sm text-muted-foreground">
              Sign in to your Nexus CRM workspace to continue
            </p>
          </div>

          {error && (
            <div className="mb-4 flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive animate-fade-in">
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5 animate-fade-in-up animate-delay-100">
            <Field label="Email address" required>
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

            <Field label="Password" required>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="pl-9 pr-9"
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

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm text-muted-foreground cursor-pointer">
                <input type="checkbox" className="h-4 w-4 rounded border-input accent-primary" />
                Remember me
              </label>
              <Link to="/forgot-password" className="text-sm text-primary hover:underline">
                Forgot password?
              </Link>
            </div>

            <Button type="submit" loading={loading} className="w-full" size="lg">
              {!loading && (
                <>
                  Sign in
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full h-px bg-border" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-background px-3 text-xs text-muted-foreground">or</span>
            </div>
          </div>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Don't have an account?{' '}
            <Link to="/signup" className="font-medium text-primary hover:underline">
              Sign up free
            </Link>
          </p>
        </div>

        <p className="text-center text-xs text-muted-foreground/70">
          © 2026 Nexus CRM. All rights reserved.
        </p>
      </div>

      {/* Right panel — showcase */}
      <div className="hidden lg:flex flex-1 items-center justify-center bg-gradient-to-br from-primary-600 via-primary-500 to-primary-700 p-12 relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              'linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />
        <div className="absolute top-1/4 -left-20 h-72 w-72 rounded-full bg-primary-300/30 blur-3xl" />
        <div className="absolute bottom-1/4 -right-20 h-96 w-96 rounded-full bg-primary-400/20 blur-3xl" />

        <div className="relative max-w-md text-white animate-fade-in-up animate-delay-200">
          <h2 className="text-3xl font-bold leading-tight">
            The enterprise CRM your team will actually love using
          </h2>
          <p className="mt-4 text-primary-100">
            Manage your entire revenue pipeline, collaborate in real time, and close deals faster with AI-powered insights.
          </p>
          <ul className="mt-8 space-y-4">
            {highlights.map((h, i) => (
              <li key={i} className="flex items-start gap-3 animate-fade-in-up" style={{ animationDelay: `${300 + i * 100}ms` }}>
                <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white/20">
                  <Check className="h-3 w-3" />
                </div>
                <span className="text-sm text-primary-50">{h}</span>
              </li>
            ))}
          </ul>

          <div className="mt-10 flex items-center gap-4 rounded-2xl border border-white/20 bg-white/10 p-4 backdrop-blur-sm">
            <div className="flex -space-x-2">
              {['JM', 'SK', 'RP', 'AL'].map((init, i) => (
                <div
                  key={i}
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-xs font-semibold ring-2 ring-primary-600"
                >
                  {init}
                </div>
              ))}
            </div>
            <div>
              <p className="text-sm font-semibold">Trusted by 12,000+ teams</p>
              <p className="text-xs text-primary-100">From startups to Fortune 500</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
