import { UsersRound, Plus, Crown } from 'lucide-react';
import { PageHeader } from '@/components/layout/page-header';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarGroup } from '@/components/ui/avatar';
import { formatCurrency } from '@/lib/utils';

interface Team {
  id: string;
  name: string;
  description: string;
  members: string[];
  lead: string;
  dealsWon: number;
  revenue: number;
}

const mockTeams: Team[] = [
  { id: '1', name: 'Enterprise Sales', description: 'Handles Fortune 500 accounts', members: ['Jordan Miles', 'Sara Kim', 'Raj Patel', 'Alex Lee'], lead: 'Jordan Miles', dealsWon: 23, revenue: 432000 },
  { id: '2', name: 'Mid-Market', description: 'SMB and mid-market segment', members: ['Emma Wilson', 'David Brown', 'James Taylor'], lead: 'Emma Wilson', dealsWon: 18, revenue: 214000 },
  { id: '3', name: 'Customer Success', description: 'Onboarding and retention', members: ['Olivia Martinez', 'Noah Anderson'], lead: 'Olivia Martinez', dealsWon: 12, revenue: 98000 },
  { id: '4', name: 'SDR Team', description: 'Outbound prospecting and qualification', members: ['Sophia Clark', 'Lucas Hall', 'Ava Thompson', 'Ethan Moore', 'Mia Davis'], lead: 'Sophia Clark', dealsWon: 8, revenue: 42000 },
];

export function TeamPage() {
  return (
    <div>
      <PageHeader
        title="Teams"
        description="Organize your team into groups and manage assignments"
        actions={
          <Button>
            <Plus className="h-4 w-4" />
            New Team
          </Button>
        }
      />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {mockTeams.map((team, i) => (
          <Card
            key={team.id}
            className="group cursor-pointer transition-all hover:shadow-elevated animate-fade-in-up"
            style={{ animationDelay: `${i * 75}ms` }}
          >
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-primary/15 to-primary/5 text-primary">
                    <UsersRound className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-base font-semibold">{team.name}</p>
                    <p className="text-xs text-muted-foreground">{team.description}</p>
                  </div>
                </div>
                <Badge variant="secondary">{team.members.length} members</Badge>
              </div>

              <div className="mt-4 flex items-center gap-2 rounded-lg bg-secondary/50 p-2.5">
                <Crown className="h-4 w-4 text-amber-500" />
                <Avatar name={team.lead} size="sm" />
                <div>
                  <p className="text-sm font-medium">{team.lead}</p>
                  <p className="text-xs text-muted-foreground">Team Lead</p>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">Members</span>
                  <AvatarGroup names={team.members} max={4} />
                </div>
                <div className="flex gap-4 text-right">
                  <div>
                    <p className="text-sm font-semibold">{team.dealsWon}</p>
                    <p className="text-xs text-muted-foreground">deals won</p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-success">{formatCurrency(team.revenue, true)}</p>
                    <p className="text-xs text-muted-foreground">revenue</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
