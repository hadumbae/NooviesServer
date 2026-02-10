/**
 * @file AggregatePipelineStages.ts
 *
 * Strongly-typed aggregation pipeline stage groups used for
 * composing MongoDB aggregation queries in a predictable,
 * domain-safe manner.
 *
 * These aliases constrain which pipeline stages are permitted
 * in specific aggregation contexts (population, filtering,
 * sorting, and virtual field resolution).
 *
 * @remarks
 * - Encourages consistent aggregation composition across domains
 * - Prevents accidental misuse of pipeline stages
 * - Improves readability of complex aggregation flows
 */

import type {PipelineStage} from "mongoose";

/**
 * Pipeline stages used exclusively for **reference population**.
 *
 * Intended to resolve ObjectId references into full documents
 * prior to filtering, sorting, or projection.
 *
 * Constraints:
 * - Only `$lookup` and `$unwind` stages are permitted
 * - No filtering or sorting logic should appear here
 * - Designed to be composed with other pipeline groups
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
    | PipelineStage.Lookup
    | PipelineStage.Unwind
    )[];

/**
 * Pipeline stages used for **reference-level filtering**.
 *
 * Applies conditional logic against populated reference fields.
 *
 * Constraints:
 * - `$lookup` and `$unwind` must precede `$match`
 * - `$match` operates on populated reference data
 * - `$unset` may remove sensitive or unused reference fields
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
    | PipelineStage.Lookup
    | PipelineStage.Unwind
    | PipelineStage.Match
    | PipelineStage.Unset
    )[];

/**
 * Pipeline stages used for **reference-level sorting**.
 *
 * Enables sorting based on populated reference fields.
 *
 * Constraints:
 * - Reference population must occur before `$sort`
 * - `$sort` may target nested reference fields
 * - `$unset` may remove unnecessary fields after sorting
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
    | PipelineStage.Lookup
    | PipelineStage.Unwind
    | PipelineStage.Sort
    | PipelineStage.Unset
    )[];

/**
 * Pipeline stages used for **virtual field materialization**.
 *
 * Typically used to:
 * - Join related collections
 * - Compute derived or denormalized fields
 * - Shape the final document output
 *
 * @remarks
 * Commonly composed after population pipelines to replicate
 * Mongoose virtual behavior in aggregation-based workflows.
 */
export type VirtualPipelineStages = (
    | PipelineStage.Lookup
    | PipelineStage.Unwind
    | PipelineStage.AddFields
    | PipelineStage.Project
    )[];
