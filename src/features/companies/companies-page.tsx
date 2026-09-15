import { useState } from 'react';
import { Building2, Plus, Search, Globe, Users, TrendingUp } from 'lucide-react';
import { PageHeader } from '@/components/layout/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar } from '@/components/ui/avatar';
import { DataTable, type Column } from '@/components/ui/table';
import { formatCurrency, formatNumber } from '@/lib/utils';

interface Company {
  id: string;
  name: string;
  domain: string;
  industry: string;
  size: string;
  revenue: number;
  contacts: number;
  deals: number;
  owner: string;
}

const mockCompanies: Company[] = [
  { id: '1', name: 'Acme Corp', domain: 'acme.com', industry: 'Technology', size: '500-1000', revenue: 48000000, contacts: 12, deals: 3, owner: 'JM' },
  { id: '2', name: 'Globex Inc', domain: 'globex.com', industry: 'Finance', size: '1000-5000', revenue: 120000000, contacts: 8, deals: 2, owner: 'SK' },
  { id: '3', name: 'Initech', domain: 'initech.com', industry: 'Software', size: '100-500', revenue: 24000000, contacts: 5, deals: 1, owner: 'RP' },
  { id: '4', name: 'Umbrella LLC', domain: 'umbrella.com', industry: 'Healthcare', size: '5000+', revenue: 340000000, contacts: 15, deals: 4, owner: 'AL' },
  { id: '5', name: 'Wayne Ent.', domain: 'wayne.com', industry: 'Manufacturing', size: '1000-5000', revenue: 89000000, contacts: 7, deals: 2, owner: 'JM' },
  { id: '6', name: 'Hooli', domain: 'hooli.com', industry: 'Technology', size: '5000+', revenue: 210000000, contacts: 20, deals: 5, owner: 'SK' },
];

export function CompaniesPage() {
  const [search, setSearch] = useState('');

  const columns: Column<Company>[] = [
    {
      key: 'name',
      header: 'Company',
      sortable: true,
      sortAccessor: (r) => r.name,
      cell: (row) => (
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Building2 className="h-4 w-4" />
          </div>
          <div>
            <p className="font-medium text-foreground">{row.name}</p>
            <a className="flex items-center gap-1 text-xs text-primary hover:underline" href="#">
              <Globe className="h-3 w-3" /> {row.domain}
            </a>
          </div>
        </div>
      ),
    },
    {
      key: 'industry',
      header: 'Industry',
      sortable: true,
      sortAccessor: (r) => r.industry,
      cell: (row) => <Badge variant="outline">{row.industry}</Badge>,
    },
    {
      key: 'size',
      header: 'Size',
      sortable: true,
      sortAccessor: (r) => r.size,
      cell: (row) => <span className="text-muted-foreground">{row.size}</span>,
    },
    {
      key: 'revenue',
      header: 'Revenue',
      sortable: true,
      sortAccessor: (r) => r.revenue,
      align: 'right',
      cell: (row) => <span className="font-medium">{formatCurrency(row.revenue, true)}</span>,
    },
    {
      key: 'contacts',
      header: 'Contacts',
      align: 'center',
      cell: (row) => (
        <span className="inline-flex items-center gap-1 text-muted-foreground">
          <Users className="h-3.5 w-3.5" /> {row.contacts}
        </span>
      ),
    },
    {
      key: 'deals',
      header: 'Deals',
      align: 'center',
      cell: (row) => (
        <span className="inline-flex items-center gap-1 text-muted-foreground">
          <TrendingUp className="h-3.5 w-3.5" /> {row.deals}
        </span>
      ),
    },
    {
      key: 'owner',
      header: 'Owner',
      cell: (row) => <Avatar name={row.owner} size="sm" />,
    },
  ];

  const filtered = mockCompanies.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.industry.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <PageHeader
        title="Companies"
        description="Manage your customer accounts and company relationships"
        actions={
          <Button>
            <Plus className="h-4 w-4" />
            New Company
          </Button>
        }
      />

      {/* Summary cards */}
      <div className="mb-4 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[
          { label: 'Total Companies', value: formatNumber(mockCompanies.length), icon: Building2 },
          { label: 'Total Revenue', value: formatCurrency(mockCompanies.reduce((s, c) => s + c.revenue, 0), true), icon: TrendingUp },
          { label: 'Total Contacts', value: formatNumber(mockCompanies.reduce((s, c) => s + c.contacts, 0)), icon: Users },
          { label: 'Active Deals', value: formatNumber(mockCompanies.reduce((s, c) => s + c.deals, 0)), icon: TrendingUp },
        ].map((stat, i) => {
          const Icon = stat.icon;
          return (
            <Card key={i} className="animate-fade-in-up" style={{ animationDelay: `${i * 50}ms` }}>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Icon className="h-4 w-4" />
                  <span className="text-xs font-medium">{stat.label}</span>
                </div>
                <p className="mt-2 text-xl font-bold">{stat.value}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card className="animate-fade-in-up animate-delay-100">
        <CardContent className="p-0">
          <div className="flex flex-col gap-3 border-b border-border p-4 sm:flex-row sm:items-center">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search companies..."
                className="pl-9"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <DataTable columns={columns} data={filtered} rowKey={(r) => r.id} selectable />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
