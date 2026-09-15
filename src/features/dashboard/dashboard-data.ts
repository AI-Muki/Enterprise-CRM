export const dashboardKpis = [
  {
    label: 'Revenue (Closed)',
    value: 482000,
    format: 'currency' as const,
    delta: 12.5,
    trend: [320, 340, 360, 350, 380, 410, 482],
    icon: 'dollar',
  },
  {
    label: 'Deals in Pipeline',
    value: 124,
    format: 'number' as const,
    delta: 8.2,
    trend: [98, 102, 110, 105, 115, 120, 124],
    icon: 'kanban',
  },
  {
    label: 'New Contacts',
    value: 348,
    format: 'number' as const,
    delta: -3.1,
    trend: [310, 340, 360, 350, 345, 360, 348],
    icon: 'users',
  },
  {
    label: 'Tasks Due',
    value: 27,
    format: 'number' as const,
    delta: -15.0,
    trend: [42, 38, 35, 33, 30, 29, 27],
    icon: 'check',
  },
];

export const revenueTrendData = [
  { name: 'Jan', revenue: 320000, target: 350000 },
  { name: 'Feb', revenue: 340000, target: 350000 },
  { name: 'Mar', revenue: 380000, target: 375000 },
  { name: 'Apr', revenue: 360000, target: 400000 },
  { name: 'May', revenue: 420000, target: 425000 },
  { name: 'Jun', revenue: 450000, target: 450000 },
  { name: 'Jul', revenue: 482000, target: 475000 },
];

export const pipelineStagesData = [
  { name: 'Lead', value: 42, amount: 840000 },
  { name: 'Qualified', value: 28, amount: 620000 },
  { name: 'Proposal', value: 19, amount: 480000 },
  { name: 'Negotiation', value: 12, amount: 340000 },
  { name: 'Closed Won', value: 8, amount: 210000 },
];

export const leadsBySourceData = [
  { name: 'Website', value: 142 },
  { name: 'Referral', value: 89 },
  { name: 'Cold Outreach', value: 64 },
  { name: 'Events', value: 38 },
  { name: 'Social', value: 52 },
];

export const topDealsData = [
  { id: 'D-001', company: 'Acme Corp', title: 'Enterprise Annual', value: 48000, stage: 'Negotiation', owner: 'JM', closeDate: 'Jul 28' },
  { id: 'D-002', company: 'Globex Inc', title: 'Platform Expansion', value: 32000, stage: 'Proposal', owner: 'SK', closeDate: 'Aug 03' },
  { id: 'D-003', company: 'Initech', title: 'Team Plan Upgrade', value: 24000, stage: 'Qualified', owner: 'RP', closeDate: 'Aug 15' },
  { id: 'D-004', company: 'Umbrella LLC', title: 'Add-on Modules', value: 18500, stage: 'Proposal', owner: 'AL', closeDate: 'Aug 10' },
  { id: 'D-005', company: 'Wayne Ent.', title: 'Enterprise Suite', value: 62000, stage: 'Negotiation', owner: 'JM', closeDate: 'Jul 30' },
];

export const activityFeedData = [
  { id: 1, type: 'deal', actor: 'Jordan Miles', action: 'moved', entity: 'Acme Corp — Enterprise Annual', to: 'Negotiation', time: '5m ago' },
  { id: 2, type: 'call', actor: 'Sara Kim', action: 'logged a call with', entity: 'Globex Inc', time: '1h ago' },
  { id: 3, type: 'task', actor: 'Raj Patel', action: 'completed task', entity: 'Follow up with Initech', time: '2h ago' },
  { id: 4, type: 'email', actor: 'Alex Lee', action: 'sent proposal to', entity: 'Umbrella LLC', time: '3h ago' },
  { id: 5, type: 'lead', actor: 'Jordan Miles', action: 'converted lead', entity: 'Wayne Ent. → Contact', time: '5h ago' },
  { id: 6, type: 'note', actor: 'Sara Kim', action: 'added a note on', entity: 'Hooli deal', time: '6h ago' },
];

export const tasksDueTodayData = [
  { id: 1, title: 'Follow up with Acme Corp', priority: 'high', due: '2:00 PM', contact: 'John Davis' },
  { id: 2, title: 'Send pricing sheet to Globex', priority: 'urgent', due: '3:30 PM', contact: 'Lisa Chen' },
  { id: 3, title: 'Demo prep call with Initech', priority: 'medium', due: '4:00 PM', contact: 'Mark Lee' },
  { id: 4, title: 'Update pipeline forecast', priority: 'low', due: '5:00 PM', contact: null },
];

export const leaderboardData = [
  { rank: 1, name: 'Jordan Miles', revenue: 142000, deals: 8, avatar: 'JM' },
  { rank: 2, name: 'Sara Kim', revenue: 118000, deals: 6, avatar: 'SK' },
  { rank: 3, name: 'Raj Patel', revenue: 94000, deals: 5, avatar: 'RP' },
  { rank: 4, name: 'Alex Lee', revenue: 78000, deals: 4, avatar: 'AL' },
];
