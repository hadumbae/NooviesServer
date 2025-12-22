import { z } from "zod";
import User from "../../users/model/User.js";

/**
 * Zod schema for validating user login input.
 *
 * Validates that the `email` and `password` fields meet formatting, length, and existence requirements:
 * - `email`: must be a valid email string, ≤255 characters, and correspond to an existing user in the database.
 * - `password`: must be a string between 16 and 255 characters.
 *
 * @example
 * ```ts
 * import { UserLoginInputSchema } from './UserLoginInput.schema.js';
 *
 * const loginData = {
 *   email: "jane@example.com",
 *   password: "secureHashedPassword123"
 * };
 *
 * await UserLoginInputSchema.parseAsync(loginData); // ✅ passes validation
 * ```
 */
export const UserLoginInputSchema = z.object({
    /** User's email address. Must exist in the database. */
    email: z
        .string({ required_error: "Email is required.", invalid_type_error: "Email must be a string." })
        .email({ message: "Invalid email address." })
        .max(255, "Email must not be more than 255 characters.")
        .refine(
            async (email) => !!(await User.findOne({ email })),
            { message: "No User Found With Email." },
        ),

    /** User's password. Required, 16–255 characters. */
    password: z
        .string({ required_error: "Password is required.", invalid_type_error: "Password must be a string." })
        .min(16, "Password must be at least 16 characters.")
        .max(255, "Password must not be more than 255 characters."),
});

/**
 * Type representing valid input for user login.
 *
 * Equivalent to the inferred type from `UserLoginInputSchema`.
 */
export type UserLoginInput = z.infer<typeof UserLoginInputSchema>;
