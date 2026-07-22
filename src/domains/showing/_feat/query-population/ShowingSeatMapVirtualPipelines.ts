/**
 * @fileoverview Defines MongoDB aggregation pipeline stages for calculating seat statistics from seat map data.
 */

import type {VirtualPipelineStages} from "@/shared/_types";

/** Aggregation stages to join seat maps and compute counts for available, reserved, sold, and unavailable seats. */
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
