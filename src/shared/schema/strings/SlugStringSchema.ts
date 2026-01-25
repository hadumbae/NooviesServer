/**
 * @file SlugStringSchema.ts
 *
 * Zod schema for **intentionally disabling slug input**.
 *
 * This schema **accepts any value but always resolves to `undefined`**.
 * It is designed for cases where slugs must be:
 * - Generated server-side
 * - Immutable once created
 * - Explicitly ignored if supplied by a client
 *
 * Common use cases:
 * - Create / update schemas where `slug` must not be user-controlled
 * - Schema composition where a slug field must exist structurally
 * - Safely overriding or discarding client-provided slugs
 */

import { z } from "zod";

/**
 * Slug suppression schema.
 *
 * - Accepts any input
 * - Allows omission
 * - Always transforms to `undefined`
 *
 * @returns `undefined` regardless of the provided value
 */
export const SlugStringSchema = z
    .any()
    .optional()
    .transform((): string | undefined => undefined);

/**
 * Inferred type for a suppressed slug value.
 *
 * Always resolves to `undefined`.
 */
export type SlugString = z.infer<typeof SlugStringSchema>;
