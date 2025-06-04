import {z} from "zod";
import transformZodParsedJSON from "../../../../shared/utility/zod/transformZodParsedJSON.js";
import {
    ParsedObjectIdStringArraySchema,
    ParsedObjectIdStringSchema,
    RequiredStringSchema
} from "../../../../shared/schema/helpers/ZodStringHelpers.js";
import {Types} from "mongoose";
import {DateStringSchema} from "../../../../shared/schema/helpers/ZodDateHelpers.js";

export const MovieQueryParamSchema = z.object({
    _id: z.string().optional().transform(transformZodParsedJSON<string>(ParsedObjectIdStringSchema)),
    title: z.string().optional().transform(transformZodParsedJSON<string>(RequiredStringSchema)),
    releaseDate: z.string().optional().transform(transformZodParsedJSON<string>(DateStringSchema)),
    genres: z.string().optional().transform(transformZodParsedJSON<Types.ObjectId[]>(ParsedObjectIdStringArraySchema)),
});

export type MovieQueryParams = z.infer<typeof MovieQueryParamSchema>;