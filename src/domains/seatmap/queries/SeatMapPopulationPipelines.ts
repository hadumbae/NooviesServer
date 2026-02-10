/**
 * @file SeatMapPopulationPipelines.ts
 *
 * Aggregation population pipelines for the `SeatMap` domain.
 *
 * Defines reusable `$lookup` and `$unwind` stages for resolving
 * SeatMap reference fields when using MongoDB aggregation instead
 * of Mongoose `.populate()`.
 *
 * @remarks
 * - Intended for aggregation-based queries and reporting workflows
 * - Mirrors standard Mongoose population behavior
 * - Centralizes population logic to remain schema-aligned
 * - Designed to be composed with {@link SeatMapVirtualPipelines}
 *
 * Populates:
 * - `showing` (via {@link ShowingPopulationPipelines})
 * - `seat` (via {@link SeatPopulationPipelines})
 *
 * @example
 * ```ts
 * SeatMapModel.aggregate([
 *   ...SeatMapPopulationPipelines,
 *   ...SeatMapVirtualPipelines,
 *   { $match: { status: "AVAILABLE" } },
 * ]);
 * ```
 */

import type {PopulationPipelineStages} from "../../../shared/types/mongoose/AggregatePipelineStages.js";
import {ShowingPopulationPipelines} from "../../showing/queries/ShowingPopulationPipelines.js";
import {SeatPopulationPipelines} from "../../seat/queries/SeatPopulationPipelines.js";

/**
 * Aggregation stages for populating `SeatMap` reference fields.
 *
 * Resolves ObjectId references into fully populated subdocuments
 * and normalizes the result shape via `$unwind` to match standard
 * populated document semantics.
 *
 * @remarks
 * - Lookup pipelines delegate to domain-specific population pipelines
 * - `$unwind` guarantees a stable, non-array reference shape
 * - Safe to compose before filtering, sorting, or pagination stages
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
            from: "seats",
            localField: "seat",
            foreignField: "_id",
            as: "seat",
            pipeline: SeatPopulationPipelines,
        },
    },
    {
        $unwind: "$showing",
    },
    {
        $unwind: "$seat",
    },
];
