/**
 * @fileoverview Defines the validation schema for movie synopsis strings.
 */

import {NonEmptyStringSchema} from "@shared/schema/strings/NonEmptyStringSchema";
import {z} from "zod";

/** Zod schema for validating that a movie synopsis is non-empty and within character limits. */
export const MovieSynopsisSchema = NonEmptyStringSchema.max(2000, "Must be 2000 characters or less.");

/** Type definition for a validated movie synopsis string. */
export type MovieSynopsis = z.infer<typeof MovieSynopsisSchema>;