import {z} from "zod";
import {RequiredStringSchema} from "../../../shared/schema/strings/RequiredStringSchema.js";
import {NonNegativeNumberSchema} from "../../../shared/schema/numbers/NonNegativeNumberSchema.js";
import {LocationSchema} from "../../../shared/schema/theatre/Location.schema.js";

export const TheatreInputSchema = z.object({
    name: RequiredStringSchema.max(255, "Must be 255 characters or less."),
    seatCapacity: NonNegativeNumberSchema,
    location: LocationSchema,
});

