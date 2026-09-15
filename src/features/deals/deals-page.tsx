import { useState } from 'react';
import { Plus, MoreHorizontal, Calendar } from 'lucide-react';
import { PageHeader } from '@/components/layout/page-header';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar } from '@/components/ui/avatar';
import { Select } from '@/components/ui/select';
import { cn, formatCurrency } from '@/lib/utils';

interface Deal {
  id: string;
  title: string;
  company: string;
  value: number;
  stage: string;
  owner: string;
  closeDate: string;
  probability: number;
}

const stages = [
  { id: 'lead', label: 'Lead In', probability: 10, color: 'border-l-blue-500' },
  { id: 'qualified', label: 'Qualified', probability: 25, color: 'border-l-cyan-500' },
  { id: 'proposal', label: 'Proposal', probability: 50, color: 'border-l-amber-500' },
  { id: 'negotiation', label: 'Negotiation', probability: 75, color: 'border-l-orange-500' },
  { id: 'won', label: 'Closed Won', probability: 100, color: 'border-l-emerald-500' },
];

const mockDeals: Deal[] = [
  { id: '1', title: 'Enterprise Annual', company: 'Acme Corp', value: 48000, stage: 'negotiation', owner: 'JM', closeDate: 'Jul 28', probability: 75 },
  { id: '2', title: 'Platform Expansion', company: 'Globex Inc', value: 32000, stage: 'proposal', owner: 'SK', closeDate: 'Aug 03', probability: 50 },
  { id: '3', title: 'Team Plan Upgrade', company: 'Initech', value: 24000, stage: 'qualified', owner: 'RP', closeDate: 'Aug 15', probability: 25 },
  { id: '4', title: 'Add-on Modules', company: 'Umbrella LLC', value: 18500, stage: 'proposal', owner: 'AL', closeDate: 'Aug 10', probability: 50 },
  { id: '5', title: 'Enterprise Suite', company: 'Wayne Ent.', value: 62000, stage: 'negotiation', owner: 'JM', closeDate: 'Jul 30', probability: 75 },
  { id: '6', title: 'Starter Plan', company: 'Pied Piper', value: 8000, stage: 'lead', owner: 'RP', closeDate: 'Aug 20', probability: 10 },
  { id: '7', title: 'Pro Migration', company: 'Hooli', value: 45000, stage: 'qualified', owner: 'SK', closeDate: 'Aug 25', probability: 25 },
  { id: '8', title: 'Annual Renewal', company: 'TechFlow', value: 28000, stage: 'won', owner: 'JM', closeDate: 'Jul 15', probability: 100 },
];

export function DealsPage() {
  const [pipeline, setPipeline] = useState('sales');
  const [deals, setDeals] = useState<Deal[]>(mockDeals);
  const [draggedId, setDraggedId] = useState<string | null>(null);

  const handleDrop = (stageId: string) => {
    if (!draggedId) return;
    setDeals((prev) =>
      prev.map((d) => (d.id === draggedId ? { ...d, stage: stageId } : d))
    );
    setDraggedId(null);
  };

  return (
    <div>
      <PageHeader
        title="Deals"
        description="Track and manage your sales pipeline with drag-and-drop Kanban"
        actions={
          <>
            <Select value={pipeline} onChange={(e) => setPipeline(e.target.value)} className="w-40">
              <option value="sales">Sales Pipeline</option>
              <option value="renewals">Renewals Pipeline</option>
              <option value="enterprise">Enterprise Pipeline</option>
            </Select>
            <Button>
              <Plus className="h-4 w-4" />
              New Deal
            </Button>
          </>
        }
      />

      {/* Pipeline summary bar */}
      <div className="mb-4 flex flex-wrap gap-3">
        {stages.map((stage) => {
          const stageDeals = deals.filter((d) => d.stage === stage.id);
          const total = stageDeals.reduce((s, d) => s + d.value, 0);
          return (
            <div key={stage.id} className="flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-1.5">
              <span className="text-xs font-medium text-muted-foreground">{stage.label}</span>
              <span className="text-sm font-semibold">{formatCurrency(total, true)}</span>
              <Badge variant="secondary" className="text-xs">{stageDeals.length}</Badge>
            </div>
          );
        })}
      </div>

      {/* Kanban Board */}
      <div className="flex gap-4 overflow-x-auto pb-4">
        {stages.map((stage) => {
          const stageDeals = deals.filter((d) => d.stage === stage.id);
          return (
            <div
              key={stage.id}
              className="w-[280px] shrink-0 animate-fade-in-up"
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => handleDrop(stage.id)}
            >
              <div className="mb-3 sticky top-0 z-10 bg-background/80 backdrop-blur-sm">
                <div className="flex items-center justify-between rounded-lg border border-border bg-card px-3 py-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold">{stage.label}</span>
                    <span className="text-xs text-muted-foreground">{stageDeals.length}</span>
                  </div>
                  <span className="text-xs font-medium text-muted-foreground">
                    {formatCurrency(stageDeals.reduce((s, d) => s + d.value, 0), true)}
                  </span>
                </div>
              </div>
              <div className="space-y-2">
                {stageDeals.map((deal) => (
                  <Card
                    key={deal.id}
                    draggable
                    onDragStart={() => setDraggedId(deal.id)}
                    onDragEnd={() => setDraggedId(null)}
                    className={cn('cursor-grab hover:shadow-elevated transition-all border-l-2', stage.color)}
                  >
                    <CardContent className="p-3.5">
                      <div className="flex items-start justify-between">
                        <p className="text-sm font-medium">{deal.title}</p>
                        <button className="text-muted-foreground hover:text-foreground">
                          <MoreHorizontal className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      <p className="mt-0.5 text-xs text-muted-foreground">{deal.company}</p>
                      <p className="mt-2 text-lg font-bold">{formatCurrency(deal.value, true)}</p>
                      <div className="mt-3 flex items-center justify-between border-t border-border/50 pt-2.5">
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          {deal.closeDate}
                        </div>
                        <Avatar name={deal.owner} size="sm" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
                {stageDeals.length === 0 && (
                  <div className="rounded-lg border border-dashed border-border py-8 text-center text-xs text-muted-foreground">
                    No deals
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
