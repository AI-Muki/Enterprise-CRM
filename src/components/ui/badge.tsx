import type { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

type Variant =
  | 'default'
  | 'primary'
  | 'secondary'
  | 'success'
  | 'warning'
  | 'destructive'
  | 'outline';

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: Variant;
  dot?: boolean;
}

const variants: Record<Variant, string> = {
  default: 'bg-secondary text-secondary-foreground',
  primary: 'bg-primary-50 text-primary-700 dark:bg-primary-500/15 dark:text-primary-300',
  secondary: 'bg-muted text-muted-foreground',
  success: 'bg-success/10 text-success dark:bg-success/15',
  warning: 'bg-warning/10 text-warning dark:bg-warning/15',
  destructive: 'bg-destructive/10 text-destructive dark:bg-destructive/15',
  outline: 'border border-border text-foreground bg-transparent',
};

export function Badge({
  className,
  variant = 'default',
  dot,
  children,
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-medium',
        variants[variant],
        className
      )}
      {...props}
    >
      {dot && <span className="h-1.5 w-1.5 rounded-full bg-current" />}
      {children}
    </span>
  );
}
