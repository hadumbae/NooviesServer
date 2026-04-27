/** @fileoverview Type definitions for configuring lean data fetching operations. */

import {type Expression, type RootFilterQuery} from "mongoose";
import type {BaseModel} from "@shared/types/schema/BaseModel";

/** Configuration for filtering and sorting lean database queries. */
export type FetchLeanDataConfig<TModel extends BaseModel> = {
    filters?: RootFilterQuery<TModel>;
    sorts?: Record<string, 1 | -1 | Expression.Meta>;
}