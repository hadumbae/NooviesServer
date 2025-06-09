import {z} from "zod";
import transformZodParsedJSON from "../../../../shared/utility/zod/transformZodParsedJSON.js";

import {CoercedNumberSchema} from "../../../../shared/schema/numbers/CoercedNumberSchema.js";

export const ScreenShowingQuerySchema = z.object({
    showingsPerScreen: z.string().optional().transform(transformZodParsedJSON<number>(CoercedNumberSchema)),
});

export type ScreenShowingQuery = z.infer<typeof ScreenShowingQuerySchema>;