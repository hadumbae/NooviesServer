import {z, type ZodType} from "zod";
import {IDInstance} from "../../../shared/schema/helpers/ZodInstanceHelpers.js";
import type ITheatre from "../model/ITheatre.js";
import {CoercedNumberSchema} from "../../../shared/schema/numbers/CoercedNumberSchema.js";
import {RequiredStringSchema} from "../../../shared/schema/strings/RequiredStringSchema.js";
import type ITheatreDetails from "./interface/ITheatreDetails.js";
import {NonNegativeNumberSchema} from "../../../shared/schema/numbers/NonNegativeNumberSchema.js";

export const TheatreRawSchema = z.object({
    _id: IDInstance.readonly(),
    name: RequiredStringSchema.min(1, "Required.").max(255, "Must be 255 characters or less."),
    location: RequiredStringSchema.min(1, "Required.").max(255, "Must be 255 characters or less."),
    seatCapacity: CoercedNumberSchema.gte(1, "Must be equal or greater than 0."),
});

export const TheatreDetailsRawSchema = TheatreRawSchema.extend({
    screenCount: NonNegativeNumberSchema,
    seatCount: NonNegativeNumberSchema,
    futureShowingCount: NonNegativeNumberSchema,
});

export const TheatreSchema = TheatreRawSchema as ZodType<ITheatre>;
export const TheatreDetailsSchema = TheatreDetailsRawSchema as ZodType<ITheatreDetails>;

export type ZTheatre = z.infer<typeof TheatreSchema>;
export type ZTheatreDetails = z.infer<typeof TheatreDetailsSchema>;