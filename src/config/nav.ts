import {
  LayoutDashboard,
  Calendar,
  Users,
  Building2,
  UserPlus,
  KanbanSquare,
  Activity,
  CheckSquare,
  Megaphone,
  BarChart3,
  UsersRound,
  ShieldCheck,
  ScrollText,
  Settings,
  Sparkles,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface NavEntry {
  label: string;
  to: string;
  icon: LucideIcon;
  badge?: string;
}

interface NavGroup {
  label: string;
  items: NavEntry[];
}

export const navSections: NavGroup[] = [
  {
    label: 'Workspace',
    items: [
      { label: 'Dashboard', to: '/dashboard', icon: LayoutDashboard },
      { label: 'Calendar', to: '/calendar', icon: Calendar },
    ],
  },
  {
    label: 'CRM',
    items: [
      { label: 'Contacts', to: '/contacts', icon: Users },
      { label: 'Companies', to: '/companies', icon: Building2 },
      { label: 'Leads', to: '/leads', icon: UserPlus },
      { label: 'Deals', to: '/deals', icon: KanbanSquare },
      { label: 'Activities', to: '/activities', icon: Activity },
      { label: 'Tasks', to: '/tasks', icon: CheckSquare },
    ],
  },
  {
    label: 'Marketing',
    items: [
      { label: 'Campaigns', to: '/campaigns', icon: Megaphone },
    ],
  },
  {
    label: 'Analytics',
    items: [
      { label: 'Reports', to: '/reports', icon: BarChart3 },
    ],
  },
  {
    label: 'Admin',
    items: [
      { label: 'Team', to: '/team', icon: UsersRound },
      { label: 'Users', to: '/users', icon: ShieldCheck },
      { label: 'Audit Log', to: '/audit', icon: ScrollText },
      { label: 'Settings', to: '/settings', icon: Settings },
    ],
  },
];

export const aiAssistantNav = { label: 'AI Assistant', to: '/ai-assistant', icon: Sparkles };
