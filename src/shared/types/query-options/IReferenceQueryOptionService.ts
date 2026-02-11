/**
 * @file IReferenceQueryOptionService.ts
 * @summary Interface for query option services supporting reference-based filters and population pipelines.
 *
 * @description
 * Extends `IQueryOptionService` to add methods for generating MongoDB aggregation stages
 * that handle references and population, in addition to standard `$match` filters and `$sort` options.
 *
 * This interface is useful for services managing documents that have relationships
 * to other collections, allowing consistent handling of both direct and referenced queries.
 */

import type {
    ReferenceFilterPipelineStages,
    ReferenceSortPipelineStages
} from "../mongoose/AggregatePipelineStages.js";
import type IQueryOptionService from "./IQueryOptionService.js";

/**
 * Interface for query option services with reference-aware pipelines.
 *
 * @template TSchema - The type of the underlying Mongoose schema.
 * @template TOptions - The type representing query options (filters, sorts, etc.).
 * @template TMatchFilters - The type representing match filters for the schema.
 *
 * @example
 * ```ts
 * class SeatMapReferenceQueryService implements IReferenceQueryOptionService<SeatMapSchemaFields, SeatMapQueryOptions, SeatMapMatchFilters> {
 *   generateReferenceFilters(params: SeatMapQueryOptions): ReferenceFilterPipelineStages {
 *     // implementation
 *   }
 *
 *   generatePopulationPipelines(): PopulationPipelineStages {
 *     // implementation
 *   }
 * }
 * ```
 */
export default interface IReferenceQueryOptionService<TSchema, TOptions, TMatchFilters>
    extends IQueryOptionService<TSchema, TOptions, TMatchFilters> {
    /**
     * Generates aggregation pipeline stages for applying reference-based filters.
     *
     * @param params - Query options containing reference filter criteria.
     * @returns Aggregation pipeline stages that filter documents based on references.
     */
    generateReferenceFilters(params: TOptions): ReferenceFilterPipelineStages;

    /**
     * Generates aggregation pipeline stages for sorting based on references.
     *
     * @param params - Query options containing reference sort criteria.
     * @returns Aggregation pipeline stages for sorting documents based on references.
     */
    generateReferenceSorts(params: TOptions): ReferenceSortPipelineStages;
}
