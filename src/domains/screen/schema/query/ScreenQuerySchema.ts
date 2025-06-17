import {z} from "zod";
import transformZodParsedJSON from "../../../../shared/utility/zod/transformZodParsedJSON.js";

import {ObjectIdStringSchema} from "../../../../shared/schema/strings/ObjectIdStringSchema.js";

export const ScreenQuerySchema = z.object({
    theatre: z.string().optional().transform(transformZodParsedJSON<string>(ObjectIdStringSchema)),
});

export type ScreenQuery = z.infer<typeof ScreenQuerySchema>;