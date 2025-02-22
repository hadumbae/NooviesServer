import {z} from "zod";

import {type SeatType, SeatTypeEnum} from "../enum/SeatTypeEnum.js";
import {RequiredBoolean} from "../../../../shared/schema/helpers/ZodBooleanHelpers.js";
import {IDString, RequiredString} from "../../../../shared/schema/helpers/ZodStringHelpers.js";

import transformZodParsedJSON from "../../../../shared/utility/zod/transformZodParsedJSON.js";

export const SeatQuerySchema = z.object({
    theatre: z.string().optional().transform(transformZodParsedJSON<string>(IDString)),
    screen: z.string().optional().transform(transformZodParsedJSON<string>(IDString)),
    row: z.string().optional().transform(transformZodParsedJSON<string>(RequiredString)),
    seatNumber: z.string().optional().transform(transformZodParsedJSON<string>(IDString)),
    seatType: z.string().optional().transform(transformZodParsedJSON<SeatType>(SeatTypeEnum)),
    isAvailable: z.string().optional().transform(transformZodParsedJSON<boolean>(RequiredBoolean)),
});

export type SeatQuery = z.infer<typeof SeatQuerySchema>;