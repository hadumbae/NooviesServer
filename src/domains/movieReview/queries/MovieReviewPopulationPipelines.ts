/**
 * @file Aggregate population pipelines for MovieReview.
 * MovieReviewPopulationPipelines.ts
 */

import type { PopulationPipelineStages } from "../../../shared/types/mongoose/AggregatePipelineStages.js";

/**
 * Aggregation pipelines for populating related MovieReview data.
 */
export const MovieReviewPopulationPipelines: PopulationPipelineStages = [
    {
        $lookup: {
            from: "movies",
            localField: "movie",
            foreignField: "_id",
            as: "movie",
            pipeline: [
                {
                    $lookup: {
                        from: "genres",
                        localField: "genres",
                        foreignField: "_id",
                        as: "genres",
                    }
                }
            ]
        }
    },
    {
        $unwind: "$movie",
    },
];