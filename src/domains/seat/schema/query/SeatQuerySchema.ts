import {z} from "zod";

import {type SeatType, SeatTypeEnum} from "../enum/SeatTypeEnum.js";
import {RequiredBoolean} from "../../../../shared/schema/helpers/ZodBooleanHelpers.js";
import {ObjectIdStringSchema, RequiredStringSchema} from "../../../../shared/schema/helpers/ZodStringHelpers.js";

import transformZodParsedJSON from "../../../../shared/utility/zod/transformZodParsedJSON.js";

export const SeatQuerySchema = z.object({
    theatre: z.string().optional().transform(transformZodParsedJSON<string>(ObjectIdStringSchema)),
    screen: z.string().optional().transform(transformZodParsedJSON<string>(ObjectIdStringSchema)),
    row: z.string().optional().transform(transformZodParsedJSON<string>(RequiredStringSchema)),
    seatNumber: z.string().optional().transform(transformZodParsedJSON<string>(ObjectIdStringSchema)),
    seatType: z.string().optional().transform(transformZodParsedJSON<SeatType>(SeatTypeEnum)),
    isAvailable: z.string().optional().transform(transformZodParsedJSON<boolean>(RequiredBoolean)),
});

export type SeatQuery = z.infer<typeof SeatQuerySchema>;