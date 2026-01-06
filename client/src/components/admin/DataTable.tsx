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
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { useDirection } from '@/hooks/useDirection';
import { useTranslation } from 'react-i18next';

interface DataTableProps {
  columns: { key: string; label: string; className?: string; render?: (row: any) => ReactNode }[];
  data: Record<string, any>[];
  isLoading?: boolean;
  emptyMessage?: string;
  emptyDescription?: string;
  renderRow?: (row: Record<string, any>, index: number) => ReactNode;
  actions?: (row: Record<string, any>) => ReactNode;
  className?: string;
  stickyHeader?: boolean;
}

export function DataTable({
  columns,
  data,
  isLoading = false,
  emptyMessage,
  emptyDescription,
  renderRow,
  actions,
  className,
  stickyHeader = true,
}: DataTableProps) {
  const { isRTL } = useDirection();
  const { t } = useTranslation();

  if (isLoading) {
    return (
      <Card className={cn('overflow-hidden', className)}>
        <div className="overflow-x-auto">
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
      </Card>
    );
  }

  if (data.length === 0) {
    return (
      <EmptyState
        title={emptyMessage || t('admin.table.noData')}
        description={emptyDescription || t('admin.table.noDataDesc')}
        className={className}
      />
    );
  }

  return (
    <Card className={cn('overflow-hidden', className)}>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader className={stickyHeader ? 'sticky top-0 z-10 bg-bg-surface' : ''}>
            <TableRow>
              {columns.map((col) => (
                <TableHead 
                  key={col.key} 
                  className={cn(
                    col.className,
                    isRTL ? 'text-right' : 'text-left'
                  )}
                >
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
                <TableRow key={index} className="hover:bg-bg-surface/50">
                  {columns.map((col) => (
                    <TableCell 
                      key={col.key} 
                      className={cn(
                        col.className,
                        isRTL ? 'text-right' : 'text-left'
                      )}
                      dir="auto"
                    >
                      {col.render ? col.render(row) : (row[col.key] ?? '-')}
                    </TableCell>
                  ))}
                  {actions && (
                    <TableCell className={cn('w-[56px] p-2', isRTL ? 'text-right' : 'text-left')}>
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
    </Card>
  );
}

