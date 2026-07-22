/**
 * @fileoverview Shared TypeScript type definitions for Mongoose operations.
 */

import type {PipelineStage} from "mongoose";

/** A collection of pipeline stages excluding those that write to or merge with collections. */
export type LookupPipelineStages = Exclude<PipelineStage, PipelineStage.Merge | PipelineStage.Out>[];