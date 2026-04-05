/**
 * @file Zod validation schema for Movie Review unique identifiers.
 * @filename MovieReviewUniqueCodeSchema.ts
 */

import {StringValueSchema} from "@shared/schema/strings/StringValueSchema";
import {z} from "zod";

/**
 * Validates a unique tracking code for movie reviews.
 * ---
 */
export const MovieReviewUniqueCodeSchema = StringValueSchema.regex(
    /^REV-[A-Z0-9]{5}-[A-Z0-9]{5}$/,
    {message: "Invalid format. Expected REV-XXXXX-XXXXX (e.g., REV-K9P2W-LM4X1)"},
);

/**
 * TypeScript type inferred from {@link MovieReviewUniqueCodeSchema}.
 * Used for type-safe routing and database queries.
 */
export type MovieReviewUniqueCode = z.infer<typeof MovieReviewUniqueCodeSchema>;