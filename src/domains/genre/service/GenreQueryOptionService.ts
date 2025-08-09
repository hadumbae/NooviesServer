import type {Request} from "express";
import type {GenreQueryFilters, GenreQueryOptions} from "../schema/options/GenreFilters.types.js";
import type {FilterQuery, SortOrder} from "mongoose";
import {GenreQueryOptionsSchema} from "../schema/options/GenreFilters.schema.js";
import filterNullArray from "../../../shared/utility/filterNullArray.js";
import type IGenre from "../model/Genre.interface.js";

interface IGenreQueryOptionService {
    fetchQueryParams(req: Request): GenreQueryOptions;
    generateMatchFilters(params: GenreQueryOptions): FilterQuery<GenreQueryFilters>;
    generateQuerySorts(params: GenreQueryOptions): Partial<Record<keyof IGenre, SortOrder>>;
}

export default class GenreQueryOptionService implements IGenreQueryOptionService {
    fetchQueryParams(req: Request): GenreQueryOptions {
        const conditions = GenreQueryOptionsSchema.parse(req.query);
        return filterNullArray(conditions) as GenreQueryOptions;
    }

    generateMatchFilters(params: GenreQueryOptions): FilterQuery<GenreQueryFilters> {
        const {name} = params;

        const filters = {
          name: name && {$regex: name, $options: "i"},
        };

        return filterNullArray(filters);
    }

    generateQuerySorts(params: GenreQueryOptions): Partial<Record<keyof IGenre, SortOrder>> {
        const {sortByName} = params;

        const sorts: Partial<Record<keyof IGenre, SortOrder | undefined>> = {
            name: sortByName,
        };

        return filterNullArray(sorts);
    }
}