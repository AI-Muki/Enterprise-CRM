# Nexus CRM

A modern, full-featured Customer Relationship Management application built for sales teams. Manage contacts, companies, leads, deals, tasks, activities, campaigns, and reports — all in one place. Features a drag-and-drop sales pipeline, role-based access control, dark mode, and a built-in AI assistant.

## How It Was Built

This is a single-page application built entirely in TypeScript. The frontend runs on **React 18** with **Vite** as the build tool, styled with **Tailwind CSS 3** using a custom design system (HSL-based color tokens, 8px spacing, custom shadows, and keyframe animations). State is managed with **Zustand** — a lightweight store handles auth state, theme persistence, and UI state (sidebar collapse, command palette). Routing uses **React Router 7** with a public/protected route split: auth pages are public, everything else sits behind a `RequireAuth` guard that checks the Supabase session.

The backend is **Supabase** (hosted Postgres). Authentication uses Supabase's built-in email/password auth. A database migration (`supabase/migrations/`) creates three tables — `profiles`, `organizations`, and `organization_members` — with Row Level Security policies that enforce ownership at the database level. A Postgres trigger (`handle_new_user`) automatically creates a profile row whenever a new user signs up. The `AuthProvider` component listens to `onAuthStateChange`, fetches the user's profile and organization membership, and populates the Zustand auth store with the user's role and organization.

The UI is built from reusable primitives in `src/components/ui/` (Button, Card, Input, Modal, Select, Badge, Avatar, Checkbox, DataTable, Skeleton, Spinner). Charts use **Recharts 3** with wrapper components for area, bar, donut, and sparkline charts. Icons come from **Lucide React**. The app shell includes a collapsible sidebar, a topbar with global search and theme toggle, and a command palette (Cmd+K) for quick navigation.

Role-based access control is defined in `src/lib/permissions.ts` — five roles (owner, admin, manager, sales_rep, viewer) each have a predefined set of permissions across all CRM modules. The `usePermissions()` hook exposes `can()`, `canAny()`, `isAdmin`, and `isOwner` helpers that components use to conditionally render actions.

The Kanban boards (Leads and Deals) use native HTML5 drag-and-drop — cards are `draggable`, columns handle `onDragOver`/`onDrop`, and state updates move the item to the new stage with live recalculation of column totals.

## Features

### Core CRM
- **Dashboard** — KPI cards with sparklines, pipeline overview, revenue trends, activity feed, tasks due today, leads by source, top deals, and team leaderboard
- **Contacts** — Full contact management with search, status filtering, and an add-contact modal form
- **Companies** — Account-level view with revenue, contacts, and deals per company
- **Leads** — Drag-and-drop Kanban board (New → Contacted → Qualified → Unqualified) with lead scoring and per-column value totals
- **Deals** — Drag-and-drop sales pipeline Kanban (Lead In → Qualified → Proposal → Negotiation → Closed Won) with live stage totals
- **Activities** — Timeline of calls, emails, meetings, notes, and tasks with type and status filters
- **Tasks** — Task list with priority badges, tabs (All / My Tasks / Overdue / Completed), and checkbox toggle
- **Calendar** — Month/week/day views with color-coded event types

### Marketing & Analytics
- **Campaigns** — Campaign performance tracking with open/reply rates and channel breakdown donut chart
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
- **Auth** — Email/password authentication via Supabase (login, signup, forgot password, reset password, verify email)
- **Dark mode** — Full dark theme with system preference detection and localStorage persistence
- **Command palette** — Quick navigation with Cmd+K keyboard shortcut
- **Responsive** — Optimized for mobile, tablet, and desktop with breakpoint-aware layouts
- **Role-based access** — Five roles (owner, admin, manager, sales_rep, viewer) with granular permissions per module

## Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Framework | React 18 | UI rendering |
| Language | TypeScript | Type safety |
| Build tool | Vite 5 | Dev server and bundling |
| Styling | Tailwind CSS 3 | Utility-first styling with custom design tokens |
| Icons | Lucide React | SVG icon library |
| Charts | Recharts 3 | Area, bar, donut, and sparkline charts |
| State | Zustand | Auth, theme, and UI state stores |
| Routing | React Router 7 | Public and protected route management |
| Backend | Supabase | Postgres, Auth, RLS, and Edge Functions |
| Utilities | clsx + tailwind-merge | Class name composition |
| Dates | date-fns | Date formatting and manipulation |

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
├── app/                      # App-level setup
│   ├── providers/            # AuthProvider (Supabase session), ThemeProvider
│   └── router/               # RequireAuth route guard
├── components/
│   ├── charts/               # Recharts wrappers (area, bar, donut, sparkline)
│   ├── layout/               # AppShell, Sidebar, Topbar, CommandPalette, Logo
│   └── ui/                   # Reusable primitives (Button, Card, Input, Modal, etc.)
├── config/                   # Navigation configuration
├── features/                 # Feature pages (one folder per module)
│   ├── dashboard/            # KPI cards, charts, activity feed, leaderboard
│   ├── contacts/             # Contact table with search, filter, add modal
│   ├── companies/            # Company cards with revenue and deal stats
│   ├── leads/                # Drag-and-drop Kanban with lead scoring
│   ├── deals/                # Drag-and-drop pipeline Kanban
│   ├── activities/           # Timeline with type and status filters
│   ├── tasks/                # Task list with priority badges and tabs
│   ├── calendar/             # Month/week/day calendar views
│   ├── campaigns/            # Campaign performance with channel breakdown
│   ├── reports/              # Report templates with charts
│   ├── team/                 # Team cards with member groups
│   ├── users/                # Member management table (Supabase-backed)
│   ├── audit/                # Audit log timeline with search and filters
│   ├── settings/             # Org settings, pipelines, roles, branding, integrations
│   ├── profile/              # Personal info and preferences (Supabase-backed)
│   ├── notifications/        # Notification center with mark-read and delete
│   ├── ai-assistant/         # Chat interface with quick actions
│   └── auth/                 # Login, signup, forgot/reset password, verify email
├── lib/                      # Shared utilities
│   ├── supabase.ts           # Supabase client initialization
│   ├── permissions.ts        # Role-based permission system
│   └── utils.ts              # cn(), formatCurrency, formatNumber, formatPercent, etc.
├── store/                    # Zustand stores
│   ├── auth-store.ts         # User, session, loading state
│   ├── theme-store.ts        # Light/dark theme with localStorage persistence
│   └── ui-store.ts           # Sidebar collapse, command palette state
├── types/                    # Shared TypeScript types
└── index.css                 # Tailwind directives + CSS custom properties (design tokens)

supabase/
└── migrations/
    └── 20260722190650_create_auth_schema.sql  # profiles, organizations, members + RLS + triggers
```

## Database Schema

The Supabase migration creates three tables with Row Level Security:

### profiles
Extends `auth.users` with display information. A Postgres trigger (`handle_new_user`) automatically inserts a row here whenever a new user signs up.

| Column | Type | Description |
|--------|------|-------------|
| id | uuid (PK) | References `auth.users.id` |
| email | text | User email (unique) |
| full_name | text | Display name |
| avatar_url | text | Avatar image URL |
| title | text | Job title |
| created_at | timestamptz | Auto-set |
| updated_at | timestamptz | Auto-updated via trigger |

**RLS**: Users can read and update only their own profile.

### organizations
The tenant root. Each organization has an owner and a plan tier.

| Column | Type | Description |
|--------|------|-------------|
| id | uuid (PK) | Auto-generated |
| name | text | Organization name |
| slug | text | URL-friendly identifier (unique) |
| owner_id | uuid | References `auth.users.id` |
| plan | text | Plan tier (default: 'free') |
| created_at | timestamptz | Auto-set |
| updated_at | timestamptz | Auto-updated via trigger |

**RLS**: Members can read; only the owner can insert, update, or delete.

### organization_members
Joins users to organizations with a role. This is what determines a user's permissions across the app.

| Column | Type | Description |
|--------|------|-------------|
| id | uuid (PK) | Auto-generated |
| organization_id | uuid (FK) | References `organizations.id` |
| user_id | uuid (FK) | References `auth.users.id` |
| role | text | One of: owner, admin, manager, sales_rep, viewer |
| invited_by | uuid | Who invited this member |
| created_at | timestamptz | Auto-set |
| updated_at | timestamptz | Auto-updated via trigger |

**RLS**: Members can read; owner/admin can insert; owner can update; self or owner can delete.

## Authentication Flow

1. User signs up with email and password via Supabase Auth
2. The `handle_new_user` trigger creates a `profiles` row automatically
3. On first login, the `AuthProvider` fetches the user's profile and organization membership
4. The auth store is populated with `id`, `email`, `name`, `role`, `organizationId`, and `organizationName`
5. `RequireAuth` checks the auth store — if no user, redirects to `/login`
6. `onAuthStateChange` keeps the session fresh and handles sign-out/token refresh

## Role-Based Access Control

Five roles with decreasing permissions:

| Role | Key Capabilities |
|------|-----------------|
| **Owner** | Full access including delete, manage users, manage settings, view audit log |
| **Admin** | Same as owner except cannot delete the organization |
| **Manager** | Create/edit contacts, companies, leads, deals, tasks, campaigns; view reports and team |
| **Sales Rep** | Create/edit contacts, companies, leads, deals, tasks; view campaigns and reports |
| **Viewer** | Read-only access across all modules |

Permissions are checked in the UI via `usePermissions().can('permission.string')` and enforced at the database level via RLS policies.

## Design System

The app uses a custom design system built on Tailwind CSS:

- **Colors**: HSL-based CSS custom properties with 6 color ramps (primary, secondary, accent, success, warning, destructive) plus neutral tones — each with 50–900 shades
- **Typography**: Inter for body and display, JetBrains Mono for code
- **Spacing**: 8px base unit
- **Shadows**: 5 levels (soft, card, elevated, floating, glow)
- **Animations**: 10 keyframe animations (fade-in, fade-in-up, scale-in, slide-in, shimmer, pulse-soft, accordion)
- **Dark mode**: Class-based with CSS variable overrides, persisted to localStorage via Zustand
- **Border radius**: Single `--radius` token with derived sizes (sm, md, lg, xl, 2xl)

## License

Private project.
