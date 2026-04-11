/**
 * @file Utility for building standardized MongoDB pagination pipelines using the $facet stage.
 * @filename buildPaginationPipelines.ts
 */

import type {PipelineStage} from "mongoose";

/**
 * Configuration for the pagination pipeline builder.
 */
export type BuildPaginationPipelinesConfig = {
    /** The sequence of stages used to process, sort, and slice the actual data records. */
    innerStages: PipelineStage.FacetPipelineStage[];
};

/**
 * Wraps a set of pipeline stages in a $facet to simultaneously calculate total counts and retrieve data.
 * ---
 * @param config - The {@link BuildPaginationPipelinesConfig} containing the data-processing stages.
 * @returns An array of {@link PipelineStage} formatted for Mongoose/MongoDB aggregation.
 */
export function buildPaginationPipelines(
    {innerStages}: BuildPaginationPipelinesConfig
): PipelineStage[] {
    return [
        {
            $facet: {
                totalCount: [{$count: "count"}],
                items: innerStages,
            }
        },
        {
            $project: {
                totalItems: {$ifNull: [{$arrayElemAt: ["$totalCount.count", 0]}, 0]},
                items: 1
            }
        },
    ];
}