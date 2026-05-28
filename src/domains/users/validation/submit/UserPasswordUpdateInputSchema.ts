/**
 * @fileoverview Zod validation schema for updating a user password.
 */

import {z} from "zod";
import {StringValueSchema} from "@shared/schema/strings/StringValueSchema";


/** Zod schema for validating user password update input. */
export const UserPasswordUpdateInputSchema = z.object({
    password: StringValueSchema
        .min(16, "Password must be at least 16 characters.")
        .max(255, "Password must not be more than 255 characters."),

    confirm: StringValueSchema
        .min(16, "Confirm must be at least 16 characters.")
        .max(255, "Confirm must not be more than 255 characters."),
}).refine(
    (data) => data.password === data.confirm,
    {message: "Passwords do not match", path: ['confirm']},
);

/** Type representing valid input for updating a user password. */
export type UserPasswordUpdateInput = z.infer<typeof UserPasswordUpdateInputSchema>;
