/**
 * @fileoverview Utility for applying population, selection, and lean configurations to Mongoose queries.
 */

import type {Query} from "mongoose";
import type {QueryConfig} from "@/shared/_types/query-config/QueryConfig";

/** Parameters for the populateQuery utility function. */
type QueryParams<ResultType, DocType> = {
    query: Query<ResultType, DocType>;
    config?: QueryConfig;
};

/**
 * Applies population, selection, and lean configurations to a Mongoose query based on request options.
 */
export default function populateQuery<ResultType, DocType>(
    {query, config}: QueryParams<ResultType, DocType>,
): Query<ResultType, DocType> {
    const {populate, virtuals, lean, select, populatePaths = []} = config ?? {};

    if (select) query.select(select);
    if (populate) query.populate(populatePaths);
    if (virtuals) query.lean({virtuals: true});
    if (!virtuals && lean) query.lean();

    return query;
}
