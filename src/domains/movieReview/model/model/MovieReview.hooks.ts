/**
 * @fileoverview Pre-validation Mongoose middleware for the MovieReview collection.
 *
 */

import {MovieReviewSchema} from "@domains/movieReview/model/model/MovieReview.schema";
import type {HydratedDocument} from "mongoose";
import type {MovieReviewSchemaFields} from "@domains/movieReview/model/model/MovieReview.types";
import {generateMovieReviewUniqueCode} from "@domains/movieReview/_feat/handle-query/generateMovieReviewUniqueCode";
import generateSlug from "@shared/utility/generateSlug";

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