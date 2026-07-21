/**
 * @fileoverview Zod schema for validating queries that fetch showings filtered by screen and date.
 */

import {z} from "zod";
import {ObjectIdSchema} from "@/shared/schema/mongoose/ObjectIdSchema";
import {SimpleDateStringSchema} from "@/shared/schema/date-time/SimpleDateStringSchema";
import {NonNegativeNumberSchema} from "@/shared/_schema/numbers/numbers/NonNegativeNumberSchema";
import {SlugStringSchema} from "@/shared/schema/strings/SlugStringSchema";

/** Schema for the showings by screen query parameters. */
export const ShowingsByScreenQuerySchema = z.object({
    theatreID: z.union([ObjectIdSchema, SlugStringSchema], {message: "Must be an ID string or a valid slug."}),
    dateString: SimpleDateStringSchema,
    limit: NonNegativeNumberSchema.optional(),
});

/** Type definition for the showings by screen query parameters. */
export type ShowingsByScreenQuery = z.infer<typeof ShowingsByScreenQuerySchema>;
