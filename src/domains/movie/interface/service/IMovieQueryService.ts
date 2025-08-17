import type {Request} from 'express'
import {type FilterQuery, Types} from "mongoose";
import type {MovieQueryRequest} from "../../type/requests/MovieQueryRequest.js";

import type {MovieQueryFilters, MovieQuerySorts} from "../../schema/query/MovieFilters.types.js";

export default interface IMovieQueryService {
    getIDParam(req: Request): Types.ObjectId;
    getFilterQuery(req: MovieQueryRequest): FilterQuery<MovieQueryFilters>;
    getSortQuery(req: MovieQueryRequest): FilterQuery<MovieQuerySorts>;
}