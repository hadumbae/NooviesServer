import {z, type ZodType} from "zod";
import {IDInstance} from "../../../shared/schema/helpers/ZodInstanceHelpers.js";
import {RequiredStringSchema} from "../../../shared/schema/helpers/ZodStringHelpers.js";
import {ScreenSchema} from "../../screen/schema/ScreenSchema.js";
import {SeatSchema} from "../../seat/schema/SeatSchema.js";
import type ITheatre from "../model/ITheatre.js";
import {CoercedNumberSchema} from "../../../shared/schema/numbers/CoercedNumberSchema.js";

export const TheatreSchema: ZodType<ITheatre> = z.object({
    _id: IDInstance.readonly(),

    name: RequiredStringSchema
        .min(1, "Required.")
        .max(255, "Must be 255 characters or less."),

    location: RequiredStringSchema
        .min(1, "Required.")
        .max(255, "Must be 255 characters or less."),

    seatCapacity: CoercedNumberSchema
        .gte(1, "Must be equal or greater than 0."),

    screens: z.array(z.union([
        IDInstance,
        z.lazy(() => ScreenSchema),
    ])),

    seats: z.array(z.union([
        IDInstance,
        z.lazy(() => SeatSchema),
    ])),
});

export type ZTheatre = z.infer<typeof TheatreSchema>;