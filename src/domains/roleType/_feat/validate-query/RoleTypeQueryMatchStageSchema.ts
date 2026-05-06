/**
 * @fileoverview Zod schema for transforming role type query match parameters into a Mongoose match stage.
 */

import {z} from "zod";
import {normaliseQueryMatchValues} from "@shared/_feat/pipeline-schema-transformers";
import {RoleTypeQueryMatchFiltersSchema} from "@domains/roleType/_feat/validate-query/RoleTypeQueryMatchFiltersSchema";

/** Zod schema that transforms role type query match values into a Mongoose match pipeline stage. */
export const RoleTypeQueryMatchStageSchema = RoleTypeQueryMatchFiltersSchema.transform(normaliseQueryMatchValues);

/** Inferred type representing the validated and transformed Mongoose match stage for role types. */
export type RoleTypeQueryMatchStage = z.infer<typeof RoleTypeQueryMatchStageSchema>;