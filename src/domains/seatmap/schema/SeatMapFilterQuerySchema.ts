import {z} from "zod";
import ZodJSONParseTransform from "../../../shared/utility/schema/url-params/transformZodParsedJSON.js";
import {type SeatType, SeatTypeEnum} from "../../seat/schema/enum/SeatTypeEnum.js";
import {NonEmptyStringSchema} from "../../../shared/schema/strings/NonEmptyStringSchema.js";
import {BooleanValueSchema} from "../../../shared/schema/booleans/BooleanValueSchema.js";
import {NumberValueSchema} from "../../../shared/schema/numbers/NumberValueSchema.js";

export const SeatMapFilterQuerySchema = z.object({
    isAvailable: z.string().optional()
        .transform(ZodJSONParseTransform<boolean>(z.boolean())),

    isReserved: z.string().optional()
        .transform(ZodJSONParseTransform<boolean>(BooleanValueSchema)),

    price: z.string().optional()
        .transform(ZodJSONParseTransform<number>(NumberValueSchema)),

    seatRow: z.string().optional()
        .transform(ZodJSONParseTransform<string>(NonEmptyStringSchema)),

    seatNumber: z.string().optional()
        .transform(ZodJSONParseTransform<string>(NonEmptyStringSchema)),

    seatType: z.string().optional()
        .transform(ZodJSONParseTransform<SeatType>(SeatTypeEnum)),
});