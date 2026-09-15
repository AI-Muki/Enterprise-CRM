import { useState } from 'react';
import { UserPlus, Plus, Star, Phone, Mail, Calendar, ArrowRight } from 'lucide-react';
import { PageHeader } from '@/components/layout/page-header';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar } from '@/components/ui/avatar';
import { cn, formatCurrency } from '@/lib/utils';

interface Lead {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  source: string;
  score: number;
  status: 'new' | 'contacted' | 'qualified' | 'unqualified';
  owner: string;
  value: number;
}

const mockLeads: Lead[] = [
  { id: '1', name: 'Olivia Martinez', company: 'TechStart', email: 'olivia@techstart.com', phone: '+1 555-0200', source: 'Website', score: 85, status: 'new', owner: 'JM', value: 12000 },
  { id: '2', name: 'Noah Anderson', company: 'CloudSys', email: 'noah@cloudsys.com', phone: '+1 555-0201', source: 'Referral', score: 72, status: 'contacted', owner: 'SK', value: 18000 },
  { id: '3', name: 'Ava Thompson', company: 'DataFlow', email: 'ava@dataflow.com', phone: '+1 555-0202', source: 'Events', score: 91, status: 'qualified', owner: 'RP', value: 35000 },
  { id: '4', name: 'Ethan Moore', company: 'ByteCorp', email: 'ethan@bytecorp.com', phone: '+1 555-0203', source: 'Cold Outreach', score: 45, status: 'contacted', owner: 'AL', value: 8000 },
  { id: '5', name: 'Sophia Clark', company: 'NexaSoft', email: 'sophia@nexasoft.com', phone: '+1 555-0204', source: 'Social', score: 68, status: 'new', owner: 'JM', value: 15000 },
  { id: '6', name: 'Lucas Hall', company: 'DevHub', email: 'lucas@devhub.com', phone: '+1 555-0205', source: 'Website', score: 30, status: 'unqualified', owner: 'SK', value: 0 },
];

const stages = [
  { id: 'new', label: 'New', color: 'bg-blue-500' },
  { id: 'contacted', label: 'Contacted', color: 'bg-amber-500' },
  { id: 'qualified', label: 'Qualified', color: 'bg-emerald-500' },
  { id: 'unqualified', label: 'Unqualified', color: 'bg-rose-500' },
] as const;

function scoreColor(score: number): string {
  if (score >= 80) return 'text-emerald-600 dark:text-emerald-400';
  if (score >= 60) return 'text-amber-600 dark:text-amber-400';
  if (score >= 40) return 'text-orange-600 dark:text-orange-400';
  return 'text-rose-600 dark:text-rose-400';
}

export function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>(mockLeads);
  const [draggedId, setDraggedId] = useState<string | null>(null);

  const handleDrop = (stageId: Lead['status']) => {
    if (!draggedId) return;
    setLeads((prev) =>
      prev.map((l) => (l.id === draggedId ? { ...l, status: stageId } : l))
    );
    setDraggedId(null);
  };

  return (
    <div>
      <PageHeader
        title="Leads"
        description="Capture, qualify, and convert prospects into customers"
        actions={
          <Button>
            <Plus className="h-4 w-4" />
            New Lead
          </Button>
        }
      />

      {/* Kanban Board */}
      <div className="flex gap-4 overflow-x-auto pb-4">
        {stages.map((stage) => {
          const stageLeads = leads.filter((l) => l.status === stage.id);
          return (
            <div
              key={stage.id}
              className="w-[300px] shrink-0 animate-fade-in-up"
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => handleDrop(stage.id)}
            >
              <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className={cn('h-2 w-2 rounded-full', stage.color)} />
                  <span className="text-sm font-semibold">{stage.label}</span>
                  <span className="text-xs text-muted-foreground">{leads.length}</span>
                </div>
                <span className="text-xs font-medium text-muted-foreground">
                  {formatCurrency(leads.reduce((s, l) => s + l.value, 0), true)}
                </span>
              </div>
              <div className="space-y-2">
                {leads.map((lead) => (
                  <Card
                    key={lead.id}
                    draggable
                    onDragStart={() => setDraggedId(lead.id)}
                    className="cursor-grab active:cursor-grabbing hover:shadow-elevated transition-shadow"
                  >
                    <CardContent className="p-3.5">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2.5">
                          <Avatar name={lead.name} size="sm" />
                          <div>
                            <p className="text-sm font-medium">{lead.name}</p>
                            <p className="text-xs text-muted-foreground">{lead.company}</p>
                          </div>
                        </div>
                        <div className={cn('text-sm font-bold', scoreColor(lead.score))}>
                          {lead.score}
                        </div>
                      </div>
                      <div className="mt-3 flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">{lead.source}</Badge>
                        {lead.value > 0 && (
                          <span className="text-xs font-medium text-muted-foreground">
                            {formatCurrency(lead.value, true)}
                          </span>
                        )}
                      </div>
                      <div className="mt-3 flex items-center justify-between border-t border-border/50 pt-2.5">
                        <div className="flex gap-1.5 text-muted-foreground">
                          <Phone className="h-3.5 w-3.5" />
                          <Mail className="h-3.5 w-3.5" />
                          <Calendar className="h-3.5 w-3.5" />
                        </div>
                        <Avatar name={lead.owner} size="sm" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
                {leads.length === 0 && (
                  <div className="rounded-lg border border-dashed border-border py-8 text-center text-xs text-muted-foreground">
                    No leads in this stage
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
