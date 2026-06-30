/**
 * @fileoverview Zod validation schema for movie review unique tracking codes.
 */

import {StringValueSchema} from "@/shared/schema/strings/StringValueSchema";
import {z} from "zod";

/** Zod schema to validate the format of a movie review tracking code. */
export const MovieReviewUniqueCodeSchema = StringValueSchema.regex(
    /^REV-[A-Z0-9]{5}-[A-Z0-9]{5}$/,
    {message: "Invalid format. Expected REV-XXXXX-XXXXX (e.g., REV-K9P2W-LM4X1)"},
);

/** TypeScript type for a validated movie review unique code. */
export type MovieReviewUniqueCode = z.infer<typeof MovieReviewUniqueCodeSchema>;