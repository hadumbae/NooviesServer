/**
 * @fileoverview Type definitions for standardized aggregation query segments.
 * Provides a structured container for $match and $sort stages, categorized by
 * root-level (match) and relationship-level (reference) operations.
 */

import type {PipelineStage} from "mongoose";

/**
 * Standardized options for constructing an aggregation pipeline.
 */
export type AggregateQueryOptions = {
    match?: {
        filters?: PipelineStage.Match;
        sorts?: PipelineStage.Sort;
    };

    reference?: {
        filters?: PipelineStage.FacetPipelineStage[];
        sorts?: PipelineStage.FacetPipelineStage[];
    };
};