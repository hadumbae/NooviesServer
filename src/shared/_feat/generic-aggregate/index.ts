import {aggregateFind, type AggregateFindConfig} from "@shared/_feat/generic-aggregate/aggregateFind";
import {aggregate} from "@shared/_feat/generic-aggregate/aggregate";
import {aggregatePaginated, type AggregatePaginationConfig} from "@shared/_feat/generic-aggregate/aggregatePaginated";
import {aggregateQuery, type AggregateQueryConfig} from "@shared/_feat/generic-aggregate/aggregateQuery";
import {buildBaseStages, type BuildBaseStagesConfig} from "@shared/_feat/generic-aggregate/buildBaseStages";
import type {AggregateQueryOptions} from "@shared/_feat/generic-aggregate/optionTypes";
import type {
    AggregateBaseConfig,
    AggregateModelQueries,
    AggregateReferenceQueries
} from "@shared/_feat/generic-aggregate/configTypes";

export {
    aggregate,
    aggregateFind,
    aggregatePaginated,
    aggregateQuery,
    buildBaseStages,
}

export type {
    AggregateQueryConfig,
    AggregateFindConfig,
    AggregatePaginationConfig,
    BuildBaseStagesConfig,
    AggregateModelQueries,
    AggregateReferenceQueries,
    AggregateBaseConfig,
    AggregateQueryOptions,
}

