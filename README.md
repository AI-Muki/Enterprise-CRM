# Nexus CRM

A modern, full-featured Customer Relationship Management application built with React, TypeScript, and Supabase. Designed for sales teams to manage contacts, companies, leads, deals, tasks, activities, campaigns, and reports — all in one place.

## Features

### Core CRM
- **Dashboard** — KPI cards with sparklines, pipeline overview, revenue trends, activity feed, tasks due today, leads by source, top deals, and team leaderboard
- **Contacts** — Full contact management with search, status filtering, and add-contact modal
- **Companies** — Account-level view with revenue, contacts, and deals per company
- **Leads** — Drag-and-drop Kanban board (New → Contacted → Qualified → Unqualified) with lead scoring
- **Deals** — Drag-and-drop sales pipeline Kanban (Lead In → Qualified → Proposal → Negotiation → Closed Won) with live stage totals
- **Activities** — Timeline of calls, emails, meetings, notes, and tasks with type and status filters
- **Tasks** — Task list with priority badges, tabs (All / My Tasks / Overdue / Completed), and checkbox toggle
- **Calendar** — Month/week/day views with color-coded event types

### Marketing & Analytics
- **Campaigns** — Campaign performance tracking with open/reply rates and channel breakdown
- **Reports** — Custom report templates with revenue, pipeline, conversion funnel, and lead source charts

### Team & Admin
- **Teams** — Team cards with leads, members, and revenue stats
- **Users** — Workspace member management with role filtering (loads from Supabase)
- **Audit Log** — Full action trail with search and action-type filtering
- **Settings** — Organization details, pipelines, custom fields, roles & permissions matrix, branding, and integrations
- **Profile** — Personal info, preferences, and avatar (saves to Supabase)
- **Notifications** — Notification center with mark-read, delete, and filtering

### AI Assistant
- Chat interface with quick-action suggestions and conversation history

### Platform
- **Auth** — Email/password authentication via Supabase (login, signup, forgot password, reset, verify email)
- **Dark mode** — Full dark theme support with system preference detection
- **Command palette** — Quick navigation with keyboard shortcut
- **Responsive** — Optimized for mobile, tablet, and desktop

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 18 + TypeScript |
| Build tool | Vite 5 |
| Styling | Tailwind CSS 3 |
| Icons | Lucide React |
| Charts | Recharts 3 |
| State | Zustand |
| Routing | React Router 7 |
| Backend | Supabase (Postgres, Auth, Edge Functions) |

## Getting Started

```bash
# Install dependencies
npm install

# Start the dev server
npm run dev

# Build for production
npm run build

# Type check
npm run typecheck

# Lint
npm run lint
```

## Project Structure

```
src/
├── app/              # App providers and router
│   ├── providers/    # Auth and theme providers
│   └── router/       # Route guards
├── components/
│   ├── charts/       # Recharts wrappers (area, bar, donut, sparkline)
│   ├── layout/       # App shell, sidebar, topbar, command palette
│   └── ui/           # Reusable primitives (button, card, input, modal, etc.)
├── config/           # Navigation config
├── features/         # Feature pages (one folder per feature)
│   ├── dashboard/
│   ├── contacts/
│   ├── companies/
│   ├── leads/
│   ├── deals/
│   ├── activities/
│   ├── tasks/
│   ├── calendar/
│   ├── campaigns/
│   ├── reports/
│   ├── team/
│   ├── users/
│   ├── audit/
│   ├── settings/
│   ├── profile/
│   ├── notifications/
│   ├── ai-assistant/
│   └── auth/
├── lib/              # Utils, Supabase client, permissions
├── store/            # Zustand stores (auth, theme, UI)
└── types/            # Shared TypeScript types
```

## Supabase Backend

The app uses Supabase for authentication and data persistence. The following are pre-configured:

- **Auth** — Email/password authentication with organization-scoped access
- **Profiles** — User profile data (name, title, avatar)
- **Organizations** — Multi-tenant organization support
- **Organization members** — Membership with role-based access (owner, admin, manager, sales_rep, viewer)

Database migrations are in `supabase/migrations/`.

## License

Private project.
