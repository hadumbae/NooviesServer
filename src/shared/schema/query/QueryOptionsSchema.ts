import {z} from "zod";
import {ParamBoolean} from "../helpers/ZodBooleanHelpers.js";
import transformZodParsedJSON from "../../utility/zod/transformZodParsedJSON.js";
import {RequiredNumber} from "../helpers/ZodNumberHelpers.js";

export const QueryOptionsSchema = z.object({
   populate: ParamBoolean,
   virtuals: ParamBoolean,
   limit: z
       .string({invalid_type_error: "Must be a valid URL string."})
       .optional()
       .transform(transformZodParsedJSON<number>(RequiredNumber)),
});

export type QueryOptions = z.infer<typeof QueryOptionsSchema>;