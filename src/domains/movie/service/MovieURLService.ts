import type {Request} from 'express';
import type {FilterQuery, SortOrder} from "mongoose";
import {MovieQueryParamSchema} from "../schema/query/MovieQueryParamSchema.js";
import ZodParseErrorHandler from "../../../shared/utility/zod/ZodParseErrorHandler.js";
import filterNullArray from "../../../shared/utility/filterNullArray.js";
import {MovieSortParamSchema} from "../schema/query/MovieSortParamSchema.js";
import type IMovieURLService from "../interface/service/IMovieURLService.js";
import type {MovieQueryRequest, MovieSortRequest} from "../type/requests/MovieQueryRequests.js";
import {ObjectIdStringSchema} from "../../../shared/schema/helpers/ZodStringHelpers.js";
import ZodParseError from "../../../shared/errors/ZodParseError.js";

export default class MovieURLService implements IMovieURLService {
    getIDParam(req: Request): string {
        const {_id} = req.params;
        const {data, success, error} = ObjectIdStringSchema.safeParse(_id);

        if (success) return data;
        throw new ZodParseError({message: "Invalid ID Provided.", errors: error?.issues});
    }

    getSortQuery(req: MovieSortRequest): Record<string, SortOrder> {
        try {
            const {sortByReleaseDate, sortByTitle} = MovieSortParamSchema.parse(req.query);
            const conditions = {releaseDate: sortByReleaseDate, title: sortByTitle};
            return filterNullArray(conditions) as Record<string, SortOrder>;
        } catch (error: any) {
            ZodParseErrorHandler(error, "Invalid URL Query Params.");
            throw error;
        }
    }

    getFilterQuery(req: MovieQueryRequest): FilterQuery<any> {
        try {
            const {_id, title, releaseDate, genres} = MovieQueryParamSchema.parse(req.query);
            const conditions = {_id, title, releaseDate, genres: genres && {$all: genres}};
            return filterNullArray(conditions);
        } catch (error: any) {
            ZodParseErrorHandler(error, "Invalid URL Query Params.");
            throw error;
        }
    }
}