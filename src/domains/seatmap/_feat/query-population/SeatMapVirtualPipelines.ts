/**
 * @fileoverview Defines MongoDB aggregation pipelines for populating virtual seat map fields.
 */


import type {VirtualPipelineStages} from "@/shared/_types";

/** Aggregation stages to join seat data and calculate final pricing for seat map entries. */
export const SeatMapVirtualPipelines: VirtualPipelineStages = [
    {
        $lookup: {
            from: "seats",
            localField: "seat",
            foreignField: "_id",
            as: "refSeat",
        },
    },
    {
        $unwind: "$refSeat",
    },
    {
        $addFields: {
            x: "$refSeat.x",
            y: "$refSeat.y",
            row: "$refSeat.row",
            seatLabel: "$refSeat.seatLabel",
            finalPrice: {
                $ifNull: [
                    "$overridePrice",
                    {$multiply: ["$basePrice", "$priceMultiplier"]},
                ],
            },
        },
    },
    {
        $project: {
            refSeat: 0,
        },
    },
];
