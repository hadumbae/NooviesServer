/**
 * @fileoverview Type definition for the configuration of a MongoDB lookup pipeline stage.
 */

import type {PipelineStage} from "mongoose";

/** Type representing the configuration for building a MongoDB lookup stage. */
export type LookupStageConfig = {
    localField?: string;
    foreignField?: string;
    as?: string;
    innerStages?: Exclude<
        PipelineStage,
        PipelineStage.Merge | PipelineStage.Out
    >[];
}