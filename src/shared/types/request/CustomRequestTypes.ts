import type {Request} from "express";
import type {QueryOptions} from "../../schema/query/QueryOptionsSchema.js";

export type PaginationRequest = Request<any, any, any, {page?: number, perPage?: number}>;
export type PopulateRequest = Request<any, any, any, {populate?: boolean}>;
export type QueryOptionsRequest = Request<any, any, any, QueryOptions>;
