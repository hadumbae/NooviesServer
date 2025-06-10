import {z} from "zod";
import {URLParamBooleanSchema} from "../url/URLParamBooleanSchema.js";
import {URLParamNumberSchema} from "../url/URLParamNumberSchema.js";

export const QueryOptionParamsSchema = z.object({
   populate: URLParamBooleanSchema.default(false),
   virtuals: URLParamBooleanSchema.default(false),
   paginated: URLParamBooleanSchema.default(false),
   limit: URLParamNumberSchema,
});

export type QueryOptionParams = z.infer<typeof QueryOptionParamsSchema>;