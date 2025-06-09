import type {Request} from 'express'
import {type FilterQuery, Types} from "mongoose";
import type {MovieQueryRequest} from "../../type/requests/MovieQueryRequest.js";
import type {MovieQueryMatchParams} from "../../schema/query/MovieQueryMatchParamSchema.js";
import type {MovieQuerySortParams} from "../../schema/query/MovieQuerySortParamSchema.js";

export default interface IMovieQueryService {
    getIDParam(req: Request): Types.ObjectId;
    getFilterQuery(req: MovieQueryRequest): FilterQuery<MovieQueryMatchParams>;
    getSortQuery(req: MovieQueryRequest): FilterQuery<MovieQuerySortParams>;
}