import type { FilterQuery, SortOrder } from "mongoose";
import type { ReferenceFilterPipelineStages, ReferenceSortPipelineStages } from "../mongoose/AggregatePipelineStages.js";

/**
 * Represents a sort query for a given schema.
 *
 * @template TSchema - The Mongoose schema or object type being sorted.
 *
 * @remarks
 * - `Partial<Record<keyof TSchema, SortOrder>>` allows specifying sort orders
 *   for fields defined in the schema.
 * - `Record<string, unknown>` allows additional dynamic or virtual fields
 *   to be included in the sort query.
 */
export type SortQuery<TSchema> =
    Partial<Record<keyof TSchema, SortOrder>> &
    Record<string, unknown>;

/**
 * Represents query options for the root entity including filters and sorting rules.
 *
 * @template TSchema - The schema type used for sorting.
 * @template TFilters - The type of the root entity being filtered.
 */
export type QueryMatchOptions<TSchema, TFilters> = {
    /**
     * Filter conditions to restrict query results.
     * Can use any valid Mongoose {@link FilterQuery} for the entity type.
     */
    filters: FilterQuery<TFilters>;

    /**
     * Sorting rules applied to the query results.
     * Keys are schema fields or dynamic properties, values are {@link SortOrder}.
     */
    sorts: SortQuery<TSchema>;
}

/**
 * Represents query options for referenced or populated entities.
 *
 * @remarks
 * - `filters` are expressed as aggregation pipeline stages for references.
 * - `sorts` are expressed as aggregation pipeline stages for references.
 */
export type QueryReferenceOptions = {
    filters: ReferenceFilterPipelineStages;
    sorts: ReferenceSortPipelineStages;
}

/**
 * Represents a complete set of query options, including root-level and reference-level queries.
 *
 * @template TSchema - The schema type used for sorting.
 * @template TMatchFilters - Type of filters applied to the root entity.
 * @template TReferenceFilters - Type of filters applied to referenced or populated entities.
 *
 * @remarks
 * - Either `match` or `reference` must be present; both are optional individually.
 * - `match` applies to root-level documents.
 * - `reference` applies to related/populated collections.
 *
 * @example
 * // Only root-level query options
 * const queryOptions1: QueryOptionTypes<MovieSchema, MovieFilters, PersonFilters> = {
 *   match: { filters: { title: /Star/ }, sorts: { releaseDate: -1 } }
 * };
 *
 * // Only reference-level query options
 * const queryOptions2: QueryOptionTypes<MovieSchema, MovieFilters, PersonFilters> = {
 *   reference: { filters: [{ $match: { name: /Tom/ } }], sorts: [{ $sort: { age: 1 } }] }
 * };
 *
 * // Both root-level and reference-level query options
 * const queryOptions3: QueryOptionTypes<MovieSchema, MovieFilters, PersonFilters> = {
 *   match: { filters: { genre: "Action" }, sorts: { releaseDate: -1 } },
 *   reference: { filters: [{ $match: { nationality: "US" } }], sorts: [{ $sort: { name: 1 } }] }
 * };
 */
export type QueryOptionTypes<
    TSchema,
    TMatchFilters,
    TReferenceFilters
> = {
    match: QueryMatchOptions<TSchema, TMatchFilters>;
    reference?: QueryReferenceOptions;
} | {
    match?: QueryMatchOptions<TSchema, TMatchFilters>;
    reference: QueryReferenceOptions;
};
