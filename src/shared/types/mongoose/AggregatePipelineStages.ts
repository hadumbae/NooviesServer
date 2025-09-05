import type {PipelineStage} from "mongoose";

/**
 * Represents an array of MongoDB aggregation pipeline stages
 * specifically used for populating references in Mongoose queries.
 *
 * This type only allows `Lookup` and `Unwind` stages.
 *
 * Example usage:
 * ```ts
 * const stages: PopulationPipelineStages = [
 *   { $lookup: { from: "users", localField: "userId", foreignField: "_id", as: "user" } },
 *   { $unwind: "$user" }
 * ];
 * ```
 */
export type PopulationPipelineStages = (PipelineStage.Lookup | PipelineStage.Unwind)[];

/**
 * Represents an array of MongoDB aggregation pipeline stages
 * used when applying reference filters in Mongoose queries.
 *
 * This type allows `Lookup`, `Unwind`, and `Unset` stages.
 *
 * Example usage:
 * ```ts
 * const stages: ReferenceFilterPipelineStages = [
 *   { $lookup: { from: "users", localField: "userId", foreignField: "_id", as: "user" } },
 *   { $unwind: "$user" },
 *   { $unset: "user.sensitiveField" }
 * ];
 * ```
 */
export type ReferenceFilterPipelineStages = (PipelineStage.Lookup | PipelineStage.Unwind | PipelineStage.Unset)[];