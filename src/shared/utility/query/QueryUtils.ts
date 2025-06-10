import type {Request} from "express";
import ZodParseError from "../../errors/ZodParseError.js";
import {type QueryOptionParams, QueryOptionParamsSchema} from "../../schema/query/QueryOptionParamsSchema.js";
import type {IQueryUtils} from "../../interfaces/query/IQueryUtils.js";
import {
    type QueryPaginationParams,
    QueryPaginationParamsSchema
} from "../../schema/query/QueryPaginationParamsSchema.js";

const QueryUtils: IQueryUtils = {
    fetchPaginationFromQuery(req: Request): QueryPaginationParams {
        const {success, data, error} = QueryPaginationParamsSchema.safeParse(req.query);

        if (!success) {
            const message = "Invalid Pagination Query.";
            throw new ZodParseError({message, errors: error.errors});
        }

        return data;
    },

    fetchOptionsFromQuery(req: Request): QueryOptionParams {
        const {success, data, error} = QueryOptionParamsSchema.safeParse(req.query);

        if (!success) {
            const message = "Invalid Query Options.";
            throw new ZodParseError({message, errors: error?.errors});
        }

        return data;
    },
}

export default QueryUtils;
