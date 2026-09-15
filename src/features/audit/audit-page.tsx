import { useState } from 'react';
import { Search, Download } from 'lucide-react';
import { PageHeader } from '@/components/layout/page-header';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar } from '@/components/ui/avatar';
import { Select } from '@/components/ui/select';

interface AuditEntry {
  id: string;
  actor: string;
  action: 'create' | 'update' | 'delete' | 'assign' | 'login' | 'convert' | 'export';
  entity: string;
  entityName: string;
  changes: string;
  timestamp: string;
  ip: string;
}

const mockAudit: AuditEntry[] = [
  { id: '1', actor: 'Jordan Miles', action: 'update', entity: 'deal', entityName: 'Acme Corp — Enterprise Annual', changes: 'stage: proposal → negotiation', timestamp: '2026-07-22 14:32:18', ip: '192.168.1.42' },
  { id: '2', actor: 'Sara Kim', action: 'create', entity: 'contact', entityName: 'Olivia Martinez', changes: 'New contact created', timestamp: '2026-07-22 13:15:02', ip: '192.168.1.38' },
  { id: '3', actor: 'Raj Patel', action: 'delete', entity: 'task', entityName: 'Follow up with Initech', changes: 'Task deleted', timestamp: '2026-07-22 12:48:55', ip: '192.168.1.51' },
  { id: '4', actor: 'Alex Lee', action: 'assign', entity: 'deal', entityName: 'Platform Expansion', changes: 'owner: Jordan Miles → Alex Lee', timestamp: '2026-07-22 11:22:30', ip: '192.168.1.44' },
  { id: '5', actor: 'Jordan Miles', action: 'convert', entity: 'lead', entityName: 'Wayne Ent.', changes: 'Lead → Contact + Deal', timestamp: '2026-07-22 10:05:12', ip: '192.168.1.42' },
  { id: '6', actor: 'Sara Kim', action: 'login', entity: 'session', entityName: 'Web login', changes: 'Successful authentication', timestamp: '2026-07-22 09:00:01', ip: '192.168.1.38' },
  { id: '7', actor: 'Raj Patel', action: 'export', entity: 'contacts', entityName: 'Contact export (124 records)', changes: 'CSV export', timestamp: '2026-07-21 17:45:22', ip: '192.168.1.51' },
  { id: '8', actor: 'Alex Lee', action: 'update', entity: 'company', entityName: 'Globex Inc', changes: 'revenue: 100M → 120M', timestamp: '2026-07-21 16:20:08', ip: '192.168.1.44' },
];

const actionVariants = {
  create: 'success',
  update: 'primary',
  delete: 'destructive',
  assign: 'warning',
  login: 'secondary',
  convert: 'primary',
  export: 'secondary',
} as const;

export function AuditPage() {
  const [search, setSearch] = useState('');
  const [actionFilter, setActionFilter] = useState('all');

  const filtered = mockAudit.filter((entry) => {
    const matchesSearch =
      entry.actor.toLowerCase().includes(search.toLowerCase()) ||
      entry.entityName.toLowerCase().includes(search.toLowerCase());
    const matchesAction = actionFilter === 'all' || entry.action === actionFilter;
    return matchesSearch && matchesAction;
  });

  return (
    <div>
      <PageHeader
        title="Audit Log"
        description="Complete trail of all actions across your workspace"
        actions={
          <Button variant="outline">
            <Download className="h-4 w-4" />
            Export Log
          </Button>
        }
      />

      <Card className="animate-fade-in-up">
        <CardContent className="p-0">
          {/* Toolbar */}
          <div className="flex flex-col gap-3 border-b border-border p-4 sm:flex-row sm:items-center">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search audit log..."
                className="pl-9"
              />
            </div>
            <Select value={actionFilter} onChange={(e) => setActionFilter(e.target.value)} className="sm:ml-auto w-40">
              <option value="all">All Actions</option>
              <option value="create">Create</option>
              <option value="update">Update</option>
              <option value="delete">Delete</option>
              <option value="assign">Assign</option>
              <option value="login">Login</option>
              <option value="convert">Convert</option>
              <option value="export">Export</option>
            </Select>
          </div>

          {/* Timeline */}
          <div className="divide-y divide-border/50">
            {filtered.map((entry) => (
              <div key={entry.id} className="flex items-start gap-3 px-4 py-3.5 hover:bg-secondary/30 transition-colors">
                <Avatar name={entry.actor} size="sm" />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{entry.actor}</span>
                    <Badge variant={actionVariants[entry.action]} className="capitalize text-xs">
                      {entry.action}
                    </Badge>
                    <span className="text-xs text-muted-foreground">{entry.entity}</span>
                  </div>
                  <p className="mt-0.5 text-sm text-foreground">{entry.entityName}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">{entry.changes}</p>
                </div>
                <div className="text-right text-xs text-muted-foreground">
                  <p>{entry.timestamp}</p>
                  <p className="mt-0.5 font-mono">{entry.ip}</p>
                </div>
              </div>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="py-12 text-center text-sm text-muted-foreground">No audit entries found</div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
