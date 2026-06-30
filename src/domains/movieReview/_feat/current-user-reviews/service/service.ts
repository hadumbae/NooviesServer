/**
 * @fileoverview Persistence service for current-user movie review operations.
 */
import type {
    CreateUserMovieReviewConfig,
    DeleteUserMovieReviewConfig,
    FetchPaginatedUserReviewsConfig,
    UpdateUserMovieReviewConfig
} from "@/domains/movieReview/_feat/current-user-reviews/service/service.types";
import {MovieReview} from "@/domains/movieReview/model/model/MovieReview.model";
import {MovieReviewPopulatePaths} from "@/domains/movieReview/_feat/query-population/MovieReviewPopulatePaths.js";
import populateQuery from "@/shared/utility/mongoose/populateQuery.js";
import {handlePersistenceQuery} from "@/shared/utility/mongoose/handlePersistenceQuery.js";
import {handleMovieReviewDuplicateIndex} from "@/domains/movieReview/_feat/handle-query/handleMovieReviewDuplicateIndex";
import type {
    MovieReviewSchemaFields,
    MyMovieReviewSchemaFields
} from "@/domains/movieReview/model/model/MovieReview.types";
import createHttpError from "http-errors";
import {DocumentVersionError} from "@/shared/errors/DocumentVersionError.js";
import type {PaginationReturns} from "@/shared/types/PaginationReturns.js";
import {
    MovieReviewPopulationPipelines
} from "@/domains/movieReview/_feat/query-population/MovieReviewPopulationPipelines.js";
import {Types} from "mongoose";
import {checkMovieReviewOwnership} from "@/domains/movieReview/_feat/check-ownership";

/** Fetches a single movie review enriched for the current user's view. */
export const fetchCurrentUserMovieReview = async (
    reviewID: Types.ObjectId
): Promise<MyMovieReviewSchemaFields> => {
    const [results] = await MovieReview.aggregate<MyMovieReviewSchemaFields>([
        {$match: {_id: reviewID}},
        {$addFields: {helpfulCount: {$size: "$helpfulLikes"}}},
        {$project: {helpfulLikes: 0}},
        ...MovieReviewPopulationPipelines,
    ]);

    return results;
}

/** Fetches a paginated list of movie reviews authored by a specific user. */
export const fetchCurrentUserMovieReviewList = async (
    {userID, page, perPage}: FetchPaginatedUserReviewsConfig
): Promise<PaginationReturns<MovieReviewSchemaFields>> => {
    const [results] = await MovieReview.aggregate<PaginationReturns<MovieReviewSchemaFields>>([
        {$match: {user: userID}},
        {
            $facet: {
                totalCount: [{$count: "count"}],
                items: [
                    {$sort: {createdAt: -1}},
                    {$skip: perPage * (page - 1)},
                    {$limit: perPage},
                    ...MovieReviewPopulationPipelines,
                    {$addFields: {helpfulCount: {$size: "$helpfulLikes"}}},
                    {$project: {helpfulLikes: 0}},
                ],
            },
        },
        {
            $project: {
                totalItems: {$ifNull: [{$arrayElemAt: ["$totalCount.count", 0]}, 0]},
                items: 1,
            },
        },
    ]);

    return results;
}

/** Creates a new movie review for the authenticated user. */
export async function createMovieReviewForCurrentUser(
    {userID, data, options}: CreateUserMovieReviewConfig
): Promise<MovieReviewSchemaFields> {
    const userReviewData = {...data, user: userID};

    const doc = await handlePersistenceQuery({
        query: () => MovieReview.create(userReviewData),
        onDuplicateIndexError: handleMovieReviewDuplicateIndex,
    });

    const query = populateQuery({
        query: MovieReview.findById(doc._id),
        config: {...options, populatePaths: MovieReviewPopulatePaths},
    });

    return query.orFail();
}

/** Updates an existing movie review authored by the current user. */
export async function updateMovieReviewForCurrentUser(
    {userID, reviewID, data, unset, options}: UpdateUserMovieReviewConfig
): Promise<MovieReviewSchemaFields> {
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
        config: {...options, populatePaths: MovieReviewPopulatePaths}
    });

    return updatedQuery.orFail();
}

/** Deletes a movie review authored by the current user. */
export async function deleteMovieReviewForCurrentUser(
    {userID, reviewID}: DeleteUserMovieReviewConfig
): Promise<void> {
    const review = await MovieReview.findById(reviewID).orFail();

    const isOwner = checkMovieReviewOwnership({userID, reviewID});
    if (!isOwner) throw createHttpError(403, "Invalid User, Can Only Delete Owned Review.");

    await review.deleteOne();
}