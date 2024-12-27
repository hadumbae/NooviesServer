import {z} from "zod";
import {Types} from "mongoose";

export const RequiredString = z.string({
    required_error: "Required",
    invalid_type_error: "Must be a valid string.",
}).trim();

export const IDString = z
    .string({required_error: "Required.", invalid_type_error: "Must be a valid ID string."})
    .length(24, "ID String must be exactly 24 characters.")
    .refine((value) => Types.ObjectId.isValid(value));