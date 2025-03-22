import { useOrganization } from '@clerk/nextjs';
import { type Permission, hasPermission } from '@/types/roles';

export function usePermissions() {
  const { membership } = useOrganization();

  const isAdmin = membership?.role === 'admin';

  const can = (permission: Permission) => {
    if (!membership?.role) return false;
    return hasPermission(membership.role as 'admin' | 'member', permission);
  };

  return {
    can,
    isAdmin,
    role: membership?.role,
  };
}
