import {z, type ZodType} from "zod";

import type ISeatSubmit from "./interface/ISeatSubmit.js";

import {ScreenAsyncIDString, TheatreAsyncIDString} from "../../../shared/schema/helpers/ZodIDHelpers.js";
import {RequiredStringSchema} from "../../../shared/schema/helpers/ZodStringHelpers.js";
import {SeatTypeEnum} from "./enum/SeatTypeEnum.js";
import {RequiredBoolean} from "../../../shared/schema/helpers/ZodBooleanHelpers.js";

import {CoercedNumberSchema} from "../../../shared/schema/numbers/CoercedNumberSchema.js";

export const SeatSubmitSchema: ZodType<ISeatSubmit> = z.object({
    row: RequiredStringSchema
        .min(1, "Required.")
        .max(50, "Must be 50 characters or less."),

    seatNumber: RequiredStringSchema
        .min(1, "Required.")
        .max(50, "Must be 50 characters or less."),

    seatType: SeatTypeEnum,

    isAvailable: RequiredBoolean,

    priceMultiplier: CoercedNumberSchema
        .gte(0, "Must be 0 or greater."),

    theatre: TheatreAsyncIDString,

    screen: ScreenAsyncIDString,
});