/**
 * @fileoverview Core utility for executing standardized MongoDB aggregation pipelines.
 * Orchestrates the construction of aggregation stages based on filtering, sorting,
 * referencing, and optional expansion (population/virtuals).
 */

import type {RequestOptions} from "@shared/_feat/fetch-request-options/schemas";
import type {PipelineStage} from "mongoose";
import type {BaseModel} from "@shared/types/schema/BaseModel";
import type {AggregateBaseConfig} from "@shared/_feat/generic-aggregate/configTypes";
import {buildBaseStages} from "@shared/_feat/generic-aggregate/buildBaseStages";

/**
 * Parameters for the aggregate query utility.
 * See {@link AggregateBaseConfig} for more.
 */
export type AggregateFindConfig<TSchema extends BaseModel> = AggregateBaseConfig<TSchema> & {
    options: Omit<RequestOptions, "page" | "perPage">;
};

/**
 * Executes a dynamically constructed MongoDB aggregation pipeline.
 */
export async function aggregateFind<TSchema extends BaseModel, TReturns = unknown>(
    params: AggregateFindConfig<TSchema>
): Promise<TReturns> {
    const {
        model,
        match,
        reference,
        options: {limit, virtuals, populate},
        virtualsPipelines,
        populationPipelines,
    } = params;

    const stages: PipelineStage[] = buildBaseStages({match, reference});

    if (typeof limit === "number") stages.push({$limit: limit});
    if (virtuals && virtualsPipelines) stages.push(...virtualsPipelines);
    if (populate && populationPipelines) stages.push(...populationPipelines);

    return model.aggregate(stages) as TReturns;
}