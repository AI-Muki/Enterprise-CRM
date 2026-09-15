import { useState } from 'react';
import { Plus, Calendar, Clock, Flag } from 'lucide-react';
import { PageHeader } from '@/components/layout/page-header';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar } from '@/components/ui/avatar';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';

interface Task {
  id: string;
  title: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'todo' | 'in_progress' | 'done';
  dueDate: string;
  dueTime: string;
  assignee: string;
  relatedTo: string;
  overdue: boolean;
}

const mockTasks: Task[] = [
  { id: '1', title: 'Follow up with Acme Corp on contract', priority: 'high', status: 'todo', dueDate: 'Today', dueTime: '2:00 PM', assignee: 'JM', relatedTo: 'Acme Corp', overdue: false },
  { id: '2', title: 'Send pricing sheet to Globex', priority: 'urgent', status: 'todo', dueDate: 'Today', dueTime: '3:30 PM', assignee: 'SK', relatedTo: 'Globex Inc', overdue: false },
  { id: '3', title: 'Demo prep call with Initech', priority: 'medium', status: 'in_progress', dueDate: 'Today', dueTime: '4:00 PM', assignee: 'RP', relatedTo: 'Initech', overdue: false },
  { id: '4', title: 'Update pipeline forecast for Q3', priority: 'low', status: 'todo', dueDate: 'Tomorrow', dueTime: '10:00 AM', assignee: 'AL', relatedTo: 'Pipeline', overdue: false },
  { id: '5', title: 'Send proposal to Wayne Ent.', priority: 'high', status: 'todo', dueDate: 'Yesterday', dueTime: '5:00 PM', assignee: 'JM', relatedTo: 'Wayne Ent.', overdue: true },
  { id: '6', title: 'Quarterly review with Hooli', priority: 'medium', status: 'done', dueDate: 'Yesterday', dueTime: '2:00 PM', assignee: 'SK', relatedTo: 'Hooli', overdue: false },
  { id: '7', title: 'Onboard new contact at Pied Piper', priority: 'low', status: 'done', dueDate: '2 days ago', dueTime: '11:00 AM', assignee: 'RP', relatedTo: 'Pied Piper', overdue: false },
];

const priorityVariants = {
  urgent: 'destructive',
  high: 'warning',
  medium: 'primary',
  low: 'secondary',
} as const;

const tabs = ['All Tasks', 'My Tasks', 'Overdue', 'Completed'] as const;

export function TasksPage() {
  const [activeTab, setActiveTab] = useState<(typeof tabs)[number]>('All Tasks');
  const [tasks, setTasks] = useState(mockTasks);

  const toggleTask = (id: string) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, status: t.status === 'done' ? 'todo' : 'done' } : t
      )
    );
  };

  const filtered = tasks.filter((t) => {
    if (activeTab === 'My Tasks') return t.assignee === 'JM';
    if (activeTab === 'Overdue') return t.overdue;
    if (activeTab === 'Completed') return t.status === 'done';
    return true;
  });

  return (
    <div>
      <PageHeader
        title="Tasks"
        description="Stay on top of your to-dos and follow-ups"
        actions={
          <Button>
            <Plus className="h-4 w-4" />
            New Task
          </Button>
        }
      />

      {/* Tabs */}
      <div className="mb-4 flex gap-1 border-b border-border">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              'border-b-2 px-4 py-2.5 text-sm font-medium transition-colors',
              activeTab === tab
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            )}
          >
            {tab}
            <span className="ml-1.5 text-xs">
              {tab === 'All Tasks' ? tasks.length : tab === 'Overdue' ? tasks.filter(t => t.overdue).length : tab === 'Completed' ? tasks.filter(t => t.status === 'done').length : tasks.filter(t => t.assignee === 'JM').length}
            </span>
          </button>
        ))}
      </div>

      <Card className="animate-fade-in-up">
        <CardContent className="p-0">
          <div className="divide-y divide-border/50">
            {filtered.map((task) => (
              <div
                key={task.id}
                className={cn(
                  'group flex items-center gap-3 px-4 py-3.5 transition-colors hover:bg-secondary/30',
                  task.status === 'done' && 'opacity-60'
                )}
              >
                <Checkbox
                  checked={task.status === 'done'}
                  onChange={() => toggleTask(task.id)}
                />
                <div className="min-w-0 flex-1">
                  <p className={cn('text-sm font-medium', task.status === 'done' && 'line-through')}>
                    {task.title}
                  </p>
                  <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" /> {task.dueDate}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" /> {task.dueTime}
                    </span>
                    <span>·</span>
                    <span>{task.relatedTo}</span>
                    {task.overdue && task.status !== 'done' && (
                      <Badge variant="destructive" className="text-xs">Overdue</Badge>
                    )}
                  </div>
                </div>
                <Badge variant={priorityVariants[task.priority]} className="capitalize">
                  <Flag className="h-3 w-3" />
                  {task.priority}
                </Badge>
                <Avatar name={task.assignee} size="sm" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
