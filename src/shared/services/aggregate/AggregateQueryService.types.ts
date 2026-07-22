/**
 * @fileoverview Defines types and interfaces for the aggregate query service used to perform complex Mongoose aggregations.
 */

import type {Model, PipelineStage} from "mongoose";
import type {QueryOptionParams} from "../../schema/query/QueryOptionParamsSchema.js";
import type {QueryOptionTypes} from "../../types/query-options/QueryOptionService.types.js";
import type {ModelObject} from "@/shared/_types/model/ModelObject";
import type {PopulationPipelineStages} from "@/shared/_types/mongoose-aggregation/PopulationPipelineStages";
import type {VirtualPipelineStages} from "@/shared/_types/mongoose-aggregation/VirtualPipelineStages";

/** Methods for executing aggregation queries with support for filtering and pagination. */
export interface AggregateQueryMethods<TSchema extends ModelObject, TMatchFilters = any> {
    query<TResult = any>(
        params: AggregateQueryParams<TSchema, TMatchFilters>
    ): Promise<AggregateQueryResults<TResult>>;
}

/** Parameters required to instantiate an aggregate query service. */
export type AggregateConstructorParams<TSchema extends ModelObject> = {
    model: Model<TSchema>;
    populationPipelines?: PopulationPipelineStages;
    virtualsPipelines?: VirtualPipelineStages;
};

/** Options for configuring pagination behavior in aggregation queries. */
export type AggregatePaginationOptions =
    | { paginated: true; page: number; perPage: number }
    | { paginated?: false; page?: never; perPage?: never };

/** Parameters for executing an aggregate query including filters and pagination options. */
export type AggregateQueryParams<TSchema extends ModelObject, TMatchFilters = any> =
    Omit<QueryOptionParams, "paginated"> & AggregatePaginationOptions & {
    options: QueryOptionTypes<TSchema, TMatchFilters>;
};

/** Internal parameters used for processing paginated aggregation pipelines. */
export type AggregatePaginatedParams =
    Pick<QueryOptionParams, "virtuals" | "populate"> & {
    pipeline: PipelineStage[];
    page: number;
    perPage: number;
};

/** The resulting data structure of an aggregate query, which may include pagination metadata. */
export type AggregateQueryResults<TResult = any> =
    | TResult[]
    | { totalItems: number, items: TResult[] };
