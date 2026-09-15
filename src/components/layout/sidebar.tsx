import { NavLink, useLocation } from 'react-router-dom';
import { PanelLeftClose, PanelLeft, Sparkles, ChevronRight } from 'lucide-react';
import { navSections } from '@/config/nav';
import { useUIStore } from '@/store/ui-store';
import { cn } from '@/lib/utils';
import { Logo } from './logo';

export function Sidebar() {
  const { sidebarCollapsed, toggleSidebar, mobileSidebarOpen, setMobileSidebarOpen } = useUIStore();
  const location = useLocation();

  return (
    <>
      {/* Mobile overlay */}
      {mobileSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden animate-fade-in"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex flex-col border-r border-sidebar-border bg-sidebar transition-all duration-300 ease-out-expo',
          sidebarCollapsed ? 'w-[68px]' : 'w-[256px]',
          'lg:translate-x-0',
          mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        {/* Logo */}
        <div className="flex h-16 items-center gap-2.5 px-4 border-b border-sidebar-border">
          <Logo collapsed={sidebarCollapsed} />
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 no-scrollbar">
          {navSections.map((section) => (
            <div key={section.label} className="mb-5">
              {!sidebarCollapsed && (
                <p className="mb-1.5 px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground/70">
                  {section.label}
                </p>
              )}
              <div className="space-y-0.5">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.to || location.pathname.startsWith(item.to + '/');
                  return (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      onClick={() => setMobileSidebarOpen(false)}
                      className={cn(
                        'group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-150',
                        sidebarCollapsed && 'justify-center',
                        isActive
                          ? 'bg-primary/10 text-primary'
                          : 'text-muted-foreground hover:bg-sidebar-accent hover:text-foreground'
                      )}
                      title={sidebarCollapsed ? item.label : undefined}
                    >
                      <Icon className={cn('h-[18px] w-[18px] shrink-0', isActive && 'text-primary')} />
                      {!sidebarCollapsed && <span className="truncate">{item.label}</span>}
                      {!sidebarCollapsed && item.badge && (
                        <span className="ml-auto rounded-full bg-primary-100 px-1.5 py-0.5 text-xs font-medium text-primary-700 dark:bg-primary-500/20 dark:text-primary-300">
                          {item.badge}
                        </span>
                      )}
                    </NavLink>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* AI Assistant CTA */}
        <div className="px-3 pb-3">
          <NavLink
            to="/ai-assistant"
            onClick={() => setMobileSidebarOpen(false)}
            className={cn(
              'flex items-center gap-3 rounded-lg border border-primary/20 bg-gradient-to-r from-primary/10 to-primary/5 px-3 py-2.5 text-sm font-medium text-primary transition-all hover:from-primary/15 hover:to-primary/10',
              sidebarCollapsed && 'justify-center'
            )}
            title={sidebarCollapsed ? 'AI Assistant' : undefined}
          >
            <Sparkles className="h-[18px] w-[18px] shrink-0" />
            {!sidebarCollapsed && <span>AI Assistant</span>}
            {!sidebarCollapsed && <ChevronRight className="ml-auto h-4 w-4" />}
          </NavLink>
        </div>

        {/* Collapse toggle */}
        <button
          onClick={toggleSidebar}
          className="hidden lg:flex h-12 items-center gap-2 border-t border-sidebar-border px-4 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          {sidebarCollapsed ? (
            <PanelLeft className="h-4 w-4" />
          ) : (
            <>
              <PanelLeftClose className="h-4 w-4" />
              <span>Collapse</span>
            </>
          )}
        </button>
      </aside>
    </>
  );
}
