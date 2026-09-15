import { useState } from 'react';
import { Bell, CheckCheck, Trash2, Filter, Inbox } from 'lucide-react';
import { PageHeader } from '@/components/layout/page-header';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface NotificationItem {
  id: string;
  type: 'deal' | 'task' | 'mention' | 'system' | 'lead';
  title: string;
  body: string;
  time: string;
  read: boolean;
}

const initialNotifications: NotificationItem[] = [
  { id: '1', type: 'deal', title: 'New deal assigned', body: 'Acme Corp — Enterprise Annual ($48,000) has been assigned to you', time: '5m ago', read: false },
  { id: '2', type: 'task', title: 'Task due today', body: 'Follow up with Globex Inc is due at 3:30 PM', time: '1h ago', read: false },
  { id: '3', type: 'lead', title: 'Lead converted', body: 'Sara Chen was successfully converted to a contact', time: '3h ago', read: false },
  { id: '4', type: 'mention', title: 'You were mentioned', body: 'Jordan Miles mentioned you in a note on Hooli deal', time: '5h ago', read: true },
  { id: '5', type: 'system', title: 'Weekly report ready', body: 'Your sales performance report for this week is available', time: '8h ago', read: true },
  { id: '6', type: 'deal', title: 'Deal stage changed', body: 'Platform Expansion moved to Proposal stage', time: '1d ago', read: true },
  { id: '7', type: 'task', title: 'Task completed', body: 'Raj Patel completed "Quarterly review with Hooli"', time: '1d ago', read: true },
  { id: '8', type: 'system', title: 'New team member', body: 'David Brown has joined the Mid-Market team', time: '2d ago', read: true },
];

const typeConfig = {
  deal: { color: 'bg-primary/10 text-primary', label: 'Deal' },
  task: { color: 'bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400', label: 'Task' },
  mention: { color: 'bg-violet-100 text-violet-700 dark:bg-violet-500/15 dark:text-violet-400', label: 'Mention' },
  system: { color: 'bg-secondary text-muted-foreground', label: 'System' },
  lead: { color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400', label: 'Lead' },
} as const;

export function NotificationsPage() {
  const [notifications, setNotifications] = useState<NotificationItem[]>(initialNotifications);
  const [filter, setFilter] = useState<'all' | 'unread' | 'deal' | 'task' | 'mention' | 'system' | 'lead'>('all');

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const markRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const remove = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const filtered = filter === 'all'
    ? notifications
    : filter === 'unread'
      ? notifications.filter((n) => !n.read)
      : notifications.filter((n) => n.type === filter);

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div>
      <PageHeader
        title="Notifications"
        description="Stay up to date with everything happening in your workspace"
        actions={
          <>
            <Button variant="outline" size="sm" onClick={() => setFilter(filter === 'all' ? 'unread' : 'all')}>
              <Filter className="h-3.5 w-3.5" />
              {filter === 'unread' ? 'Show all' : 'Unread only'}
            </Button>
            <Button variant="outline" size="sm" onClick={markAllRead} disabled={unreadCount === 0}>
              <CheckCheck className="h-3.5 w-3.5" />
              Mark all read
            </Button>
          </>
        }
      />

      {unreadCount > 0 && (
        <p className="mb-3 text-sm text-muted-foreground">
          You have <span className="font-medium text-primary">{unreadCount}</span> unread notification{unreadCount > 1 ? 's' : ''}
        </p>
      )}

      <Card className="animate-fade-in-up">
        <CardContent className="p-0">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16">
              <Inbox className="h-10 w-10 text-muted-foreground/40" />
              <p className="mt-3 text-sm text-muted-foreground">No notifications to show</p>
            </div>
          ) : (
            <div className="divide-y divide-border/50">
              {filtered.map((notif) => {
                const cfg = typeConfig[notif.type];
                return (
                  <div
                    key={notif.id}
                    className={cn(
                      'flex items-start gap-3 px-4 py-3.5 transition-colors hover:bg-secondary/30 cursor-pointer',
                      !notif.read && 'bg-primary/5'
                    )}
                    onClick={() => !notif.read && markRead(notif.id)}
                  >
                    <div className={cn('flex h-9 w-9 shrink-0 items-center justify-center rounded-lg', cfg.color)}>
                      <Bell className="h-4 w-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium">{notif.title}</p>
                        <Badge variant="outline" className="text-xs">{cfg.label}</Badge>
                        {!notif.read && <span className="h-2 w-2 rounded-full bg-primary" />}
                      </div>
                      <p className="mt-0.5 text-sm text-muted-foreground">{notif.body}</p>
                      <p className="mt-1 text-xs text-muted-foreground/70">{notif.time}</p>
                    </div>
                    <button
                      onClick={(e) => { e.stopPropagation(); remove(notif.id); }}
                      className="rounded-lg p-1.5 text-muted-foreground hover:bg-secondary hover:text-destructive transition-colors"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
