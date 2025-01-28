import {z, type ZodType} from "zod";
import {RequiredBoolean} from "../../../shared/schema/helpers/ZodBooleanHelpers.js";
import {RequiredNumber} from "../../../shared/schema/helpers/ZodNumberHelpers.js";
import {SeatAsyncIDString, ShowingAsyncIDString} from "../../../shared/schema/helpers/ZodIDHelpers.js";
import type ISeatMapSubmit from "./interface/ISeatMapSubmit.js";

export const SeatMapSubmitSchema: ZodType<ISeatMapSubmit> = z.object({
    isAvailable: RequiredBoolean
        .optional()
        .default(true),

    isReserved: RequiredBoolean
        .optional()
        .default(false),

    price: RequiredNumber
        .gt(0, "Must be greater than 0."),

    seat: SeatAsyncIDString,

    showing: ShowingAsyncIDString,
});