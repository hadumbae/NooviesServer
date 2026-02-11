/**
 * @file MovieVirtualPipelines.ts
 *
 * Aggregation virtual pipelines for the `Movie` domain.
 *
 * Defines reusable stages that materialize derived fields
 * when executing aggregation-based queries.
 *
 * @remarks
 * - Intended for aggregate workflows (not Mongoose virtuals)
 * - Computes derived metadata without modifying the schema
 * - Safe to compose after population pipelines
 *
 * Virtual fields added:
 * - `showingCount` — total number of showings associated with the movie
 *
 * @example
 * ```ts
 * MovieModel.aggregate([
 *   ...MoviePopulationPipelines,
 *   ...MovieVirtualPipelines,
 * ]);
 * ```
 */

import type {VirtualPipelineStages} from "../../../shared/types/mongoose/AggregatePipelineStages.js";

/**
 * Aggregation stages for materializing Movie virtual fields.
 *
 * Resolves related showings and computes a derived `showingCount`
 * field, then removes intermediate lookup data to keep the final
 * document shape clean.
 *
 * @remarks
 * - Uses `$lookup` to join the `showings` collection
 * - `$addFields` derives computed metadata
 * - `$unset` removes temporary aggregation artifacts
 * - Designed to be appended after filtering and sorting stages
 */
export const MovieVirtualPipelines: VirtualPipelineStages = [
    {
        $lookup: {
            from: "showings",
            localField: "_id",
            foreignField: "movie",
            as: "movieShowings",
        }
    },
    {
        $addFields: {
            showingCount: { $size: "$movieShowings" }
        }
    },
    {
        $unset: "movieShowings",
    }
];
