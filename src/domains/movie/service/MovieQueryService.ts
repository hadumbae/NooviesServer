import type {Request} from 'express';
import {type FilterQuery, type SortOrder, Types} from "mongoose";
import filterNullArray from "../../../shared/utility/filterNullArray.js";
import type IMovieQueryService from "../interface/service/IMovieQueryService.js";
import ZodParseError from "../../../shared/errors/ZodParseError.js";
import type {MovieQueryRequest} from "../type/requests/MovieQueryRequest.js";
import {ParsedObjectIdStringSchema} from "../../../shared/schema/strings/ParsedObjectIdStringSchema.js";
import {MovieQueryFiltersSchema, MovieQuerySortsSchema} from "../schema/query/MovieFilters.schema.js";

export default class MovieQueryService implements IMovieQueryService {
    getIDParam(req: Request): Types.ObjectId {
        const {_id} = req.params;
        const {data, success, error} = ParsedObjectIdStringSchema.safeParse(_id);

        if (!success) {
            const message = "Invalid ID Provided.";
            throw new ZodParseError({message, errors: error?.issues});
        }

        return data;
    }

    getSortQuery(req: MovieQueryRequest): Record<string, SortOrder> {
        const {success, data, error} = MovieQuerySortsSchema.safeParse(req.query);

        if (!success) {
            const message = "Invalid URL Query Params.";
            throw new ZodParseError({message, errors: error?.issues, raw: req.query});
        }

        const {sortByReleaseDate, sortByTitle} = data;
        return filterNullArray({releaseDate: sortByReleaseDate, title: sortByTitle});
    }

    getFilterQuery(req: MovieQueryRequest): FilterQuery<any> {
        const {success, data, error} = MovieQueryFiltersSchema.safeParse(req.query);

        if (!success) {
            const message = "Invalid URL Query Params.";
            throw new ZodParseError({message, errors: error?.issues, raw: req.query});
        }

        const {_id, title, releaseDate, genres} = data;
        const conditions = {_id, title, releaseDate, ...(genres?.length ? {genres: {$all: genres}} : {})};
        return filterNullArray(conditions);
    }
}