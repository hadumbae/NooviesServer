import type {Request} from 'express'
import type {FilterQuery} from "mongoose";
import type {MovieQueryRequest} from "../../type/requests/MovieQueryRequests.js";

export default interface IMovieURLService {
    getIDParam(req: Request): string;
    getFilterQuery(req: MovieQueryRequest): FilterQuery<any>;
    getSortQuery(req: MovieQueryRequest): FilterQuery<any>;
}