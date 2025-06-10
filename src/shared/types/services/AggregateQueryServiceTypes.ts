import type {FilterQuery} from "mongoose";
import type {PopulatePipelineStages} from "../mongoose/PopulatePipelineStages.js";

export type AggregateServiceCountParams<TSchema = Record<string, any>> = {
    matchFilters?: FilterQuery<TSchema>,
    populateFilters?: PopulatePipelineStages,
}

export type AggregateServiceQueryParams<TSchema = Record<string, any>> = {
    matchFilters: FilterQuery<TSchema>,
    populateFilters: PopulatePipelineStages,
    limit?: number,
    populate?: boolean,
    populatePipelines?: PopulatePipelineStages,
} & (| {
    paginated: true,
    page: number,
    perPage: number,
} | {
    paginated?: false,
    page?: never,
    perPage?: never,
});

export type AggregateServiceGenerateParams<TMatchFilters = any> = {
    paginated?: boolean,
    page?: number,
    perPage?: number,
    limit?: number,
    populate?: boolean,
    matchFilters: FilterQuery<TMatchFilters>;
    populateFilters: PopulatePipelineStages;
    populatePipelines: PopulatePipelineStages;
}