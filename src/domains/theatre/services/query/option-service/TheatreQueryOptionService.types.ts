import type {
    TheatreMatchFilters,
    TheatreQueryOptions,
    TheatreSorts
} from "../../../schema/query/TheatreQueryOptions.types.js";

import type {Request} from "express";
import type {FilterQuery} from "mongoose";

export interface ITheatreQueryOptionService {
    fetchQueryParams(req: Request): TheatreQueryOptions;
    generateMatchFilters(params: TheatreQueryOptions): FilterQuery<TheatreMatchFilters>;
    generateQuerySorts(params: TheatreQueryOptions): TheatreSorts;
}