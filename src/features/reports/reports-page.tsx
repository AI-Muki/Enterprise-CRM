import { BarChart3, Plus, Download, TrendingUp, TrendingDown } from 'lucide-react';
import { PageHeader } from '@/components/layout/page-header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AreaChartCard, BarChartCard, DonutChartCard } from '@/components/charts';
import { cn, formatCurrency, formatNumber, formatPercent } from '@/lib/utils';

const reportTemplates = [
  { id: '1', name: 'Sales Performance', description: 'Revenue by rep and team', icon: TrendingUp, type: 'line' },
  { id: '2', name: 'Pipeline Health', description: 'Deal velocity and conversion', icon: BarChart3, type: 'bar' },
  { id: '3', name: 'Lead Conversion', description: 'Lead source and funnel analysis', icon: TrendingDown, type: 'donut' },
  { id: '4', name: 'Activity Volume', description: 'Calls, emails, and meetings', icon: BarChart3, type: 'bar' },
  { id: '5', name: 'Revenue Forecast', description: 'Projected close and weighted pipeline', icon: TrendingUp, type: 'line' },
  { id: '6', name: 'Team Performance', description: 'Leaderboard and quota attainment', icon: BarChart3, type: 'bar' },
];

const monthlyData = [
  { name: 'Jan', won: 320, lost: 80, pipeline: 450 },
  { name: 'Feb', won: 340, lost: 60, pipeline: 480 },
  { name: 'Mar', won: 380, lost: 90, pipeline: 520 },
  { name: 'Apr', won: 360, lost: 70, pipeline: 490 },
  { name: 'May', won: 420, lost: 85, pipeline: 550 },
  { name: 'Jun', won: 450, lost: 75, pipeline: 580 },
  { name: 'Jul', won: 482, lost: 68, pipeline: 610 },
];

const conversionData = [
  { name: 'Lead → Qualified', value: 68 },
  { name: 'Qualified → Proposal', value: 52 },
  { name: 'Proposal → Negotiation', value: 41 },
  { name: 'Negotiation → Won', value: 33 },
];

const sourceData = [
  { name: 'Website', value: 142 },
  { name: 'Referral', value: 89 },
  { name: 'Outbound', value: 64 },
  { name: 'Events', value: 38 },
];

export function ReportsPage() {
  return (
    <div>
      <PageHeader
        title="Reports & Analytics"
        description="Build, save, and share custom reports across your CRM"
        actions={
          <>
            <Button variant="outline">
              <Download className="h-4 w-4" />
              Export
            </Button>
            <Button>
              <Plus className="h-4 w-4" />
              New Report
            </Button>
          </>
        }
      />

      {/* Report templates */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {reportTemplates.map((tpl, i) => {
          const Icon = tpl.icon;
          return (
            <Card
              key={tpl.id}
              className="group cursor-pointer transition-all hover:shadow-elevated hover:border-primary/30 animate-fade-in-up"
              style={{ animationDelay: `${i * 50}ms` }}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold">{tpl.name}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">{tpl.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Charts grid */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card className="animate-fade-in-up">
          <CardHeader>
            <CardTitle>Revenue: Won vs Lost</CardTitle>
            <CardDescription>Monthly breakdown in thousands</CardDescription>
          </CardHeader>
          <CardContent>
            <BarChartCard
              data={monthlyData}
              dataKeys={['won', 'lost']}
              height={260}
              stacked
              valueFormatter={(v) => `$${v}k`}
            />
          </CardContent>
        </Card>

        <Card className="animate-fade-in-up animate-delay-100">
          <CardHeader>
            <CardTitle>Pipeline Value Trend</CardTitle>
            <CardDescription>Total pipeline over time</CardDescription>
          </CardHeader>
          <CardContent>
            <AreaChartCard
              data={monthlyData}
              dataKeys={['pipeline']}
              height={260}
              valueFormatter={(v) => `$${v}k`}
            />
          </CardContent>
        </Card>

        <Card className="animate-fade-in-up animate-delay-200">
          <CardHeader>
            <CardTitle>Conversion Funnel</CardTitle>
            <CardDescription>Stage-to-stage conversion rate</CardDescription>
          </CardHeader>
          <CardContent>
            <BarChartCard
              data={conversionData}
              dataKeys={['value']}
              height={260}
              valueFormatter={(v) => `${v}%`}
            />
          </CardContent>
        </Card>

        <Card className="animate-fade-in-up animate-delay-300">
          <CardHeader>
            <CardTitle>Leads by Source</CardTitle>
            <CardDescription>Distribution across channels</CardDescription>
          </CardHeader>
          <CardContent>
            <DonutChartCard
              data={sourceData}
              height={260}
              valueFormatter={(v) => formatNumber(v)}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
