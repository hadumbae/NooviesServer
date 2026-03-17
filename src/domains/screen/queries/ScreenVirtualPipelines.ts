/**
 * @file Aggregation pipelines for screen virtual fields.
 * @filename ScreenVirtualPipelines.ts
 */

import type {VirtualPipelineStages} from "../../../shared/types/mongoose/AggregatePipelineStages.js";

/**
 * Computes derived screen metrics from related collections.
 *
 * Adds:
 * - `seatCount`
 * - `futureShowingCount` (filtered by active statuses)
 */
export const ScreenVirtualPipelines: VirtualPipelineStages = [
    {
        $lookup: {
            from: "seats",
            localField: "_id",
            foreignField: "screen",
            as: "vpSeats",
        },
    },
    {
        $lookup: {
            from: "showings",
            localField: "_id",
            foreignField: "screen",
            as: "vpShowings",
            pipeline: [
                {
                    $match: {
                        status: {
                            $in: ["SCHEDULED", "SOLD_OUT"]
                        }
                    }
                }
            ],
        },
    },
    {
        $addFields: {
            seatCount: {$size: "$vpSeats"},
            futureShowingCount: {$size: "$vpShowings"},
        },
    },
    {
        $project: {
            vpSeats: 0,
            vpShowings: 0,
        }
    },
];