import { Outlet } from 'react-router-dom';
import { Sidebar } from './sidebar';
import { Topbar } from './topbar';
import { useUIStore } from '@/store/ui-store';
import { cn } from '@/lib/utils';

export function AppShell() {
  const { sidebarCollapsed } = useUIStore();

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <div
        className={cn(
          'flex min-h-screen flex-col transition-all duration-300 ease-out-expo',
          sidebarCollapsed ? 'lg:pl-[68px]' : 'lg:pl-[256px]'
        )}
      >
        <Topbar />
        <main className="flex-1 px-4 py-6 lg:px-8 lg:py-8">
          <div className="mx-auto max-w-[1400px]">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
