import {z, type ZodType} from "zod";
import type {ITheatre} from "../model/TheatreModel.js";
import {IDInstance} from "../../../shared/schema/helpers/ZodInstanceHelpers.js";
import {RequiredString} from "../../../shared/schema/helpers/ZodStringHelpers.js";
import {RequiredNumber} from "../../../shared/schema/helpers/ZodNumberHelpers.js";
import {ScreenSchema} from "../../screen/schema/ScreenSchema.js";
import {SeatSchema} from "../../seat/schema/SeatSchema.js";

export const TheatreSchema: ZodType<ITheatre> = z.object({
    _id: IDInstance.readonly(),

    name: RequiredString
        .min(1, "Required.")
        .max(255, "Must be 255 characters or less."),

    location: RequiredString
        .min(1, "Required.")
        .max(255, "Must be 255 characters or less."),

    numberOfSeats: RequiredNumber
        .gte(1, "Must be equal or greater than 0."),

    screens: z
        .array(z.union([
            IDInstance,
            z.lazy(() => ScreenSchema),
        ])),

    seats: z
        .array(z.union([
            IDInstance,
            z.lazy(() => SeatSchema),
        ])),
});