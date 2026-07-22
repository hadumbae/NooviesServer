/**
 * @fileoverview Defines the specific Mongoose pipeline stages allowed for sorting by referenced documents.
 */

import type {PipelineStage} from "mongoose";

/** A collection of pipeline stages used to perform a sort operation across a document reference. */
export type ReferenceSortPipelineStages = (
    | PipelineStage.Lookup
    | PipelineStage.Unwind
    | PipelineStage.Sort
    | PipelineStage.Unset
    )[];