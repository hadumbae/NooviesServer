/**
 * @fileoverview Defines MongoDB aggregation pipelines for populating movie review relations.
 */

import type {PopulationPipelineStages} from "@shared/types/mongoose/AggregatePipelineStages";
import {MovieWithRatingPipelines} from "@domains/movieReview/_feat/query-population/MovieWithRatingPipelines.js";

/** Aggregation stages to populate movie and user details for a movie review. */
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
                        uniqueCode: 1,
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