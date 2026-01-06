import React, { ReactNode } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { EmptyState } from '@/components/EmptyState';
import { cn } from '@/lib/utils';
import { useDirection } from '@/hooks/useDirection';
import { useTranslation } from 'react-i18next';

interface AdminTableProps {
  columns: { key: string; label: string; className?: string }[];
  data: Record<string, any>[];
  isLoading?: boolean;
  emptyMessage?: string;
  emptyDescription?: string;
  renderRow?: (row: Record<string, any>, index: number) => ReactNode;
  actions?: (row: Record<string, any>) => ReactNode;
  className?: string;
}

export function AdminTable({
  columns,
  data,
  isLoading = false,
  emptyMessage,
  emptyDescription,
  renderRow,
  actions,
  className,
}: AdminTableProps) {
  const { isRTL } = useDirection();
  const { t } = useTranslation();
  if (isLoading) {
    return (
      <div className={cn('rounded-lg border border-border-soft', className)}>
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((col) => (
                <TableHead key={col.key} className={col.className}>
                  <Skeleton className="h-4 w-20" />
                </TableHead>
              ))}
              {actions && <TableHead className="w-[56px]"></TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {[1, 2, 3, 4, 5].map((i) => (
              <TableRow key={i}>
                {columns.map((col) => (
                  <TableCell key={col.key}>
                    <Skeleton className="h-4 w-full" />
                  </TableCell>
                ))}
                {actions && (
                  <TableCell className="w-[56px]">
                    <Skeleton className="h-4 w-8 mx-auto" />
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <EmptyState
        title={emptyMessage || 'No data found'}
        description={emptyDescription || 'There is no data to display.'}
        className={className}
      />
    );
  }

  return (
    <div className={cn('rounded-lg border border-border-soft overflow-x-auto', className)} style={{ maxWidth: '100%' }}>
      <div className="min-w-full">
        <Table>
        <TableHeader>
          <TableRow>
            {columns.map((col) => (
              <TableHead key={col.key} className={col.className}>
                {col.label}
              </TableHead>
            ))}
            {actions && (
              <TableHead className={cn('w-[56px] whitespace-nowrap', isRTL ? 'text-right' : 'text-left')}>
                {t('admin.table.actions')}
              </TableHead>
            )}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((row, index) => {
            if (renderRow) {
              return <React.Fragment key={index}>{renderRow(row, index)}</React.Fragment>;
            }
            return (
              <TableRow key={index}>
                {columns.map((col) => (
                  <TableCell key={col.key} className={col.className}>
                    {row[col.key] ?? '-'}
                  </TableCell>
                ))}
                {actions && (
                  <TableCell className={cn('w-[56px] p-2 relative', isRTL ? 'text-right' : 'text-left')}>
                    <div className={cn('flex items-center', isRTL ? 'justify-start' : 'justify-end')}>
                      {actions(row)}
                    </div>
                  </TableCell>
                )}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
      </div>
    </div>
  );
}

