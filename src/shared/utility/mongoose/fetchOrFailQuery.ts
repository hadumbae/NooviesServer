/**
 * @file Executes a Mongoose Query and throws an HTTP error if the result is nullish.
 * fetchOrFailQuery.ts
 */

import type {Query} from "mongoose";
import createHttpError from "http-errors";

/**
 * Parameters for `fetchOrFailQuery`
 */
type QueryParams<TResult, TDoc> = {
    query: Query<TResult, TDoc>;
    httpCode?: number;
    errorMessage?: string;
}

/**
 * Resolves a Query or throws if no result is found.
 */
export async function fetchOrFailQuery<TResult, TDoc>(
    params: QueryParams<TResult, TDoc>
): Promise<NonNullable<TResult>> {
    const {query, httpCode = 404, errorMessage = "Not Found"} = params;

    const item = await query;

    if (!item) {
        throw createHttpError(httpCode, errorMessage);
    }

    return item;
}