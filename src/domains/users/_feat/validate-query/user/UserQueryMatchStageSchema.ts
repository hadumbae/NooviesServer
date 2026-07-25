/**
 * @fileoverview Defines the Zod schema for transforming user query filters into MongoDB match stages.
 */

import {z} from "zod";
import {normaliseQueryMatchValues} from "@/shared/_feat/pipeline-schema-transformers";
import {UserQueryFilterSchema} from "@/domains/users/_feat/validate-query/user/UserQueryFilterSchema";

/** Schema that validates and normalizes user query filters for database matching. */
export const UserQueryMatchStageSchema = UserQueryFilterSchema.transform(normaliseQueryMatchValues);

/** Type definition for the validated user query match stage. */
export type UserQueryMatchStage = z.infer<typeof UserQueryMatchStageSchema>;