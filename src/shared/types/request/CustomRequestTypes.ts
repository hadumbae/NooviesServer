import type {Request} from "express";

export type PaginationRequest = Request<any, any, any, {page?: number, perPage?: number}>;
export type PopulateRequest = Request<any, any, any, {populate?: boolean}>;
