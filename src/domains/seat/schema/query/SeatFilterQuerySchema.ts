import {z} from "zod";
import ZodJSONParseTransform from "../../../../shared/utility/zod/ZodJSONParseTransform.js";
import {IDString, RequiredString} from "../../../../shared/schema/helpers/ZodStringHelpers.js";
import {type SeatType, SeatTypeEnum} from "../enum/SeatTypeEnum.js";
import {RequiredBoolean} from "../../../../shared/schema/helpers/ZodBooleanHelpers.js";

export const SeatFilterQuerySchema = z.object({
    theatre: z.string().optional()
        .transform(
            ZodJSONParseTransform<string>(IDString)
        ),

    screen: z.string().optional()
        .transform(
            ZodJSONParseTransform<string>(IDString)
        ),

    row: z.string().optional()
        .transform(
            ZodJSONParseTransform<string>(RequiredString)
        ),

    seatNumber: z.string().optional()
        .transform(
            ZodJSONParseTransform<string>(IDString)
        ),

    seatType: z.string().optional()
        .transform(
            ZodJSONParseTransform<SeatType>(SeatTypeEnum)
        ),

    isAvailable: z.string().optional()
        .transform(
            ZodJSONParseTransform<boolean>(RequiredBoolean)
        ),
});