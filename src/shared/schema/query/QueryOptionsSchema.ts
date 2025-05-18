import {z} from "zod";
import {ParamBoolean} from "../helpers/ZodBooleanHelpers.js";

export const QueryOptionsSchema = z.object({
   populate: ParamBoolean,
   virtuals: ParamBoolean,
});

export type QueryOptions = z.infer<typeof QueryOptionsSchema>;