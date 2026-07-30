/**
 * @fileoverview Configuration for fetching lean data from the database.
 */

import type {BaseModel} from "@/shared/_types/model/BaseModel";
import type {Expression, RootFilterQuery} from "mongoose";

/** Configuration for filtering and sorting lean data queries. */
export type FetchLeanDataConfig<TModel extends BaseModel> = {
    filters?: RootFilterQuery<TModel>;
    sorts?: Record<string, 1 | -1 | Expression.Meta>;
}