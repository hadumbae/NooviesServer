import {z} from "zod";
import ZodJSONParseTransform from "../../../../shared/utility/zod/transformZodParsedJSON.js";
import {RequiredBoolean} from "../../../../shared/schema/helpers/ZodBooleanHelpers.js";

export const ShowingSeatQuerySchema = z.object({
    populate: z.string().optional().transform(ZodJSONParseTransform<boolean>(RequiredBoolean)),
    mapped: z.string().optional().transform(ZodJSONParseTransform<boolean>(RequiredBoolean)),
});

export type ShowingSeatQuery = z.infer<typeof ShowingSeatQuerySchema>;