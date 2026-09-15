import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@/app/providers/theme-provider';
import { AuthProvider } from '@/app/providers/auth-provider';
import { RequireAuth } from '@/app/router/require-auth';
import { AppShell } from '@/components/layout/app-shell';
import { CommandPalette } from '@/components/layout/command-palette';
import { LoginPage } from '@/features/auth/login-page';
import { SignupPage } from '@/features/auth/signup-page';
import { ForgotPasswordPage } from '@/features/auth/forgot-password-page';
import { ResetPasswordPage } from '@/features/auth/reset-password-page';
import { VerifyEmailPage } from '@/features/auth/verify-email-page';
import { DashboardPage } from '@/features/dashboard/dashboard-page';
import { ContactsPage } from '@/features/contacts/contacts-page';
import { CompaniesPage } from '@/features/companies/companies-page';
import { LeadsPage } from '@/features/leads/leads-page';
import { DealsPage } from '@/features/deals/deals-page';
import { ActivitiesPage } from '@/features/activities/activities-page';
import { TasksPage } from '@/features/tasks/tasks-page';
import { CalendarPage } from '@/features/calendar/calendar-page';
import { CampaignsPage } from '@/features/campaigns/campaigns-page';
import { ReportsPage } from '@/features/reports/reports-page';
import { TeamPage } from '@/features/team/team-page';
import { UsersPage } from '@/features/users/users-page';
import { AuditPage } from '@/features/audit/audit-page';
import { SettingsPage } from '@/features/settings/settings-page';
import { NotificationsPage } from '@/features/notifications/notifications-page';
import { AiAssistantPage } from '@/features/ai-assistant/ai-assistant-page';
import { ProfilePage } from '@/features/profile/profile-page';

export function AppRouter() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            {/* Public auth routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
            <Route path="/verify-email" element={<VerifyEmailPage />} />

            {/* Protected routes */}
            <Route
              element={
                <RequireAuth>
                  <AppShell />
                </RequireAuth>
              }
            >
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/contacts" element={<ContactsPage />} />
              <Route path="/companies" element={<CompaniesPage />} />
              <Route path="/leads" element={<LeadsPage />} />
              <Route path="/deals" element={<DealsPage />} />
              <Route path="/activities" element={<ActivitiesPage />} />
              <Route path="/tasks" element={<TasksPage />} />
              <Route path="/calendar" element={<CalendarPage />} />
              <Route path="/campaigns" element={<CampaignsPage />} />
              <Route path="/reports" element={<ReportsPage />} />
              <Route path="/team" element={<TeamPage />} />
              <Route path="/users" element={<UsersPage />} />
              <Route path="/audit" element={<AuditPage />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="/notifications" element={<NotificationsPage />} />
              <Route path="/ai-assistant" element={<AiAssistantPage />} />
              <Route path="/profile" element={<ProfilePage />} />
            </Route>

            {/* Fallback */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
          <CommandPalette />
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
}
