import {z, type ZodType} from "zod";
import {SeatAsyncIDString, ShowingAsyncIDString} from "../../../shared/schema/helpers/ZodIDHelpers.js";
import type ISeatMapSubmit from "./interface/ISeatMapSubmit.js";
import {BooleanValueSchema} from "../../../shared/schema/booleans/BooleanValueSchema.js";
import {NumberValueSchema} from "../../../shared/schema/numbers/NumberValueSchema.js";

export const SeatMapSubmitSchema: ZodType<ISeatMapSubmit> = z.object({
    isAvailable: BooleanValueSchema
        .optional()
        .default(true),

    isReserved: BooleanValueSchema
        .optional()
        .default(false),

    price: NumberValueSchema
        .gt(0, "Must be greater than 0."),

    seat: SeatAsyncIDString,

    showing: ShowingAsyncIDString,
});