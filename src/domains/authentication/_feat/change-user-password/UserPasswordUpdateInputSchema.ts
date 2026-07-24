/**
 * @fileoverview Zod validation schema for updating a user password.
 */

import {z} from "zod";
import {PasswordStringSchema} from "@/shared/schema/strings/PasswordStringSchema";

/** Zod schema for validating user password update input. */
export const UserPasswordUpdateInputSchema = z.object({
    password: PasswordStringSchema,
    confirm: PasswordStringSchema,
}).refine(
    (data) => data.password === data.confirm,
    {message: "Passwords do not match", path: ['confirm']},
);

/** Type representing valid input for updating a user password. */
export type UserPasswordUpdateInput = z.infer<typeof UserPasswordUpdateInputSchema>;
