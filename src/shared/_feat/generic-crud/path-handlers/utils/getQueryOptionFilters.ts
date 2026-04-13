/**
 * @file Helper utility for extracting Mongoose-compatible filters from validated Zod query outputs.
 * @filename getQueryOptionFilters.ts
 */

import {z, type ZodTypeAny} from "zod";

/**
 * Safely extracts filter criteria from a transformed Zod query object.
 * ---
 * @param queries - The validated and transformed output from a Zod schema, or undefined.
 * @returns A Mongoose-compatible filter object, defaulting to `{}`.
 */
export function getQueryOptionFilters<TSchema extends ZodTypeAny>(queries: z.output<TSchema> | undefined) {
    return queries?.match?.filters ?? queries?.filters ?? {};
}