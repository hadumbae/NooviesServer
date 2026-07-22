/**
 * @file ShowingPopulationPipelines.ts
 *
 * MongoDB aggregation pipeline stages for populating `Showing` relations.
 *
 * Populates:
 * - `movie` (including nested `genres`)
 * - `theatre`
 * - `screen`
 *
 * Intended for use in aggregate queries where fully hydrated
 * showing documents are required.
 */


import {PopulationPipelineStages} from "@/shared/_types/mongoose-aggregation/PopulationPipelineStages";

/**
 * Aggregation pipeline for populating core `Showing` references.
 */
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
