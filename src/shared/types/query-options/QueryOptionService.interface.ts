import type { Request } from "express";
import type { FilterQuery} from "mongoose";
import type { QueryOptionTypes, SortQuery } from "./QueryOptionService.types.js";

/**
 * Interface for services that parse query parameters from requests
 * and generate structured Mongoose filter and sort objects.
 *
 * @template TSchema - The schema type used for sorting.
 * @template TOptions - The type of raw query parameters extracted from the request.
 * @template TMatchFilters - The type of the root entity filters.
 * @template TReferenceFilters - The type of reference/populated entity filters.
 *
 * @remarks
 * This interface is typically implemented by domain-specific services
 * to transform Express request query parameters into Mongoose-compatible
 * filters and sorts for both root documents and referenced documents.
 */
export default interface IQueryOptionService<
    TSchema,
    TOptions,
    TMatchFilters,
> {
    /**
     * Extracts query parameters from an Express request.
     *
     * @param req - The Express request object.
     * @returns The raw query parameters as a structured {@link TOptions} object.
     */
    fetchQueryParams(req: Request): TOptions;

    /**
     * Generates Mongoose filters for the root entity from query options.
     *
     * @param options - Parsed query parameters.
     * @returns A {@link FilterQuery} for filtering the root entity.
     */
    generateMatchFilters(options: TOptions): FilterQuery<TMatchFilters>;

    /**
     * Generates sort rules for the root entity based on query options.
     *
     * @param options - Parsed query parameters.
     * @returns A {@link SortQuery} mapping fields to sort orders.
     */
    generateMatchSorts(options: TOptions): SortQuery<TSchema>;

    /**
     * Combines filters and sorts for both root and reference entities
     * into a single {@link QueryOptionTypes} object.
     *
     * @param options - Parsed query parameters.
     * @returns Structured query options including `match` and `reference`.
     */
    generateQueryOptions(options: TOptions): QueryOptionTypes<TSchema, TMatchFilters>;
}
