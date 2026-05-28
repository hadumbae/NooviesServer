/**
 * @fileoverview Aggregation pipelines for lean User population.
 */

import type {PopulationPipelineStages} from "@shared/types/mongoose/AggregatePipelineStages.js";

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