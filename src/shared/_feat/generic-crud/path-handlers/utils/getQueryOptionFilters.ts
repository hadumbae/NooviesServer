/** @fileoverview Utility for safely extracting MongoDB filter criteria from validated query objects. */

import type {AggregateQueryOptions} from "@shared/_feat/generic-aggregate";
import type {RootFilterQuery} from "mongoose";
import type {BaseModel} from "@shared/types/schema/BaseModel";

/** Extracts the match filter criteria from query options or returns an empty object fallback. */
export function getQueryOptionFilters<TModel extends BaseModel>(
    queries?: AggregateQueryOptions
): RootFilterQuery<TModel> {
    return queries?.match?.filters?.$match ?? {};
}