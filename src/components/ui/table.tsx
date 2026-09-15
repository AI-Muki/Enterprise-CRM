import { useState, type ReactNode } from 'react';
import { ChevronDown, ChevronUp, ChevronsUpDown, Inbox } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Checkbox } from '@/components/ui/checkbox';

export interface Column<T> {
  key: string;
  header: string;
  cell: (row: T) => ReactNode;
  sortable?: boolean;
  sortAccessor?: (row: T) => string | number;
  width?: string;
  align?: 'left' | 'right' | 'center';
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  rowKey: (row: T) => string;
  onRowClick?: (row: T) => void;
  selectable?: boolean;
  emptyState?: ReactNode;
  loading?: boolean;
}

export function DataTable<T>({
  columns,
  data,
  rowKey,
  onRowClick,
  selectable,
  emptyState,
  loading,
}: DataTableProps<T>) {
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const handleSort = (col: Column<T>) => {
    if (!col.sortable) return;
    if (sortKey === col.key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(col.key);
      setSortDir('asc');
    }
  };

  const sortedData = [...data];
  if (sortKey) {
    const col = columns.find((c) => c.key === sortKey);
    if (col?.sortAccessor) {
      sortedData.sort((a, b) => {
        const av = col.sortAccessor!(a);
        const bv = col.sortAccessor!(b);
        if (av < bv) return sortDir === 'asc' ? -1 : 1;
        if (av > bv) return sortDir === 'asc' ? 1 : -1;
        return 0;
      });
    }
  }

  const allSelected = data.length > 0 && selected.size === data.length;
  const toggleAll = () => {
    if (allSelected) setSelected(new Set());
    else setSelected(new Set(data.map(rowKey)));
  };
  const toggleRow = (id: string) => {
    const next = new Set(selected);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelected(next);
  };

  if (loading) {
    return (
      <div className="w-full">
        <div className="flex gap-4 pb-3 border-b border-border">
          {selectable && <div className="w-8" />}
          {columns.map((c) => (
            <div key={c.key} className="h-4 flex-1 rounded bg-muted animate-pulse" />
          ))}
        </div>
        {Array.from({ length: 5 }).map((_, r) => (
          <div key={r} className="flex gap-4 py-3.5 border-b border-border/50">
            {selectable && <div className="w-8" />}
            {columns.map((c) => (
              <div key={c.key} className="h-4 flex-1 rounded bg-muted/60 animate-pulse" />
            ))}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="w-full">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-border">
            {selectable && (
              <th className="w-10 py-3 pl-4 pr-2">
                <Checkbox checked={allSelected} onChange={toggleAll} />
              </th>
            )}
            {columns.map((col) => (
              <th
                key={col.key}
                style={{ width: col.width }}
                className={cn(
                  'py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider',
                  col.align === 'right' && 'text-right',
                  col.align === 'center' && 'text-center',
                  col.sortable && 'cursor-pointer select-none hover:text-foreground transition-colors'
                )}
                onClick={() => handleSort(col)}
              >
                <div
                  className={cn(
                    'inline-flex items-center gap-1',
                    col.align === 'right' && 'flex-row-reverse'
                  )}
                >
                  {col.header}
                  {col.sortable && sortKey === col.key && sortDir === 'asc' && (
                    <ChevronUp className="h-3.5 w-3.5" />
                  )}
                  {col.sortable && sortKey === col.key && sortDir === 'desc' && (
                    <ChevronDown className="h-3.5 w-3.5" />
                  )}
                  {col.sortable && sortKey !== col.key && (
                    <ChevronsUpDown className="h-3.5 w-3.5 opacity-40" />
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sortedData.length === 0 ? (
            <tr>
              <td colSpan={columns.length + (selectable ? 1 : 0)} className="py-12">
                {emptyState || (
                  <div className="flex flex-col items-center justify-center text-center">
                    <Inbox className="h-10 w-10 text-muted-foreground/40" />
                    <p className="mt-2 text-sm text-muted-foreground">No records found</p>
                  </div>
                )}
              </td>
            </tr>
          ) : (
            sortedData.map((row) => {
              const id = rowKey(row);
              const isSelected = selected.has(id);
              return (
                <tr
                  key={id}
                  onClick={() => onRowClick?.(row)}
                  className={cn(
                    'border-b border-border/50 transition-colors',
                    onRowClick && 'cursor-pointer',
                    isSelected ? 'bg-primary/5' : 'hover:bg-secondary/50'
                  )}
                >
                  {selectable && (
                    <td className="py-3 pl-4 pr-2" onClick={(e) => e.stopPropagation()}>
                      <Checkbox
                        checked={isSelected}
                        onChange={() => toggleRow(id)}
                      />
                    </td>
                  )}
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className={cn(
                        'py-3 px-4 text-sm text-foreground',
                        col.align === 'right' && 'text-right',
                        col.align === 'center' && 'text-center'
                      )}
                    >
                      {col.cell(row)}
                    </td>
                  ))}
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}
