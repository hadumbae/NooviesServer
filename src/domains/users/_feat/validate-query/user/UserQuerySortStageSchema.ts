/**
 * @fileoverview Defines the schema for transforming user query sort parameters into a pipeline-ready format.
 */

import {UserQuerySortSchema} from "@/domains/users/_feat/validate-query/user/UserQuerySortSchema";
import {normaliseQuerySortValues} from "@/shared/_feat/pipeline-schema-transformers";
import {z} from "zod";

/** Zod schema that normalizes user sort fields and directions for database queries. */
export const UserQuerySortStageSchema = UserQuerySortSchema.transform(normaliseQuerySortValues);

/** Type definition for the transformed user query sort stage. */
export type UserQuerySortStage = z.infer<typeof UserQuerySortStageSchema>;