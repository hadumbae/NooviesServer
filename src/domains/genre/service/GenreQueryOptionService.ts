import type {Request} from "express";
import type {GenreQueryFilters, GenreQueryOptions} from "../schema/options/GenreFilters.types.js";
import type {FilterQuery, SortOrder} from "mongoose";
import {GenreQueryOptionsSchema} from "../schema/options/GenreFilters.schema.js";
import filterNullArray from "../../../shared/utility/filterNullArray.js";
import type IGenre from "../model/Genre.interface.js";

/**
 * Service interface for building genre query options,
 * including parsing request parameters, generating MongoDB match filters,
 * and generating sort configurations.
 */
interface IGenreQueryOptionService {
    /**
     * Parses and validates query parameters from the request object
     * into a {@link GenreQueryOptions} instance.
     *
     * @param req - Express request containing query parameters.
     * @returns A validated {@link GenreQueryOptions} object.
     */
    fetchQueryParams(req: Request): GenreQueryOptions;

    /**
     * Builds a MongoDB match filter object from validated query options.
     *
     * @param params - Validated genre query options.
     * @returns A MongoDB {@link FilterQuery} to match genre documents.
     */
    generateMatchFilters(params: GenreQueryOptions): FilterQuery<GenreQueryFilters>;

    /**
     * Builds a MongoDB sort object from validated query options.
     *
     * @param params - Validated genre query options.
     * @returns A partial record mapping {@link IGenre} keys to {@link SortOrder}.
     */
    generateQuerySorts(params: GenreQueryOptions): Partial<Record<keyof IGenre, SortOrder>>;
}

/**
 * Implementation of {@link IGenreQueryOptionService} that
 * uses {@link GenreQueryOptionsSchema} for validation and
 * builds MongoDB filter/sort configurations for genre queries.
 */
export default class GenreQueryOptionService implements IGenreQueryOptionService {
    /**
     * Parses and validates query parameters from the request object
     * into a {@link GenreQueryOptions} instance.
     *
     * Uses {@link GenreQueryOptionsSchema} to validate and `filterNullArray` to strip nullish values.
     *
     * @param req - Express request containing query parameters.
     * @returns A validated {@link GenreQueryOptions} object.
     */
    fetchQueryParams(req: Request): GenreQueryOptions {
        const conditions = GenreQueryOptionsSchema.parse(req.query);
        return filterNullArray(conditions) as GenreQueryOptions;
    }

    /**
     * Generates MongoDB match filters for genre queries.
     *
     * Example:
     * ```ts
     * // params: { name: "rock" }
     * // returns: { name: { $regex: "rock", $options: "i" } }
     * ```
     *
     * @param params - Validated genre query options.
     * @returns A {@link FilterQuery} with MongoDB regex match for name (case-insensitive).
     */
    generateMatchFilters(params: GenreQueryOptions): FilterQuery<GenreQueryFilters> {
        const { name } = params;

        const filters = {
            name: name && { $regex: name, $options: "i" },
        };

        return filterNullArray(filters);
    }

    /**
     * Generates MongoDB sort configuration for genre queries.
     *
     * Example:
     * ```ts
     * // params: { sortByName: 1 }
     * // returns: { name: 1 }
     * ```
     *
     * @param params - Validated genre query options.
     * @returns Partial record mapping {@link IGenre} fields to sort order values.
     */
    generateQuerySorts(params: GenreQueryOptions): Partial<Record<keyof IGenre, SortOrder>> {
        const { sortByName } = params;

        const sorts: Partial<Record<keyof IGenre, SortOrder | undefined>> = {
            name: sortByName,
        };

        return filterNullArray(sorts);
    }
}