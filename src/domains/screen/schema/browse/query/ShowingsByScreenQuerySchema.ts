import {z} from "zod";
import {ObjectIdSchema} from "../../../../../shared/schema/mongoose/ObjectIdSchema.js";
import {SimpleDateStringSchema} from "../../../../../shared/schema/date-time/SimpleDateStringSchema.js";
import {NonNegativeNumberSchema} from "../../../../../shared/schema/numbers/NonNegativeNumberSchema.js";
import {SlugStringSchema} from "../../../../../shared/schema/strings/SlugStringSchema.js";

/**
 * @file ShowingsByScreenQuery.schema.ts
 *
 * Zod schema for validating query parameters used when
 * fetching showings grouped by screen.
 *
 * Enforces:
 * - Valid MongoDB ObjectId for the theatre
 * - ISO-like date string (`YYYY-MM-DD`)
 * - Non-negative numeric limit
 */
export const ShowingsByScreenQuerySchema = z.object({
    /** Target theatre identifier */
    theatreID: z.union([ObjectIdSchema, SlugStringSchema], {message: "Must be an ID string or a valid slug."}),

    /** Local date used to filter showings */
    dateString: SimpleDateStringSchema,

    /** Maximum number of showings to return */
    limit: NonNegativeNumberSchema.optional(),
});

/**
 * Parsed and type-safe representation of
 * {@link ShowingsByScreenQuerySchema}.
 */
export type ShowingsByScreenQuery = z.infer<typeof ShowingsByScreenQuerySchema>;
