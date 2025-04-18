import {z} from "zod";
import transformZodParsedJSON from "../../../../shared/utility/zod/transformZodParsedJSON.js";
import {RequiredNumber} from "../../../../shared/schema/helpers/ZodNumberHelpers.js";

export const ScreenShowingQuerySchema = z.object({
    showingsPerScreen: z.string().optional().transform(transformZodParsedJSON<number>(RequiredNumber)),
});

export type ScreenShowingQuery = z.infer<typeof ScreenShowingQuerySchema>;