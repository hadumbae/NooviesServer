/**
 * @fileoverview Defines the schema for transforming user moderation log filters into MongoDB match stages.
 */

import {z} from "zod";
import {normaliseQueryMatchValues} from "@/shared/_feat/pipeline-schema-transformers";
import {
    UserModerationLogQueryFilterSchema
} from "@/domains/users/_feat/validate-query/moderation-log/UserModerationLogQueryFilterSchema";

/** Zod schema that normalises moderation log query filters for use in aggregation pipelines. */
export const UserModerationLogQueryMatchStageSchema = UserModerationLogQueryFilterSchema.transform(normaliseQueryMatchValues);

/** Type definition for the normalised user moderation log query match stage. */
export type UserModerationLogQueryMatchStage = z.infer<typeof UserModerationLogQueryMatchStageSchema>;