/**
 * @file Persistence service for current-user MovieReview operations.
 * MyMovieReviewService.ts
 */

import type {
    CreateUserMovieReviewParams,
    DeleteUserMovieReviewParams,
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
 * Fetches paginated MovieReviews for a user.
 *
 * Applies optional population and virtual configuration.
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
 * Creates a MovieReview scoped to a user.
 *
 * Handles duplicate index errors and returns a populated document.
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
 * Updates a user-owned MovieReview.
 *
 * Enforces ownership, retries on persistence conflicts,
 * and maps version errors to DocumentVersionError.
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

/**
 * Deletes a user-owned MovieReview.
 *
 * Throws if the document does not exist or ownership validation fails.
 */
export const deleteMovieReviewForCurrentUser = async (
    {userID, reviewID}: DeleteUserMovieReviewParams
): Promise<void> => {
    const review = await MovieReview.findById(reviewID).orFail();

    const isOwner = checkMovieReviewOwnership({userID, reviewID});
    if (!isOwner) throw createHttpError(403, "Invalid User, Can Only Delete Owned Review.");

    await review.deleteOne();
}