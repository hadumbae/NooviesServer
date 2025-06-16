import {z} from "zod";
import transformZodParsedJSON from "../../../../shared/utility/zod/transformZodParsedJSON.js";

import {PositiveNumberSchema} from "../../../../shared/schema/numbers/PositiveNumberSchema.js";

export const MovieCreditOptionQueryParamsSchema = z.object({
    limit: z
        .string({invalid_type_error: "Must be a valid URL string."})
        .optional()
        .transform(transformZodParsedJSON(PositiveNumberSchema)),
});