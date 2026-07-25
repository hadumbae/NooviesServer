/**
 * @fileoverview Defines constant values for user moderation log event codes.
 */

/** List of valid action codes used for logging user moderation events. */
export const UserModerationLogActionConstant = [
    "user_role_update",
    "user_registered",
    "user_suspended",
] as const;