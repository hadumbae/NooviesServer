/**
 * @file Aggregate population pipelines for MovieReview.
 * @filename MovieReviewPopulationPipelines.ts
 */

import type {PopulationPipelineStages} from "../../../shared/types/mongoose/AggregatePipelineStages.js";
import {MovieWithRatingPipelines} from "./MovieWithRatingPipelines.js";

/**
 * Aggregation pipelines for populating related MovieReview data.
 * @returns {PopulationPipelineStages} A sequence of lookup and transformation stages.
 */
export const MovieReviewPopulationPipelines: PopulationPipelineStages = [
    {
        $lookup: {
            from: "movies",
            localField: "movie",
            foreignField: "_id",
            as: "movie",
            pipeline: MovieWithRatingPipelines,
        }
    },
    {
        $lookup: {
            from: "users",
            localField: "user",
            foreignField: "_id",
            as: "user",
            pipeline: [
                {
                    $project: {
                        _id: 1,
                        name: 1,
                    },
                }
            ],
        },
    },
    {
        $unwind: "$movie",
    },
    {
        $unwind: "$user",
    },
];