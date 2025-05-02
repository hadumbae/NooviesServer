import {z} from "zod";
import {RequiredStringSchema} from "../../../../shared/schema/helpers/ZodStringHelpers.js";
import transformZodParsedJSON from "../../../../shared/utility/zod/transformZodParsedJSON.js";
import type {SortOrder} from "mongoose";
import {MongooseSortOrderSchema} from "../../../../shared/schema/mongoose/MongooseSortOrderSchema.js";
import type {MovieQueryParamSchema} from "./MovieQueryParamSchema.js";

export const MovieSortParamSchema = z.object({
    sortByReleaseDate: RequiredStringSchema.optional().transform(transformZodParsedJSON<SortOrder>(MongooseSortOrderSchema)),
    sortByTitle: RequiredStringSchema.optional().transform(transformZodParsedJSON<SortOrder>(MongooseSortOrderSchema)),
});

export type MovieSortParams = z.infer<typeof MovieQueryParamSchema>;