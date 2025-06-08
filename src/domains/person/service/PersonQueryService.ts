import type {Request} from "express";
import {type PersonQueryParams, PersonQueryParamsSchema} from "../schema/query/PersonQueryParamsSchema.js";
import ZodParseError from "../../../shared/errors/ZodParseError.js";
import {type FilterQuery} from "mongoose";

interface IPersonQueryService {
    fetchQueryParams: (req: Request) => PersonQueryParams;
    generateMatchFilters: (queries: PersonQueryParams) => FilterQuery<PersonQueryParams>;
}

export default class PersonQueryService implements IPersonQueryService {
    fetchQueryParams(req: Request): PersonQueryParams {
        const {success, data, error} = PersonQueryParamsSchema.safeParse(req.query);
        if (!success) throw new ZodParseError({message: "Failed To Parse Person Params.", errors: error.errors});
        return data;
    }

    generateMatchFilters(queries: PersonQueryParams): FilterQuery<PersonQueryParams> {
        const {_id, name, nationality} = queries

        return {
            _id,
            nationality,
            name: {$regex: name, $options: "i"},
        };
    }
}