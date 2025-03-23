'use client';

import { cn } from '@/lib/utils';
import React from 'react';

function MultiStepFormInput({
  className,
  type,
  error,
  ...props
}: React.ComponentProps<'input'> & { error?: string }) {
  return (
    <div className="relative w-full">
      <input
        type={type || 'text'}
        className={cn(
          'file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md bg-transparent px-3 py-1 shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50',
          'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive',
          'text-xl text-center w-full',
          error ? 'border-red-500' : '',
          className
        )}
        {...props}
      />
      {error && (
        <p className="text-red-500 text-sm mt-1 absolute left-0 right-0 text-center">
          {error}
        </p>
      )}
    </div>
  );
}

export default MultiStepFormInput;
