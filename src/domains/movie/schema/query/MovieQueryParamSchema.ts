import {z} from "zod";
import {
    ParsedObjectIdStringSchema,
} from "../../../../shared/schema/helpers/ZodStringHelpers.js";
import {URLParamObjectIDSchema} from "../../../../shared/schema/url/URLParamObjectIDSchema.js";
import {URLParamStringSchema} from "../../../../shared/schema/url/URLParamStringSchema.js";
import {URLParamDateStringSchema} from "../../../../shared/schema/url/URLParamDateStringSchema.js";
import generateURLParamArraySchema from "../../../../shared/utility/zod/generateURLParamArraySchema.js";

export const MovieQueryParamSchema = z.object({
    _id: URLParamObjectIDSchema,
    title: URLParamStringSchema,
    releaseDate: URLParamDateStringSchema,
    genres: generateURLParamArraySchema(ParsedObjectIdStringSchema),
});

export type MovieQueryParams = z.infer<typeof MovieQueryParamSchema>;