import type {PaginationRequest} from "../types/request/CustomRequestTypes.js";

type PaginationQueryReturns = {page: number, perPage: number};

export interface IPaginationUtils {
    fetchPaginationFromQuery(req: PaginationRequest): PaginationQueryReturns;
}

const PaginationUtils: IPaginationUtils = {
    fetchPaginationFromQuery(req: PaginationRequest): PaginationQueryReturns {
        const page = req.query.page || parseInt(process.env.PAGINATION_PAGE_DEFAULT!);
        const perPage = req.query.perPage || parseInt(process.env.PAGINATION_PER_PAGE_DEFAULT!);

        return { page, perPage };
    }
};

export default PaginationUtils;