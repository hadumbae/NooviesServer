/**
 * @file Pre-validation Mongoose middleware for the MovieReview collection.
 * @filename MovieReview.hooks.ts
 */

import {MovieReviewSchema} from "@domains/movieReview/model/MovieReview.schema";
import type {HydratedDocument} from "mongoose";
import type {MovieReviewSchemaFields} from "@domains/movieReview/model/MovieReview.types";
import {generateMovieReviewUniqueCode} from "@domains/movieReview/utilities/generateMovieReviewUniqueCode";
import generateSlug from "@shared/utility/generateSlug";

/**
 * Hook to automatically populate identifiers before Mongoose validation occurs.
 * ---
 */
MovieReviewSchema.pre(
    "validate",
    {document: true},
    function (this: HydratedDocument<MovieReviewSchemaFields>, next: () => void) {
        if (this.isNew) {
            /** Assign unique alphanumeric tracking code (e.g., REV-XXXXX-XXXXX) */
            this.uniqueCode = generateMovieReviewUniqueCode();

            /** Generate a URL-safe slug for the review resource */
            this.slug = generateSlug("review");
        }

        next();
    }
);