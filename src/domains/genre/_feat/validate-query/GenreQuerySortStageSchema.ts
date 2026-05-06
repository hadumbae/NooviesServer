/**
 * @fileoverview Zod schema for transforming genre query sort parameters into a Mongoose sort stage.
 */

import {z} from "zod";
import {GenreQueryMatchSortsSchema} from "@domains/genre/_feat/validate-query/GenreQueryMatchSortsSchema";
import {normaliseQuerySortValues} from "@shared/_feat/pipeline-schema-transformers";

/** Zod schema that transforms genre query sort values into a Mongoose sort pipeline stage. */
export const GenreQuerySortStageSchema = GenreQueryMatchSortsSchema.transform(normaliseQuerySortValues);

/** Inferred type representing the validated and transformed Mongoose sort stage for genres. */
export type GenreQuerySortStage = z.infer<typeof GenreQuerySortStageSchema>;