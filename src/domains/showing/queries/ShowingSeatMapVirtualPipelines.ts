/**
 * @file ShowingSeatMapVirtualPipelines.ts
 *
 * Virtual aggregation pipeline for deriving seat availability
 * metrics on `Showing` documents.
 *
 * Computes:
 * - Total seat maps
 * - Available, reserved, sold, and unavailable seat counts
 *
 * Designed for read-only projection in aggregate queries.
 */

import type {VirtualPipelineStages} from "../../../shared/types/mongoose/AggregatePipelineStages.js";

/**
 * Aggregation pipeline for calculating seat map statistics
 * associated with a `Showing`.
 */
export const ShowingSeatMapVirtualPipelines: VirtualPipelineStages = [
    {
        $lookup: {
            from: "SeatMaps",
            localField: "_id",
            foreignField: "showing",
            as: "_sms",
        },
    },
    {
        $addFields: {
            seatMapCount: {$size: "$_sms"},
            unavailableSeatsCount: {
                $size: {
                    $filter: {
                        input: "$_sms",
                        as: "usc",
                        cond: {$eq: ["$usc.status", "UNAVAILABLE"]},
                    },
                },
            },
            availableSeatsCount: {
                $size: {
                    $filter: {
                        input: "$_sms",
                        as: "asc",
                        cond: {$eq: ["$asc.status", "AVAILABLE"]},
                    },
                },
            },
            reservedSeatsCount: {
                $size: {
                    $filter: {
                        input: "$_sms",
                        as: "rsc",
                        cond: {$eq: ["$rsc.status", "RESERVED"]},
                    },
                },
            },
            soldSeatsCount: {
                $size: {
                    $filter: {
                        input: "$_sms",
                        as: "ssc",
                        cond: {$eq: ["$ssc.status", "SOLD"]},
                    },
                },
            },
        },
    },
    {
        $project: {_sms: 0},
    },
];
