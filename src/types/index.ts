export type Role = 'owner' | 'admin' | 'manager' | 'sales_rep' | 'viewer';

export type DealStageType = 'open' | 'won' | 'lost';

export type ActivityType = 'call' | 'email' | 'meeting' | 'note' | 'task';

export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';

export type TaskStatus = 'todo' | 'in_progress' | 'done';

export type LeadStatus = 'new' | 'contacted' | 'qualified' | 'unqualified' | 'converted';

export type CampaignStatus = 'draft' | 'active' | 'paused' | 'completed';

export type NotificationType = 'deal' | 'task' | 'mention' | 'system' | 'lead';

import type { LucideIcon } from 'lucide-react';

export interface NavItem {
  label: string;
  to: string;
  icon: LucideIcon;
  badge?: string;
  roles?: Role[];
}

export interface NavSection {
  label: string;
  items: NavItem[];
}
