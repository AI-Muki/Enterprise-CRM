import type { ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';
import { PageHeader } from '@/components/layout/page-header';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/misc';

interface ModulePlaceholderProps {
  title: string;
  description: string;
  icon: LucideIcon;
  actionLabel?: string;
  children?: ReactNode;
  headerActions?: ReactNode;
}

export function ModulePlaceholder({
  title,
  description,
  icon: Icon,
  actionLabel = 'Get started',
  children,
  headerActions,
}: ModulePlaceholderProps) {
  return (
    <div>
      <PageHeader
        title={title}
        description={description}
        actions={headerActions}
      />
      {children || (
        <Card className="animate-fade-in-up">
          <CardContent className="p-0">
            <EmptyState
              icon={<Icon className="h-7 w-7" />}
              title={`Welcome to ${title}`}
              description={`This module is ready for implementation. ${description}`}
              action={
                <Button>
                  <Icon className="h-4 w-4" />
                  {actionLabel}
                </Button>
              }
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
