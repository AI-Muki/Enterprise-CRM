import { useState, useEffect } from 'react';
import { Plus, MoreHorizontal, Mail, Crown, Shield, User, Briefcase } from 'lucide-react';
import { PageHeader } from '@/components/layout/page-header';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar } from '@/components/ui/avatar';
import { DataTable, type Column } from '@/components/ui/table';
import { Select } from '@/components/ui/select';
import { Spinner } from '@/components/ui/misc';
import { supabase } from '@/lib/supabase';

interface Member {
  id: string;
  name: string;
  email: string;
  role: 'owner' | 'admin' | 'manager' | 'sales_rep' | 'viewer';
  team: string;
  status: 'active' | 'invited' | 'inactive';
  lastActive: string;
  deals: number;
}

const roleConfig = {
  owner: { icon: Crown, label: 'Owner', variant: 'warning' as const },
  admin: { icon: Shield, label: 'Admin', variant: 'primary' as const },
  manager: { icon: Shield, label: 'Manager', variant: 'secondary' as const },
  sales_rep: { icon: User, label: 'Sales Rep', variant: 'secondary' as const },
  viewer: { icon: User, label: 'Viewer', variant: 'outline' as const },
};

const statusVariants = {
  active: 'success',
  invited: 'warning',
  inactive: 'secondary',
} as const;

export function UsersPage() {
  const [roleFilter, setRoleFilter] = useState('all');
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) { setLoading(false); return; }

      const { data: membership } = await supabase
        .from('organization_members')
        .select('organization_id')
        .eq('user_id', userData.user.id)
        .maybeSingle();

      if (!membership) { setLoading(false); return; }

      const { data, error } = await supabase
        .from('organization_members')
        .select(`
          id,
          role,
          user_id,
          profiles!inner(full_name, email)
        `)
        .eq('organization_id', membership.organization_id);

      if (error) { setLoading(false); return; }

      const mapped: Member[] = (data || []).map((row: any) => ({
        id: row.id,
        name: row.profiles?.full_name || row.profiles?.email?.split('@')[0] || 'Unknown',
        email: row.profiles?.email || '',
        role: row.role,
        team: '—',
        status: 'active' as const,
        lastActive: 'recently',
        deals: 0,
      }));

      setMembers(mapped);
      setLoading(false);
    })();
  }, []);

  const columns: Column<Member>[] = [
    {
      key: 'name',
      header: 'Member',
      sortable: true,
      sortAccessor: (r) => r.name,
      cell: (row) => (
        <div className="flex items-center gap-3">
          <Avatar name={row.name} size="md" />
          <div>
            <p className="font-medium text-foreground">{row.name}</p>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Mail className="h-3 w-3" /> {row.email}
            </div>
          </div>
        </div>
      ),
    },
    {
      key: 'role',
      header: 'Role',
      sortable: true,
      sortAccessor: (r) => r.role,
      cell: (row) => {
        const cfg = roleConfig[row.role];
        const Icon = cfg.icon;
        return (
          <Badge variant={cfg.variant}>
            <Icon className="h-3 w-3" />
            {cfg.label}
          </Badge>
        );
      },
    },
    {
      key: 'team',
      header: 'Team',
      sortable: true,
      sortAccessor: (r) => r.team,
      cell: (row) => (
        <span className="inline-flex items-center gap-1.5 text-muted-foreground">
          <Briefcase className="h-3.5 w-3.5" /> {row.team}
        </span>
      ),
    },
    {
      key: 'deals',
      header: 'Deals',
      sortable: true,
      sortAccessor: (r) => r.deals,
      align: 'center',
      cell: (row) => <span className="font-medium">{row.deals}</span>,
    },
    {
      key: 'status',
      header: 'Status',
      sortable: true,
      sortAccessor: (r) => r.status,
      cell: (row) => <Badge variant={statusVariants[row.status]} dot>{row.status}</Badge>,
    },
    {
      key: 'lastActive',
      header: 'Last Active',
      sortable: true,
      sortAccessor: (r) => r.lastActive,
      cell: (row) => <span className="text-muted-foreground">{row.lastActive}</span>,
    },
    {
      key: 'actions',
      header: '',
      align: 'right',
      cell: () => (
        <button className="rounded-lg p-1.5 text-muted-foreground hover:bg-secondary transition-colors">
          <MoreHorizontal className="h-4 w-4" />
        </button>
      ),
    },
  ];

  const filtered = roleFilter === 'all' ? members : members.filter((m) => m.role === roleFilter);

  return (
    <div>
      <PageHeader
        title="Users"
        description="Manage workspace members, roles, and permissions"
        actions={
          <Button>
            <Plus className="h-4 w-4" />
            Invite Member
          </Button>
        }
      />

      <Card className="animate-fade-in-up">
        <CardContent className="p-0">
          <div className="flex flex-col gap-3 border-b border-border p-4 sm:flex-row sm:items-center">
            <Select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)} className="w-40">
              <option value="all">All Roles</option>
              <option value="owner">Owner</option>
              <option value="admin">Admin</option>
              <option value="manager">Manager</option>
              <option value="sales_rep">Sales Rep</option>
              <option value="viewer">Viewer</option>
            </Select>
            <div className="flex gap-2 sm:ml-auto text-xs text-muted-foreground">
              <span>{members.filter((m) => m.status === 'active').length} active</span>
              <span>·</span>
              <span>{members.filter((m) => m.status === 'invited').length} invited</span>
            </div>
          </div>
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <Spinner className="h-8 w-8" />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <DataTable columns={columns} data={filtered} rowKey={(r) => r.id} selectable />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
