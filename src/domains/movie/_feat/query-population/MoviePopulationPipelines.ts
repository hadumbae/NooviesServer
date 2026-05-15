/**
 * @file Aggregation pipelines for populating Movie domain references.
 * @filename MoviePopulationPipelines.ts
 */

import type {PipelineStage} from "mongoose";

/**
 * Reusable aggregation stages for resolving Movie reference fields.
 */
export const MoviePopulationPipelines: PipelineStage.Lookup[] = [
    {
        $lookup: {
            from: "genres",
            localField: "genres",
            foreignField: "_id",
            as: "genres",
            pipeline: [
                { $sort: { name: 1 } },
                { $project: { __v: 0 } },
            ],
        },
    },
];