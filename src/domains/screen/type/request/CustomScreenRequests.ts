import type {Request} from "express";
import type {ScreenShowingQuery} from "../../schema/query/ScreenShowingQuerySchema.js";
import type {ScreenQuery} from "../../schema/query/ScreenQuerySchema.js";

export type ScreenQueryRequest = Request<any, any, any, ScreenQuery>;
export type ScreenShowingQueryRequest = Request<any, any, any, ScreenShowingQuery>;