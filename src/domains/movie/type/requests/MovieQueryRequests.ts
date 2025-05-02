import type {Request} from "express";
import type {MovieQueryParams} from "../../schema/query/MovieQueryParamSchema.js";
import type {MovieSortParams} from "../../schema/query/MovieSortParamSchema.js";

export type MovieQueryRequest = Request<any, any, any, MovieQueryParams>;
export type MovieSortRequest = Request<any, any, any, MovieSortParams>;