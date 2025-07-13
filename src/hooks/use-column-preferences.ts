'use client';

import { useEffect, useState } from 'react';
import { useQueryState } from 'nuqs';
import { loadPreference, savePreference, PREFERENCE_KEYS } from '@/lib/preferences';

const DEFAULT_COLUMNS = 'name,phoneNumber,email,location,paymentStatus,createdAt';

/**
 * Custom hook to manage column visibility preferences with localStorage persistence
 */
export function useColumnPreferences() {
  const [isLoaded, setIsLoaded] = useState(false);

  // Initialize with saved preferences or default
  const [visibleColumns, setVisibleColumns] = useQueryState('columns', {
    shallow: false,
    defaultValue: DEFAULT_COLUMNS,
  });

  // Load preferences from localStorage on mount
  useEffect(() => {
    const savedPreferences = loadPreference(PREFERENCE_KEYS.CLIENT_TABLE_COLUMNS, DEFAULT_COLUMNS);

    // Only set if URL doesn't already have column preferences
    if (!visibleColumns || visibleColumns === DEFAULT_COLUMNS) {
      setVisibleColumns(savedPreferences);
    }

    setIsLoaded(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run once on mount

  // Save preferences to localStorage whenever they change
  useEffect(() => {
    if (!isLoaded || !visibleColumns) return;

    savePreference(PREFERENCE_KEYS.CLIENT_TABLE_COLUMNS, visibleColumns);
  }, [visibleColumns, isLoaded]);

  return {
    visibleColumns,
    setVisibleColumns,
    isLoaded,
  };
}
