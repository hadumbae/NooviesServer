/**
 * @fileoverview High-level dispatcher for MongoDB aggregation operations.
 * Automatically switches between paginated facet queries and direct array
 * fetches based on the presence of pagination parameters in the request options.
 */

import type {BaseModel} from "@shared/types/schema/BaseModel";
import type {AggregateBaseConfig} from "@shared/_feat/generic-aggregate/configTypes";
import type {RequestOptions} from "@shared/_feat/fetch-request-options/schemas";
import {aggregatePaginated} from "@shared/_feat/generic-aggregate/aggregatePaginated";
import {aggregateFind} from "@shared/_feat/generic-aggregate/aggregateFind";

/**
 * Configuration for the aggregate dispatcher.
 */
export type AggregateQueryConfig<TSchema extends BaseModel> = AggregateBaseConfig<TSchema> & {
    options: Omit<RequestOptions, "limit">;
};

/**
 * Orchestrates aggregation execution by determining the appropriate strategy.
 */
export async function aggregateQuery<TSchema extends BaseModel, TReturns = unknown>(
    params: AggregateQueryConfig<TSchema>
): Promise<TReturns> {
    const {page, perPage = 10, ...remOptions} = params.options;

    if (page) {
        return aggregatePaginated({
            ...params,
            options: {page, perPage, ...remOptions}
        }) as Promise<TReturns>;
    }

    return aggregateFind(params) as Promise<TReturns>;
}