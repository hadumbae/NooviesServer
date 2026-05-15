/**
 * @fileoverview Zod schema for validating an array of ISO 639-1 language codes for a movie.
 */

import {z} from "zod";
import {ISO6391LanguageCodeSchema} from "@shared/schema/enums/ISO6391LanguageCodeSchema";

/** Zod schema for an array of unique ISO 639-1 language codes. */
export const MovieLanguagesSchema = z.array(
    ISO6391LanguageCodeSchema,
    {required_error: "Required.", invalid_type_error: "Must be an array of ISO 6391 codes."},
).refine((arr) => (new Set(arr)).size === arr.length, {message: "All genre IDs must be unique."});

/** TypeScript type inferred from MovieLanguagesSchema. */
export type MovieLanguages = z.infer<typeof MovieLanguagesSchema>;