import type {Request} from "express";

export type PaginationRequest = Request<any, any, any, {page?: number, perPage?: number}>
