import {z, type ZodType} from "zod";

import type ISeatSubmit from "./interface/ISeatSubmit.js";

import {ScreenAsyncIDString, TheatreAsyncIDString} from "../../../shared/schema/helpers/ZodIDHelpers.js";
import {RequiredString} from "../../../shared/schema/helpers/ZodStringHelpers.js";
import {SeatTypeEnum} from "./enum/SeatTypeEnum.js";
import {RequiredBoolean} from "../../../shared/schema/helpers/ZodBooleanHelpers.js";
import {RequiredNumber} from "../../../shared/schema/helpers/ZodNumberHelpers.js";

export const SeatSubmitSchema: ZodType<ISeatSubmit> = z.object({
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

    theatre: TheatreAsyncIDString,

    screen: ScreenAsyncIDString,
});