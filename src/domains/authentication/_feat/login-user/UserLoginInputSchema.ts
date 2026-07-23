/**
 * @fileoverview Defines the validation schema and type for user login credentials.
 */

import {z} from "zod";
import {EmailSchema} from "@/shared/schema/strings/EmailSchema";
import {PasswordStringSchema} from "@/shared/schema/strings/PasswordStringSchema";

/** Zod schema for validating user login input data. */
export const UserLoginInputSchema = z.object({
    email: EmailSchema.max(255, "Max. 255 Chars"),
    password: PasswordStringSchema,
});

/** Type definition for user login input derived from the Zod schema. */
export type UserLoginInput = z.infer<typeof UserLoginInputSchema>;
