import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import type { User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { useAuthStore, type AuthUser, type Role } from '@/store/auth-store';

interface OrgMembership {
  organization_id: string;
  role: Role;
  organizations: { name: string } | null;
}

interface AuthContextValue {
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextValue>({
  isAuthenticated: false,
  isLoading: true,
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const { setUser, setSession, setInitialized, reset } = useAuthStore();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  async function buildAuthUser(user: User): Promise<AuthUser> {
    const { data: profile } = await supabase
      .from('profiles')
      .select('full_name, avatar_url, title')
      .eq('id', user.id)
      .maybeSingle();

    const { data: membership } = await supabase
      .from('organization_members')
      .select('organization_id, role, organizations(name)')
      .eq('user_id', user.id)
      .maybeSingle() as { data: OrgMembership | null };

    return {
      id: user.id,
      email: user.email ?? '',
      name: profile?.full_name || (user.email?.split('@')[0] ?? 'User'),
      role: membership?.role ?? 'viewer',
      avatarUrl: profile?.avatar_url ?? undefined,
      organizationId: membership?.organization_id,
      organizationName: membership?.organizations?.name ?? undefined,
    };
  }

  useEffect(() => {
    let mounted = true;

    async function init() {
      const { data: { session } } = await supabase.auth.getSession();

      if (!mounted) return;

      if (session?.user) {
        setSession(session);
        const authUser = await buildAuthUser(session.user);
        if (!mounted) return;
        setUser(authUser);
        setIsAuthenticated(true);
      } else {
        reset();
        setIsAuthenticated(false);
      }

      setIsLoading(false);
      setInitialized(true);
    }

    init();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        (async () => {
          if (event === 'SIGNED_OUT' || !session) {
            reset();
            setIsAuthenticated(false);
            setIsLoading(false);
            return;
          }

          if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED' || event === 'USER_UPDATED') {
            setSession(session);
            const authUser = await buildAuthUser(session.user);
            if (!mounted) return;
            setUser(authUser);
            setIsAuthenticated(true);
            setIsLoading(false);
          }
        })();
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
