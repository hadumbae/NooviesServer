import {z} from 'zod';
import {RequiredStringSchema} from "../../../shared/schema/strings/RequiredStringSchema.js";

export const GenreInputSchema = z.object({
    name: RequiredStringSchema
        .min(3, "Must be 3 characters or longer.")
        .max(255, "Must be 255 characters or less."),

    description: RequiredStringSchema
        .max(1000, "Must be 1000 characters or less."),
});