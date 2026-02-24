/**
 * @file MovieReview create input schema.
 * MovieReviewCreateInputSchema.ts
 */

import { z } from "zod";
import { ObjectIdSchema } from "../../../shared/schema/mongoose/ObjectIdSchema.js";
import { MovieReviewUpdateInputSchema } from "./MovieReviewUpdateInputSchema.js";

/**
 * Input schema for creating MovieReview records.
 */
export const MovieReviewCreateInputSchema = MovieReviewUpdateInputSchema.extend({
    movie: ObjectIdSchema,
});

/**
 * Inferred type for create input data.
 */
export type MovieReviewCreateInputData = z.infer<typeof MovieReviewCreateInputSchema>;