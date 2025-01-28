import type {PipelineStage} from "mongoose";

export type MatchPipelineStage = PipelineStage.Match;
export type LookupPipelineStage = PipelineStage.Lookup;

export type PopulateQueryFilters = (MatchPipelineStage | LookupPipelineStage)[];