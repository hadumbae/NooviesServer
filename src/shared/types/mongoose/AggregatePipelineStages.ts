import type {PipelineStage} from "mongoose";

/**
 * @file aggregation-pipeline.types.ts
 *
 * Strongly-typed aggregation pipeline stage groups used for
 * composing MongoDB/Mongoose queries.
 *
 * These aliases constrain which stages are allowed in specific
 * aggregation contexts (population, filtering, sorting, virtuals).
 */

/**
 * Pipeline stages used exclusively for **reference population**.
 *
 * Constraints:
 * - Only `$lookup` and `$unwind` stages are permitted
 * - Intended for populating related collections prior to filtering or sorting
 *
 * @example
 * ```ts
 * const stages: PopulationPipelineStages = [
 *   {
 *     $lookup: {
 *       from: "users",
 *       localField: "userId",
 *       foreignField: "_id",
 *       as: "user",
 *     },
 *   },
 *   { $unwind: "$user" },
 * ];
 * ```
 */
export type PopulationPipelineStages = (
    PipelineStage.Lookup |
    PipelineStage.Unwind
    )[];

/**
 * Pipeline stages used for **reference-level filtering**.
 *
 * Constraints:
 * - `$lookup` must precede `$match`
 * - `$match` operates on populated reference fields
 * - `$unset` may remove sensitive or unnecessary reference fields
 *
 * @example
 * ```ts
 * const stages: ReferenceFilterPipelineStages = [
 *   { $lookup: { from: "users", localField: "userId", foreignField: "_id", as: "user" } },
 *   { $unwind: "$user" },
 *   { $match: { "user.active": true } },
 *   { $unset: "user.ssn" },
 * ];
 * ```
 */
export type ReferenceFilterPipelineStages = (
    PipelineStage.Lookup |
    PipelineStage.Match |
    PipelineStage.Unset
    )[];

/**
 * Pipeline stages used for **reference-level sorting**.
 *
 * Constraints:
 * - Sorting is applied after reference population
 * - `$sort` may target populated reference fields
 * - `$unset` may remove unneeded fields post-sort
 *
 * @example
 * ```ts
 * const stages: ReferenceSortPipelineStages = [
 *   { $lookup: { from: "users", localField: "userId", foreignField: "_id", as: "user" } },
 *   { $unwind: "$user" },
 *   { $sort: { "user.age": -1 } },
 *   { $unset: "user.password" },
 * ];
 * ```
 */
export type ReferenceSortPipelineStages = (
    PipelineStage.Lookup |
    PipelineStage.Unwind |
    PipelineStage.Sort |
    PipelineStage.Unset
    )[];

/**
 * Pipeline stages used for **virtual field construction**.
 *
 * Typically used to:
 * - Join related collections
 * - Compute derived fields
 * - Shape the final document output
 */
export type VirtualPipelineStages = (
    PipelineStage.Lookup |
    PipelineStage.AddFields |
    PipelineStage.Project
    )[];
