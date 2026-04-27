/** @fileoverview Utility for safely extracting MongoDB sort criteria from validated query objects. */

import type {Expression} from "mongoose";
import type {AggregateQueryOptions} from "@shared/_feat/generic-aggregate";

/** Extracts sort criteria from a transformed Zod query output or returns an empty object fallback. */
export function getQueryOptionSorts(
    queries?: AggregateQueryOptions
): Record<string, 1 | -1 | Expression.Meta> {
    return queries?.match?.sorts?.$sort ?? {};
}