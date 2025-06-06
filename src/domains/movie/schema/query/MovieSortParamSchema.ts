import {z} from "zod";
import type {MovieQueryParamSchema} from "./MovieQueryParamSchema.js";
import {URLParamMongooseSortOrderSchema} from "../../../../shared/schema/url/URLParamMongooseSortOrderSchema.js";

export const MovieSortParamSchema = z.object({
    sortByReleaseDate: URLParamMongooseSortOrderSchema,
    sortByTitle: URLParamMongooseSortOrderSchema,
});

export type MovieSortParams = z.infer<typeof MovieQueryParamSchema>;