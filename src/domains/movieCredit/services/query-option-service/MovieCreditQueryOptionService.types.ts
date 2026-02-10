import type IQueryOptionService from "../../../../shared/types/query-options/IQueryOptionService.js";
import type {IMovieCredit} from "../../models/MovieCredit.interface.js";
import type {
    MovieCreditQueryMatchFilters,
    MovieCreditQueryOptions
} from "../../schemas/query/MovieCreditQueryOption.types.js";
import type {
    ReferenceFilterPipelineStages
} from "../../../../shared/types/mongoose/AggregatePipelineStages.js";

/**
 * MovieCredit-specific query option service contract.
 *
 * @remarks
 * Extends the generic {@link IQueryOptionService} with support for
 * reference-based filtering and population pipelines.
 */
export interface MovieCreditQueryOptionMethods
    extends IQueryOptionService<IMovieCredit, MovieCreditQueryOptions, MovieCreditQueryMatchFilters> {

    /**
     * Generates aggregation pipeline stages for applying
     * reference-based filters (e.g. movie slug, role name).
     *
     * @param params - Validated query options.
     * @returns Aggregation pipeline stages for reference filtering.
     */
    generateReferenceFilters(params: MovieCreditQueryOptions): ReferenceFilterPipelineStages;
}