/**
 * User preferences management utilities
 */

export const PREFERENCE_KEYS = {
  CLIENT_TABLE_COLUMNS: 'client-table-column-preferences',
} as const;

export type PreferenceKey = (typeof PREFERENCE_KEYS)[keyof typeof PREFERENCE_KEYS];

/**
 * Save a preference to localStorage
 */
export function savePreference(key: PreferenceKey, value: string): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(key, value);
  } catch (error) {
    console.warn(`Failed to save preference ${key}:`, error);
  }
}

/**
 * Load a preference from localStorage
 */
export function loadPreference(key: PreferenceKey, defaultValue: string = ''): string {
  if (typeof window === 'undefined') return defaultValue;

  try {
    const saved = localStorage.getItem(key);
    return saved ?? defaultValue;
  } catch (error) {
    console.warn(`Failed to load preference ${key}:`, error);
    return defaultValue;
  }
}

/**
 * Clear a specific preference
 */
export function clearPreference(key: PreferenceKey): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.warn(`Failed to clear preference ${key}:`, error);
  }
}

/**
 * Clear all user preferences
 */
export function clearAllPreferences(): void {
  if (typeof window === 'undefined') return;

  Object.values(PREFERENCE_KEYS).forEach((key) => {
    clearPreference(key);
  });
}
