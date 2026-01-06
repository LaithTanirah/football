import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Eye, Edit, Trash2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { MoreVertical } from 'lucide-react';
import { useDirection } from '@/hooks/useDirection';

interface RowActionsMenuProps {
  onView?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  disabled?: boolean;
  showView?: boolean;
  showEdit?: boolean;
  showDelete?: boolean;
}

export function RowActionsMenu({
  onView,
  onEdit,
  onDelete,
  disabled = false,
  showView = true,
  showEdit = true,
  showDelete = true,
}: RowActionsMenuProps) {
  const { t } = useTranslation();
  const { isRTL } = useDirection();
  const [open, setOpen] = useState(false);
  const justOpenedRef = useRef(false);

  useEffect(() => {
    if (open) {
      // Mark that menu just opened
      justOpenedRef.current = true;
      // Reset after a delay to allow user interaction (increased to 200ms)
      const timer = setTimeout(() => {
        justOpenedRef.current = false;
      }, 200);
      return () => clearTimeout(timer);
    } else {
      // Reset when menu closes
      justOpenedRef.current = false;
    }
  }, [open]);

  const handleView = () => {
    if (justOpenedRef.current) return; // Ignore if menu just opened
    onView?.();
  };

  const handleEdit = () => {
    if (justOpenedRef.current) return; // Ignore if menu just opened
    onEdit?.();
  };

  const handleDelete = () => {
    if (justOpenedRef.current) return; // Ignore if menu just opened
    onDelete?.();
  };

  return (
    <div className="relative inline-flex" onClick={(e) => e.stopPropagation()}>
      <DropdownMenu open={open} onOpenChange={setOpen} modal={true}>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8" 
            disabled={disabled}
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent 
          align={isRTL ? 'start' : 'end'}
          onCloseAutoFocus={(e) => e.preventDefault()}
          onOpenAutoFocus={(e) => e.preventDefault()}
          onEscapeKeyDown={(e) => {
            e.preventDefault();
            setOpen(false);
          }}
        >
          {showView && onView && (
            <DropdownMenuItem 
              onSelect={(e) => {
                e.preventDefault();
                setOpen(false);
                handleView();
              }}
            >
              <Eye className="h-4 w-4 me-2" />
              {t('admin.actions.view')}
            </DropdownMenuItem>
          )}
          {showEdit && onEdit && (
            <DropdownMenuItem 
              onSelect={(e) => {
                e.preventDefault();
                setOpen(false);
                handleEdit();
              }}
            >
              <Edit className="h-4 w-4 me-2" />
              {t('admin.actions.edit')}
            </DropdownMenuItem>
          )}
          {showDelete && onDelete && (
            <DropdownMenuItem 
              className="text-destructive" 
              onSelect={(e) => {
                e.preventDefault();
                setOpen(false);
                handleDelete();
              }}
            >
              <Trash2 className="h-4 w-4 me-2" />
              {t('admin.actions.delete')}
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

