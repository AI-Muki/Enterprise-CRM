import { useState } from 'react';
import { Plus, Search, Filter, Upload, MoreHorizontal, Mail, Phone, Building2, CheckCircle2 } from 'lucide-react';
import { PageHeader } from '@/components/layout/page-header';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input, Field } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Modal } from '@/components/ui/modal';
import { Badge } from '@/components/ui/badge';
import { Avatar } from '@/components/ui/avatar';
import { DataTable, type Column } from '@/components/ui/table';
import { formatCurrency } from '@/lib/utils';

interface Contact {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  title: string;
  status: 'active' | 'lead' | 'inactive';
  dealValue: number;
  lastActivity: string;
  owner: string;
}

const mockContacts: Contact[] = [
  { id: '1', name: 'John Davis', email: 'john@acme.com', phone: '+1 555-0100', company: 'Acme Corp', title: 'VP Engineering', status: 'active', dealValue: 48000, lastActivity: '2h ago', owner: 'JM' },
  { id: '2', name: 'Lisa Chen', email: 'lisa@globex.com', phone: '+1 555-0101', company: 'Globex Inc', title: 'CTO', status: 'active', dealValue: 32000, lastActivity: '1d ago', owner: 'SK' },
  { id: '3', name: 'Mark Lee', email: 'mark@initech.com', phone: '+1 555-0102', company: 'Initech', title: 'Product Manager', status: 'lead', dealValue: 24000, lastActivity: '3d ago', owner: 'RP' },
  { id: '4', name: 'Sarah Williams', email: 'sarah@umbrella.com', phone: '+1 555-0103', company: 'Umbrella LLC', title: 'CEO', status: 'active', dealValue: 18500, lastActivity: '5h ago', owner: 'AL' },
  { id: '5', name: 'David Brown', email: 'david@wayne.com', phone: '+1 555-0104', company: 'Wayne Ent.', title: 'Director', status: 'lead', dealValue: 62000, lastActivity: '1w ago', owner: 'JM' },
  { id: '6', name: 'Emma Wilson', email: 'emma@hooli.com', phone: '+1 555-0105', company: 'Hooli', title: 'VP Sales', status: 'inactive', dealValue: 0, lastActivity: '2w ago', owner: 'SK' },
  { id: '7', name: 'James Taylor', email: 'james@piedpiper.com', phone: '+1 555-0106', company: 'Pied Piper', title: 'Founder', status: 'active', dealValue: 15000, lastActivity: '4h ago', owner: 'RP' },
];

const statusVariants = {
  active: 'success',
  lead: 'primary',
  inactive: 'secondary',
} as const;

export function ContactsPage() {
  const [search, setSearch] = useState('');
  const [contacts, setContacts] = useState<Contact[]>(mockContacts);
  const [showAddModal, setShowAddModal] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all');
  const [newContact, setNewContact] = useState({ name: '', email: '', phone: '', company: '', title: '' });
  const [formError, setFormError] = useState('');

  const handleAdd = () => {
    if (!newContact.name.trim() || !newContact.email.trim()) {
      setFormError('Name and email are required');
      return;
    }
    const contact: Contact = {
      id: Date.now().toString(),
      name: newContact.name,
      email: newContact.email,
      phone: newContact.phone || '—',
      company: newContact.company || '—',
      title: newContact.title || '—',
      status: 'lead',
      dealValue: 0,
      lastActivity: 'just now',
      owner: 'JM',
    };
    setContacts((prev) => [contact, ...prev]);
    setNewContact({ name: '', email: '', phone: '', company: '', title: '' });
    setFormError('');
    setShowAddModal(false);
  };

  const columns: Column<Contact>[] = [
    {
      key: 'name',
      header: 'Name',
      sortable: true,
      sortAccessor: (r) => r.name,
      cell: (row) => (
        <div className="flex items-center gap-3">
          <Avatar name={row.name} size="sm" />
          <div>
            <p className="font-medium text-foreground">{row.name}</p>
            <p className="text-xs text-muted-foreground">{row.title}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'company',
      header: 'Company',
      sortable: true,
      sortAccessor: (r) => r.company,
      cell: (row) => (
        <div className="flex items-center gap-2">
          <Building2 className="h-3.5 w-3.5 text-muted-foreground" />
          <span>{row.company}</span>
        </div>
      ),
    },
    {
      key: 'email',
      header: 'Contact',
      cell: (row) => (
        <div className="space-y-0.5">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Mail className="h-3 w-3" /> {row.email}
          </div>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Phone className="h-3 w-3" /> {row.phone}
          </div>
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      sortable: true,
      sortAccessor: (r) => r.status,
      cell: (row) => <Badge variant={statusVariants[row.status]} dot>{row.status}</Badge>,
    },
    {
      key: 'dealValue',
      header: 'Deal Value',
      sortable: true,
      sortAccessor: (r) => r.dealValue,
      align: 'right',
      cell: (row) => <span className="font-medium">{formatCurrency(row.dealValue, true)}</span>,
    },
    {
      key: 'owner',
      header: 'Owner',
      cell: (row) => <Avatar name={row.owner} size="sm" />,
    },
    {
      key: 'lastActivity',
      header: 'Last Activity',
      sortable: true,
      sortAccessor: (r) => r.lastActivity,
      cell: (row) => <span className="text-muted-foreground">{row.lastActivity}</span>,
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

  const filtered = contacts.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.company.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div>
      <PageHeader
        title="Contacts"
        description="Manage your customer relationships and contact information"
        actions={
          <>
            <Button variant="outline">
              <Upload className="h-4 w-4" />
              Import
            </Button>
            <Button onClick={() => setShowAddModal(true)}>
              <Plus className="h-4 w-4" />
              New Contact
            </Button>
          </>
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
                placeholder="Search contacts..."
                className="pl-9"
              />
            </div>
            <div className="flex items-center gap-2 sm:ml-auto">
              <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="w-36">
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="lead">Lead</option>
                <option value="inactive">Inactive</option>
              </Select>
              <Button variant="outline" size="sm">
                <Filter className="h-3.5 w-3.5" />
                Filters
              </Button>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <DataTable
              columns={columns}
              data={filtered}
              rowKey={(r) => r.id}
              selectable
            />
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between border-t border-border px-4 py-3 text-xs text-muted-foreground">
            <span>Showing {filtered.length} of {contacts.length} contacts</span>
            <div className="flex items-center gap-1">
              <Button variant="outline" size="sm" disabled>Previous</Button>
              <Button variant="outline" size="sm" disabled>Next</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Add Contact Modal */}
      <Modal
        open={showAddModal}
        onClose={() => { setShowAddModal(false); setFormError(''); }}
        title="New Contact"
        description="Add a new contact to your CRM"
        footer={
          <>
            <Button variant="outline" onClick={() => setShowAddModal(false)}>Cancel</Button>
            <Button onClick={handleAdd}>
              <CheckCircle2 className="h-4 w-4" />
              Create Contact
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          {formError && (
            <p className="text-sm text-destructive">{formError}</p>
          )}
          <Field label="Full name" required>
            <Input
              value={newContact.name}
              onChange={(e) => setNewContact({ ...newContact, name: e.target.value })}
              placeholder="John Davis"
            />
          </Field>
          <Field label="Email" required>
            <Input
              type="email"
              value={newContact.email}
              onChange={(e) => setNewContact({ ...newContact, email: e.target.value })}
              placeholder="john@acme.com"
            />
          </Field>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Phone">
              <Input
                value={newContact.phone}
                onChange={(e) => setNewContact({ ...newContact, phone: e.target.value })}
                placeholder="+1 555-0100"
              />
            </Field>
            <Field label="Company">
              <Input
                value={newContact.company}
                onChange={(e) => setNewContact({ ...newContact, company: e.target.value })}
                placeholder="Acme Corp"
              />
            </Field>
          </div>
          <Field label="Title">
            <Input
              value={newContact.title}
              onChange={(e) => setNewContact({ ...newContact, title: e.target.value })}
              placeholder="VP Engineering"
            />
          </Field>
        </div>
      </Modal>
    </div>
  );
}
