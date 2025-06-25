import {z, type ZodType} from "zod";
import {IDInstance} from "../../../shared/schema/helpers/ZodInstanceHelpers.js";
import {ScreenSchema} from "../../screen/schema/screen/Screen.schema.js";
import type ITheatre from "../model/ITheatre.js";
import {CoercedNumberSchema} from "../../../shared/schema/numbers/CoercedNumberSchema.js";
import {RequiredStringSchema} from "../../../shared/schema/strings/RequiredStringSchema.js";
import {ShowingSchema} from "../../showing/schema/ShowingSchema.js";

export const TheatreSchema: ZodType<ITheatre> = z.object({
    _id: IDInstance.readonly(),
    name: RequiredStringSchema.min(1, "Required.").max(255, "Must be 255 characters or less."),
    location: RequiredStringSchema.min(1, "Required.").max(255, "Must be 255 characters or less."),
    seatCapacity: CoercedNumberSchema.gte(1, "Must be equal or greater than 0."),
    screens: z.lazy(() => ScreenSchema).optional(),
    showings: z.lazy(() => ShowingSchema).optional(),
});

export type ZTheatre = z.infer<typeof TheatreSchema>;