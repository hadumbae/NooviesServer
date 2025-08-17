import type {Request} from "express";
import type {MovieQueryFilters, MovieQuerySorts} from "../../schema/query/MovieFilters.types.js";

export type MovieQueryRequest = Request<any, any, any, MovieQueryFilters & MovieQuerySorts>;

