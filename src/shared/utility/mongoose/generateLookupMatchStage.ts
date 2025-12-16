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

/**
 * Parameters for `generateLookupMatchStage`.
 */
type LookupParams = {
    from: string;
    as: string;
    localField: string;
    foreignField: string;
    filters?: Record<string, any>;
    project?: Record<string, 1>;
};

/**
 * Generates a MongoDB `$lookup` aggregation stage with optional filtering and projection.
 *
 * @param params - Configuration for the `$lookup` stage.
 * @returns A `PipelineStage.Lookup` object suitable for a Mongoose aggregation pipeline.
 *
 * @remarks
 * - Matches `localField` to `foreignField` using `$expr` for dynamic aggregation variable binding.
 * - `filters` restrict the joined documents further.
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
export default function generateLookupMatchStage(params: LookupParams): PipelineStage.Lookup {
    const { from, as, localField, foreignField, project, filters = {} } = params;
    const pipeline: (PipelineStage.Match | PipelineStage.Project)[] = [];

    // --- Has Project Stage ---
    if (project) {
        pipeline.push({ $project: { _id: 1, ...project } });
    }

    // --- Match Via Expression, Filters ---
    pipeline.push({
        $match: {
            ...filters,
            $expr: {
                $eq: [`$${foreignField}`, `$$${localField}Field`],
            },
        },
    });

    // --- Lookup Stage ---
    return {
        $lookup: {
            from,
            let: { [`${localField}Field`]: `$${localField}` },
            pipeline,
            as,
        },
    };
}
