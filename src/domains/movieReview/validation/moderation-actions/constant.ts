/**
 * @file Constants defining the permissible moderation actions for movie reviews.
 * @filename constant.ts
 */

/**
 * List of available administrative actions for moderating user reviews.
 * ---
 */
export const MovieReviewModerationActionConstant = [
  "MOD_SOFT_DELETE",
  "MOD_TOGGLE_PUBLICITY",
  "MOD_RESET_DISPLAY_NAME",
  "MOD_RESET_LIKES",
  "MOD_SET_RATING",
] as const;