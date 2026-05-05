/**
 * @fileoverview Utility for executing standardized, paginated MongoDB aggregation pipelines.
 * Leverages the $facet stage to simultaneously calculate total document counts
 * and fetch a specific subset (page) of data, ensuring efficient server-side pagination.
 */

import type {RequestOptions} from "@shared/_feat/fetch-request-options/schemas";
import type {PipelineStage} from "mongoose";
import type {BaseModel} from "@shared/types/schema/BaseModel";
import type {AggregateBaseConfig} from "@shared/_feat/generic-aggregate/configTypes";
import {buildPaginationPipelines} from "@shared/_feat/pagination-pipelines";
import type {
    RequestPaginationOptions
} from "@shared/_feat/fetch-request-options/schemas/RequestPaginationOptionsSchema";
import {buildBaseStages} from "@shared/_feat/generic-aggregate/buildBaseStages";

/**
 * Configuration for paginated aggregation.
 */
export type AggregatePaginationConfig<TSchema extends BaseModel> = AggregateBaseConfig<TSchema> & {
    options: Omit<RequestOptions, "limit" | "page" | "perPage"> & RequestPaginationOptions;
};

/**
 * Executes a paginated MongoDB aggregation pipeline.
 */
export async function aggregatePaginated<TSchema extends BaseModel, TReturns = unknown>(
    params: AggregatePaginationConfig<TSchema>
): Promise<TReturns> {
    const {
        model,
        match,
        sort,
        reference,
        options: {page, perPage, virtuals, populate},
        virtualsPipelines,
        populationPipelines,
    } = params;

    const stages: PipelineStage[] = buildBaseStages({match, sort, reference});

    const innerStages: PipelineStage.FacetPipelineStage[] = [
        {$skip: (page - 1) * perPage},
        {$limit: perPage},
    ];

    if (populate && populationPipelines) {
        innerStages.push(...(populationPipelines as PipelineStage.FacetPipelineStage[]));
    }

    if (virtuals && virtualsPipelines) {
        innerStages.push(...(virtualsPipelines as PipelineStage.FacetPipelineStage[]));
    }

    const paginatedPipelines: PipelineStage[] = [
        ...stages,
        ...buildPaginationPipelines({innerStages})
    ];

    const [result] = await model.aggregate(paginatedPipelines).option({virtuals});

    return result as TReturns;
}