/**
 * @fileoverview Defines the Zod schema and type for email address validation.
 */

import {StringValueSchema} from "@/shared/schema/strings/StringValueSchema";
import {z} from "zod";

/** Zod schema for validating email strings. */
export const EmailSchema = StringValueSchema.email({message: "Invalid Email Address"});

/** Type definition for a validated email string. */
export type EmailString = z.infer<typeof EmailSchema>;