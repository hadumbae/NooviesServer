/**
 * @file generateLookupMatchStage.ts
 * @summary Utility to generate a MongoDB `$lookup` stage with optional filtering and projection.
 *
 * @description
 * Creates a Mongoose-compatible `$lookup` aggregation stage that:
 * - Joins a foreign collection by matching a local field to a foreign field
 * - Optionally filters the joined documents
 * - Optionally projects specific fields from the joined collection
 *
 * Useful for constructing reusable, type-safe aggregation pipelines
 * when referencing related documents.
 */

import type { PipelineStage } from "mongoose";
import type { LookupMatchStageOptions } from "../../types/mongoose/LookupMatchStage.types.js";

/**
 * Generates a MongoDB `$lookup` aggregation stage with optional filtering and projection.
 *
 * @param params - Configuration object for the `$lookup` stage.
 * @param params.from - Name of the foreign collection to join.
 * @param params.as - Field name to store the joined documents.
 * @param params.localField - Local field to match on.
 * @param params.foreignField - Foreign field to match on.
 * @param params.filters - Optional filters applied to the joined documents.
 * @param params.project - Optional projection of specific fields from the joined documents.
 *
 * @returns A `PipelineStage.Lookup` object suitable for a Mongoose aggregation pipeline.
 *
 * @remarks
 * - Uses `$expr` to dynamically match `localField` and `foreignField`.
 * - `filters` further restrict the joined documents.
 * - `project` allows selecting specific fields from the joined documents.
 *
 * @example
 * ```ts
 * const stage = generateLookupMatchStage({
 *   from: "users",
 *   as: "userDetails",
 *   localField: "userId",
 *   foreignField: "_id",
 *   filters: { active: true },
 *   project: { name: 1, email: 1 }
 * });
 * ```
 */
export default function generateLookupMatchStage(
    params: LookupMatchStageOptions
): PipelineStage.Lookup {
    const { from, as, localField, foreignField, project, filters = {} } = params;
    const pipeline: (PipelineStage.Match | PipelineStage.Project)[] = [];

    // --- Project Stage ---
    if (project) {
        pipeline.push({ $project: { _id: 1, ...project } });
    }

    // --- Match Stage with Filters ---
    pipeline.push({
        $match: {
            ...filters,
            $expr: {
                $eq: [`$${foreignField}`, `$$${localField}Field`],
            },
        },
    });

    // --- Return Lookup Stage ---
    return {
        $lookup: {
            from,
            let: { [`${localField}Field`]: `$${localField}` },
            pipeline,
            as,
        },
    };
}
