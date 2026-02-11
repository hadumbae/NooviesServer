/**
 * @file MoviePopulationPipelines.ts
 *
 * Aggregate population pipelines for the `Movie` domain.
 *
 * Defines reusable `$lookup` stages for resolving Movie
 * reference fields when using MongoDB aggregation instead
 * of Mongoose `.populate()`.
 *
 * @remarks
 * - Intended for aggregation-based query execution
 * - Mirrors Mongoose population behavior in pipeline form
 * - Keeps reference resolution centralized and schema-aligned
 * - Safe to compose before virtual pipelines
 *
 * Populates:
 * - `genres` (sorted alphabetically by name)
 *
 * @example
 * ```ts
 * MovieModel.aggregate([
 *   ...MoviePopulationPipelines,
 *   ...MovieVirtualPipelines,
 * ]);
 * ```
 */

import type {PopulationPipelineStages} from "../../../shared/types/mongoose/AggregatePipelineStages.js";

/**
 * Aggregation stages for populating Movie reference fields.
 *
 * Performs a `$lookup` on the `genres` collection and:
 * - Sorts genres alphabetically
 * - Removes internal version keys
 *
 * @remarks
 * - Designed for composition inside larger aggregation flows
 * - Does not unwind genres (preserves array structure)
 */
export const MoviePopulationPipelines: PopulationPipelineStages = [
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
