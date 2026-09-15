import { Megaphone, Plus, Mail, Users, TrendingUp, CheckCircle, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { PageHeader } from '@/components/layout/page-header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DonutChartCard } from '@/components/charts';
import { formatNumber } from '@/lib/utils';

const mockCampaigns = [
  { id: '1', name: 'Summer Product Launch', status: 'active', channel: 'Email', members: 1240, sent: 1240, opened: 892, replied: 142, startDate: 'Jul 01' },
  { id: '2', name: 'Enterprise Outreach Q3', status: 'active', channel: 'Email + Call', members: 320, sent: 280, opened: 198, replied: 67, startDate: 'Jul 10' },
  { id: '3', name: 'Re-engagement Series', status: 'paused', channel: 'Email', members: 2100, sent: 1050, opened: 620, replied: 89, startDate: 'Jun 15' },
  { id: '4', name: 'Webinar Follow-up', status: 'completed', channel: 'Email', members: 450, sent: 450, opened: 380, replied: 95, startDate: 'Jun 01' },
  { id: '5', name: 'Holiday Promo Blast', status: 'draft', channel: 'Email', members: 0, sent: 0, opened: 0, replied: 0, startDate: '—' },
];

const statusVariants = {
  active: 'success',
  paused: 'warning',
  completed: 'secondary',
  draft: 'outline',
} as const;

const channelStats = [
  { name: 'Email', value: 3 },
  { name: 'Email + Call', value: 1 },
  { name: 'Social', value: 1 },
];

export function CampaignsPage() {
  return (
    <div>
      <PageHeader
        title="Campaigns"
        description="Create and track marketing outreach programs"
        actions={
          <Button>
            <Plus className="h-4 w-4" />
            New Campaign
          </Button>
        }
      />

      {/* Stats */}
      <div className="mb-4 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[
          { label: 'Active Campaigns', value: '2', icon: Megaphone, color: 'text-primary' },
          { label: 'Total Reached', value: formatNumber(4110, true), icon: Users, color: 'text-emerald-600' },
          { label: 'Open Rate', value: '71.2%', icon: Mail, color: 'text-amber-600' },
          { label: 'Reply Rate', value: '8.9%', icon: TrendingUp, color: 'text-violet-600' },
        ].map((stat, i) => {
          const Icon = stat.icon;
          return (
            <Card key={i} className="animate-fade-in-up" style={{ animationDelay: `${i * 50}ms` }}>
              <CardContent className="p-4">
                <div className={cn('flex h-9 w-9 items-center justify-center rounded-lg bg-secondary', stat.color)}>
                  <Icon className="h-4 w-4" />
                </div>
                <p className="mt-3 text-xs text-muted-foreground">{stat.label}</p>
                <p className="mt-0.5 text-xl font-bold">{stat.value}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* Campaign list */}
        <Card className="lg:col-span-2 animate-fade-in-up animate-delay-100">
          <CardHeader>
            <CardTitle>All Campaigns</CardTitle>
            <CardDescription>Track performance across all campaigns</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {mockCampaigns.map((campaign) => (
              <div
                key={campaign.id}
                className="group rounded-lg border border-border p-4 transition-all hover:shadow-soft cursor-pointer"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold">{campaign.name}</p>
                      <Badge variant={statusVariants[campaign.status as keyof typeof statusVariants]} dot>
                        {campaign.status}
                      </Badge>
                    </div>
                    <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
                      <span>{campaign.channel}</span>
                      <span>·</span>
                      <span>Started {campaign.startDate}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold">{formatNumber(campaign.members, true)}</p>
                    <p className="text-xs text-muted-foreground">members</p>
                  </div>
                </div>

                {campaign.status !== 'draft' && (
                  <div className="mt-3 grid grid-cols-3 gap-3 border-t border-border/50 pt-3">
                    <div>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Mail className="h-3 w-3" /> Sent
                      </div>
                      <p className="mt-0.5 text-sm font-semibold">{formatNumber(campaign.sent, true)}</p>
                    </div>
                    <div>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <CheckCircle className="h-3 w-3" /> Opened
                      </div>
                      <p className="mt-0.5 text-sm font-semibold">
                        {formatNumber(campaign.opened, true)}
                        <span className="ml-1 text-xs text-muted-foreground">
                          ({campaign.sent > 0 ? Math.round((campaign.opened / campaign.sent) * 100) : 0}%)
                        </span>
                      </p>
                    </div>
                    <div>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" /> Replied
                      </div>
                      <p className="mt-0.5 text-sm font-semibold">
                        {formatNumber(campaign.replied, true)}
                        <span className="ml-1 text-xs text-muted-foreground">
                          ({campaign.sent > 0 ? Math.round((campaign.replied / campaign.sent) * 100) : 0}%)
                        </span>
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Channel breakdown */}
        <Card className="animate-fade-in-up animate-delay-200">
          <CardHeader>
            <CardTitle>By Channel</CardTitle>
            <CardDescription>Campaign distribution</CardDescription>
          </CardHeader>
          <CardContent>
            <DonutChartCard data={channelStats} height={240} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
