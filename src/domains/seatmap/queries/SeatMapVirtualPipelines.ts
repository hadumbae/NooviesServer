/**
 * @file SeatMapVirtualPipelines.ts
 *
 * Aggregate pipeline stages for resolving SeatMap virtual fields.
 *
 * Provides a reusable aggregation fragment that mirrors SeatMap
 * virtuals when using MongoDB aggregation pipelines instead of
 * Mongoose document queries.
 *
 * @remarks
 * - Intended for aggregate-based queries where Mongoose virtuals
 *   are unavailable (e.g. reporting, analytics, complex filters)
 * - Keeps aggregate projections aligned with schema-level virtuals
 * - Must be updated in tandem with SeatMap virtual definitions
 *
 * Resolves:
 * - `finalPrice`
 * - `x`
 * - `y`
 * - `row`
 * - `seatLabel`
 *
 * @example
 * ```ts
 * SeatMapModel.aggregate([
 *   ...SeatMapVirtualPipelines,
 *   { $match: { status: "AVAILABLE" } }
 * ]);
 * ```
 */

import type {VirtualPipelineStages} from "../../../shared/types/mongoose/AggregatePipelineStages.js";

/**
 * Aggregation stages for materializing SeatMap virtual fields.
 *
 * Joins the referenced `seat` document, projects derived values,
 * and removes the temporary lookup field.
 */
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
