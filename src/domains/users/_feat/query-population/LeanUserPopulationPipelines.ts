/**
 * @fileoverview Aggregation pipelines for lean User population.
 */


import {PopulationPipelineStages} from "@/shared/_types/mongoose-aggregation/PopulationPipelineStages";

/**
 * Aggregation stages to populate a user reference with limited fields.
 */
export const LeanUserPopulationPipelines: PopulationPipelineStages = [
    {
        $lookup: {
            from: "users",
            localField: "user",
            foreignField: "_id",
            pipeline: [
                { $project: { _id: 1, name: 1 } },
            ],
            as: "user",
        }
    },
    {
        $unwind: "$user"
    }
];