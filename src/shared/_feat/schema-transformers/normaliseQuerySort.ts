/**
 * @fileoverview Utility for transforming URL sort parameters into Mongoose-compatible sort objects.
 */

import type {URLParamSortOrder} from "@/shared/_feat/parse-query-string";

/**
 * Converts URL query sort parameters by removing prefixes and adjusting casing to match database schema fields.
 */
export function normaliseQuerySort(
    values: Record<string, URLParamSortOrder>
): Record<string, 1 | -1> {
    return Object.fromEntries(
        Object.entries(values)
            .filter(([, value]) => value !== undefined && value !== null)
            .map(([key, value]) => [
                key.replace(/^sortBy/, '').replace(/^./, (v) => v.toLowerCase()),
                value
            ]),
    ) as Record<string, 1 | -1>;
}