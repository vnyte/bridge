'use client';

import * as React from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface PopConfirmProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void | Promise<void>;
  onCancel?: () => void;
  disabled?: boolean;
  variant?: 'destructive' | 'default';
  icon?: React.ReactNode;
}

export function PopConfirm({
  children,
  title = 'Are you sure?',
  description = 'This action cannot be undone.',
  confirmText = 'Yes',
  cancelText = 'No',
  onConfirm,
  onCancel,
  disabled = false,
  variant = 'destructive',
  icon,
}: PopConfirmProps) {
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const handleConfirm = async () => {
    if (!onConfirm) return;

    try {
      setLoading(true);
      await onConfirm();
      setOpen(false);
    } catch (error) {
      console.error('PopConfirm error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    }
    setOpen(false);
  };

  const defaultIcon = (
    <div className="w-4 h-4 bg-orange-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
      !
    </div>
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild disabled={disabled}>
        {children}
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="start">
        <div className="p-4">
          <div className="flex items-start gap-3 mb-4">
            {icon || defaultIcon}
            <div className="flex-1">
              <div className="font-medium text-sm mb-1">{title}</div>
              {description && <div className="text-sm text-muted-foreground">{description}</div>}
            </div>
          </div>
          <div className="flex justify-between gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleCancel}
              disabled={loading}
              className="h-8 px-3"
            >
              {cancelText}
            </Button>
            <Button
              size="sm"
              onClick={handleConfirm}
              disabled={loading}
              className={cn(
                'h-8 px-3',
                variant === 'destructive' && 'bg-blue-500 hover:bg-blue-600 text-white'
              )}
            >
              {loading ? '...' : confirmText}
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
