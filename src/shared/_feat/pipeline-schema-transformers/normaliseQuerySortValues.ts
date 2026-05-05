/**
 * @fileoverview Normalizes URL sort query parameters into a Mongoose sort stage format.
 */

import type {URLParamSortOrder} from "@shared/_feat/parse-query-string";
import type {Expression, PipelineStage} from "mongoose";

/** Normalizes URL sort query parameters into a Mongoose sort stage format. */
export function normaliseQuerySortValues(values: Record<string, URLParamSortOrder>): PipelineStage.Sort {
    const normalisedValues = Object.fromEntries(
        Object.entries(values)
            .filter(([, value]) => value !== undefined && value !== null)
            .map(([key, value]) => [
                key.replace(/^sortBy/, '').replace(/^./, (v) => v.toLowerCase()),
                value
            ]),
    ) as Record<string, 1 | -1 | Expression.Meta>;

    return {
        $sort: normalisedValues,
    };
}