// src/utils/permissions.js

/**
 * Generates permission settings for a user based on their role.
 * @param {string} role - The user's role (e.g., "admin", "editor", "subscriber").
 * @returns {object} permissions object
 */
export const generatePermissions = (role) => {
  const basePermissions = {
    dashboard: true,
    profile: true,
  };

  switch (role?.toLowerCase()) {
    case "admin":
      return {
        ...basePermissions,
        users: true,
        customers: true,
        invoices: true,
        settings: true,
        canEdit: true,
        canDelete: true,
        canCreate: true,
      };
    case "editor":
      return {
        ...basePermissions,
        users: false,
        customers: true,
        invoices: true,
        settings: false,
        canEdit: true,
        canDelete: false,
        canCreate: true,
      };
    case "subscriber":
      return {
        ...basePermissions,
        users: false,
        customers: false,
        invoices: true,
        settings: false,
        canEdit: false,
        canDelete: false,
        canCreate: false,
      };
    default:
      return basePermissions;
  }
};
