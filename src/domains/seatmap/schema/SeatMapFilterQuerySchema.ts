import {z} from "zod";
import {RequiredBoolean} from "../../../shared/schema/helpers/ZodBooleanHelpers.js";
import {RequiredNumber} from "../../../shared/schema/helpers/ZodNumberHelpers.js";
import {RequiredString} from "../../../shared/schema/helpers/ZodStringHelpers.js";
import ZodJSONParseTransform from "../../../shared/utility/zod/ZodJSONParseTransform.js";
import {type SeatType, SeatTypeEnum} from "../../seat/schema/enum/SeatTypeEnum.js";

export const SeatMapFilterQuerySchema = z.object({
    isAvailable: z.string().optional()
        .transform(ZodJSONParseTransform<boolean>(z.boolean())),

    isReserved: z.string().optional()
        .transform(ZodJSONParseTransform<boolean>(RequiredBoolean)),

    price: z.string().optional()
        .transform(ZodJSONParseTransform<number>(RequiredNumber)),

    seatRow: z.string().optional()
        .transform(ZodJSONParseTransform<string>(RequiredString)),

    seatNumber: z.string().optional()
        .transform(ZodJSONParseTransform<string>(RequiredString)),

    seatType: z.string().optional()
        .transform(ZodJSONParseTransform<SeatType>(SeatTypeEnum)),
});