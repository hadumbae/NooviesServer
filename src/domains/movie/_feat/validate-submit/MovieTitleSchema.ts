/**
 * @fileoverview Defines the validation schema and type for movie titles.
 */

import {NonEmptyStringSchema} from "@/shared/schema/strings/NonEmptyStringSchema";
import {z} from "zod";

/** Zod schema for validating a movie title string. */
export const MovieTitleSchema = NonEmptyStringSchema.max(250, "Must be 250 characters or less.");

/** Type inferred from the MovieTitleSchema. */
export type MovieTitle = z.infer<typeof MovieTitleSchema>;