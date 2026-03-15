/**
 * @file Zod schema for validating generic string values.
 * @filename StringValueSchema.ts
 */

import {z} from "zod";

/**
 * Base schema for validating string values.
 *
 * Provides standardized error messages for required
 * and invalid string inputs.
 */
export const StringValueSchema = z
    .string({ required_error: "Required.", invalid_type_error: "Must be a valid string." });

/**
 * Inferred TypeScript type for {@link StringValueSchema}.
 */
export type StringValue = z.infer<typeof StringValueSchema>;