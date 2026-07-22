/**
 * @fileoverview Defines the allowed Mongoose pipeline stages for filtering referenced documents.
 */

import type {PipelineStage} from "mongoose";

/** A subset of Mongoose pipeline stages used to filter and clean up joined reference data. */
export type ReferenceFilterPipelineStages = (
    | PipelineStage.Lookup
    | PipelineStage.Unwind
    | PipelineStage.Match
    | PipelineStage.Unset
    )[];