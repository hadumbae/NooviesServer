import type {Request} from 'express';
import {type FilterQuery, type SortOrder} from "mongoose";
import filterNullishAttributes from "../../../shared/utility/filterNullishAttributes.js";
import {MovieQueryOptionsSchema} from "../schema/query/MovieQueryOption.schema.js";
import type IQueryOptionService from "../../../shared/types/query-options/IQueryOptionService.js";
import type {MovieQueryMatchFilters, MovieQueryOptions} from "../schema/query/MovieQueryOption.types.js";
import type {QueryOptionTypes} from "../../../shared/types/query-options/QueryOptionService.types.js";
import type {MovieSchemaFields} from "../model/Movie.types.js";

/**
 * Service for parsing, validating, and converting query parameters
 * into Mongoose-compatible filters and sorts for {@link MovieSchemaFields} documents.
 *
 * Implements {@link IQueryOptionService} to provide a consistent interface
 * for fetching query parameters and generating query options.
 */
export default class MovieQueryOptionService implements IQueryOptionService<MovieSchemaFields, MovieQueryOptions, MovieQueryMatchFilters> {

    /**
     * Parses and validates query parameters from an Express request.
     * Removes null or undefined values from the resulting object.
     *
     * @param req - Express request object containing query parameters
     * @returns Validated and cleaned {@link MovieQueryOptions} object
     *
     * @example
     * // GET /movies?title=Matrix&genres=Action
     * const options = service.fetchQueryParams(req);
     */
    fetchQueryParams(req: Request): MovieQueryOptions {
        const params = MovieQueryOptionsSchema.parse(req.query);

        return filterNullishAttributes(params);
    }

    /**
     * Generates Mongoose filter conditions based on {@link MovieQueryOptions}.
     * Automatically converts string fields to regex for case-insensitive matching,
     * and handles array inclusion for genres.
     *
     * @param options - Parsed movie query options
     * @returns A {@link FilterQuery} object for Mongoose queries
     *
     * @example
     * const filters = service.generateMatchFilters({title: "Matrix", genres: ["Action"]});
     * // filters: { title: { $regex: "Matrix", $options: "i" }, genres: { $in: ["Action"] } }
     */
    generateMatchFilters(options: MovieQueryOptions): FilterQuery<MovieQueryMatchFilters> {
        const {_id, title, releaseDate, genres, originalTitle, isReleased, country, isAvailable} = options;

        const conditions = {
            _id,
            releaseDate,
            title: title && {$regex: title, $options: "i"},
            genres: genres && {$all: genres},
            originalTitle,
            isReleased,
            isAvailable,
            country,
        };

        return filterNullishAttributes(conditions);
    }

    /**
     * Generates sorting options for Mongoose queries based on {@link MovieQueryOptions}.
     * Only includes fields with non-null sort orders.
     *
     * @param options - Movie query options containing sort fields
     * @returns Partial record mapping {@link MovieSchemaFields} fields to {@link SortOrder}
     *
     * @example
     * const sorts = service.generateMatchSorts({sortByTitle: 1, sortByReleaseDate: -1});
     * // sorts: { title: 1, releaseDate: -1 }
     */
    generateMatchSorts(options: MovieQueryOptions): Partial<Record<keyof MovieSchemaFields, SortOrder>> {
        const {
            sortByReleaseDate,
            sortByTitle,
            sortByOriginalTitle,
            sortByIsReleased,
            sortByIsAvailable,
            sortByCountry,
        } = options;

        const sorts = {
            releaseDate: sortByReleaseDate,
            title: sortByTitle,
            originalTitle: sortByOriginalTitle,
            isReleased: sortByIsReleased,
            isAvailable: sortByIsAvailable,
            country: sortByCountry,
        };

        return filterNullishAttributes(sorts);
    }

    /**
     * Combines match filters and sorts into a structured query options object.
     *
     * @param options - Validated {@link MovieQueryOptions}
     * @returns {@link QueryOptionTypes} object containing `match` filters and sorts
     *
     * @example
     * const queryOptions = service.generateQueryOptions({title: "Matrix", sortByReleaseDate: 1});
     * // queryOptions: { match: { filters: { title: /Matrix/i }, sorts: { releaseDate: 1 } } }
     */
    generateQueryOptions(options: MovieQueryOptions): QueryOptionTypes<MovieSchemaFields, MovieQueryMatchFilters> {
        const matchFilters = this.generateMatchFilters(options);
        const matchSorts = this.generateMatchSorts(options);

        return {
            match: {filters: matchFilters, sorts: matchSorts},
        };
    }
}
