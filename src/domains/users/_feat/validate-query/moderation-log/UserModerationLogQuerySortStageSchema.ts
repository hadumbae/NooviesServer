/**
 * @fileoverview Defines the Zod schema for transforming user moderation log query sort parameters.
 */

import {z} from "zod";
import {normaliseQuerySortValues} from "@/shared/_feat/pipeline-schema-transformers";
import {
    UserModerationLogQuerySortSchema
} from "@/domains/users/_feat/validate-query/moderation-log/UserModerationLogQuerySortSchema";

/** Zod schema that normalises sort values for user moderation log queries. */
export const UserModerationLogQuerySortStageSchema = UserModerationLogQuerySortSchema.transform(normaliseQuerySortValues);

/** Type representing the normalised sort stage for user moderation log queries. */
export type UserModerationLogQuerySortStage = z.infer<typeof UserModerationLogQuerySortStageSchema>;