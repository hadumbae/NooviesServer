/**
 * @fileoverview MongoDB aggregation stages for populating Seat document references.
 */


import {PopulationPipelineStages} from "@/shared/_types/mongoose-aggregation/PopulationPipelineStages";

/**
 * Aggregation pipeline that materializes 'screen' and 'theatre' references for Seat documents.
 */
export const SeatPopulationPipelines: PopulationPipelineStages = [
    {
        $lookup: {
            from: "screens",
            localField: "screen",
            foreignField: "_id",
            as: "screen",
        },
    },
    {
        $lookup: {
            from: "theatres",
            localField: "theatre",
            foreignField: "_id",
            as: "theatre",
        },
    },
    {
        $unwind: "$screen",
    },
    {
        $unwind: "$theatre",
    },
];