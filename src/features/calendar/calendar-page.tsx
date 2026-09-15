import { useState } from 'react';
import { Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import { PageHeader } from '@/components/layout/page-header';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface CalendarEvent {
  id: string;
  title: string;
  time: string;
  type: 'meeting' | 'call' | 'task' | 'demo';
  day: number;
}

const mockEvents: CalendarEvent[] = [
  { id: '1', title: 'Discovery call — Acme', time: '10:00', type: 'call', day: 2 },
  { id: '2', title: 'Demo — Globex', time: '14:00', type: 'demo', day: 5 },
  { id: '3', title: 'Follow-up — Initech', time: '11:30', type: 'call', day: 8 },
  { id: '4', title: 'Contract review', time: '15:00', type: 'meeting', day: 10 },
  { id: '5', title: 'Send proposal', time: '09:00', type: 'task', day: 12 },
  { id: '6', title: 'QBR — Hooli', time: '13:00', type: 'meeting', day: 15 },
  { id: '7', title: 'Demo — Wayne Ent.', time: '16:00', type: 'demo', day: 18 },
  { id: '8', title: 'Follow-up call', time: '10:30', type: 'call', day: 22 },
  { id: '9', title: 'Team sync', time: '09:30', type: 'meeting', day: 24 },
  { id: '10', title: 'Send pricing', time: '14:00', type: 'task', day: 28 },
];

const eventColors = {
  meeting: 'bg-violet-100 text-violet-700 dark:bg-violet-500/20 dark:text-violet-300 border-violet-200 dark:border-violet-500/30',
  call: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300 border-emerald-200 dark:border-emerald-500/30',
  task: 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300 border-amber-200 dark:border-amber-500/30',
  demo: 'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300 border-blue-200 dark:border-blue-500/30',
} as const;

const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const monthNames = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

export function CalendarPage() {
  const today = new Date();
  const [viewDate, setViewDate] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const [viewMode, setViewMode] = useState<'month' | 'week' | 'day'>('month');

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const totalDays = new Date(year, month + 1, 0).getDate();
  const firstDayOffset = new Date(year, month, 1).getDay();
  const todayDate = today.getDate();
  const isCurrentMonth = year === today.getFullYear() && month === today.getMonth();

  const cells: (number | null)[] = [
    ...Array.from({ length: firstDayOffset }).fill(null) as null[],
    ...Array.from({ length: totalDays }).map((_, i) => i + 1),
  ];

  const prevMonth = () => setViewDate(new Date(year, month - 1, 1));
  const nextMonth = () => setViewDate(new Date(year, month + 1, 1));
  const goToday = () => setViewDate(new Date(today.getFullYear(), today.getMonth(), 1));

  return (
    <div>
      <PageHeader
        title="Calendar"
        description="Schedule meetings, calls, and tasks in one view"
        actions={
          <Button>
            <Plus className="h-4 w-4" />
            New Event
          </Button>
        }
      />

      <Card className="animate-fade-in-up">
        <CardContent className="p-0">
          {/* Calendar header */}
          <div className="flex items-center justify-between border-b border-border p-4">
            <div className="flex items-center gap-3">
              <h2 className="text-lg font-semibold">{monthNames[month]} {year}</h2>
              <div className="flex gap-1">
                <Button variant="outline" size="icon" onClick={prevMonth}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" onClick={nextMonth}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={goToday}>Today</Button>
              <div className="flex rounded-lg border border-border p-0.5">
                {(['month', 'week', 'day'] as const).map((mode) => (
                  <button
                    key={mode}
                    onClick={() => setViewMode(mode)}
                    className={cn(
                      'rounded-md px-3 py-1 text-xs font-medium capitalize transition-colors',
                      viewMode === mode ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'
                    )}
                  >
                    {mode}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Day headers */}
          <div className="grid grid-cols-7 border-b border-border">
            {days.map((day) => (
              <div key={day} className="px-2 py-2.5 text-center text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar grid */}
          <div className="grid grid-cols-7">
            {cells.map((day, i) => {
              const events = day ? mockEvents.filter((e) => e.day === day) : [];
              const isToday = isCurrentMonth && day === todayDate;
              return (
                <div
                  key={i}
                  className={cn(
                    'min-h-[100px] border-b border-r border-border p-1.5',
                    !day && 'bg-secondary/30',
                    isToday && 'bg-primary/5'
                  )}
                >
                  {day && (
                    <>
                      <span
                        className={cn(
                          'inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-medium',
                          isToday ? 'bg-primary text-primary-foreground' : 'text-muted-foreground'
                        )}
                      >
                        {day}
                      </span>
                      <div className="mt-1 space-y-1">
                        {events.map((event) => (
                          <div
                            key={event.id}
                            className={cn(
                              'rounded-md border px-1.5 py-1 text-xs font-medium transition-all hover:scale-[1.02] cursor-pointer',
                              eventColors[event.type]
                            )}
                          >
                            <p className="truncate">{event.title}</p>
                            <p className="text-[10px] opacity-70">{event.time}</p>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Legend */}
      <div className="mt-4 flex flex-wrap gap-3">
        {Object.entries(eventColors).map(([type, color]) => (
          <div key={type} className="flex items-center gap-2">
            <span className={cn('h-3 w-3 rounded border', color)} />
            <span className="text-xs capitalize text-muted-foreground">{type}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
