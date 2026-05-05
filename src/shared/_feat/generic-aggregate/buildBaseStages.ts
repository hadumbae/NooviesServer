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
export type BuildBaseStagesConfig = Pick<AggregateBaseConfig<any>, "match" | "sort" | "reference"> & {
    stages?: PipelineStage[];
};

/**
 * Appends standard filtering and sorting stages to an aggregation pipeline.
 */
export function buildBaseStages(
    {stages = [], reference, match, sort}: BuildBaseStagesConfig
): PipelineStage[] {
    if (match && Object.keys(match.$match).length > 0) {
        stages.push(match);
    } else {
        stages?.push({$match: {}});
    }

    if (sort && Object.keys(sort.$sort).length > 0) {
        stages.push(sort);
    }

    if (reference?.filters && reference.filters.length > 0) {
        stages.push(...reference.filters);
    }

    if (reference?.sorts && reference.sorts.length > 0) {
        stages.push(...reference.sorts);
    }

    return stages;
}