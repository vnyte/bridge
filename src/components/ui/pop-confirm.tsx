'use client';

import * as React from 'react';
import { createPortal } from 'react-dom';
import { Button } from '@/components/ui/button';

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
  const [triggerRect, setTriggerRect] = React.useState<DOMRect | null>(null);
  const triggerRef = React.useRef<HTMLDivElement>(null);

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

  const handleTriggerClick = () => {
    if (disabled) return;

    const rect = triggerRef.current?.getBoundingClientRect();
    if (rect) {
      setTriggerRect(rect);
      setOpen(true);
    }
  };

  const defaultIcon = (
    <div className="w-4 h-4 bg-orange-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
      !
    </div>
  );

  const popoverContent =
    open && triggerRect ? (
      <div
        className="fixed bg-white border rounded-lg shadow-lg p-4 w-80"
        style={{
          zIndex: 10000,
          left: triggerRect.left,
          top: triggerRect.bottom + 4,
          pointerEvents: 'auto',
        }}
      >
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
            style={{ pointerEvents: 'auto' }}
          >
            {cancelText}
          </Button>
          <Button
            size="sm"
            variant={variant}
            onClick={handleConfirm}
            disabled={loading}
            className="h-8 px-3"
            style={{ pointerEvents: 'auto' }}
          >
            {loading ? '...' : confirmText}
          </Button>
        </div>
      </div>
    ) : null;

  return (
    <>
      <div ref={triggerRef} onClick={handleTriggerClick} className="inline-block">
        {children}
      </div>
      {typeof window !== 'undefined' &&
        popoverContent &&
        createPortal(popoverContent, document.body)}
    </>
  );
}
