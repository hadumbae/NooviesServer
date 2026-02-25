/**
 * @file Current user MovieReview persistence service.
 * MyMovieReviewService.ts
 */

import type {
    CreateUserMovieReviewParams,
    FetchPaginatedUserReviewsParams,
    UpdateUserMovieReviewParams
} from "./MyMovieReviewService.types.js";
import {MovieReview} from "../model/MovieReview.model.js";
import {MovieReviewPopulatePaths} from "../queries/MovieReviewPopulatePaths.js";
import populateQuery from "../../../shared/utility/mongoose/populateQuery.js";
import {handlePersistenceQuery} from "../../../shared/utility/mongoose/handlePersistenceQuery.js";
import {handleMovieReviewDuplicateIndex} from "../utilities/handleMovieReviewDuplicateIndex.js";
import type {MovieReviewSchemaFields} from "../model/MovieReview.types.js";
import {checkMovieReviewOwnership} from "../utilities/checkMovieReviewOwnership.js";
import createHttpError from "http-errors";
import {DocumentVersionError} from "../../../shared/errors/DocumentVersionError.js";
import type {PaginationReturns} from "../../../shared/types/PaginationReturns.js";

/**
 * Retrieves paginated MovieReviews owned by the authenticated user.
 *
 * @returns Paginated MovieReview results.
 */
export const fetchCurrentUserMovieReviews = async (
    {userID, page, perPage, options}: FetchPaginatedUserReviewsParams
): Promise<PaginationReturns<MovieReviewSchemaFields>> => {
    const fetchQuery = MovieReview.find({user: userID})
        .skip((page - 1) * perPage)
        .limit(perPage);

    const populatedQuery = populateQuery({
        query: fetchQuery,
        options: {...options, populatePaths: MovieReviewPopulatePaths},
    });

    const [totalItems, items] = await Promise.all([
        MovieReview.countDocuments({user: userID}),
        populatedQuery,
    ]);

    return {
        totalItems,
        items,
    };
}

/**
 * Creates a MovieReview for the authenticated user.
 *
 * @returns The populated MovieReview.
 */
export const createMovieReviewForCurrentUser = async (
    {userID, data, options}: CreateUserMovieReviewParams
): Promise<MovieReviewSchemaFields> => {
    const userReviewData = {...data, user: userID};

    const doc = await handlePersistenceQuery({
        query: () => MovieReview.create(userReviewData),
        onDuplicateIndexError: handleMovieReviewDuplicateIndex,
    });

    const query = populateQuery({
        query: MovieReview.findById(doc._id),
        options: {...options, populatePaths: MovieReviewPopulatePaths},
    });

    return query.orFail();
}

/**
 * Updates an owned MovieReview with retry support for version conflicts.
 *
 * @returns The updated populated MovieReview.
 */
export const updateMovieReviewForCurrentUser = async (
    {userID, reviewID, data, unset, options}: UpdateUserMovieReviewParams
): Promise<MovieReviewSchemaFields> => {
    const isOwner = checkMovieReviewOwnership({userID, reviewID});
    if (!isOwner) throw createHttpError(403, "Invalid User, Can Only Update Owned Review.");

    const docToUpdate = await MovieReview.findById(reviewID).orFail();

    docToUpdate.set(data);
    if (unset) Object.keys(unset).forEach((key) => docToUpdate.set(key, undefined));

    await handlePersistenceQuery({
        query: () => docToUpdate.save(),
        retries: 3,
        modelName: MovieReview.modelName,
        onDuplicateIndexError: handleMovieReviewDuplicateIndex,
        onVersionError: () => {
            throw new DocumentVersionError({
                _id: reviewID,
                model: MovieReview.modelName,
                raw: data,
                message: "Document version error with movie review.",
            });
        },
    });

    const updatedQuery = populateQuery({
        query: MovieReview.findById(reviewID),
        options: {...options, populatePaths: MovieReviewPopulatePaths}
    });

    return updatedQuery.orFail();
}