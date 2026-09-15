import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  Bell,
  Moon,
  Sun,
  Menu,
  ChevronDown,
  Settings,
  LogOut,
  User,
  Command,
  Check,
} from 'lucide-react';
import { useThemeStore } from '@/store/theme-store';
import { useUIStore } from '@/store/ui-store';
import { useAuthStore } from '@/store/auth-store';
import { supabase } from '@/lib/supabase';
import { Avatar } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

const mockNotifications = [
  { id: 1, title: 'New deal assigned', body: 'Acme Corp — $24,000', time: '5m ago', unread: true },
  { id: 2, title: 'Task due today', body: 'Follow up with Globex', time: '1h ago', unread: true },
  { id: 3, title: 'Lead converted', body: 'Sara Chen → Contact', time: '3h ago', unread: false },
];

export function Topbar() {
  const { theme, toggleTheme } = useThemeStore();
  const { setMobileSidebarOpen, setCommandPaletteOpen } = useUIStore();
  const { user, reset } = useAuthStore();
  const navigate = useNavigate();

  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setNotifOpen(false);
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) setProfileOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const userName = user?.name || 'Alex Morgan';
  const userEmail = user?.email || 'alex@nexuscrm.io';

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border bg-card/80 px-4 backdrop-blur-xl lg:px-6">
      {/* Mobile menu */}
      <button
        onClick={() => setMobileSidebarOpen(true)}
        className="rounded-lg p-2 text-muted-foreground hover:bg-secondary transition-colors lg:hidden"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Search / Command */}
      <button
        onClick={() => setCommandPaletteOpen(true)}
        className="group flex h-9.5 flex-1 max-w-md items-center gap-2.5 rounded-lg border border-border bg-background px-3 text-sm text-muted-foreground transition-all hover:border-primary/30 hover:bg-secondary/50"
      >
        <Search className="h-4 w-4" />
        <span className="flex-1 text-left">Search or jump to...</span>
        <kbd className="hidden items-center gap-0.5 rounded border border-border bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground sm:flex">
          <Command className="h-2.5 w-2.5" />K
        </kbd>
      </button>

      <div className="ml-auto flex items-center gap-1.5">
        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          className="rounded-lg p-2 text-muted-foreground hover:bg-secondary transition-colors"
          aria-label="Toggle theme"
        >
          {theme === 'light' ? <Moon className="h-[18px] w-[18px]" /> : <Sun className="h-[18px] w-[18px]" />}
        </button>

        {/* Notifications */}
        <div ref={notifRef} className="relative">
          <button
            onClick={() => setNotifOpen((o) => !o)}
            className="relative rounded-lg p-2 text-muted-foreground hover:bg-secondary transition-colors"
          >
            <Bell className="h-[18px] w-[18px]" />
            <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-destructive ring-2 ring-card" />
          </button>

          {notifOpen && (
            <div className="absolute right-0 mt-2 w-80 rounded-xl border border-border bg-popover shadow-floating animate-fade-in-down">
              <div className="flex items-center justify-between border-b border-border px-4 py-3">
                <span className="text-sm font-semibold">Notifications</span>
                <button className="text-xs text-primary hover:underline">Mark all read</button>
              </div>
              <div className="max-h-80 overflow-y-auto">
                {mockNotifications.map((n) => (
                  <div
                    key={n.id}
                    className={cn(
                      'flex gap-3 border-b border-border/50 px-4 py-3 transition-colors hover:bg-secondary/50 cursor-pointer',
                      n.unread && 'bg-primary/5'
                    )}
                  >
                    <div className="mt-1.5">
                      {n.unread ? (
                        <span className="h-2 w-2 rounded-full bg-primary" />
                      ) : (
                        <Check className="h-3.5 w-3.5 text-muted-foreground" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground">{n.title}</p>
                      <p className="text-xs text-muted-foreground">{n.body}</p>
                      <p className="mt-0.5 text-xs text-muted-foreground/70">{n.time}</p>
                    </div>
                  </div>
                ))}
              </div>
              <button className="w-full py-2.5 text-center text-xs font-medium text-primary hover:bg-secondary/50 transition-colors">
                View all notifications
              </button>
            </div>
          )}
        </div>

        {/* Profile */}
        <div ref={profileRef} className="relative">
          <button
            onClick={() => setProfileOpen((o) => !o)}
            className="flex items-center gap-2 rounded-lg p-1 pr-2 hover:bg-secondary transition-colors"
          >
            <Avatar name={userName} size="sm" />
            <ChevronDown className="hidden h-3.5 w-3.5 text-muted-foreground sm:block" />
          </button>

          {profileOpen && (
            <div className="absolute right-0 mt-2 w-60 rounded-xl border border-border bg-popover shadow-floating animate-fade-in-down">
              <div className="border-b border-border px-4 py-3">
                <p className="text-sm font-semibold">{userName}</p>
                <p className="text-xs text-muted-foreground">{userEmail}</p>
              </div>
              <div className="p-1.5">
                <button
                  onClick={() => { setProfileOpen(false); navigate('/profile'); }}
                  className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-foreground hover:bg-secondary transition-colors"
                >
                  <User className="h-4 w-4" /> Profile
                </button>
                <button
                  onClick={() => { setProfileOpen(false); navigate('/settings'); }}
                  className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-foreground hover:bg-secondary transition-colors"
                >
                  <Settings className="h-4 w-4" /> Settings
                </button>
                <div className="my-1 h-px bg-border" />
                <button
                  onClick={async () => { await supabase.auth.signOut(); reset(); navigate('/login'); }}
                  className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-destructive hover:bg-destructive/10 transition-colors"
                >
                  <LogOut className="h-4 w-4" /> Sign out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
