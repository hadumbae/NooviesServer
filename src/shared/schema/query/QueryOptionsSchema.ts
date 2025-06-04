import {z} from "zod";
import {URLParamBooleanSchema} from "../url/URLParamBooleanSchema.js";
import {URLParamNumberSchema} from "../url/URLParamNumberSchema.js";

export const QueryOptionsSchema = z.object({
   populate: URLParamBooleanSchema,
   virtuals: URLParamBooleanSchema,
   limit: URLParamNumberSchema,
});

export type QueryOptions = z.infer<typeof QueryOptionsSchema>;