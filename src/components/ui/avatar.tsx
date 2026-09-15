import { cn, initials } from '@/lib/utils';

interface AvatarProps {
  name: string;
  src?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const sizes = {
  sm: 'h-7 w-7 text-xs',
  md: 'h-9 w-9 text-sm',
  lg: 'h-11 w-11 text-base',
  xl: 'h-16 w-16 text-lg',
};

const colorPalette = [
  'bg-primary-100 text-primary-700 dark:bg-primary-500/20 dark:text-primary-300',
  'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300',
  'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300',
  'bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-300',
  'bg-violet-100 text-violet-700 dark:bg-violet-500/20 dark:text-violet-300',
  'bg-cyan-100 text-cyan-700 dark:bg-cyan-500/20 dark:text-cyan-300',
];

function colorFor(name: string): string {
  const hash = name.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
  return colorPalette[hash % colorPalette.length];
}

export function Avatar({ name, src, size = 'md', className }: AvatarProps) {
  return (
    <div
      className={cn(
        'relative inline-flex shrink-0 items-center justify-center rounded-full font-semibold overflow-hidden ring-1 ring-border',
        sizes[size],
        !src && colorFor(name),
        className
      )}
    >
      {src ? (
        <img src={src} alt={name} className="h-full w-full object-cover" />
      ) : (
        <span>{initials(name)}</span>
      )}
    </div>
  );
}

export function AvatarGroup({
  names,
  max = 4,
  size = 'sm',
}: {
  names: string[];
  max?: number;
  size?: 'sm' | 'md';
}) {
  const visible = names.slice(0, max);
  const remaining = names.length - max;
  return (
    <div className="flex -space-x-2">
      {visible.map((name, i) => (
        <div
          key={i}
          className="ring-2 ring-card rounded-full"
          style={{ zIndex: visible.length - i }}
        >
          <Avatar name={name} size={size} />
        </div>
      ))}
      {remaining > 0 && (
        <div
          className={cn(
            'inline-flex items-center justify-center rounded-full ring-2 ring-card bg-muted text-muted-foreground font-medium',
            sizes[size]
          )}
        >
          +{remaining}
        </div>
      )}
    </div>
  );
}
