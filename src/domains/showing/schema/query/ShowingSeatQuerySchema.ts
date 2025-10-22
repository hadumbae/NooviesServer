import {z} from "zod";
import ZodJSONParseTransform from "../../../../shared/utility/zod/transformZodParsedJSON.js";

import {BooleanValueSchema} from "../../../../shared/schema/booleans/BooleanValueSchema.js";

export const ShowingSeatQuerySchema = z.object({
    populate: z.string().optional().transform(ZodJSONParseTransform<boolean>(BooleanValueSchema)),
    mapped: z.string().optional().transform(ZodJSONParseTransform<boolean>(BooleanValueSchema)),
});

export type ShowingSeatQuery = z.infer<typeof ShowingSeatQuerySchema>;