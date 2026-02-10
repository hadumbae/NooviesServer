/**
 * @file SeatPopulationPipelines.ts
 *
 * Aggregation pipeline stages for populating `Seat` reference data.
 *
 * Intended for use in aggregation-based queries where seat documents
 * must be enriched with their associated screen and theatre context.
 *
 * This pipeline resolves ObjectId references and flattens the result
 * into a single document shape suitable for filtering, sorting, or
 * further virtual field construction.
 */

import type {PopulationPipelineStages} from "../../../shared/types/mongoose/AggregatePipelineStages.js";

/**
 * Population pipeline for `Seat` documents.
 *
 * Populates:
 * - `screen` – the screen this seat belongs to
 * - `theatre` – the theatre owning the screen
 *
 * @remarks
 * - Uses `$lookup` followed by `$unwind` to fully materialize references
 * - Designed to be composed before filtering, sorting, or pagination stages
 * - Safe to reuse across repositories and aggregate query services
 *
 * @example
 * ```ts
 * SeatModel.aggregate([
 *   ...SeatPopulationPipelines,
 *   { $match: { "screen.isActive": true } },
 * ]);
 * ```
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
