import type { PipelineStage } from "mongoose";

type LookupParams = {
    /** Name of the foreign collection to join. */
    from: string;

    /** Name of the field in the output documents where the joined array will be stored. */
    as: string;

    /** Local field in the current collection to match against the foreign collection. */
    localField: string;

    /** Foreign field in the joined collection to match against the local field. */
    foreignField: string;

    /** Optional additional filter conditions to apply to the joined documents. */
    filters?: Record<string, any>;

    /** Optional projection specifying which fields to include from the joined documents. */
    project?: Record<string, 1>;
};

/**
 * Generates a MongoDB `$lookup` aggregation stage with optional filtering and projection
 * for use in Mongoose aggregation pipelines.
 *
 * @param params - Configuration options for the `$lookup` stage.
 * @returns A {@link PipelineStage.Lookup} object that can be inserted into a Mongoose aggregation pipeline.
 *
 * @remarks
 * - Uses the `$expr` operator to match the `localField` with the `foreignField`.
 * - Optional `filters` can be used to restrict the joined documents further.
 * - Optional `project` allows selecting specific fields from the joined documents.
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
 *
 * // Produces:
 * // {
 * //   $lookup: {
 * //     from: "users",
 * //     let: { userIdID: "$userId" },
 * //     pipeline: [
 * //       { $project: { _id: 1, name: 1, email: 1 } },
 * //       { $match: { active: true, $expr: { $eq: ["$_id", "$$userIdID"] } } }
 * //     ],
 * //     as: "userDetails"
 * //   }
 * // }
 * ```
 */
export default function generateLookupMatchStage(params: LookupParams): PipelineStage.Lookup {
    const { from, as, localField, foreignField, project, filters = {} } = params;

    const pipeline: (PipelineStage.Match | PipelineStage.Project)[] = [];
    if (project) pipeline.push({ $project: { _id: 1, ...project } });
    pipeline.push({ $match: { ...filters, $expr: { $eq: [`$${foreignField}`, `$$${localField}ID`] } } });

    return {
        $lookup: {
            from,
            let: { [`${localField}ID`]: `$${localField}` },
            pipeline,
            as,
        },
    };
}
