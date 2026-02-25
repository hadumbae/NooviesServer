/**
 * @file Maps MovieReview duplicate index errors to ZodDuplicateIndexError.
 * handleMovieReviewDuplicateIndex.ts
 */

import {ZodDuplicateIndexError} from "../../../shared/errors/zod/ZodDuplicateIndexError.js";
import {MovieReview} from "../model/MovieReview.model.js";

/**
 * Translates a MongoDB duplicate index string into a typed ZodDuplicateIndexError.
 *
 * @param indexString - The MongoDB duplicate index identifier.
 * @throws {ZodDuplicateIndexError} Always throws a mapped duplicate index error.
 */
export function handleMovieReviewDuplicateIndex(indexString: string): never {
    if (indexString === "user_1_movie_1") {
        throw new ZodDuplicateIndexError({
            index: indexString,
            model: MovieReview.modelName,
            message: "Duplicate movie review detected. Reviews must not have the same user and movie.",
            errors: [
                {
                    path: ["user"],
                    code: "custom",
                    message: "A movie review by user already exists for this movie."
                },
                {
                    path: ["movie"],
                    code: "custom",
                    message: "A movie review for this movie already exists by the user."
                }
            ],
        });
    }

    throw new ZodDuplicateIndexError({
        index: indexString,
        model: MovieReview.modelName,
        errors: [],
        message: "Movie review with duplicate indexes detected."
    });
}