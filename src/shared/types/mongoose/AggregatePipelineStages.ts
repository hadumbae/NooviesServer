/**
 * @file AggregatePipelineStages.ts
 *
 * Strongly-typed aggregation pipeline stage groupings used for
 * composing MongoDB aggregation queries in a predictable,
 * domain-safe, and intention-revealing manner.
 *
 * These type aliases restrict which pipeline stages are allowed
 * in specific aggregation contexts such as:
 * - Reference population
 * - Reference-level filtering
 * - Reference-level sorting
 * - Virtual field materialization
 *
 * @remarks
 * - Encourages consistent aggregation composition across domains
 * - Prevents accidental misuse of unrelated pipeline stages
 * - Improves readability and architectural clarity
 * - Makes pipeline intent explicit at the type level
 */

import type {PipelineStage} from "mongoose";

/**
 * Pipeline stages used exclusively for **reference population**.
 *
 * Intended to resolve ObjectId references into full documents
 * prior to filtering, sorting, or projection logic.
 *
 * Constraints:
 * - Only `$lookup` and `$unwind` stages are permitted
 * - No `$match`, `$sort`, or projection logic should appear here
 * - Designed to be composed before filter/sort pipelines
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
 * - `$lookup` / `$unwind` must precede `$match`
 * - `$match` operates on populated reference data
 * - `$unset` may remove sensitive or unused reference fields
 * - Root-level filtering should use standard `$match` pipelines
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
 * - `$sort` may target nested populated fields
 * - `$unset` may remove unnecessary fields after sorting
 * - Sorting logic should remain isolated from filtering pipelines
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
 * Used to replicate or replace Mongoose virtual behavior
 * within aggregation-based workflows.
 *
 * Typical responsibilities:
 * - Joining related collections
 * - Computing derived or denormalized fields
 * - Shaping the final document output
 * - Removing intermediate fields
 *
 * @remarks
 * - Commonly composed after population pipelines
 * - Safe to use in reporting and read-heavy query paths
 * - Should not introduce filtering logic
 */
export type VirtualPipelineStages = (
    | PipelineStage.Lookup
    | PipelineStage.Unwind
    | PipelineStage.AddFields
    | PipelineStage.Project
    | PipelineStage.Unset
    )[];
