import {z} from 'zod';
import {IDInstance} from "../../../shared/schema/helpers/ZodInstanceHelpers.js";

export const UserSchema = z.object({
    name: z
        .string({required_error: "Name is required.", invalid_type_error: "Name must be a string."})
        .min(3, "Name must be at least 3 characters.")
        .max(255, "Name must not be more than 255 characters."),

    email: z.string({required_error: "Email is required.", invalid_type_error: "Email must be a string."})
        .email({message: "Invalid email address."})
        .max(255, "Email must not be more than 255 characters."),

    password: z
        .string({required_error: "Password is required.", invalid_type_error: "Password must be a string."})
        .min(16, "Password must be at least 16 characters.")
        .max(255, "Password must not be more than 255 characters."),

    isAdmin: z
        .coerce
        .boolean({
            required_error: "IsAdmin is required.",
            invalid_type_error: "IsAdmin must be a boolean."
        }),

    favourites: z.array(IDInstance)
});

export type ZUser = z.infer<typeof UserSchema>;