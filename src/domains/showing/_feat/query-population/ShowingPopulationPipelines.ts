/**
 * @fileoverview Defines MongoDB aggregation pipeline stages for populating Showing document relations.
 */

import type {PopulationPipelineStages} from "@/shared/_types";

/** Aggregation stages to populate movie, genre, theatre, and screen data for showings. */
export const ShowingPopulationPipelines: PopulationPipelineStages = [
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
        },
    },
    {
        $lookup: {
            from: "theatres",
            localField: "theatre",
            foreignField: "_id",
            as: "theatre"
        },
    },
    {
        $lookup: {
            from: "screens",
            localField: "screen",
            foreignField: "_id",
            as: "screen"
        },
    },
    {
        $unwind: "$theatre",
    },
    {
        $unwind: "$screen",
    },
    {
        $unwind: "$movie",
    },
];
