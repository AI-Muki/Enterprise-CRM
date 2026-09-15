import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MailCheck, AlertCircle, ArrowRight, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { LogoFull } from '@/components/layout/logo';

export function VerifyEmailPage() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase.auth.getSession();

      if (error || !data.session) {
        setStatus('error');
        setMessage('No active session found. Please sign in again.');
        return;
      }

      // If email is already confirmed, redirect
      if (data.session.user.email_confirmed_at) {
        setStatus('success');
        setMessage('Your email is already verified!');
        return;
      }

      // Resend verification email
      const { error: resendError } = await supabase.auth.resend({
        type: 'signup',
        email: data.session.user.email ?? '',
      });

      if (resendError) {
        setStatus('error');
        setMessage(resendError.message);
      } else {
        setStatus('success');
        setMessage('A verification email has been sent to your inbox. Click the link to verify your email.');
      }
    })();
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex justify-center">
          <LogoFull />
        </div>

        <div className="rounded-2xl border border-border bg-card p-8 shadow-card animate-fade-in-up text-center">
          {status === 'loading' && (
            <>
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Loader2 className="h-6 w-6 animate-spin" />
              </div>
              <h1 className="text-xl font-bold">Verifying your email</h1>
              <p className="mt-2 text-sm text-muted-foreground">Please wait...</p>
            </>
          )}

          {status === 'success' && (
            <>
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-success/10 text-success">
                <MailCheck className="h-6 w-6" />
              </div>
              <h1 className="text-xl font-bold">Verify your email</h1>
              <p className="mt-2 text-sm text-muted-foreground">{message}</p>
              <Link to="/dashboard" className="block mt-6">
                <Button className="w-full" size="lg">
                  Go to dashboard
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </>
          )}

          {status === 'error' && (
            <>
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10 text-destructive">
                <AlertCircle className="h-6 w-6" />
              </div>
              <h1 className="text-xl font-bold">Verification failed</h1>
              <p className="mt-2 text-sm text-muted-foreground">{message}</p>
              <Link to="/login" className="block mt-6">
                <Button variant="outline" className="w-full" size="lg">
                  Back to sign in
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
