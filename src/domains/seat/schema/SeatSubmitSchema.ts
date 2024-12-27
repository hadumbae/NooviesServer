import {z} from 'zod';
import {IDInstance} from "../../../shared/schema/helpers/ZodInstanceHelpers.js";
import {TheatreSchema} from "../../theatre/schema/TheatreSchema.js";
import {RequiredString} from "../../../shared/schema/helpers/ZodStringHelpers.js";
import {SeatTypeEnum} from "./enum/SeatTypeEnum.js";
import {RequiredBoolean} from "../../../shared/schema/helpers/ZodBooleanHelpers.js";
import {RequiredNumber} from "../../../shared/schema/helpers/ZodNumberHelpers.js";

export const SeatSubmitSchema = z.object({
    theatre: z
        .union([
            IDInstance,
            z.lazy(() => TheatreSchema)
        ]),

    row: RequiredString
        .min(1, "Required.")
        .max(50, "Must be 50 characters or less."),

    seatNumber: RequiredString
        .min(1, "Required.")
        .max(50, "Must be 50 characters or less."),

    seatType: SeatTypeEnum,

    isAvailable: RequiredBoolean,

    priceMultiplier: RequiredNumber
        .gte(0, "Must be 0 or greater."),
});