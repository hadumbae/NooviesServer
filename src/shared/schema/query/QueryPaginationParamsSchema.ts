import {z} from "zod";
import {URLParamNumberSchema} from "../url/URLParamNumberSchema.js";

export const QueryPaginationParamsSchema = z.object({
    page: URLParamNumberSchema.default(Number(process.env.PAGINATION_PAGE_DEFAULT!)),
    perPage: URLParamNumberSchema.default(Number(process.env.PAGINATION_PER_PAGE_DEFAULT!)),
});

export type QueryPaginationParams = z.infer<typeof QueryPaginationParamsSchema>;