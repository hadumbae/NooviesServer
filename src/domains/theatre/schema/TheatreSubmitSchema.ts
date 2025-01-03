import {z, type ZodType} from "zod";
import {ScreenAsyncIDString, SeatAsyncIDString} from "../../../shared/schema/helpers/ZodIDHelpers.js";
import type ITheatreSubmit from "./interface/ITheatreSubmit.js";
import {RequiredString} from "../../../shared/schema/helpers/ZodStringHelpers.js";
import {RequiredNumber} from "../../../shared/schema/helpers/ZodNumberHelpers.js";

export const TheatreSubmitSchema: ZodType<ITheatreSubmit> = z.object({
    name: RequiredString
        .min(1, "Required.")
        .max(255, "Must be 255 characters or less."),

    location: RequiredString
        .min(1, "Required.")
        .max(255, "Must be 255 characters or less."),

    numberOfSeats: RequiredNumber
        .gte(1, "Must be equal or greater than 0."),

    screens: z
        .array(ScreenAsyncIDString),

    seats: z
        .array(SeatAsyncIDString),
});