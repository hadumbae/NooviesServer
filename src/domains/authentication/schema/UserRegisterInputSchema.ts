import {z} from "zod";
import {NonEmptyStringSchema} from "../../../shared/schema/strings/NonEmptyStringSchema.js";

/**
 * Zod schema for validating user registration input.
 *
 * Ensures that the registration fields meet formatting, length, and consistency requirements:
 * - `name`: 3–255 characters.
 * - `email`: valid email, ≤255 characters.
 * - `password`: 16–255 characters.
 * - `confirm`: must match `password`.
 *
 * @example
 * ```ts
 * import { UserRegisterInputSchema } from './UserRegisterSubmit.schema.js';
 *
 * const input = {
 *   name: "Jane Doe",
 *   email: "jane@example.com",
 *   password: "secureHashedPassword123",
 *   confirm: "secureHashedPassword123"
 * };
 *
 * await UserRegisterInputSchema.parseAsync(input); // ✅ valid
 * ```
 */
export const UserRegisterInputSchema = z.object({
    /** User's full name. Required, 3–255 characters. */
    name: NonEmptyStringSchema
        .min(3, "Must be at least 3 characters.")
        .max(255, "Must not be more than 255 characters."),

    /** User's email address. Required, valid format, ≤255 characters. */
    email: NonEmptyStringSchema
        .email({message: "Invalid email address."})
        .max(255, "Must not be more than 255 characters."),

    /** User's password. Required, 16–255 characters. */
    password: NonEmptyStringSchema
        .min(16, "Must be at least 16 characters.")
        .max(255, "Must not be more than 255 characters."),

    /** Password confirmation. Must match `password`. */
    confirm: NonEmptyStringSchema
        .min(16, "Must be at least 16 characters.")
        .max(255, "Must not be more than 255 characters."),
}).refine(
    (data) => data.password === data.confirm,
    {message: "Passwords do not match", path: ['confirm']}
);

/**
 * Type representing valid input for user registration.
 *
 * Derived from `UserRegisterInputSchema`.
 */
export type UserRegisterInput = z.infer<typeof UserRegisterInputSchema>;
