/**
 * @fileoverview Zod schema for validating and normalizing movie review query sort stages.
 */

import {z} from "zod";
import {MovieReviewQueryMatchSortSchema} from "@domains/movieReview/_feat/validate-query-options/query-schemas";
import {normaliseQuerySortValues} from "@shared/_feat/pipeline-schema-transformers";

/** Zod schema that transforms raw movie review sort parameters into a normalized Mongoose sort object. */
export const MovieReviewQuerySortStageSchema = MovieReviewQueryMatchSortSchema.transform(normaliseQuerySortValues);

/** Type definition for the validated movie review query sort stage. */
export type MovieReviewQuerySortStage = z.infer<typeof MovieReviewQuerySortStageSchema>;