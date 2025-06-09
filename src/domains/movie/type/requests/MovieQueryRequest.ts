import type {Request} from "express";
import type {MovieQuerySortParams} from "../../schema/query/MovieQuerySortParamSchema.js";
import type {MovieQueryMatchParams} from "../../schema/query/MovieQueryMatchParamSchema.js";

export type MovieQueryRequest = Request<any, any, any, MovieQueryMatchParams & MovieQuerySortParams>;

