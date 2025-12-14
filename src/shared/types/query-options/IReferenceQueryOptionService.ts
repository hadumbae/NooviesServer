import type {
    PopulationPipelineStages,
    ReferenceFilterPipelineStages,
    ReferenceSortPipelineStages
} from "../mongoose/AggregatePipelineStages.js";
import type IQueryOptionService from "./IQueryOptionService.js";

/**
 * Interface for query option services that support reference-based filters
 * and population pipelines in addition to standard match filters.
 *
 * Extends `IQueryOptionService` with methods for generating MongoDB
 * aggregation stages related to references and population.
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
     * Generates aggregation pipeline stages for applying reference-based filters
     * based on the provided query options.
     *
     * @param params - The query options containing reference filter criteria.
     * @returns Aggregation pipeline stages that filter documents based on references.
     */
    generateReferenceFilters(params: TOptions): ReferenceFilterPipelineStages;

    generateReferenceSorts(params: TOptions): ReferenceSortPipelineStages;

    /**
     * Generates aggregation pipeline stages for populating references in the schema.
     *
     * @returns Aggregation pipeline stages for population.
     */
    generatePopulationPipelines(): PopulationPipelineStages;
}
