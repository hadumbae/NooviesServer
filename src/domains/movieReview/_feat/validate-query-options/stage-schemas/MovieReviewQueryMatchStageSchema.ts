/**
 * @fileoverview Defines the Zod schema for the movie review query match stage.
 */

import {z} from "zod";
import {
    MovieReviewQueryMatchFilterSchema
} from "@domains/movieReview/_feat/validate-query-options/query-schemas/MovieReviewQueryMatchFilterSchema";
import {normaliseQueryMatchValues} from "@shared/_feat/pipeline-schema-transformers";

/** Zod schema that transforms movie review filters into a normalized match stage. */
export const MovieReviewQueryMatchStageSchema = MovieReviewQueryMatchFilterSchema.transform(normaliseQueryMatchValues);

/** Type definition for the validated movie review query match stage. */
export type MovieReviewQueryMatchStage = z.infer<typeof MovieReviewQueryMatchStageSchema>;