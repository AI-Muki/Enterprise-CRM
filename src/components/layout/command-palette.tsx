import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ArrowRight } from 'lucide-react';
import { useUIStore } from '@/store/ui-store';
import { navSections } from '@/config/nav';
import { cn } from '@/lib/utils';

const allNavItems = navSections.flatMap((s) =>
  s.items.map((i) => ({ label: i.label, to: i.to, section: s.label }))
);

export function CommandPalette() {
  const { commandPaletteOpen, setCommandPaletteOpen } = useUIStore();
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const navigate = useNavigate();

  const results = useMemo(() => {
    if (!query) return allNavItems;
    return allNavItems.filter((item) =>
      item.label.toLowerCase().includes(query.toLowerCase())
    );
  }, [query]);

  useEffect(() => {
    if (!commandPaletteOpen) {
      setQuery('');
      setActiveIndex(0);
    }
  }, [commandPaletteOpen]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setCommandPaletteOpen(!commandPaletteOpen);
      }
      if (e.key === 'Escape') setCommandPaletteOpen(false);
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [commandPaletteOpen, setCommandPaletteOpen]);

  if (!commandPaletteOpen) return null;

  const selectItem = (to: string) => {
    navigate(to);
    setCommandPaletteOpen(false);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-start justify-center p-4 pt-[15vh]">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-fade-in"
        onClick={() => setCommandPaletteOpen(false)}
      />
      <div className="relative w-full max-w-xl overflow-hidden rounded-2xl border border-border bg-popover shadow-floating animate-scale-in">
        <div className="flex items-center gap-3 border-b border-border px-4">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'ArrowDown') {
                e.preventDefault();
                setActiveIndex((i) => Math.min(i + 1, results.length - 1));
              } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                setActiveIndex((i) => Math.max(i - 1, 0));
              } else if (e.key === 'Enter' && results[activeIndex]) {
                selectItem(results[activeIndex].to);
              }
            }}
            placeholder="Search pages, contacts, deals..."
            className="flex h-14 w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
          <kbd className="rounded border border-border bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
            ESC
          </kbd>
        </div>
        <div className="max-h-80 overflow-y-auto p-2">
          {results.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">No results found</p>
          ) : (
            results.map((item, i) => (
              <button
                key={item.to}
                onMouseEnter={() => setActiveIndex(i)}
                onClick={() => selectItem(item.to)}
                className={cn(
                  'flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors',
                  i === activeIndex ? 'bg-secondary text-foreground' : 'text-muted-foreground'
                )}
              >
                <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground/60">
                  {item.section}
                </span>
                <span className="flex-1 text-left text-foreground">{item.label}</span>
                <ArrowRight className="h-3.5 w-3.5 opacity-0 transition-opacity group-hover:opacity-100" />
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
