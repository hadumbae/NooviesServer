/**
 * @file Query option service for MovieReview filtering and sorting.
 * MovieReviewQueryOptionService.ts
 */

import type {Request} from "express";
import type IQueryOptionService from "../../../../shared/types/query-options/IQueryOptionService.js";
import type {MovieReviewSchemaFields} from "../../model/MovieReview.types.js";
import {type MovieReviewQueryOptions, MovieReviewQueryOptionSchema} from "../../schema/query-options/MovieReviewQueryOptionSchema.js";
import type {MovieReviewMatchQueryFilters,} from "../../schema/query-options/MovieReviewMatchQuerySchemas.js";
import InvalidQueryOptionError from "../../../../shared/errors/InvalidQueryOptionError.js";
import {MovieReview} from "../../model/MovieReview.model.js";
import filterNullishAttributes from "../../../../shared/utility/filterNullishAttributes.js";
import type {FilterQuery, SortOrder} from "mongoose";
import type {QueryOptionTypes} from "../../../../shared/types/query-options/QueryOptionService.types.js";

/**
 * Maps validated MovieReview query parameters to Mongoose
 * match filters and sort options.
 */
export class MovieReviewQueryOptionService
    implements IQueryOptionService<MovieReviewSchemaFields, MovieReviewQueryOptions, MovieReviewMatchQueryFilters> {

    /**
     * Parses and validates query parameters from the request.
     */
    fetchQueryParams(req: Request): MovieReviewQueryOptions {
        const {success, error, data} = MovieReviewQueryOptionSchema.safeParse(req.query);

        if (!success) {
            throw new InvalidQueryOptionError({
                modelName: MovieReview.modelName,
                errors: error.errors,
            });
        }

        return filterNullishAttributes(data);
    }

    /**
     * Generates Mongoose match filter conditions.
     */
    generateMatchFilters(
        {movieID, rating, isRecommended}: MovieReviewQueryOptions
    ): FilterQuery<MovieReviewMatchQueryFilters> {
        const conditions = {
            movie: movieID,
            rating,
            isRecommended,
        };

        return filterNullishAttributes(conditions);
    }

    /**
     * Generates Mongoose match sort conditions.
     */
    generateMatchSorts(
        {sortByRating}: MovieReviewQueryOptions
    ): Partial<Record<keyof MovieReviewSchemaFields, SortOrder>> {
        const sorts = {
            rating: sortByRating,
        };

        return filterNullishAttributes(sorts);
    }

    /**
     * Generates query option configuration for persistence queries.
     */
    generateQueryOptions(
        options: MovieReviewQueryOptions
    ): QueryOptionTypes<MovieReviewSchemaFields, MovieReviewMatchQueryFilters> {
        return {
            match: {
                filters: this.generateMatchFilters(options),
                sorts: this.generateMatchSorts(options),
            }
        }
    }
}