/**
 * @fileoverview Defines the subset of Mongoose pipeline stages allowed for virtual population.
 */

import type {PipelineStage} from "mongoose";

/** Represents the specific Mongoose aggregation stages supported for virtual field population. */
export type VirtualPipelineStages = (
    | PipelineStage.Lookup
    | PipelineStage.Unwind
    | PipelineStage.AddFields
    | PipelineStage.Project
    | PipelineStage.Unset
    )[];