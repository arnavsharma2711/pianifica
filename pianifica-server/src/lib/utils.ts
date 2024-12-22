export const isAdmin = (role?: string | null): boolean => {
  if (!role) return false;
  return role === "SUPER_ADMIN" || role === "ORG_ADMIN";
};

export const isSuperAdmin = (role?: string | null): boolean => {
  if (!role) return false;
  return role === "SUPER_ADMIN";
};
