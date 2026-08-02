/**
 * @fileoverview Defines constant values for user moderation log event codes.
 */

/** List of valid action codes used for logging user moderation events. */
export const UserModerationLogActionConstant = [
    "user_role_update",
    "user_role_grant_admin",
    "user_role_revoke_admin",
    "user_registered",
    "user_suspended",
    "user_lift_suspension",
] as const;