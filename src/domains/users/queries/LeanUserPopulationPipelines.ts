/**
 * @file Aggregation pipelines for lean User population.
 * @filename LeanUserPopulationPipelines.ts
 */

import type {PopulationPipelineStages} from "../../../shared/types/mongoose/AggregatePipelineStages.js";

/**
 * A sequence of Mongoose/MongoDB aggregation stages to populate a user reference.
 * @returns {PopulationPipelineStages} An array of typed aggregation stages.
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