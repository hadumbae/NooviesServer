/**
 * @file SeatMapPopulationPipelines.ts
 *
 * Aggregate population pipelines for the `SeatMap` domain.
 *
 * Defines reusable `$lookup` and `$unwind` stages for resolving
 * SeatMap reference fields when using MongoDB aggregation instead
 * of Mongoose `.populate()`.
 *
 * @remarks
 * - Intended for aggregate-based queries and reporting workflows
 * - Mirrors standard Mongoose population behavior
 * - Keeps population logic centralized and schema-aligned
 * - Designed to be composed with {@link SeatMapVirtualPipelines}
 *
 * Populates:
 * - `showing` (via {@link ShowingPopulationPipelines})
 * - `screen`
 * - `theatre`
 *
 * @example
 * ```ts
 * SeatMapModel.aggregate([
 *   ...SeatMapPopulationPipelines,
 *   ...SeatMapVirtualPipelines,
 *   { $match: { status: "AVAILABLE" } }
 * ]);
 * ```
 */

import type {PopulationPipelineStages} from "../../../shared/types/mongoose/AggregatePipelineStages.js";
import {ShowingPopulationPipelines} from "../../showing/queries/ShowingPopulationPipelines.js";

/**
 * Aggregation stages for populating SeatMap reference fields.
 *
 * Performs lookups for related domain entities and normalizes
 * the result shape via `$unwind` to match populated documents.
 */
export const SeatMapPopulationPipelines: PopulationPipelineStages = [
    {
        $lookup: {
            from: "showings",
            localField: "showing",
            foreignField: "_id",
            as: "showing",
            pipeline: ShowingPopulationPipelines,
        },
    },
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
        $unwind: "$showing",
    },
    {
        $unwind: "$screen",
    },
    {
        $unwind: "$theatre",
    },
];
