/**
 * @file Populate paths for MovieReview queries.
 * MovieReviewPopulatePaths.ts
 */

import type { PopulatePath } from "../../../shared/types/mongoose/PopulatePath.js";

/**
 * Population configuration for related MovieReview fields.
 */
export const MovieReviewPopulatePaths: PopulatePath[] = [
    {
        path: "movie",
        populate: { path: "genres" },
    },
    {
        path: "user",
        select: "name"
    }
];