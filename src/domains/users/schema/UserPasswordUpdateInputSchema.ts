import { z } from "zod";

/**
 * Zod schema for validating user password update input.
 *
 * Ensures that the new password and confirmation meet length requirements
 * and that both fields match.
 *
 * @example
 * ```ts
 * import { UserPasswordUpdateInputSchema } from './UserPasswordUpdateInputSchema.js';
 *
 * const updateData = {
 *   password: "newSecurePassword123",
 *   confirm: "newSecurePassword123"
 * };
 *
 * await UserPasswordUpdateInputSchema.parseAsync(updateData); // ✅ passes validation
 * ```
 */
export const UserPasswordUpdateInputSchema = z.object({
    /** The new password. Required, 16–255 characters. */
    password: z
        .string({ required_error: "Password is required.", invalid_type_error: "Password must be a string." })
        .min(16, "Password must be at least 16 characters.")
        .max(255, "Password must not be more than 255 characters."),

    /** Confirmation of the new password. Must match `password`. */
    confirm: z
        .string({ required_error: "Confirm is required.", invalid_type_error: "Confirm must be a string." })
        .min(16, "Confirm must be at least 16 characters.")
        .max(255, "Confirm must not be more than 255 characters."),
}).refine(
    (data) => data.password === data.confirm,
    { message: "Passwords do not match", path: ['confirm'] },
);

/**
 * Type representing valid input for updating a user's password.
 *
 * Derived from `UserPasswordUpdateInputSchema`.
 */
export type UserPasswordUpdateInput = z.infer<typeof UserPasswordUpdateInputSchema>;
