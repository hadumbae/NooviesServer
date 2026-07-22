/**
 * @fileoverview Defines a type for Mongoose aggregation pipeline stages used in population operations.
 */

import type {PipelineStage} from "mongoose";

/** A collection of lookup and unwind stages used to populate related documents in an aggregation. */
export type PopulationPipelineStages = (
    | PipelineStage.Lookup
    | PipelineStage.Unwind
    )[];