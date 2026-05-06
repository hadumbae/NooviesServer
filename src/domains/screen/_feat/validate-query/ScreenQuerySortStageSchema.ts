/**
 * @fileoverview Zod schema for transforming screen query sort parameters into a Mongoose sort stage.
 */

import {z} from "zod";
import {ScreenQueryMatchSortSchema} from "@domains/screen/_feat/validate-query/ScreenQueryMatchSortSchema";
import {normaliseQuerySortValues} from "@shared/_feat/pipeline-schema-transformers";

/** Zod schema that transforms screen query sort values into a Mongoose sort pipeline stage. */
export const ScreenQuerySortStageSchema = ScreenQueryMatchSortSchema.transform(normaliseQuerySortValues);

/** Inferred type representing the validated and transformed Mongoose sort stage for screens. */
export type ScreenQuerySortStage = z.infer<typeof ScreenQuerySortStageSchema>;