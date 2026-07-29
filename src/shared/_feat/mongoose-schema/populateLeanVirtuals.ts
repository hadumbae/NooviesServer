/**
 * @fileoverview Utility for conditionally populating Mongoose virtuals when using lean queries.
 */

import type {BaseModel} from "@/shared/_types";
import type {PopulateOptions, Query} from "mongoose";

/** Configuration for executing a population operation on a Mongoose query. */
type PopulationConfig<TSchema extends BaseModel> = {
    query: Query<any, TSchema>;
    lean?: boolean | Record<string, any> | undefined;
    options?: PopulateOptions | (PopulateOptions | string)[];
}

/**
 * Applies population options to a query if the lean configuration explicitly requests virtuals.
 */
export function populateLeanVirtuals<TSchema extends BaseModel>(
    {query, lean, options = []}: PopulationConfig<TSchema>
): void {
    const hasVirtuals = typeof lean === "object" && lean.virtuals === true;

    if (hasVirtuals) {
        query.populate(options);
    }
}