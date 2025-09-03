import type {Request} from 'express';
import {type FilterQuery, type SortOrder} from "mongoose";
import filterNullArray from "../../../shared/utility/filterNullArray.js";
import {MovieQueryOptionsSchema} from "../schema/query/MovieFilters.schema.js";
import type IQueryOptionService from "../../../shared/interfaces/IQueryOptionService.js";
import type IMovie from "../model/Movie.interface.js";
import type {MovieQueryFilters, MovieQueryOptions} from "../schema/query/MovieFilters.types.js";

/**
 * Service responsible for parsing query options from requests
 * and generating Mongoose-compatible query filters and sort objects
 * for the `Movie` model.
 *
 * Implements {@link IQueryOptionService}.
 */
export default class MovieQueryOptionService implements IQueryOptionService<IMovie, MovieQueryOptions, MovieQueryFilters> {
    /**
     * Parses query parameters from an Express request and returns
     * a validated `MovieQueryOptions` object.
     *
     * Filters out any null or undefined values.
     *
     * @param req - The Express request object
     * @returns A validated and filtered {@link MovieQueryOptions} object
     */
    fetchQueryParams(req: Request): MovieQueryOptions {
        const params = MovieQueryOptionsSchema.parse(req.query);
        return filterNullArray(params);
    }

    /**
     * Generates Mongoose-compatible match filters based on query options.
     *
     * Supports exact matches for `_id` and `releaseDate`,
     * regex-based case-insensitive matches for `title`,
     * and `$in` filters for `genres`.
     *
     * @param options - The validated {@link MovieQueryOptions}
     * @returns A {@link FilterQuery} object usable in Mongoose queries
     */
    generateMatchFilters(options: MovieQueryOptions): FilterQuery<MovieQueryFilters> {
        const { _id, title, releaseDate, genres } = options;

        const conditions = {
            _id,
            releaseDate,
            title: title && { $regex: title, $options: "i" },
            genres: genres && { genres: { $in: genres } },
        };

        return filterNullArray(conditions);
    }

    /**
     * Generates Mongoose-compatible sort options for querying movies.
     *
     * @param options - The validated {@link MovieQueryOptions}
     * @returns A partial record mapping movie fields to {@link SortOrder} ('asc' | 'desc')
     */
    generateQuerySorts(options: MovieQueryOptions): Partial<Record<keyof IMovie, SortOrder>> {
        const { sortByReleaseDate, sortByTitle } = options;

        const sorts = {
            releaseDate: sortByReleaseDate,
            title: sortByTitle,
        };

        return filterNullArray(sorts);
    }
}