import { useAuthStore, type Role } from '@/store/auth-store';

export type Permission =
  | 'contacts.view' | 'contacts.create' | 'contacts.edit' | 'contacts.delete'
  | 'companies.view' | 'companies.create' | 'companies.edit' | 'companies.delete'
  | 'leads.view' | 'leads.create' | 'leads.edit' | 'leads.delete'
  | 'deals.view' | 'deals.create' | 'deals.edit' | 'deals.delete'
  | 'tasks.view' | 'tasks.create' | 'tasks.edit' | 'tasks.delete'
  | 'campaigns.view' | 'campaigns.create' | 'campaigns.edit' | 'campaigns.delete'
  | 'reports.view' | 'reports.export'
  | 'team.view' | 'team.manage'
  | 'users.view' | 'users.manage'
  | 'settings.view' | 'settings.manage'
  | 'audit.view';

const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  owner: [
    'contacts.view', 'contacts.create', 'contacts.edit', 'contacts.delete',
    'companies.view', 'companies.create', 'companies.edit', 'companies.delete',
    'leads.view', 'leads.create', 'leads.edit', 'leads.delete',
    'deals.view', 'deals.create', 'deals.edit', 'deals.delete',
    'tasks.view', 'tasks.create', 'tasks.edit', 'tasks.delete',
    'campaigns.view', 'campaigns.create', 'campaigns.edit', 'campaigns.delete',
    'reports.view', 'reports.export',
    'team.view', 'team.manage',
    'users.view', 'users.manage',
    'settings.view', 'settings.manage',
    'audit.view',
  ],
  admin: [
    'contacts.view', 'contacts.create', 'contacts.edit', 'contacts.delete',
    'companies.view', 'companies.create', 'companies.edit', 'companies.delete',
    'leads.view', 'leads.create', 'leads.edit', 'leads.delete',
    'deals.view', 'deals.create', 'deals.edit', 'deals.delete',
    'tasks.view', 'tasks.create', 'tasks.edit', 'tasks.delete',
    'campaigns.view', 'campaigns.create', 'campaigns.edit', 'campaigns.delete',
    'reports.view', 'reports.export',
    'team.view', 'team.manage',
    'users.view', 'users.manage',
    'settings.view', 'settings.manage',
    'audit.view',
  ],
  manager: [
    'contacts.view', 'contacts.create', 'contacts.edit',
    'companies.view', 'companies.create', 'companies.edit',
    'leads.view', 'leads.create', 'leads.edit',
    'deals.view', 'deals.create', 'deals.edit',
    'tasks.view', 'tasks.create', 'tasks.edit', 'tasks.delete',
    'campaigns.view', 'campaigns.create', 'campaigns.edit',
    'reports.view', 'reports.export',
    'team.view',
    'users.view',
    'settings.view',
  ],
  sales_rep: [
    'contacts.view', 'contacts.create', 'contacts.edit',
    'companies.view', 'companies.create',
    'leads.view', 'leads.create', 'leads.edit',
    'deals.view', 'deals.create', 'deals.edit',
    'tasks.view', 'tasks.create', 'tasks.edit',
    'campaigns.view',
    'reports.view',
    'team.view',
  ],
  viewer: [
    'contacts.view',
    'companies.view',
    'leads.view',
    'deals.view',
    'tasks.view',
    'campaigns.view',
    'reports.view',
    'team.view',
  ],
};

export function usePermissions() {
  const user = useAuthStore((s) => s.user);
  const role = user?.role ?? 'viewer';
  const permissions = ROLE_PERMISSIONS[role];

  return {
    role,
    can: (permission: Permission) => permissions.includes(permission),
    canAny: (perms: Permission[]) => perms.some((p) => permissions.includes(p)),
    isAdmin: role === 'owner' || role === 'admin',
    isOwner: role === 'owner',
  };
}
