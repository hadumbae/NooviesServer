/**
 * @fileoverview Zod schema for transforming person query match parameters into a Mongoose match stage.
 */

import {z} from "zod";
import {PersonQueryMatchFiltersSchema} from "@domains/person/_feat/validate-query/PersonQueryMatchFiltersSchema";
import {normaliseQueryMatchValues} from "@shared/_feat/pipeline-schema-transformers";

/** Zod schema that transforms person query match values into a Mongoose match pipeline stage. */
export const PersonQueryMatchStageSchema = PersonQueryMatchFiltersSchema.transform(normaliseQueryMatchValues);

/** Inferred type representing the validated and transformed Mongoose match stage for persons. */
export type PersonQueryMatchStage = z.infer<typeof PersonQueryMatchStageSchema>;