/**
 * @fileoverview Zod schema for transforming genre query match parameters into a Mongoose match stage.
 */

import {z} from "zod";
import {GenreQueryMatchFiltersSchema} from "@domains/genre/_feat/validate-query/GenreQueryMatchFiltersSchema";
import {normaliseQueryMatchValues} from "@shared/_feat/pipeline-schema-transformers";

/** Zod schema that transforms genre query match values into a Mongoose match pipeline stage. */
export const GenreQueryMatchStageSchema = GenreQueryMatchFiltersSchema.transform(normaliseQueryMatchValues);

/** Inferred type representing the validated and transformed Mongoose match stage for genres. */
export type GenreQueryMatchStage = z.infer<typeof GenreQueryMatchStageSchema>;