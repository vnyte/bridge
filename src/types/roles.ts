export type Role = 'admin' | 'member';

export const ROLE_PERMISSIONS = {
  admin: ['org:read', 'org:write', 'user:manage', 'student:manage', 'payment:manage'],
  member: ['org:read', 'student:read', 'schedule:read'],
} as const;

export type Permission = (typeof ROLE_PERMISSIONS)[keyof typeof ROLE_PERMISSIONS][number];

// Helper function to check if a role has a specific permission
export function hasPermission(role: Role, permission: Permission) {
  return role === 'admin' || (ROLE_PERMISSIONS[role] as readonly string[]).includes(permission);
}
