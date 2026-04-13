/**
 * @fileoverview Utility for populating a MongoDB aggregation pipeline with initial stages.
 * Standardizes the sequence in which root-level matches/sorts and reference-level
 * filters/sorts are injected into the pipeline array.
 */

import type {AggregateBaseConfig} from "@shared/_feat/generic-aggregate/configTypes";
import type {PipelineStage} from "mongoose";

/**
 * Configuration for building base aggregation stages.
 */
export type BuildBaseStagesConfig = Pick<AggregateBaseConfig<any>, "match" | "reference"> & {
    stages?: PipelineStage[];
};

/**
 * Appends standard filtering and sorting stages to an aggregation pipeline.
 */
export function buildBaseStages(
    {stages = [], reference, match}: BuildBaseStagesConfig
): PipelineStage[] {
    if (match?.filters && Object.keys(match.filters.$match).length > 0) {
        stages.push(match.filters);
    }

    if (match?.sorts && Object.keys(match.sorts.$sort).length > 0) {
        stages.push(match.sorts);
    }

    if (reference?.filters && reference.filters.length > 0) {
        stages.push(...reference.filters);
    }

    if (reference?.sorts && reference.sorts.length > 0) {
        stages.push(...reference.sorts);
    }

    return stages;
}