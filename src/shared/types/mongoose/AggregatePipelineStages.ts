import type { PipelineStage } from "mongoose";

/**
 * Represents an array of MongoDB aggregation pipeline stages
 * specifically used for **populating references** in Mongoose queries.
 *
 * @remarks
 * - Only `$lookup` and `$unwind` stages are allowed.
 * - Typically used to populate related collections before further aggregation.
 *
 * @example
 * ```ts
 * const stages: PopulationPipelineStages = [
 *   {
 *     $lookup: {
 *       from: "users",
 *       localField: "userId",
 *       foreignField: "_id",
 *       as: "user"
 *     }
 *   },
 *   { $unwind: "$user" }
 * ];
 * ```
 */
export type PopulationPipelineStages = (PipelineStage.Lookup | PipelineStage.Unwind)[];

/**
 * Represents an array of MongoDB aggregation pipeline stages
 * used when applying **reference-level filters** in Mongoose queries.
 *
 * @remarks
 * - Allows `$lookup`, `$match`, and `$unset` stages.
 * - `$match` is applied after `$lookup` to filter the populated documents.
 * - `$unset` can remove sensitive or unnecessary fields from the reference before returning results.
 *
 * @example
 * ```ts
 * const stages: ReferenceFilterPipelineStages = [
 *   { $lookup: { from: "users", localField: "userId", foreignField: "_id", as: "user" } },
 *   { $unwind: "$user" },
 *   { $match: { "user.active": true } },
 *   { $unset: "user.ssn" }
 * ];
 * ```
 */
export type ReferenceFilterPipelineStages = (
    PipelineStage.Lookup |
    PipelineStage.Match |
    PipelineStage.Unset
    )[];

/**
 * Represents an array of MongoDB aggregation pipeline stages
 * used when applying **reference-level sorting** in Mongoose queries.
 *
 * @remarks
 * - Allows `$lookup`, `$unwind`, `$sort`, and `$unset` stages.
 * - `$sort` can be applied to populated fields to order results.
 * - `$unset` can remove unneeded fields after sorting.
 *
 * @example
 * ```ts
 * const stages: ReferenceSortPipelineStages = [
 *   { $lookup: { from: "users", localField: "userId", foreignField: "_id", as: "user" } },
 *   { $unwind: "$user" },
 *   { $sort: { "user.age": -1 } },
 *   { $unset: "user.password" }
 * ];
 * ```
 */
export type ReferenceSortPipelineStages = (
    PipelineStage.Lookup |
    PipelineStage.Unwind |
    PipelineStage.Sort |
    PipelineStage.Unset
    )[];
