/**
 * @file LookupMatchStage.types.ts
 *
 * Type definitions for building MongoDB `$lookup` and match
 * aggregation stages.
 */

/**
 * Base shape for generating a `$lookup` stage with optional filtering and projection.
 */
export type LookupMatchStageOptions = {
    /** Name of the collection to join from. */
    from: string;

    /** Name of the field to store the joined results. */
    as: string;

    /** Local field to match on. */
    localField: string;

    /** Foreign field to match on. */
    foreignField: string;

    /** Optional additional filter criteria applied to the joined collection. */
    filters?: Record<string, any>;

    /** Optional projection specifying which fields to include (`1`) in the joined documents. */
    project?: Record<string, 1>;
};
