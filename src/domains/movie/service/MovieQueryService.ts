import type {FilterQuery, SortOrder} from "mongoose";
import {MovieQueryParamSchema} from "../schema/query/MovieQueryParamSchema.js";
import ZodParseErrorHandler from "../../../shared/utility/zod/ZodParseErrorHandler.js";
import filterNullArray from "../../../shared/utility/filterNullArray.js";
import {MovieSortParamSchema} from "../schema/query/MovieSortParamSchema.js";
import type IMovieQueryService from "../interface/service/IMovieQueryService.js";
import type {MovieQueryRequest, MovieSortRequest} from "../type/requests/MovieQueryRequests.js";

export default class MovieQueryService implements IMovieQueryService {
    getSortQuery(req: MovieSortRequest): Record<string, SortOrder> {
        try {
            const {sortByReleaseDate, sortByTitle} = MovieSortParamSchema.parse(req.query);
            const conditions = {releaseDate: sortByReleaseDate, title: sortByTitle};
            return filterNullArray(conditions);
        } catch (error: any) {
            ZodParseErrorHandler(error, "Invalid URL Query Params.");
            throw error;
        }
    }

    getFilterQuery(req: MovieQueryRequest): FilterQuery<any> {
        try {
            const {title, releaseDate, genres} = MovieQueryParamSchema.parse(req.query);
            const conditions = {title, releaseDate, genres: {$all: genres}};
            return filterNullArray(conditions);
        } catch (error: any) {
            ZodParseErrorHandler(error, "Invalid URL Query Params.");
            throw error;
        }
    }
}