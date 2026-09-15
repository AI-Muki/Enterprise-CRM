import { useState, useEffect } from 'react';
import { Settings, Building2, KanbanSquare, ListChecks, Palette, Plug, Users, ChevronRight, Check } from 'lucide-react';
import { PageHeader } from '@/components/layout/page-header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input, Field, Textarea, Label } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Switch } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/store/auth-store';

const sections = [
  { id: 'general', label: 'General', icon: Building2 },
  { id: 'pipelines', label: 'Pipelines', icon: KanbanSquare },
  { id: 'custom-fields', label: 'Custom Fields', icon: ListChecks },
  { id: 'roles', label: 'Roles & Permissions', icon: Users },
  { id: 'branding', label: 'Branding', icon: Palette },
  { id: 'integrations', label: 'Integrations', icon: Plug },
];

const mockPipelines = [
  { id: '1', name: 'Sales Pipeline', stages: 5, deals: 42 },
  { id: '2', name: 'Renewals Pipeline', stages: 4, deals: 18 },
  { id: '3', name: 'Enterprise Pipeline', stages: 6, deals: 12 },
];

const integrations = [
  { id: '1', name: 'Slack', description: 'Send notifications to channels', connected: true, color: 'bg-violet-500' },
  { id: '2', name: 'Google Workspace', description: 'Sync emails and calendar', connected: true, color: 'bg-blue-500' },
  { id: '3', name: 'Zoom', description: 'Create and join meetings', connected: false, color: 'bg-sky-500' },
  { id: '4', name: 'Mailchimp', description: 'Sync contacts for campaigns', connected: false, color: 'bg-amber-500' },
  { id: '5', name: 'Zapier', description: 'Connect to 5000+ apps', connected: true, color: 'bg-orange-500' },
  { id: '6', name: 'Stripe', description: 'Track payments and subscriptions', connected: false, color: 'bg-indigo-500' },
];

export function SettingsPage() {
  const { user } = useAuthStore();
  const [activeSection, setActiveSection] = useState('general');
  const [notifEmail, setNotifEmail] = useState(true);
  const [notifPush, setNotifPush] = useState(true);
  const [notifDigest, setNotifDigest] = useState(false);
  const [orgName, setOrgName] = useState('');
  const [orgLoading, setOrgLoading] = useState(true);
  const [orgSaving, setOrgSaving] = useState(false);
  const [orgSaved, setOrgSaved] = useState(false);

  useEffect(() => {
    (async () => {
      if (!user?.organizationId) { setOrgLoading(false); return; }
      const { data } = await supabase
        .from('organizations')
        .select('name')
        .eq('id', user.organizationId)
        .maybeSingle();
      if (data) setOrgName(data.name);
      setOrgLoading(false);
    })();
  }, [user]);

  const saveOrg = async () => {
    if (!user?.organizationId) return;
    setOrgSaving(true);
    await supabase.from('organizations').update({ name: orgName }).eq('id', user.organizationId);
    setOrgSaving(false);
    setOrgSaved(true);
    setTimeout(() => setOrgSaved(false), 3000);
  };

  return (
    <div>
      <PageHeader
        title="Settings"
        description="Configure your workspace, pipelines, and integrations"
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[220px_1fr]">
        {/* Settings nav */}
        <nav className="space-y-1 lg:sticky lg:top-20 lg:self-start">
          {sections.map((section) => {
            const Icon = section.icon;
            return (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={cn(
                  'flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                  activeSection === section.id
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                )}
              >
                <Icon className="h-4 w-4" />
                {section.label}
                <ChevronRight className="ml-auto h-3.5 w-3.5 opacity-50" />
              </button>
            );
          })}
        </nav>

        {/* Settings content */}
        <div className="space-y-6 animate-fade-in">
          {activeSection === 'general' && (
            <>
              <Card>
                <CardHeader>
                  <CardTitle>Organization Details</CardTitle>
                  <CardDescription>Update your workspace information</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Field label="Organization name" required>
                    <Input value={orgName} onChange={(e) => setOrgName(e.target.value)} disabled={orgLoading} placeholder="Organization name" />
                  </Field>
                  <Field label="Website">
                    <Input defaultValue="https://nexuscrm.io" />
                  </Field>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <Field label="Industry">
                      <Select defaultValue="technology">
                        <option value="technology">Technology</option>
                        <option value="finance">Finance</option>
                        <option value="healthcare">Healthcare</option>
                        <option value="retail">Retail</option>
                      </Select>
                    </Field>
                    <Field label="Time zone">
                      <Select defaultValue="pst">
                        <option value="pst">Pacific (PST)</option>
                        <option value="est">Eastern (EST)</option>
                        <option value="utc">UTC</option>
                        <option value="cet">Central European (CET)</option>
                      </Select>
                    </Field>
                  </div>
                  <Field label="Description">
                    <Textarea placeholder="Tell us about your organization..." />
                  </Field>
                  <div className="flex items-center justify-end gap-2">
                    {orgSaved && <span className="text-sm text-success">Saved!</span>}
                    <Button variant="outline">Cancel</Button>
                    <Button onClick={saveOrg} loading={orgSaving}>Save changes</Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Notifications</CardTitle>
                  <CardDescription>Choose how you want to be notified</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    { label: 'Email notifications', desc: 'Receive emails for important updates', checked: notifEmail, setter: setNotifEmail },
                    { label: 'Push notifications', desc: 'Get real-time browser notifications', checked: notifPush, setter: setNotifPush },
                    { label: 'Daily digest', desc: 'A summary of all activity once per day', checked: notifDigest, setter: setNotifDigest },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center justify-between rounded-lg border border-border p-3">
                      <div>
                        <p className="text-sm font-medium">{item.label}</p>
                        <p className="text-xs text-muted-foreground">{item.desc}</p>
                      </div>
                      <Switch checked={item.checked} onChange={item.setter} />
                    </div>
                  ))}
                </CardContent>
              </Card>
            </>
          )}

          {activeSection === 'pipelines' && (
            <Card>
              <CardHeader className="flex-row items-center justify-between">
                <div>
                  <CardTitle>Pipelines</CardTitle>
                  <CardDescription>Manage your sales pipelines and stages</CardDescription>
                </div>
                <Button size="sm">
                  <KanbanSquare className="h-4 w-4" />
                  New Pipeline
                </Button>
              </CardHeader>
              <CardContent className="space-y-2">
                {mockPipelines.map((p) => (
                  <div key={p.id} className="flex items-center justify-between rounded-lg border border-border p-4 hover:bg-secondary/30 transition-colors cursor-pointer">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <KanbanSquare className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold">{p.name}</p>
                        <p className="text-xs text-muted-foreground">{p.stages} stages · {p.deals} active deals</p>
                      </div>
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {activeSection === 'custom-fields' && (
            <Card>
              <CardHeader>
                <CardTitle>Custom Fields</CardTitle>
                <CardDescription>Add custom fields to contacts, companies, and deals</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-lg border border-dashed border-border py-12 text-center">
                  <ListChecks className="mx-auto h-8 w-8 text-muted-foreground/40" />
                  <p className="mt-2 text-sm text-muted-foreground">No custom fields yet</p>
                  <Button className="mt-4" size="sm">
                    <ListChecks className="h-4 w-4" />
                    Add Custom Field
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {activeSection === 'roles' && (
            <Card>
              <CardHeader>
                <CardTitle>Roles & Permissions</CardTitle>
                <CardDescription>Manage what each role can do in your workspace</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="py-3 text-left text-xs font-medium uppercase text-muted-foreground">Permission</th>
                        <th className="px-3 py-3 text-center text-xs font-medium uppercase text-muted-foreground">Owner</th>
                        <th className="px-3 py-3 text-center text-xs font-medium uppercase text-muted-foreground">Admin</th>
                        <th className="px-3 py-3 text-center text-xs font-medium uppercase text-muted-foreground">Manager</th>
                        <th className="px-3 py-3 text-center text-xs font-medium uppercase text-muted-foreground">Rep</th>
                        <th className="px-3 py-3 text-center text-xs font-medium uppercase text-muted-foreground">Viewer</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { label: 'View Contacts', perms: ['contacts.view', 'contacts.view', 'contacts.view', 'contacts.view', 'contacts.view'] },
                        { label: 'Create Contacts', perms: ['contacts.create', 'contacts.create', 'contacts.create', 'contacts.create', ''] },
                        { label: 'Edit Contacts', perms: ['contacts.edit', 'contacts.edit', 'contacts.edit', 'contacts.edit', ''] },
                        { label: 'Delete Records', perms: ['contacts.delete', 'contacts.delete', '', '', ''] },
                        { label: 'Manage Pipelines', perms: ['deals.create', 'deals.create', 'deals.create', 'deals.create', ''] },
                        { label: 'Manage Users', perms: ['users.manage', 'users.manage', '', '', ''] },
                        { label: 'View Reports', perms: ['reports.view', 'reports.view', 'reports.view', 'reports.view', 'reports.view'] },
                        { label: 'Export Data', perms: ['reports.export', 'reports.export', 'reports.export', '', ''] },
                        { label: 'Manage Settings', perms: ['settings.manage', 'settings.manage', '', '', ''] },
                        { label: 'View Audit Log', perms: ['audit.view', 'audit.view', '', '', ''] },
                      ].map((row) => (
                        <tr key={row.label} className="border-b border-border/50">
                          <td className="py-3 text-sm">{row.label}</td>
                          {row.perms.map((allowed, i) => (
                            <td key={i} className="px-3 py-3 text-center">
                              {allowed ? (
                                <Check className="mx-auto h-4 w-4 text-success" />
                              ) : (
                                <span className="text-muted-foreground/30">—</span>
                              )}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}

          {activeSection === 'branding' && (
            <Card>
              <CardHeader>
                <CardTitle>Branding</CardTitle>
                <CardDescription>Customize the look and feel of your workspace</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Field label="Primary color">
                  <div className="flex gap-2">
                    {['bg-primary-600', 'bg-emerald-600', 'bg-rose-600', 'bg-amber-600', 'bg-violet-600', 'bg-cyan-600'].map((c, i) => (
                      <button
                        key={c}
                        className={cn('h-9 w-9 rounded-lg ring-2 ring-offset-2 ring-offset-card transition-all', c, i === 0 ? 'ring-foreground' : 'ring-transparent hover:ring-foreground/30')}
                      />
                    ))}
                  </div>
                </Field>
                <Field label="Logo">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <Building2 className="h-6 w-6" />
                    </div>
                    <Button variant="outline" size="sm">Upload Logo</Button>
                  </div>
                </Field>
              </CardContent>
            </Card>
          )}

          {activeSection === 'integrations' && (
            <Card>
              <CardHeader>
                <CardTitle>Integrations</CardTitle>
                <CardDescription>Connect your favorite tools to Nexus CRM</CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {integrations.map((int) => (
                  <div key={int.id} className="flex items-center gap-3 rounded-lg border border-border p-4">
                    <div className={cn('flex h-10 w-10 items-center justify-center rounded-lg text-white', int.color)}>
                      <Plug className="h-5 w-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-semibold">{int.name}</p>
                        {int.connected && <Badge variant="success" dot>Connected</Badge>}
                      </div>
                      <p className="text-xs text-muted-foreground">{int.description}</p>
                    </div>
                    <Button variant={int.connected ? 'outline' : 'primary'} size="sm">
                      {int.connected ? 'Disconnect' : 'Connect'}
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
