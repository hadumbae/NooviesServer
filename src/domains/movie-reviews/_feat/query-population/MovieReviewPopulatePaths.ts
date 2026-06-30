/**
 * @fileoverview Defines the Mongoose population configuration for movie review queries.
 */

import type { PopulatePath } from "@/shared/types/mongoose/PopulatePath.js";

/** Population configuration for related MovieReview fields. */
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