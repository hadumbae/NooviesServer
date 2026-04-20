/**
 * @fileoverview Zod schema for normalizing various sort order formats into Mongoose-compatible values.
 */

import {z} from "zod";

/**
 * Validates and transforms numeric-style sort strings ("1" or "-1").
 * * **Logic**: Maps string representation to literal numbers $1$ (Ascending) or $-1$ (Descending).
 */
const NumericSortSchema = z
    .enum(["1", "-1"], {message: "Invalid sort order."})
    .transform(v => Number(v) as 1 | -1);

/**
 * Validates and transforms human-readable sort strings.
 */
const StringSortSchema = z
    .enum(["asc", "desc", "ascending", "descending"], {message: "Invalid sort order."})
    .transform(v => v === "asc" || v === "ascending" ? 1 : -1);

/**
 * A flexible schema for parsing sort order from URL query parameters.
 */
export const URLParamSortOrderSchema = z
    .union([NumericSortSchema, StringSortSchema], {message: "Invalid sort order."})
    .optional();

/** * TypeScript type inferred from the sort order schema. */
export type URLParamSortOrder = z.infer<typeof URLParamSortOrderSchema>;