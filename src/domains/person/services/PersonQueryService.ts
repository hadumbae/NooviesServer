import type {Request} from "express";
import {PersonQueryFiltersSchema} from "../schema/query/PersonFilters.schema.js";
import ZodParseError from "../../../shared/errors/ZodParseError.js";
import {type FilterQuery, type SortOrder} from "mongoose";
import type {PersonQueryFilters, PersonQueryOptions} from "../schema/query/PersonFilters.types.js";
import filterNullArray from "../../../shared/utility/filterNullArray.js";
import type {IPerson} from "../interfaces/IPerson.js";

interface IPersonQueryService {
    fetchQueryParams: (req: Request) => PersonQueryOptions;
    generateQueryFilters: (queries: PersonQueryOptions) => FilterQuery<PersonQueryFilters>;
    generateQuerySorts: (queries: PersonQueryOptions) => Partial<Record<keyof IPerson, SortOrder>>;
}

export default class PersonQueryService implements IPersonQueryService {
    fetchQueryParams(req: Request): PersonQueryFilters {
        const {success, data, error} = PersonQueryFiltersSchema.safeParse(req.query);

        if (!success) {
            const message = "Invalid Query Parameters.";
            throw new ZodParseError({message, errors: error.errors});
        }

        return data;
    }

    generateQueryFilters(queries: PersonQueryOptions): FilterQuery<PersonQueryFilters> {
        const {_id, name, nationality, ...sortQueries} = queries;

        const filters = {
            _id,
            nationality,
            ...(name && {name: {$regex: name, $options: "i"}}),
        };

        return filterNullArray(filters);
    }

    generateQuerySorts(queries: PersonQueryOptions): Partial<Record<keyof IPerson, SortOrder>> {
        const {sortByName, sortByNationality, ...matchQueries} = queries;
        const sorts = {name: sortByName, nationality: sortByNationality};
        return filterNullArray(sorts);
    }
}