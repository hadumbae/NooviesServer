import {z} from "zod";
import transformZodParsedJSON from "../../../../shared/utility/zod/transformZodParsedJSON.js";
import {IDString} from "../../../../shared/schema/helpers/ZodStringHelpers.js";

export const ScreenQuerySchema = z.object({
    theatre: z.string().optional().transform(transformZodParsedJSON<string>(IDString)),
});

export type ScreenQuery = z.infer<typeof ScreenQuerySchema>;