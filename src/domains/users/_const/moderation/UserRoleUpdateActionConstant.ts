/**
 * @fileoverview Constant list of all valid action identifiers for user role modifications.
 */

/** Tuple array containing the authoritative set of available user role update actions. */
export const UserRoleUpdateActionConstant = [
    "user_role_update",
    "user_role_grant_admin",
    "user_role_revoke_admin",
] as const;