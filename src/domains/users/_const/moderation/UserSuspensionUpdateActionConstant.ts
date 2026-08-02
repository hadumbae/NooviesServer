/**
 * @fileoverview Constant list of all valid action identifiers for user suspension lifecycle adjustments.
 */

/** Tuple array containing the authoritative set of available user suspension update actions. */
export const UserSuspensionUpdateActionConstant = [
    "user_suspended",
    "user_lift_suspension",
] as const;