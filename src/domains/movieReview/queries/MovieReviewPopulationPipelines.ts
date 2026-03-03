/**
 * @file Aggregate population pipelines for MovieReview.
 * MovieReviewPopulationPipelines.ts
 */

import type {PopulationPipelineStages} from "../../../shared/types/mongoose/AggregatePipelineStages.js";
import {MoviePopulationPipelines} from "../../movie/queries/MoviePopulationPipelines.js";

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
            pipeline: MoviePopulationPipelines,
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
                        _id: 0,
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