/**
 * @fileoverview Defines the combined schema for user moderation log query filters and sorting options.
 */

import {z} from "zod";
import {
    UserModerationLogQueryFilterSchema
} from "@/domains/users/_feat/validate-query/moderation-log/UserModerationLogQueryFilterSchema";
import {
    UserModerationLogQuerySortSchema
} from "@/domains/users/_feat/validate-query/moderation-log/UserModerationLogQuerySortSchema";

/** Zod schema merging moderation log filters and sort parameters. */
export const UserModerationLogQueryOptionSchema = UserModerationLogQueryFilterSchema.merge(UserModerationLogQuerySortSchema);

/** Type definition for the combined user moderation log query options. */
export type UserModerationLogQueryOptions = z.infer<typeof UserModerationLogQueryOptionSchema>;
