import { useState } from 'react';
import {
  DollarSign,
  KanbanSquare,
  Users,
  CheckSquare,
  TrendingUp,
  TrendingDown,
  Phone,
  Mail,
  UserPlus,
  StickyNote,
  KanbanSquare as KanbanIcon,
  Clock,
  ChevronRight,
} from 'lucide-react';
import { PageHeader } from '@/components/layout/page-header';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar } from '@/components/ui/avatar';
import { Select } from '@/components/ui/select';
import { SkeletonCard } from '@/components/ui/skeleton';
import { Sparkline } from '@/components/charts';
import { AreaChartCard, BarChartCard, DonutChartCard } from '@/components/charts';
import { cn, formatCurrency, formatNumber, formatPercent } from '@/lib/utils';
import {
  dashboardKpis,
  revenueTrendData,
  pipelineStagesData,
  leadsBySourceData,
  topDealsData,
  activityFeedData,
  tasksDueTodayData,
  leaderboardData,
} from './dashboard-data';

const iconMap = {
  dollar: DollarSign,
  kanban: KanbanSquare,
  users: Users,
  check: CheckSquare,
};

const activityIcons = {
  deal: KanbanIcon,
  call: Phone,
  email: Mail,
  task: CheckSquare,
  note: StickyNote,
  lead: UserPlus,
};

const activityColors = {
  deal: 'text-primary bg-primary/10',
  call: 'text-emerald-600 bg-emerald-100 dark:bg-emerald-500/15 dark:text-emerald-400',
  email: 'text-blue-600 bg-blue-100 dark:bg-blue-500/15 dark:text-blue-400',
  task: 'text-amber-600 bg-amber-100 dark:bg-amber-500/15 dark:text-amber-400',
  note: 'text-violet-600 bg-violet-100 dark:bg-violet-500/15 dark:text-violet-400',
  lead: 'text-rose-600 bg-rose-100 dark:bg-rose-500/15 dark:text-rose-400',
};

const priorityColors = {
  urgent: 'destructive',
  high: 'warning',
  medium: 'primary',
  low: 'secondary',
} as const;

export function DashboardPage() {
  const [range, setRange] = useState('30d');
  const [loading] = useState(false);

  return (
    <div>
      <PageHeader
        title="Dashboard"
        description="Track your sales performance and team activity at a glance"
        actions={
          <>
            <Select value={range} onChange={(e) => setRange(e.target.value)} className="w-32">
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="quarter">This quarter</option>
              <option value="year">This year</option>
            </Select>
            <Button variant="outline" size="md">
              Export
            </Button>
            <Button size="md">
              <TrendingUp className="h-4 w-4" />
              Reports
            </Button>
          </>
        }
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {loading
          ? Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
          : dashboardKpis.map((kpi, i) => {
              const Icon = iconMap[kpi.icon as keyof typeof iconMap];
              const isPositive = kpi.delta >= 0;
              return (
                <Card key={kpi.label} className="animate-fade-in-up" style={{ animationDelay: `${i * 75}ms` }}>
                  <CardContent className="p-5">
                    <div className="flex items-center justify-between">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                        <Icon className="h-5 w-5" />
                      </div>
                      <span
                        className={cn(
                          'inline-flex items-center gap-0.5 text-xs font-medium',
                          isPositive ? 'text-success' : 'text-destructive'
                        )}
                      >
                        {isPositive ? (
                          <TrendingUp className="h-3 w-3" />
                        ) : (
                          <TrendingDown className="h-3 w-3" />
                        )}
                        {formatPercent(kpi.delta)}
                      </span>
                    </div>
                    <p className="mt-4 text-sm text-muted-foreground">{kpi.label}</p>
                    <p className="mt-1 text-2xl font-bold tracking-tight">
                      {kpi.format === 'currency'
                        ? formatCurrency(kpi.value, true)
                        : formatNumber(kpi.value, true)}
                    </p>
                    <div className="mt-3 h-10">
                      <Sparkline
                        data={kpi.trend.map((v, idx) => ({ name: idx, value: v }))}
                        color={isPositive ? 'hsl(142 71% 45%)' : 'hsl(0 84% 60%)'}
                      />
                    </div>
                  </CardContent>
                </Card>
              );
            })}
      </div>

      {/* Row 2 — Pipeline + Tasks */}
      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* Pipeline overview */}
        <Card className="lg:col-span-2 animate-fade-in-up animate-delay-100">
          <CardHeader className="flex-row items-center justify-between">
            <div>
              <CardTitle>Pipeline Overview</CardTitle>
              <CardDescription>Deal count and value by stage</CardDescription>
            </div>
            <Badge variant="primary" dot>
              {pipelineStagesData.reduce((sum, s) => sum + s.value, 0)} active
            </Badge>
          </CardHeader>
          <CardContent>
            <BarChartCard
              data={pipelineStagesData}
              dataKeys={['value']}
              height={240}
              valueFormatter={(v) => formatNumber(v)}
            />
          </CardContent>
        </Card>

        {/* Tasks due today */}
        <Card className="animate-fade-in-up animate-delay-200">
          <CardHeader className="flex-row items-center justify-between">
            <div>
              <CardTitle>Tasks Due Today</CardTitle>
              <CardDescription>{tasksDueTodayData.length} pending</CardDescription>
            </div>
            <Button variant="ghost" size="sm">
              View all
              <ChevronRight className="h-3.5 w-3.5" />
            </Button>
          </CardHeader>
          <CardContent className="space-y-2">
            {tasksDueTodayData.map((task) => (
              <div
                key={task.id}
                className="group flex items-center gap-3 rounded-lg border border-border/60 p-3 transition-colors hover:bg-secondary/50"
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-secondary text-muted-foreground">
                  <Clock className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-foreground">{task.title}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs text-muted-foreground">{task.due}</span>
                    {task.contact && (
                      <span className="text-xs text-muted-foreground">· {task.contact}</span>
                    )}
                  </div>
                </div>
                <Badge variant={priorityColors[task.priority as keyof typeof priorityColors]}>
                  {task.priority}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Row 3 — Revenue trend + Activity feed */}
      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card className="animate-fade-in-up animate-delay-100">
          <CardHeader>
            <CardTitle>Revenue Trend</CardTitle>
            <CardDescription>Revenue vs target over time</CardDescription>
          </CardHeader>
          <CardContent>
            <AreaChartCard
              data={revenueTrendData}
              dataKeys={['revenue', 'target']}
              height={260}
              valueFormatter={(v) => formatCurrency(v, true)}
            />
          </CardContent>
        </Card>

        <Card className="animate-fade-in-up animate-delay-200">
          <CardHeader className="flex-row items-center justify-between">
            <div>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Latest team interactions</CardDescription>
            </div>
            <Button variant="ghost" size="sm">
              View all
              <ChevronRight className="h-3.5 w-3.5" />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              {activityFeedData.slice(0, 6).map((activity, i) => {
                const Icon = activityIcons[activity.type as keyof typeof activityIcons];
                return (
                  <div key={activity.id} className="flex gap-3 py-2">
                    <div className="relative flex flex-col items-center">
                      <div
                        className={cn(
                          'flex h-8 w-8 shrink-0 items-center justify-center rounded-full',
                          activityColors[activity.type as keyof typeof activityColors]
                        )}
                      >
                        <Icon className="h-4 w-4" />
                      </div>
                      {i < 5 && <div className="w-px flex-1 bg-border mt-1" />}
                    </div>
                    <div className="min-w-0 flex-1 pb-3">
                      <p className="text-sm text-foreground">
                        <span className="font-medium">{activity.actor}</span>{' '}
                        <span className="text-muted-foreground">{activity.action}</span>{' '}
                        <span className="font-medium">{activity.entity}</span>
                        {activity.to && (
                          <>
                            {' '}
                            <span className="text-muted-foreground">to</span>{' '}
                            <Badge variant="primary" className="ml-0.5">{activity.to}</Badge>
                          </>
                        )}
                      </p>
                      <p className="mt-0.5 text-xs text-muted-foreground">{activity.time}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Row 4 — Leads by source + Top deals + Leaderboard */}
      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="animate-fade-in-up animate-delay-100">
          <CardHeader>
            <CardTitle>Leads by Source</CardTitle>
            <CardDescription>Where your prospects come from</CardDescription>
          </CardHeader>
          <CardContent>
            <DonutChartCard
              data={leadsBySourceData}
              height={240}
              valueFormatter={(v) => formatNumber(v)}
            />
          </CardContent>
        </Card>

        <Card className="animate-fade-in-up animate-delay-200">
          <CardHeader className="flex-row items-center justify-between">
            <div>
              <CardTitle>Top Deals</CardTitle>
              <CardDescription>Closing this month</CardDescription>
            </div>
            <Button variant="ghost" size="sm">
              View all
              <ChevronRight className="h-3.5 w-3.5" />
            </Button>
          </CardHeader>
          <CardContent className="space-y-2">
            {topDealsData.map((deal) => (
              <div
                key={deal.id}
                className="group flex items-center gap-3 rounded-lg p-2.5 transition-colors hover:bg-secondary/50 cursor-pointer"
              >
                <Avatar name={deal.owner} size="sm" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{deal.title}</p>
                  <p className="text-xs text-muted-foreground">{deal.company} · {deal.closeDate}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold">{formatCurrency(deal.value, true)}</p>
                  <Badge variant="outline" className="mt-0.5 text-xs">{deal.stage}</Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="animate-fade-in-up animate-delay-300">
          <CardHeader>
            <CardTitle>Team Leaderboard</CardTitle>
            <CardDescription>Revenue won this quarter</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {leaderboardData.map((member, i) => (
              <div key={member.rank} className="flex items-center gap-3">
                <span
                  className={cn(
                    'flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold',
                    i === 0 && 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400',
                    i === 1 && 'bg-slate-200 text-slate-700 dark:bg-slate-600/30 dark:text-slate-300',
                    i === 2 && 'bg-orange-100 text-orange-700 dark:bg-orange-500/20 dark:text-orange-400',
                    i > 2 && 'bg-muted text-muted-foreground'
                  )}
                >
                  {member.rank}
                </span>
                <Avatar name={member.name} size="sm" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{member.name}</p>
                  <p className="text-xs text-muted-foreground">{member.deals} deals won</p>
                </div>
                <p className="text-sm font-semibold text-success">{formatCurrency(member.revenue, true)}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
