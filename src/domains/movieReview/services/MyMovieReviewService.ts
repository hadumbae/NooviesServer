/**
 * @file Persistence service for current-user MovieReview operations.
 * @filename MyMovieReviewService.ts
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
import {MovieReviewPopulationPipelines} from "../queries/MovieReviewPopulationPipelines.js";

/**
 * Fetches a paginated list of movie reviews authored by a specific user.
 * @param params - User ID and pagination values.
 * @returns A {@link PaginationReturns} object containing items and total count.
 */
export const fetchCurrentUserMovieReviews = async (
    {userID, page, perPage}: FetchPaginatedUserReviewsParams
): Promise<PaginationReturns<MovieReviewSchemaFields>> => {
    const [results] = await MovieReview.aggregate<PaginationReturns<MovieReviewSchemaFields>>([
        { $match: { user: userID } },
        {
            $facet: {
                totalCount: [{ $count: "count" }],
                items: [
                    { $sort: { createdAt: -1 } },
                    { $skip: perPage * (page - 1) },
                    { $limit: perPage },
                    ...MovieReviewPopulationPipelines,
                    { $addFields: { helpfulCount: { $size: "$helpfulLikes" } } },
                    { $project: { helpfulLikes: 0 } },
                ],
            },
        },
        {
            $project: {
                totalItems: { $ifNull: [{ $arrayElemAt: ["$totalCount.count", 0] }, 0] },
                items: 1,
            },
        },
    ]);

    return results;
}

/**
 * Creates a new movie review for the authenticated user.
 * @param params - User ID, review data, and population options.
 * @returns Returns a fully populated document according to {@link MovieReviewPopulatePaths}.
 */
export const createMovieReviewForCurrentUser = async (
    {userID, data, options}: CreateUserMovieReviewParams
): Promise<MovieReviewSchemaFields> => {
    const userReviewData = { ...data, user: userID };

    const doc = await handlePersistenceQuery({
        query: () => MovieReview.create(userReviewData),
        onDuplicateIndexError: handleMovieReviewDuplicateIndex,
    });

    const query = populateQuery({
        query: MovieReview.findById(doc._id),
        options: { ...options, populatePaths: MovieReviewPopulatePaths },
    });

    return query.orFail();
}

/**
 * Updates an existing movie review authored by the current user.
 * @param params - Target ID, update data, unset fields, and population options.
 * @throws {HttpResponseError} 403 if user does not own the review.
 * @returns Returns a fully populated document according to {@link MovieReviewPopulatePaths}.
 */
export const updateMovieReviewForCurrentUser = async (
    {userID, reviewID, data, unset, options}: UpdateUserMovieReviewParams
): Promise<MovieReviewSchemaFields> => {
    const isOwner = checkMovieReviewOwnership({ userID, reviewID });
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
        options: { ...options, populatePaths: MovieReviewPopulatePaths }
    });

    return updatedQuery.orFail();
}

/**
 * Deletes a movie review authored by the current user.
 * @param params - User ID and the target Review ID.
 * @throws {HttpResponseError} 403 if ownership check fails.
 */
export const deleteMovieReviewForCurrentUser = async (
    {userID, reviewID}: DeleteUserMovieReviewParams
): Promise<void> => {
    const review = await MovieReview.findById(reviewID).orFail();

    const isOwner = checkMovieReviewOwnership({ userID, reviewID });
    if (!isOwner) throw createHttpError(403, "Invalid User, Can Only Delete Owned Review.");

    await review.deleteOne();
}