/**
 * @file SlugStringSchema.ts
 *
 * Zod schema for validating slug strings.
 *
 * Enforces:
 * - A non-empty string value
 * - A maximum length of 75 characters
 *
 * This schema is intended for slugs that are:
 * - Already normalized (e.g. kebab-case)
 * - Persisted as stable identifiers
 * - Generated or validated server-side
 *
 * It does **not** perform slugification or transformation.
 */

import {z} from "zod";
import {NonEmptyStringSchema} from "./NonEmptyStringSchema.js";

/**
 * Slug string validation schema.
 *
 * - Requires a non-empty string
 * - Enforces a maximum length of 75 characters
 *
 * @example
 * ```ts
 * const slug: SlugString = "now-showing";
 * ```
 */
export const SlugStringSchema =
    NonEmptyStringSchema.max(75, "Slugs must be no more than 75 characters.");

/**
 * TypeScript type inferred from `SlugStringSchema`.
 */
export type SlugString = z.infer<typeof SlugStringSchema>;
