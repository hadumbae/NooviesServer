import type {FilterQuery} from "mongoose";
import type {MovieQueryRequest} from "../../type/requests/MovieQueryRequests.js";

export default interface IMovieQueryService {
    getFilterQuery(req: MovieQueryRequest): FilterQuery<any>;
    getSortQuery(req: MovieQueryRequest): FilterQuery<any>;
}