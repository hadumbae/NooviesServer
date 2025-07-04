import {z} from "zod";
import ZodJSONParseTransform from "../../../shared/utility/zod/transformZodParsedJSON.js";
import {type SeatType, SeatTypeEnum} from "../../seat/schema/enum/SeatTypeEnum.js";
import {CoercedNumberSchema} from "../../../shared/schema/numbers/CoercedNumberSchema.js";
import {RequiredStringSchema} from "../../../shared/schema/strings/RequiredStringSchema.js";
import {RequiredBoolean} from "../../../shared/schema/booleans/RequiredBoolean.js";

export const SeatMapFilterQuerySchema = z.object({
    isAvailable: z.string().optional()
        .transform(ZodJSONParseTransform<boolean>(z.boolean())),

    isReserved: z.string().optional()
        .transform(ZodJSONParseTransform<boolean>(RequiredBoolean)),

    price: z.string().optional()
        .transform(ZodJSONParseTransform<number>(CoercedNumberSchema)),

    seatRow: z.string().optional()
        .transform(ZodJSONParseTransform<string>(RequiredStringSchema)),

    seatNumber: z.string().optional()
        .transform(ZodJSONParseTransform<string>(RequiredStringSchema)),

    seatType: z.string().optional()
        .transform(ZodJSONParseTransform<SeatType>(SeatTypeEnum)),
});