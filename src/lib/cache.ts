import { revalidateTag, unstable_cache } from 'next/cache';
import { cache } from 'react';

const compactNumberFormatter = new Intl.NumberFormat(undefined, {
  notation: 'compact',
});

export function formatCompactNumber(number: number) {
  return compactNumberFormatter.format(number);
}

formatCompactNumber(2090);

export type ValidTags =
  | ReturnType<typeof getTenantTag>
  | ReturnType<typeof getUserTag>
  | ReturnType<typeof getIdTag>;

export const CACHE_TAGS = {
  tenants: 'tenants',
  vehicles: 'vehicles',
  branch: 'branch',
  clients: 'clients',
  learningLicenses: 'learning-licenses',
  drivingLicenses: 'driving-licenses',
} as const;

export function getTenantTag(tenantId: string, tag: keyof typeof CACHE_TAGS) {
  return `tenant:${tenantId}-${CACHE_TAGS[tag]}` as const;
}

export function getUserTag(userId: string, tag: keyof typeof CACHE_TAGS) {
  return `user:${userId}-${CACHE_TAGS[tag]}` as const;
}

export function getIdTag(id: string, tag: keyof typeof CACHE_TAGS) {
  return `id:${id}-${CACHE_TAGS[tag]}` as const;
}

export function clearFullCache() {
  revalidateTag('*');
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function dbCache<T extends (...args: any[]) => Promise<any>>(
  cb: Parameters<typeof unstable_cache<T>>[0],
  { tags }: { tags: ValidTags[] }
) {
  return cache(unstable_cache<T>(cb, undefined, { tags: [...tags, '*'] }));
}

export function revalidateDbCache({
  tag,
  userId,
  tenantId,
  branchId,
  id,
}: {
  tag: keyof typeof CACHE_TAGS;
  userId?: string;
  tenantId?: string;
  branchId?: string;
  id?: string;
}) {
  if (tenantId != null) {
    revalidateTag(getTenantTag(tenantId, tag));
  }

  if (branchId != null) {
    revalidateTag(getIdTag(branchId, tag));
  }

  if (userId != null) {
    revalidateTag(getUserTag(userId, tag));
  }

  if (id != null) {
    revalidateTag(getIdTag(id, tag));
  }
}
