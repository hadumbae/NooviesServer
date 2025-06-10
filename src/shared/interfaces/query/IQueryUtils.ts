import type {Request} from "express";

import type {QueryOptionParams} from "../../schema/query/QueryOptionParamsSchema.js";
import type {QueryPaginationParams} from "../../schema/query/QueryPaginationParamsSchema.js";

export interface IQueryUtils {
    fetchPaginationFromQuery(req: Request): QueryPaginationParams;
    fetchOptionsFromQuery(req: Request): QueryOptionParams;
}