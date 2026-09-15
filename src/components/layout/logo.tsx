import { cn } from '@/lib/utils';

export function Logo({ collapsed }: { collapsed?: boolean }) {
  return (
    <div className="flex items-center gap-2.5">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-primary-600 to-primary-400 shadow-glow">
        <svg viewBox="0 0 24 24" className="h-5 w-5 text-white" fill="none">
          <path
            d="M6 4L12 8L18 4V16L12 20L6 16V4Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          <path d="M12 8V20" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
        </svg>
      </div>
      {!collapsed && (
        <div className="flex flex-col leading-none">
          <span className="text-base font-bold tracking-tight text-foreground">Nexus</span>
          <span className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground">
            CRM Platform
          </span>
        </div>
      )}
    </div>
  );
}

export function LogoFull({ className }: { className?: string }) {
  return (
    <div className={cn('flex items-center gap-3', className)}>
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary-600 to-primary-400 shadow-glow">
        <svg viewBox="0 0 24 24" className="h-6 w-6 text-white" fill="none">
          <path
            d="M6 4L12 8L18 4V16L12 20L6 16V4Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          <path d="M12 8V20" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
        </svg>
      </div>
      <div className="flex flex-col leading-none">
        <span className="text-xl font-bold tracking-tight">Nexus</span>
        <span className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
          CRM Platform
        </span>
      </div>
    </div>
  );
}
