import {z} from "zod";
import transformZodParsedJSON from "../../../../shared/utility/zod/transformZodParsedJSON.js";
import {PositiveNumber} from "../../../../shared/schema/helpers/ZodNumberHelpers.js";

export const MovieCreditOptionQueryParamsSchema = z.object({
    limit: z
        .string({invalid_type_error: "Must be a valid URL string."})
        .optional()
        .transform(transformZodParsedJSON(PositiveNumber)),
});