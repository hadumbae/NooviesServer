import type {
    ReferenceFilterPipelineStages,
} from "../../types/mongoose/AggregatePipelineStages.js";
import generateLookupMatchStage from "./generateLookupMatchStage.js";
import type {LookupMatchStageOptions} from "../../types/mongoose/LookupMatchStage.types.js";

/**
 * @file generateReferenceFilterPipelineStages.ts
 * @summary Builds Mongoose aggregation pipeline stages for reference-based filters.
 *
 * @description
 * Converts an array of {@link LookupMatchStageOptions} into a sequence of
 * Mongoose aggregation stages that:
 * - Perform `$lookup` joins with optional `filters`
 * - Filter out empty results for joined references
 * - Clean up temporary fields using `$unset`
 *
 * Useful for constructing reusable, type-safe pipelines for filtering on
 * related documents.
 */

/**
 * Parameters for `generateReferenceFilterPipelineStages`.
 */
type StageParams = {
    /** Array of lookup/match stage definitions with optional filters. */
    stages: LookupMatchStageOptions[];
};

/**
 * Generates aggregation pipeline stages for reference-based filters.
 *
 * @param params - Configuration object containing stages to generate.
 * @param params.stages - Array of lookup stage options.
 *
 * @returns A `ReferenceFilterPipelineStages` array suitable for
 * inclusion in a Mongoose aggregation pipeline.
 *
 * @example
 * ```ts
 * const stages = generateReferenceFilterPipelineStages({
 *   stages: [
 *     {
 *       from: "users",
 *       as: "userDetails",
 *       localField: "userId",
 *       foreignField: "_id",
 *       filters: { active: true },
 *     }
 *   ]
 * });
 * ```
 */
export default function generateReferenceFilterPipelineStages(
    {stages}: StageParams
): ReferenceFilterPipelineStages {
    // --- Setup ---
    const pipelines: ReferenceFilterPipelineStages = [];
    const matchStages: Record<string, any> = {};
    const unsetKeys: string[] = [];

    // --- Build Stages ---
    for (const stage of stages) {
        const {filters, as, ...lookupParams} = stage;

        if (filters && Object.keys(filters).length > 0) {
            const lookup = generateLookupMatchStage({
                ...lookupParams,
                as,
                filters,
            });

            pipelines.push(lookup);
            matchStages[as] = {$ne: []};
            unsetKeys.push(as);
        }
    }

    // --- Add Clean Up Stages ---
    if (Object.keys(matchStages).length > 0) {
        pipelines.push({$match: matchStages});
        pipelines.push({$unset: unsetKeys});
    }

    return pipelines;
}
