import type {PipelineStage} from "mongoose";

export type PopulatePipelineStages = (PipelineStage.Match | PipelineStage.Lookup | PipelineStage.Unwind | PipelineStage.Group)[];
