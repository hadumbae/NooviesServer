import {z} from "zod";
import transformZodParsedJSON from "../../../../shared/utility/zod/transformZodParsedJSON.js";
import {RequiredStringSchema} from "../../../../shared/schema/helpers/ZodStringHelpers.js";

export const MovieCreditPopulateQueryParamsSchema = z.object({
    name: z
        .string({invalid_type_error: "Must be a valid URL string."})
        .optional()
        .transform(transformZodParsedJSON<string>(RequiredStringSchema)),

    title: z
        .string({invalid_type_error: "Must be a valid URL string."})
        .optional()
        .transform(transformZodParsedJSON<string>(RequiredStringSchema)),
});