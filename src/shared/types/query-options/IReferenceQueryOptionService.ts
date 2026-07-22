/**
 * @fileoverview Service interface for generating MongoDB pipeline stages for referenced document queries.
 */

import type IQueryOptionService from "./IQueryOptionService.js";
import type {ReferenceFilterPipelineStages, ReferenceSortPipelineStages} from "@/shared/_types";

/** Service for building filter and sort pipeline stages for related database entities. */
export default interface IReferenceQueryOptionService<TSchema, TOptions, TMatchFilters> extends IQueryOptionService<TSchema, TOptions, TMatchFilters> {
    /** Generates an array of aggregation stages for filtering referenced documents. */
    generateReferenceFilters(params: TOptions): ReferenceFilterPipelineStages;
    /** Generates an array of aggregation stages for sorting referenced documents. */
    generateReferenceSorts(params: TOptions): ReferenceSortPipelineStages;
}
