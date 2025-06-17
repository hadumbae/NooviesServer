import {z, type ZodType} from "zod";
import {SeatAsyncIDString, ShowingAsyncIDString} from "../../../shared/schema/helpers/ZodIDHelpers.js";
import type ISeatMapSubmit from "./interface/ISeatMapSubmit.js";
import {CoercedNumberSchema} from "../../../shared/schema/numbers/CoercedNumberSchema.js";
import {RequiredBoolean} from "../../../shared/schema/booleans/RequiredBoolean.js";

export const SeatMapSubmitSchema: ZodType<ISeatMapSubmit> = z.object({
    isAvailable: RequiredBoolean
        .optional()
        .default(true),

    isReserved: RequiredBoolean
        .optional()
        .default(false),

    price: CoercedNumberSchema
        .gt(0, "Must be greater than 0."),

    seat: SeatAsyncIDString,

    showing: ShowingAsyncIDString,
});