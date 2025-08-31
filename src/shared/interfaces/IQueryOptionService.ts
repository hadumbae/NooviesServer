import type {Request} from "express";
import type {FilterQuery, SortOrder} from "mongoose";

/**
 * Generic service interface for handling query options derived from URL parameters.
 *
 * Designed for use with Express controllers and Mongoose queries, where
 * incoming request query parameters need to be:
 * - Extracted and validated into a strongly typed options object
 * - Transformed into Mongoose filter queries
 * - Transformed into Mongoose sort specifications
 *
 * @typeParam TModel   - The Mongoose model type (schema interface) being queried.
 * @typeParam TOptions - The validated query options type (typically inferred from a Zod schema).
 * @typeParam TFilters - The filter fields type, describing which properties can be filtered.
 */
export default interface IQueryOptionService<TModel, TOptions, TFilters> {
    /**
     * Extracts and validates query parameters from an Express request,
     * returning them as a strongly typed `TOptions` object.
     *
     * @param req - The incoming Express request.
     * @returns A validated query options object.
     *
     * @example
     * ```ts
     * const options = service.fetchQueryParams(req);
     * // => { roleName: "Engineer", sortByDepartment: 1 }
     * ```
     */
    fetchQueryParams(req: Request): TOptions;

    /**
     * Converts the validated query options into a Mongoose filter object,
     * used for the `.find()` method.
     *
     * @param options - The validated query options.
     * @returns A Mongoose `FilterQuery` object that can be passed to `.find()`.
     *
     * @example
     * ```ts
     * const filters = service.generateMatchFilters(options);
     * // => { roleName: "Engineer", department: "IT" }
     * ```
     */
    generateMatchFilters(options: TOptions): FilterQuery<TFilters>;

    /**
     * Converts the validated query options into a Mongoose sort specification,
     * used for the `.sort()` method.
     *
     * @param options - The validated query options.
     * @returns A partial mapping of model keys to sort order (`1` for ascending, `-1` for descending).
     *
     * @example
     * ```ts
     * const sorts = service.generateQuerySorts(options);
     * // => { roleName: 1, department: -1 }
     * ```
     */
    generateQuerySorts(options: TOptions): Partial<Record<keyof TModel, SortOrder>>;
}