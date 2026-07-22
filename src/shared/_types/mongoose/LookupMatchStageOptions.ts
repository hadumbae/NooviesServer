/**
 * @fileoverview Defines the configuration options for building a MongoDB lookup stage with an inner match.
 */

/** Configuration options for a MongoDB lookup and match aggregation stage. */
export type LookupMatchStageOptions = {
    from: string;
    as: string;
    localField: string;
    foreignField: string;
    filters?: Record<string, any>;
    project?: Record<string, 1>;
};
