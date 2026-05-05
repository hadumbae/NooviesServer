/**
 * @fileoverview Zod schema for transforming theatre query sort parameters into a Mongoose sort stage.
 */

import {z} from "zod";
import {TheatreQueryMatchSortSchema} from "@domains/theatre/_feat/validate-query/TheatreQueryMatchSortSchema";
import {normaliseQuerySortValues} from "@shared/_feat/pipeline-schema-transformers";

/** Zod schema that transforms theatre query sort values into a Mongoose sort pipeline stage. */
export const TheatreQuerySortStageSchema = TheatreQueryMatchSortSchema.transform(normaliseQuerySortValues);

/** Inferred type representing the validated and transformed Mongoose sort stage for theatres. */
export type TheatreQuerySortStage = z.infer<typeof TheatreQuerySortStageSchema>;