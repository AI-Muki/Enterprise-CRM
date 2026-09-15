import { useState } from 'react';
import { Activity, Plus, Phone, Mail, Calendar, FileText, StickyNote, CheckSquare, Filter } from 'lucide-react';
import { PageHeader } from '@/components/layout/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar } from '@/components/ui/avatar';
import { Select } from '@/components/ui/select';
import { cn } from '@/lib/utils';

interface ActivityItem {
  id: string;
  type: 'call' | 'email' | 'meeting' | 'note' | 'task';
  title: string;
  description: string;
  actor: string;
  entity: string;
  time: string;
  completed: boolean;
}

const mockActivities: ActivityItem[] = [
  { id: '1', type: 'call', title: 'Discovery call', description: 'Discussed platform requirements and timeline', actor: 'Jordan Miles', entity: 'Acme Corp', time: '5m ago', completed: true },
  { id: '2', type: 'email', title: 'Proposal sent', description: 'Sent pricing proposal for Enterprise plan', actor: 'Sara Kim', entity: 'Globex Inc', time: '1h ago', completed: true },
  { id: '3', type: 'meeting', title: 'Demo scheduled', description: 'Product demo with stakeholders', actor: 'Raj Patel', entity: 'Initech', time: '2h ago', completed: false },
  { id: '4', type: 'note', title: 'Internal note', description: 'Decision maker is VP Engineering, budget approved', actor: 'Alex Lee', entity: 'Umbrella LLC', time: '3h ago', completed: true },
  { id: '5', type: 'task', title: 'Follow-up call', description: 'Call back to discuss contract terms', actor: 'Jordan Miles', entity: 'Wayne Ent.', time: '5h ago', completed: false },
  { id: '6', type: 'call', title: 'Check-in call', description: 'Quarterly check-in, very positive', actor: 'Sara Kim', entity: 'Hooli', time: '6h ago', completed: true },
  { id: '7', type: 'email', title: 'Follow-up email', description: 'Sent additional case studies', actor: 'Raj Patel', entity: 'Pied Piper', time: '8h ago', completed: true },
  { id: '8', type: 'meeting', title: 'QBR with Hooli', description: 'Quarterly business review with leadership team', actor: 'Alex Lee', entity: 'Hooli', time: '1d ago', completed: true },
  { id: '9', type: 'task', title: 'Contract review', description: 'Review contract terms before sending', actor: 'Jordan Miles', entity: 'Wayne Ent.', time: '1d ago', completed: true },
  { id: '10', type: 'note', title: 'Competitor mentioned', description: 'Prospect is also evaluating a competitor', actor: 'Sara Kim', entity: 'Globex Inc', time: '2d ago', completed: true },
];

const activityConfig = {
  call: { icon: Phone, color: 'text-emerald-600 bg-emerald-100 dark:bg-emerald-500/15 dark:text-emerald-400', label: 'Call' },
  email: { icon: Mail, color: 'text-blue-600 bg-blue-100 dark:bg-blue-500/15 dark:text-blue-400', label: 'Email' },
  meeting: { icon: Calendar, color: 'text-violet-600 bg-violet-100 dark:bg-violet-500/15 dark:text-violet-400', label: 'Meeting' },
  note: { icon: StickyNote, color: 'text-amber-600 bg-amber-100 dark:bg-amber-500/15 dark:text-amber-400', label: 'Note' },
  task: { icon: CheckSquare, color: 'text-rose-600 bg-rose-100 dark:bg-rose-500/15 dark:text-rose-400', label: 'Task' },
};

export function ActivitiesPage() {
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const filtered = mockActivities.filter((a) => {
    const matchesType = typeFilter === 'all' || a.type === typeFilter;
    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'completed' && a.completed) ||
      (statusFilter === 'scheduled' && !a.completed);
    return matchesType && matchesStatus;
  });

  const counts = {
    all: mockActivities.length,
    call: mockActivities.filter((a) => a.type === 'call').length,
    email: mockActivities.filter((a) => a.type === 'email').length,
    meeting: mockActivities.filter((a) => a.type === 'meeting').length,
    note: mockActivities.filter((a) => a.type === 'note').length,
    task: mockActivities.filter((a) => a.type === 'task').length,
  };

  return (
    <div>
      <PageHeader
        title="Activities"
        description="Timeline of all interactions across your CRM"
        actions={
          <Button>
            <Plus className="h-4 w-4" />
            Log Activity
          </Button>
        }
      />

      <Card className="animate-fade-in-up">
        <CardHeader className="flex-row items-center justify-between">
          <CardTitle>Activity Timeline</CardTitle>
          <div className="flex items-center gap-2">
            <Select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className="w-36">
              <option value="all">All Types</option>
              <option value="call">Calls ({counts.call})</option>
              <option value="email">Emails ({counts.email})</option>
              <option value="meeting">Meetings ({counts.meeting})</option>
              <option value="note">Notes ({counts.note})</option>
              <option value="task">Tasks ({counts.task})</option>
            </Select>
            <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="w-36">
              <option value="all">All Status</option>
              <option value="completed">Completed</option>
              <option value="scheduled">Scheduled</option>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16">
              <Activity className="h-10 w-10 text-muted-foreground/40" />
              <p className="mt-3 text-sm text-muted-foreground">No activities match your filters</p>
              <Button variant="outline" size="sm" className="mt-3" onClick={() => { setTypeFilter('all'); setStatusFilter('all'); }}>
                Clear filters
              </Button>
            </div>
          ) : (
            <div className="relative">
              {filtered.map((activity, i) => {
                const cfg = activityConfig[activity.type];
                const Icon = cfg.icon;
                return (
                  <div key={activity.id} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className={cn('flex h-10 w-10 items-center justify-center rounded-full', cfg.color)}>
                        <Icon className="h-4 w-4" />
                      </div>
                      {i < filtered.length - 1 && <div className="w-px flex-1 bg-border" />}
                    </div>
                    <div className="flex-1 pb-6">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-medium text-foreground">{activity.title}</p>
                            <Badge variant="outline" className="text-xs">{cfg.label}</Badge>
                            {!activity.completed && <Badge variant="warning" dot>Scheduled</Badge>}
                          </div>
                          <p className="mt-0.5 text-sm text-muted-foreground">{activity.description}</p>
                          <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                            <Avatar name={activity.actor} size="sm" />
                            <span>{activity.actor}</span>
                            <span>·</span>
                            <span>{activity.entity}</span>
                            <span>·</span>
                            <span>{activity.time}</span>
                          </div>
                        </div>
                      </div>
                    </div>
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
