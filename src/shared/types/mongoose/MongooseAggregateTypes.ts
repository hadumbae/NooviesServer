import type {PipelineStage} from "mongoose";

export type MatchPipelineStage = PipelineStage.Match;
export type LookupPipelineStage = PipelineStage.Lookup;
export type UnwindPipelineStage = PipelineStage.Unwind;
export type GroupPipelineStage = PipelineStage.Group;

export type PopulateQueryFilters = (LookupPipelineStage | MatchPipelineStage | UnwindPipelineStage | GroupPipelineStage)[];