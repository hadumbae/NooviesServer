import type {PaginationRequest, PopulateRequest} from "../../types/request/CustomRequestTypes.js";
import {PaginationSchema} from "../../schema/PaginationSchemas.js";
import ZodParseError from "../../errors/ZodParseError.js";
import {ParamBoolean} from "../../schema/helpers/ZodBooleanHelpers.js";

type PopulateQueryReturn = boolean | undefined;
type PaginationQueryReturns = {page: number, perPage: number};

export interface IQueryUtils {
    fetchPopulateFromQuery(req: PopulateRequest): PopulateQueryReturn;
    fetchPaginationFromQuery(req: PaginationRequest): PaginationQueryReturns;
}

const QueryUtils: IQueryUtils = {
    fetchPopulateFromQuery(req: PopulateRequest): PopulateQueryReturn {
        const populate =  req.query.populate;
        const result = ParamBoolean.safeParse(populate);

        if (!result.success) {
            throw new ZodParseError({
                message: "Invalidate `Populate` Query.",
                errors: result.error.errors,
            });
        }

        return result.data;
    },

    fetchPaginationFromQuery(req: PaginationRequest): PaginationQueryReturns {
        const page = req.query.page || parseInt(process.env.PAGINATION_PAGE_DEFAULT!);
        const perPage = req.query.perPage || parseInt(process.env.PAGINATION_PER_PAGE_DEFAULT!);

        const result = PaginationSchema.safeParse({
            page,
            perPage,
        });

        if (!result.success) {
            throw new ZodParseError({
                message: "Validation Failed.",
                errors: result.error.errors,
            });
        }

        return result.data!;
    }
}

export default QueryUtils;
