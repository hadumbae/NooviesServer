/**
 * @file Aggregation pipelines for populating screen relations.
 * @filename ScreenPopulationPipelines.ts
 */


import {PopulationPipelineStages} from "@/shared/_types/mongoose-aggregation/PopulationPipelineStages";

/**
 * Populates the `theatre` reference via `$lookup` and flattens the result.
 */
export const ScreenPopulationPipelines: PopulationPipelineStages = [
    {
        $lookup: {
            from: "theatres",
            localField: "theatre",
            foreignField: "_id",
            as: "theatre",
        },
    },
    {
        $unwind: "$theatre",
    }
];